import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { format, parseISO } from 'date-fns';


// =========================================================
// 🧹 SANITIZE FUNCTION 
// =========================================================

function sanitizeText(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/</g, "&lt;") // استبدال علامة أصغر من
    .replace(/>/g, "&gt;") // استبدال علامة أكبر من
    .replace(/"/g, "&quot;") // استبدال علامات التنصيص
    .replace(/'/g, "&#039;") // استبدال الفاصلة العليا
    .trim(); // إزالة المسافات الزائدة
}

// =========================================================
// 📝 TYPE DEFINITIONS
// =========================================================
interface BookingRequest {
  action: 'create' | 'update' | 'cancel';
  bookingId?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  date?: string;
  time?: string;
  service?: string;
  comments?: string;
}

// =========================================================
// ⚙️ CONFIGURATION & RATE LIMITER
// =========================================================
const REQUEST_LIMIT = 5;
const REQUEST_WINDOW = 60 * 1000; // 1 Minute
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(req: Request): boolean {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (record && now < record.resetTime) {
    if (record.count >= REQUEST_LIMIT) return false;
    record.count++;
  } else {
    requestCounts.set(ip, { count: 1, resetTime: now + REQUEST_WINDOW });
  }
  return true;
}

// =========================================================
// 🔐 GOOGLE SHEETS HELPER
// =========================================================
const getCleanPrivateKey = (): string => {
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!key) throw new Error('GOOGLE_PRIVATE_KEY is missing');
  
  const cleanKey = key.replace(/^"|"$/g, '');
  if (cleanKey.includes('-----BEGIN PRIVATE KEY-----') && cleanKey.includes('\n')) {
    return cleanKey;
  }
  return cleanKey.replace(/\\n/g, '\n');
};

async function getGoogleSheet(): Promise<GoogleSpreadsheetWorksheet> {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing Google Sheets Credentials in Environment Variables');
  }

  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: getCleanPrivateKey(),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

// =========================================================
// 🚀 ACTION HANDLERS
// =========================================================

async function handleCancel(sheet: GoogleSpreadsheetWorksheet, bookingId: string) {
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get('BookingID') === bookingId);

  if (!row) throw new Error('Booking not found');

  row.set('Status', 'Cancelled');
  await row.save();
  return { success: true, message: "تم إلغاء الحجز بنجاح" };
}

async function handleUpdate(sheet: GoogleSpreadsheetWorksheet, data: BookingRequest) {
  const rows = await sheet.getRows();
  const row = rows.find((r) => r.get('BookingID') === data.bookingId);

  if (!row) throw new Error('Booking not found');

  const sanitizedComments = sanitizeText(data.comments);
  const formattedDate = data.date ? format(parseISO(data.date), 'dd/MM/yyyy') : row.get('Date');

  if (data.date) row.set('Date', formattedDate);
  if (data.time) row.set('Time', data.time);
  if (data.service) row.set('Service', data.service);
  if (data.firstName || data.lastName) {
     const oldName = row.get('Name') || "";
     const newFirst = data.firstName || String(oldName).split(' ')[0];
     const newLast = data.lastName || String(oldName).split(' ')[1] || "";
     row.set('Name', `${newFirst} ${newLast}`.trim());
  }
  
  row.set('Comments', sanitizedComments);
  row.set('Status', 'Active'); 

  await row.save();
  return { success: true, message: "تم تحديث الحجز بنجاح", bookingId: data.bookingId };
}

async function handleCreate(sheet: GoogleSpreadsheetWorksheet, data: BookingRequest) {
  if (!data.firstName || !data.phone || !data.date || !data.time || !data.service) {
    throw new Error('Missing required fields');
  }

  const formattedDate = format(parseISO(data.date), 'dd/MM/yyyy');
  const rows = await sheet.getRows();

  const existingBooking = rows.find((row) => 
    row.get('Phone') === data.phone && 
    row.get('Date') === formattedDate && 
    row.get('Time') === data.time && 
    row.get('Status') === 'Active'
  );

  if (existingBooking) {
    return { 
      success: true, 
      message: "هذا الموعد محجوز مسبقاً لك!", 
      bookingId: existingBooking.get('BookingID') 
    };
  }

  const newBookingId = crypto.randomUUID();
  const normalizedPhone = data.phone.replace(/\D/g, '').replace(/^0/, '');
  const customerId = `CID-${normalizedPhone}`;
  
  const sanitizedComments = sanitizeText(data.comments);

  await sheet.addRow({
    BookingID: newBookingId,
    CustomerID: customerId,
    Status: 'Active',
    Date: formattedDate,
    Time: data.time,
    Service: data.service,
    Name: `${data.firstName} ${data.lastName}`,
    Phone: data.phone,
    Comments: sanitizedComments,
  });

  return { 
    success: true, 
    message: "تم حفظ الحجز بنجاح!", 
    bookingId: newBookingId 
  };
}

// =========================================================
// 🌐 POST ENDPOINT
// =========================================================
export async function POST(req: Request) {
  try {
    if (!checkRateLimit(req)) {
      return NextResponse.json(
        { success: false, message: "عدد كبير من الطلبات. الرجاء الانتظار دقيقة." },
        { status: 429 }
      );
    }

    const body: BookingRequest = await req.json();
    const sheet = await getGoogleSheet();

    let response;
    switch (body.action) {
      case 'create':
        response = await handleCreate(sheet, body);
        break;
      case 'update':
        if (!body.bookingId) throw new Error('Booking ID required for update');
        response = await handleUpdate(sheet, body);
        break;
      case 'cancel':
        if (!body.bookingId) throw new Error('Booking ID required for cancel');
        response = await handleCancel(sheet, body.bookingId);
        break;
      default:
        return NextResponse.json({ success: false, message: "إجراء غير معروف" }, { status: 400 });
    }

    return NextResponse.json(response);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[API Error]:', errorMessage);
    
    const status = errorMessage === 'Booking not found' ? 404 : 
                   errorMessage === 'Missing required fields' ? 400 : 500;

    return NextResponse.json(
      { success: false, message: errorMessage || "حدث خطأ غير متوقع" },
      { status }
    );
  }
}

// =========================================================
// 📅 GET ENDPOINT
// =========================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const excludeId = searchParams.get('excludeId');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    const sheet = await getGoogleSheet();
    const rows = await sheet.getRows();
    
    let formattedDate;
    try {
        formattedDate = format(parseISO(date), 'dd/MM/yyyy');
    } catch { 
        return NextResponse.json({ error: 'Invalid Date Format' }, { status: 400 });
    }

    const bookedSlots = rows
      .filter((row: GoogleSpreadsheetRow) => {
        const isSameDate = row.get('Date') === formattedDate;
        const isActive = row.get('Status') === 'Active';
        const isNotExcluded = !excludeId || row.get('BookingID') !== excludeId;
        return isSameDate && isActive && isNotExcluded;
      })
      .map((row: GoogleSpreadsheetRow) => row.get('Time'));

    return NextResponse.json({ success: true, bookedSlots });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[Availability Error]:', errorMessage);
    return NextResponse.json(
      { success: false, message: "خطأ في استرجاع المواعيد" },
      { status: 500 }
    );
  }
}