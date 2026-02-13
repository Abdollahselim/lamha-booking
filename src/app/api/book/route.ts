import { google, sheets_v4 } from 'googleapis';
import { NextResponse } from 'next/server';

// =========================================================
// CONFIGURATION
// =========================================================
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// =========================================================
// TYPE DEFINITIONS
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

interface BookingRow {
  rowIndex: number;
  BookingID: string;
  CustomerID: string;
  Status: string;
  Date: string;
  Time: string;
  Service: string;
  Name: string;
  Phone: string;
  Comments: string;
}

// =========================================================
// AUTH HELPER
// =========================================================
const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('Missing Google Credentials');
  }

  // تنظيف المفتاح عشان يشتغل على Vercel
  const cleanKey = key.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

  return new google.auth.JWT({
    email,
    key: cleanKey,
    scopes: SCOPES,
  });
};

// =========================================================
// HELPER FUNCTIONS
// =========================================================

/**
 * دالة ذكية تجيب اسم أول ورقة عمل في الشيت أوتوماتيك
 * عشان لو اسمها Sheet1 أو "ورقة 1" الكود يشتغل في الحالتين
 */
async function getFirstSheetTitle(sheets: sheets_v4.Sheets, spreadsheetId: string): Promise<string> {
  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  // إرجاع عنوان أول ورقة
  return metadata.data.sheets?.[0].properties?.title || 'Sheet1';
}

/**
 * جلب جميع البيانات مع تحديد الأنواع
 */
async function getAllRows(sheets: sheets_v4.Sheets, spreadsheetId: string, rangeName: string): Promise<BookingRow[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeName,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  // تحويل الصفوف لكائنات
  return rows.slice(1).map((row: string[], index: number) => ({
    rowIndex: index + 2,
    BookingID: row[0] || '',
    CustomerID: row[1] || '',
    Status: row[2] || '',
    Date: row[3] || '',
    Time: row[4] || '',
    Service: row[5] || '',
    Name: row[6] || '',
    Phone: row[7] || '',
    Comments: row[8] || '',
  }));
}

/**
 * تنظيف النصوص من الأكواد الخبيثة
 */
function sanitizeText(text: string | undefined): string {
  if (!text) return "";
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}
//  تنسيق التاريخ (حل مشكلة التاريخ بيسمع غلط)
function formatDateString(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-'); 
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// =========================================================
// POST ENDPOINT
// =========================================================
export async function POST(req: Request) {
  try {
    const body: BookingRequest = await req.json();
    const { action, bookingId, firstName, lastName, phone, date, time, service, comments } = body;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID');

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // 🔥 الخطوة السحرية: جلب اسم الصفحة الحقيقي ديناميكياً
    const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId);
    const rangeName = `${sheetTitle}!A:I`;

    // ---------------------------
    // 1. CREATE
    // ---------------------------
    if (action === 'create') {
      const newBookingId = crypto.randomUUID();
      const rawPhone = phone || '000000000';
      const customerId = `CID-${rawPhone.replace(/\D/g, '').slice(-9)}`;

      const sanitizedComments = sanitizeText(comments);
      const finalDate = formatDateString(date);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: rangeName,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            newBookingId,                   // A: BookingID
            customerId,                     // B: CustomerID
            'Active',                       // C: Status
            finalDate,                      // D: Date
            time,                           // E: Time
            service,                        // F: Service
            `${firstName} ${lastName}`,     // G: Name
            phone,                          // H: Phone
            sanitizedComments               // I: Comments
          ]],
        },
      });

      return NextResponse.json({ success: true, message: "تم الحجز بنجاح", bookingId: newBookingId });
    }
    // -----------------------------------------------------
    // 2. UPDATE & CANCEL
    // -----------------------------------------------------
    if (action === 'update' || action === 'cancel') {
      if (!bookingId) return NextResponse.json({ success: false, message: "رقم الحجز مطلوب" }, { status: 400 });

      const allRows = await getAllRows(sheets, spreadsheetId, rangeName);
      const targetRow = allRows.find((r) => r.BookingID === bookingId);

      if (!targetRow) {
        return NextResponse.json({ success: false, message: "لم يتم العثور على الحجز" }, { status: 404 });
      }

      if (action === 'cancel') {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!C${targetRow.rowIndex}`, // تحديث الحالة فقط
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['Cancelled']] },
        });
        return NextResponse.json({ success: true, message: "تم إلغاء الحجز بنجاح" });
      }

      if (action === 'update') {
        const finalDate = date ? formatDateString(date) : targetRow.Date;
        const newName = (firstName && lastName) ? `${firstName} ${lastName}` : targetRow.Name;
        const sanitizedComments = sanitizeText(comments);

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!C${targetRow.rowIndex}:I${targetRow.rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              'Active',                                // C
              finalDate,                               // D
              time || targetRow.Time,                  // E
              service || targetRow.Service,            // F
              newName,                                 // G
              phone || targetRow.Phone,                // H
              sanitizedComments || targetRow.Comments  // I
            ]]
          },
        });
        return NextResponse.json({ success: true, message: "تم تعديل الحجز بنجاح" });
      }
    }

    return NextResponse.json({ success: false, message: "إجراء غير صحيح" }, { status: 400 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[API Error]:', errorMessage);
    return NextResponse.json(
      { success: false, message: "حدث خطأ في الخادم", error: errorMessage },
      { status: 500 }
    );
  }
}

// =========================================================
// GET ENDPOINT
// =========================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID');

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    // جلب اسم الصفحة والداتا
    const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId);
    const rangeName = `${sheetTitle}!A:I`;

    const allRows = await getAllRows(sheets, spreadsheetId, rangeName);
    const searchDate = new Date(date).toLocaleDateString('en-GB');

    const bookedSlots = allRows
      .filter((r) => r.Date === searchDate && r.Status === 'Active')
      .map((r) => r.Time);

    return NextResponse.json({ success: true, bookedSlots });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[Availability Error]:', errorMessage);
    return NextResponse.json({ success: false, message: "Error fetching slots" }, { status: 500 });
  }
}