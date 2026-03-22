import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const { data, filename, sheetName } = await req.json();

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Auto-width columns
    const colWidths = data[0].map((_: unknown, colIdx: number) => ({
      wch: Math.max(...data.map((row: unknown[]) => String(row[colIdx] ?? "").length), 10),
    }));
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheetName || "Données");

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    const safeFilename = (filename || "export").replace(/[^a-z0-9_\-]/gi, "_") + ".xlsx";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 });
  }
}
