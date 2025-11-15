import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportData {
  title: string;
  summary: any;
  data: any[];
  filters: any;
  organisationName?: string;
  branchName?: string;
}

export class ReportExporter {
  /**
   * Export report as PDF
   */
  static exportToPDF(exportData: ExportData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text(exportData.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Organization info
    if (exportData.organisationName) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(exportData.organisationName, pageWidth / 2, yPosition, {
        align: 'center',
      });
      yPosition += 5;
    }

    if (exportData.branchName) {
      doc.text(exportData.branchName, pageWidth / 2, yPosition, {
        align: 'center',
      });
      yPosition += 5;
    }

    // Generation date
    doc.text(
      `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' },
    );
    yPosition += 15;

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Summary Statistics', 14, yPosition);
    yPosition += 8;

    // Summary table
    const summaryData = Object.entries(exportData.summary).map(([key, value]) => [
      this.formatKey(key),
      this.formatValue(value),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 14, right: 14 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Applied Filters
    if (exportData.filters && Object.keys(exportData.filters).length > 0) {
      doc.setFontSize(14);
      doc.text('Applied Filters', 14, yPosition);
      yPosition += 8;

      const filterData = Object.entries(exportData.filters)
        .filter(([_, value]) => value && value !== 'ALL')
        .map(([key, value]) => [this.formatKey(key), String(value)]);

      if (filterData.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['Filter', 'Value']],
          body: filterData,
          theme: 'grid',
          headStyles: { fillColor: [99, 102, 241] },
          margin: { left: 14, right: 14 },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      }
    }

    // Detailed Data
    if (exportData.data && exportData.data.length > 0) {
      // Add new page for detailed data
      doc.addPage();
      yPosition = 20;

      doc.setFontSize(14);
      doc.text('Detailed Records', 14, yPosition);
      yPosition += 8;

      // Prepare table data with serial number, excluding ID fields
      const headers = this.getTableHeaders(exportData.data[0]);
      const rows = exportData.data.map((record, idx) => [
        String(idx + 1),
        ...this.getTableRow(record, headers),
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [["No", ...headers.map((h) => this.formatKey(h))]],
        body: rows,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 8 },
      });
    }

    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' },
      );
    }

    // Save the PDF
    const fileName = `${exportData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  /**
   * Export report as Excel
   */
  static exportToExcel(exportData: ExportData) {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      [exportData.title],
      [],
      ['Generated:', new Date().toLocaleString()],
      exportData.organisationName ? ['Organization:', exportData.organisationName] : [],
      exportData.branchName ? ['Branch:', exportData.branchName] : [],
      [],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ...Object.entries(exportData.summary).map(([key, value]) => [
        this.formatKey(key),
        this.formatValue(value),
      ]),
    ].filter((row) => row.length > 0);

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Style the header
    summarySheet['A1'] = { v: exportData.title, s: { font: { bold: true, sz: 16 } } };

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Filters Sheet
    const filterData = Object.entries(exportData.filters)
      .filter(([_, value]) => value && value !== 'ALL')
      .map(([key, value]) => [this.formatKey(key), String(value)]);

    if (filterData.length > 0) {
      const filtersSheet = XLSX.utils.aoa_to_sheet([
        ['Applied Filters'],
        ['Filter', 'Value'],
        ...filterData,
      ]);
      XLSX.utils.book_append_sheet(workbook, filtersSheet, 'Filters');
    }

    // Detailed Data Sheet
    if (exportData.data && exportData.data.length > 0) {
      const detailedData = this.prepareDataForExcel(exportData.data);
      const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
      XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed Data');
    }

    // Save the Excel file
    const fileName = `${exportData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  /**
   * Export report as CSV
   */
  static exportToCSV(exportData: ExportData) {
    if (!exportData.data || exportData.data.length === 0) {
      alert('No data to export');
      return;
    }

    const csvData = this.prepareDataForExcel(exportData.data);
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fileName = `${exportData.title.replace(/\s+/g, '_')}_${new Date().getTime()}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Helper: Format object keys to readable labels
   */
  private static formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  /**
   * Helper: Format values for display
   */
  private static formatValue(value: any): string {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object' && !Array.isArray(value)) {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  }

  /**
   * Helper: Get table headers from first record
   */
  private static getTableHeaders(record: any): string[] {
    const headers: string[] = [];

    const addHeaders = (obj: any, prefix = '') => {
      Object.keys(obj).forEach((key) => {
        if (key === '__typename') return;
        // Skip id-like fields: id, Id, _id, nested ...Id
        if (/^id$/i.test(key) || /Id$/.test(key) || /_id$/i.test(key)) return;

        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (
          obj[key] &&
          typeof obj[key] === 'object' &&
          !Array.isArray(obj[key]) &&
          !(obj[key] instanceof Date)
        ) {
          addHeaders(obj[key], fullKey);
        } else if (!Array.isArray(obj[key])) {
          headers.push(fullKey);
        }
      });
    };

    addHeaders(record);
    return headers.slice(0, 10); // Limit to 10 columns for PDF
  }

  /**
   * Helper: Get table row values
   */
  private static getTableRow(record: any, headers: string[]): any[] {
    return headers.map((header) => {
      const keys = header.split('.');
      let value = record;

      for (const key of keys) {
        value = value?.[key];
      }

      if (value instanceof Date) {
        return value.toLocaleDateString();
      }

      return this.formatValue(value);
    });
  }

  /**
   * Helper: Prepare data for Excel/CSV export
   */
  private static prepareDataForExcel(data: any[]): any[] {
    return data.map((record, idx) => {
      const flatRecord: any = {};
      // Add leading serial number column
      flatRecord['No'] = idx + 1;

      const flatten = (obj: any, prefix = '') => {
        Object.keys(obj).forEach((key) => {
          if (key === '__typename') return;

          const fullKey = prefix ? `${prefix}_${key}` : key;

          if (
            obj[key] &&
            typeof obj[key] === 'object' &&
            !Array.isArray(obj[key]) &&
            !(obj[key] instanceof Date)
          ) {
            flatten(obj[key], fullKey);
          } else if (!Array.isArray(obj[key])) {
            // Skip id-like fields in exports
            if (/(^|_)id$/i.test(fullKey) || /Id$/.test(fullKey)) return;
            flatRecord[this.formatKey(fullKey)] =
              obj[key] instanceof Date
                ? obj[key].toLocaleDateString()
                : this.formatValue(obj[key]);
          }
        });
      };

      flatten(record);
      return flatRecord;
    });
  }
}
