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
  date?: string; // Expecting ISO string or YYYY-MM-DD
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
/**
 * Authenticate with Google Sheets API using Service Account.
 * Handles newline characters in private key for Vercel deployment.
 */
const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) {
    throw new Error('Missing Google Credentials in environment variables');
  }

  // Clean the key: remove extra quotes and properly format newlines
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
 * Dynamically fetch the title of the first sheet to avoid "Range not found" errors.
 */
async function getFirstSheetTitle(sheets: sheets_v4.Sheets, spreadsheetId: string): Promise<string> {
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  if (!metadata.data.sheets || metadata.data.sheets.length === 0) {
    throw new Error('No sheets found in the spreadsheet');
  }
  return metadata.data.sheets[0].properties?.title || 'Sheet1';
}

/**
 * Fetch all rows from the spreadsheet and map them to typed objects.
 * Mapping follows the column order: A: BookingID -> I: Comments
 */
async function getAllRows(sheets: sheets_v4.Sheets, spreadsheetId: string, rangeName: string): Promise<BookingRow[]> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeName,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) return [];

  // Map array rows to BookingRow objects, skipping the header row
  return rows.slice(1).map((row: string[], index: number) => ({
    rowIndex: index + 2, // 1-based index + header row
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
 * Sanitize text to prevent basic injection attacks.
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

/**
 * Format date string to DD/MM/YYYY.
 * Handles ISO strings with time components (e.g., 2026-02-15T22:00:00.000Z).
 */
function formatDateString(dateStr: string | undefined): string {
  if (!dateStr) return '';
  
  try {
    // 1. Create a Date object from the input string
    const dateObj = new Date(dateStr);
    
    // 2. Check if date is valid
    if (isNaN(dateObj.getTime())) return dateStr;

    // 3. Format explicitly to 'Asia/Riyadh' timezone
    // 'en-GB' locale ensures DD/MM/YYYY format
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Riyadh' // This forces the correct day
    }).format(dateObj);

  } catch {
    // Fallback: simple split if Intl fails
    return dateStr.split('T')[0];
  }
}

// =========================================================
// POST ENDPOINT (HANDLE ACTIONS)
// =========================================================
export async function POST(req: Request) {
  try {
    const body: BookingRequest = await req.json();
    const { action, bookingId, firstName, lastName, phone, date, time, service, comments } = body;
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID');

    // Initialize Google Sheets API
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Dynamic Sheet Title & Range (Columns A to I)
    const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId);
    const rangeName = `${sheetTitle}!A:I`;

    // -----------------------------------------------------
    // 1. CREATE ACTION
    // -----------------------------------------------------
    if (action === 'create') {
      const newBookingId = crypto.randomUUID();
      
      // Generate CustomerID (CID + last 9 digits of phone)
      const cleanPhone = phone?.replace(/\D/g, '') || '000';
      const customerId = `CID-${cleanPhone.slice(-9)}`;
      
      const sanitizedComments = sanitizeText(comments);
      const finalDate = formatDateString(date);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: rangeName,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            newBookingId,                // A: BookingID
            customerId,                  // B: CustomerID
            'Active',                    // C: Status
            finalDate,                   // D: Date
            time,                        // E: Time
            service,                     // F: Service
            `${firstName} ${lastName}`,  // G: Name
            phone,                       // H: Phone
            sanitizedComments            // I: Comments
          ]],
        },
      });

      return NextResponse.json({ success: true, message: "Booking created successfully", bookingId: newBookingId });
    }

    // -----------------------------------------------------
    // 2. UPDATE & CANCEL ACTIONS
    // -----------------------------------------------------
    if (action === 'update' || action === 'cancel') {
      if (!bookingId) return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });

      // Fetch all rows to find the target booking
      const allRows = await getAllRows(sheets, spreadsheetId, rangeName);
      const targetRow = allRows.find((r) => r.BookingID === bookingId);

      if (!targetRow) {
        return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
      }

      // Handle Cancel
      if (action === 'cancel') {
        // Update only column C (Status)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!C${targetRow.rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: [['Cancelled']] },
        });
        return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
      }

      // Handle Update
      if (action === 'update') {
        // Use new date if provided, otherwise keep existing
        const finalDate = date ? formatDateString(date) : targetRow.Date;
        const newName = (firstName && lastName) ? `${firstName} ${lastName}` : targetRow.Name;
        const sanitizedComments = sanitizeText(comments);

        // Update columns C through I (Status, Date, Time, Service, Name, Phone, Comments)
        // BookingID (A) and CustomerID (B) remain unchanged
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTitle}!C${targetRow.rowIndex}:I${targetRow.rowIndex}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              'Active',
              finalDate,
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
    // Secure error logging (log full error on server, send generic message to client)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error('[API Error]:', errorMessage);
    
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: process.env.NODE_ENV === 'development' ? errorMessage : undefined },
      { status: 500 }
    );
  }
}

// =========================================================
// GET ENDPOINT (CHECK AVAILABILITY)
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
    
    // Dynamic Sheet Title & Range
    const sheetTitle = await getFirstSheetTitle(sheets, spreadsheetId);
    const rangeName = `${sheetTitle}!A:I`;

    const allRows = await getAllRows(sheets, spreadsheetId, rangeName);
    
    // Format search date to match sheet format (DD/MM/YYYY)
    const searchDate = formatDateString(date);

    // Filter active slots for the requested date
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