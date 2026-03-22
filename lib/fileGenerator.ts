import * as XLSX from "xlsx";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  WidthType,
  BorderStyle,
} from "docx";

export interface SheetData {
  name: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface FileGenerationResult {
  base64: string;
  mimeType: string;
  filename: string;
  type: "xlsx" | "docx";
}

/**
 * Generate an Excel file from structured sheet data.
 */
export function generateExcel(
  sheets: SheetData[],
  filename = "export.xlsx"
): FileGenerationResult {
  const wb = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const wsData = [sheet.headers, ...sheet.rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Bold header row styling
    const headerRange = XLSX.utils.decode_range(ws["!ref"] || "A1");
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellRef]) continue;
      ws[cellRef].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E3A5F" } },
        alignment: { horizontal: "center" },
      };
    }

    // Auto column widths
    const colWidths = sheet.headers.map((h, i) => ({
      wch: Math.max(
        h.length,
        ...sheet.rows.map((r) => String(r[i] ?? "").length)
      ),
    }));
    ws["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const base64 = Buffer.from(buffer).toString("base64");

  return {
    base64,
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    filename,
    type: "xlsx",
  };
}

export interface DocxSection {
  type: "heading1" | "heading2" | "paragraph" | "table";
  text?: string;
  headers?: string[];
  rows?: string[][];
}

/**
 * Generate a DOCX file from structured sections.
 */
export async function generateDocx(
  sections: DocxSection[],
  filename = "export.docx"
): Promise<FileGenerationResult> {
  const children: (Paragraph | Table)[] = [];

  for (const section of sections) {
    if (section.type === "heading1" && section.text) {
      children.push(
        new Paragraph({
          text: section.text,
          heading: HeadingLevel.HEADING_1,
        })
      );
    } else if (section.type === "heading2" && section.text) {
      children.push(
        new Paragraph({
          text: section.text,
          heading: HeadingLevel.HEADING_2,
        })
      );
    } else if (section.type === "paragraph" && section.text) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: section.text })],
        })
      );
    } else if (
      section.type === "table" &&
      section.headers &&
      section.rows
    ) {
      const border = {
        top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
      };

      const headerRow = new TableRow({
        children: section.headers.map(
          (h) =>
            new TableCell({
              borders: border,
              shading: { fill: "1E3A5F" },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      bold: true,
                      color: "FFFFFF",
                      size: 20,
                    }),
                  ],
                }),
              ],
              width: { size: 100 / section.headers!.length, type: WidthType.PERCENTAGE },
            })
        ),
      });

      const dataRows = section.rows.map(
        (row) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  borders: border,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, size: 20 })],
                    }),
                  ],
                  width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
                })
            ),
          })
      );

      children.push(
        new Table({
          rows: [headerRow, ...dataRows],
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );

      // Spacing after table
      children.push(new Paragraph({ text: "" }));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const buffer = await Packer.toBuffer(doc);
  const base64 = buffer.toString("base64");

  return {
    base64,
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filename,
    type: "docx",
  };
}
