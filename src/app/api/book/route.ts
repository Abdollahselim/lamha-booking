import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { format, parseISO } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';

// =========================================================
// 🛡️ RATE LIMITER (Simple IP-based)
// =========================================================
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: Request) {
  try {
    // =========================================================
    // 🔐 RATE LIMITING CHECK
    // =========================================================
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const limit = 5; // Max 5 requests
    const windowMs = 60 * 1000; // Per minute

    const record = requestCounts.get(ip);
    if (record && now < record.resetTime) {
      if (record.count >= limit) {
        return NextResponse.json(
          { success: false, message: "عدد كبير من الطلبات. الرجاء الانتظار دقيقة." },
          { status: 429 }
        );
      }
      record.count++;
    } else {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    }

    // =========================================================
    // ✅ ENVIRONMENT VARIABLES CHECK
    // =========================================================
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 
        !process.env.GOOGLE_PRIVATE_KEY || 
        !process.env.GOOGLE_SHEET_ID) {
      console.error('[ERROR] Missing Google Sheets credentials in .env.local');
      return NextResponse.json(
        { success: false, message: "خطأ في إعدادات الخادم" },
        { status: 500 }
      );
    }

    // =========================================================
    // 📥 PARSE REQUEST BODY
    // =========================================================
    const body = await req.json();
    const { action, bookingId, firstName, lastName, phone, date, time, service, comments } = body;

    // Helper: Normalize Phone to act as CustomerID
    const normalizedPhone = phone?.replace(/\D/g, '').replace(/^0/, ''); // '5XXXXXXXX'
    const customerId = `CID-${normalizedPhone}`;

    // =========================================================
    // 🛡️ VALIDATION
    // =========================================================
    if (action === 'create' || action === 'update') {
      if (!firstName || !phone || !date || !time || !service) {
        return NextResponse.json({ success: false, message: "بيانات الحجز غير مكتملة" }, { status: 400 });
      }
    }

    // =========================================================
    // 🔌 GOOGLE SHEETS CONNECTION
    // =========================================================
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // =========================================================
    // ⚙️ LOGIC HANDLING (CANCEL / UPDATE / CREATE)
    // =========================================================
    
    // 1. CANCEL
    if (action === 'cancel') {
      if (!bookingId) return NextResponse.json({ success: false, message: "رقم الحجز مفقود" }, { status: 400 });
      const rowToCancel = rows.find((row) => row.get('BookingID') === bookingId);
      if (rowToCancel) {
        rowToCancel.set('Status', 'Cancelled');
        await rowToCancel.save();
        return NextResponse.json({ success: true, message: "تم إلغاء الحجز بنجاح" });
      }
      return NextResponse.json({ success: false, message: "الحجز غير موجود" }, { status: 404 });
    }

    // 2. UPDATE (RESCHEDULE)
    if (action === 'update') {
      if (!bookingId) return NextResponse.json({ success: false, message: "رقم الحجز مفقود" }, { status: 400 });
      const rowToUpdate = rows.find((row) => row.get('BookingID') === bookingId);
      
      if (rowToUpdate) {
        // Sanitize and Format
        const sanitizedComments = DOMPurify.sanitize(comments || "");
        const formattedDate = format(parseISO(date), 'dd/MM/yyyy');

        rowToUpdate.set('Date', formattedDate);
        rowToUpdate.set('Time', time);
        rowToUpdate.set('Service', service);
        rowToUpdate.set('Comments', sanitizedComments);
        rowToUpdate.set('Status', 'Active'); // Ensure it's active if it was cancelled/others
        
        await rowToUpdate.save();
        return NextResponse.json({ success: true, message: "تم تحديث الحجز بنجاح", bookingId });
      }
      return NextResponse.json({ success: false, message: "الحجز غير موجود" }, { status: 404 });
    }

    // 3. CREATE (With Idempotency)
    if (action === 'create') {
      const formattedDate = format(parseISO(date), 'dd/MM/yyyy');
      
      // Idempotency: Check if an active booking already exists for this person at this time
      const existingActive = rows.find(row => 
        row.get('Phone') === phone && 
        row.get('Date') === formattedDate && 
        row.get('Time') === time && 
        row.get('Status') === 'Active'
      );

      if (existingActive) {
        return NextResponse.json({ 
          success: true, 
          message: "هذا الموعد محجوز مسبقاً لك!", 
          bookingId: existingActive.get('BookingID') 
        });
      }

      const newBookingId = crypto.randomUUID();
      const sanitizedComments = DOMPurify.sanitize(comments || "");

      await sheet.addRow({
        BookingID: newBookingId,
        CustomerID: customerId,
        Status: 'Active',
        Date: formattedDate,
        Time: time,
        Service: service,
        Name: `${firstName} ${lastName}`,
        Phone: phone,
        Comments: sanitizedComments,
      });

      return NextResponse.json({ 
        success: true, 
        message: "تم حفظ الحجز بنجاح!", 
        bookingId: newBookingId 
      });
    }

    return NextResponse.json({ success: false, message: "إجراء غير معروف" }, { status: 400 });

  } catch (error) {
    // Secure error logging (don't expose sensitive data)
    console.error('[Booking API Error]', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء الحجز. الرجاء المحاولة لاحقاً." }, 
      { status: 500 }
    );
  }
}

// =========================================================
// 📊 GET ENDPOINT - Check Availability (Optional but Recommended)
// =========================================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const excludeId = searchParams.get('excludeId');

    console.log("excludeId", excludeId);

    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }

    // Connect to Google Sheets
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    // Get all active bookings for this date
    const rows = await sheet.getRows();
    const formattedDate = format(parseISO(date), 'dd/MM/yyyy');
    
    const bookedSlots = rows
      .filter((row) => {
        const isSameDate = row.get('Date') === formattedDate;
        const isActive = row.get('Status') === 'Active';
        const isNotCurrentBooking = !excludeId || row.get('BookingID') !== excludeId;
        return isSameDate && isActive && isNotCurrentBooking;
      })
      .map((row) => row.get('Time'));

    return NextResponse.json({ 
      success: true, 
      bookedSlots 
    });

  } catch (error) {
    console.error('[Availability Check Error]', error);
    return NextResponse.json(
      { success: false, message: 'خطأ في التحقق من الأوقات المتاحة' }, 
      { status: 500 }
    );
  }
}