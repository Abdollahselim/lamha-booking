import { google, sheets_v4 } from 'googleapis';
import { NextResponse } from 'next/server';

// =========================================================
// ⚙️ CONFIGURATION
// =========================================================
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SHEET_NAME = 'Sheet1'; 
const RANGE_NAME = `${SHEET_NAME}!A:I`;

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
// 🔐 AUTH HELPER
// =========================================================
const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('Missing Google Credentials in environment variables');
  }

  const cleanKey = key.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

  return new google.auth.JWT({
    email,
    key: cleanKey,
    scopes: SCOPES,
  });
};

// =========================================================
// 🛠️ HELPER FUNCTIONS
// =========================================================

/**
 * Fetch all rows with Strict Typing
 */
async function getAllRows(sheets: sheets_v4.Sheets, spreadsheetId: string): Promise<BookingRow[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: RANGE_NAME,
  });

  const rows = response.data.values;
  
  if (!rows || rows.length === 0) return [];

  // Skip header and map with explicit types to avoid 'any' error
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
 * Sanitize text without external libraries
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

// =========================================================
// 🌐 POST ENDPOINT
// =========================================================
export async function POST(req: Request) {
  try {
    const body: BookingRequest = await req.json();
    const { action, bookingId, firstName, lastName, phone, date, time, service, comments } = body;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID');

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // 1. CREATE
    if (action === 'create') {
      const newBookingId = crypto.randomUUID();
      const rawPhone = phone || '000000000';
      const customerId = `CID-${rawPhone.replace(/\D/g, '').slice(-9)}`;
      const formattedDate = date ? new Date(date).toLocaleDateString('en-GB') : '';
      const sanitizedComments = sanitizeText(comments);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: RANGE_NAME,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            newBookingId,
            customerId,
            'Active',
            formattedDate,
            time,
            service,
            `${firstName} ${lastName}`,
            phone,
            sanitizedComments
          ]],
        },
      });

      return NextResponse.json({ success: true, message: "Booking created successfully", bookingId: newBookingId });
    }

    // 2. UPDATE & CANCEL
    if (action === 'update' || action === 'cancel') {
      if (!bookingId) return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });

      const allRows = await getAllRows(sheets, spreadsheetId);
      const targetRow = allRows.find((r) => r.BookingID === bookingId);

      if (!targetRow) {
        return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
      }

      if (action === 'cancel') {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_NAME}!C${targetRow.rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['Cancelled']] },
        });
        return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
      }

      if (action === 'update') {
        const formattedDate = date ? new Date(date).toLocaleDateString('en-GB') : targetRow.Date;
        const newName = (firstName && lastName) ? `${firstName} ${lastName}` : targetRow.Name;
        const sanitizedComments = sanitizeText(comments);

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${SHEET_NAME}!C${targetRow.rowIndex}:I${targetRow.rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              'Active',
              formattedDate,
              time || targetRow.Time,
              service || targetRow.Service,
              newName,
              phone || targetRow.Phone,
              sanitizedComments || targetRow.Comments
            ]]
          },
        });
        return NextResponse.json({ success: true, message: "Booking updated successfully" });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    // Narrowing the error type safely
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[API Error]:', errorMessage);
    return NextResponse.json(
      { success: false, message: "Server Error", error: errorMessage },
      { status: 500 }
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

    if (!date) return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID');

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const allRows = await getAllRows(sheets, spreadsheetId);
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