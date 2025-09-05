import {
  AnySacramentRecord,
  ExportOptions,
  ExportResult,
  SacramentSearchFilters,
} from "@/types/sacraments";
import { formatSacramentType } from "./sacramentHelpers";

/**
 * Export utility functions for sacrament records
 */

/**
 * Convert sacrament records to CSV format
 */
export function convertToCSV(
  records: AnySacramentRecord[],
  includeFields?: string[],
): string {
  if (records.length === 0) return "";

  // Define all possible fields
  const allFields = [
    "id",
    "memberName",
    "sacramentType",
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
    "certificateNumber",
    "notes",
    "createdAt",
    // Baptism specific
    "godparent1Name",
    "godparent2Name",
    // Marriage specific
    "groomName",
    "brideName",
    "witness1Name",
    "witness2Name",
    // Communion/Confirmation specific
    "sponsorName",
    // Marriage specific
    "marriageLicenseNumber",
  ];

  // Use specified fields or all fields
  const fields = includeFields || allFields;

  // Filter fields that exist in the data
  const existingFields = fields.filter((field) =>
    records.some(
      (record) =>
        record.hasOwnProperty(field) &&
        record[field as keyof AnySacramentRecord] != null,
    ),
  );

  // Create CSV header
  const header = existingFields
    .map((field) => {
      // Convert camelCase to Title Case
      return field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    })
    .join(",");

  // Create CSV rows
  const rows = records.map((record) => {
    return existingFields
      .map((field) => {
        let value = record[field as keyof AnySacramentRecord] as any;

        // Format specific fields
        if (field === "sacramentType") {
          value = formatSacramentType(value);
        } else if (field === "dateOfSacrament" || field === "createdAt") {
          value = value ? new Date(value).toLocaleDateString() : "";
        } else if (field === "memberName" && !value && record.member) {
          value = `${record.member.firstName} ${record.member.lastName}`;
        }

        // Escape commas and quotes in CSV
        if (typeof value === "string") {
          value = value.replace(/"/g, '""');
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            value = `"${value}"`;
          }
        }

        return value || "";
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
}

/**
 * Generate filename for export
 */
export function generateExportFilename(
  format: "csv" | "excel" | "pdf",
  sacramentType?: string,
  dateRange?: { start: string; end: string },
): string {
  const timestamp = new Date().toISOString().split("T")[0];
  let filename = "sacrament-records";

  if (sacramentType && sacramentType !== "all") {
    filename += `-${sacramentType.toLowerCase()}`;
  }

  if (dateRange?.start && dateRange?.end) {
    filename += `-${dateRange.start}-to-${dateRange.end}`;
  }

  filename += `-${timestamp}`;

  switch (format) {
    case "csv":
      return `${filename}.csv`;
    case "excel":
      return `${filename}.xlsx`;
    case "pdf":
      return `${filename}.pdf`;
    default:
      return `${filename}.csv`;
  }
}

/**
 * Download file from blob data
 */
export function downloadFile(
  data: string | Blob,
  filename: string,
  mimeType?: string,
): void {
  let blob: Blob;

  if (typeof data === "string") {
    blob = new Blob([data], { type: mimeType || "text/plain" });
  } else {
    blob = data;
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Export sacrament records to CSV
 */
export async function exportToCSV(
  records: AnySacramentRecord[],
  options: Partial<ExportOptions> = {},
): Promise<ExportResult> {
  try {
    const csvData = convertToCSV(records, options.includeFields);
    const filename = generateExportFilename(
      "csv",
      options.filters?.sacramentType === "all"
        ? undefined
        : options.filters?.sacramentType,
      options.dateRange,
    );

    downloadFile(csvData, filename, "text/csv");

    return {
      success: true,
      fileName: filename,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("CSV export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export CSV",
    };
  }
}

/**
 * Export sacrament records to Excel (simplified - would need a proper Excel library)
 */
export async function exportToExcel(
  records: AnySacramentRecord[],
  options: Partial<ExportOptions> = {},
): Promise<ExportResult> {
  try {
    // For now, we'll export as CSV with Excel-compatible format
    // In a real implementation, you'd use a library like xlsx or exceljs
    const csvData = convertToCSV(records, options.includeFields);
    const filename = generateExportFilename(
      "excel",
      options.filters?.sacramentType === "all"
        ? undefined
        : options.filters?.sacramentType,
      options.dateRange,
    );

    // Create a more Excel-friendly CSV
    const excelCsvData = "\uFEFF" + csvData; // Add BOM for proper UTF-8 encoding in Excel

    downloadFile(excelCsvData, filename.replace(".xlsx", ".csv"), "text/csv");

    return {
      success: true,
      fileName: filename,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("Excel export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export Excel",
    };
  }
}

/**
 * Generate HTML table for PDF export
 */
function generateHTMLTable(records: AnySacramentRecord[]): string {
  if (records.length === 0) return "<p>No records to export</p>";

  const fields = [
    "memberName",
    "sacramentType",
    "dateOfSacrament",
    "locationOfSacrament",
    "officiantName",
  ];

  const headerRow = fields
    .map((field) => {
      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f5f5f5;">${label}</th>`;
    })
    .join("");

  const dataRows = records
    .map((record) => {
      const cells = fields
        .map((field) => {
          let value = record[field as keyof AnySacramentRecord] as any;

          if (field === "sacramentType") {
            value = formatSacramentType(value);
          } else if (field === "dateOfSacrament") {
            value = value ? new Date(value).toLocaleDateString() : "";
          } else if (field === "memberName" && !value && record.member) {
            value = `${record.member.firstName} ${record.member.lastName}`;
          }

          return `<td style="border: 1px solid #ddd; padding: 8px;">${value || ""}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
      <thead>
        <tr>${headerRow}</tr>
      </thead>
      <tbody>
        ${dataRows}
      </tbody>
    </table>
  `;
}

/**
 * Export sacrament records to PDF (simplified - would need a proper PDF library)
 */
export async function exportToPDF(
  records: AnySacramentRecord[],
  options: Partial<ExportOptions> = {},
): Promise<ExportResult> {
  try {
    // For now, we'll create an HTML version that can be printed to PDF
    // In a real implementation, you'd use a library like jsPDF or puppeteer
    const filename = generateExportFilename(
      "pdf",
      options.filters?.sacramentType === "all"
        ? undefined
        : options.filters?.sacramentType,
      options.dateRange,
    );

    const htmlTable = generateHTMLTable(records);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sacrament Records Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          .export-info { margin-bottom: 20px; color: #666; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Sacrament Records Export</h1>
        <div class="export-info">
          <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Records:</strong> ${records.length}</p>
          ${
            options.filters?.sacramentType &&
            options.filters.sacramentType !== "all"
              ? `<p><strong>Sacrament Type:</strong> ${formatSacramentType(options.filters.sacramentType)}</p>`
              : ""
          }
        </div>
        ${htmlTable}
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Print to PDF
          </button>
        </div>
      </body>
      </html>
    `;

    // Open in new window for printing
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    }

    return {
      success: true,
      fileName: filename,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("PDF export error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export PDF",
    };
  }
}

/**
 * Main export function that handles all formats
 */
export async function exportSacramentRecords(
  records: AnySacramentRecord[],
  options: ExportOptions,
): Promise<ExportResult> {
  if (records.length === 0) {
    return {
      success: false,
      error: "No records to export",
    };
  }

  switch (options.format) {
    case "csv":
      return exportToCSV(records, options);
    case "excel":
      return exportToExcel(records, options);
    case "pdf":
      return exportToPDF(records, options);
    default:
      return {
        success: false,
        error: `Unsupported export format: ${options.format}`,
      };
  }
}

/**
 * Filter records based on export options
 */
export function filterRecordsForExport(
  records: AnySacramentRecord[],
  options: Partial<ExportOptions>,
): AnySacramentRecord[] {
  let filteredRecords = [...records];

  // Filter by record IDs if specified
  if (options.recordIds && options.recordIds.length > 0) {
    filteredRecords = filteredRecords.filter((record) =>
      options.recordIds!.includes(record.id),
    );
  }

  // Filter by sacrament type
  if (
    options.filters?.sacramentType &&
    options.filters.sacramentType !== "all"
  ) {
    filteredRecords = filteredRecords.filter(
      (record) => record.sacramentType === options.filters!.sacramentType,
    );
  }

  // Filter by date range
  if (options.dateRange?.start && options.dateRange?.end) {
    const startDate = new Date(options.dateRange.start);
    const endDate = new Date(options.dateRange.end);

    filteredRecords = filteredRecords.filter((record) => {
      const recordDate = new Date(record.dateOfSacrament);
      return recordDate >= startDate && recordDate <= endDate;
    });
  }

  // Filter by other criteria from filters
  if (options.filters?.searchTerm) {
    const searchTerm = options.filters.searchTerm.toLowerCase();
    filteredRecords = filteredRecords.filter(
      (record) =>
        record.memberName?.toLowerCase().includes(searchTerm) ||
        record.officiantName.toLowerCase().includes(searchTerm) ||
        record.locationOfSacrament.toLowerCase().includes(searchTerm) ||
        record.notes?.toLowerCase().includes(searchTerm),
    );
  }

  return filteredRecords;
}
