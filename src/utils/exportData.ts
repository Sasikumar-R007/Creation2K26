import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, ImageRun, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export type ExportFormat = 'excel' | 'pdf' | 'word';

export interface ColumnOption {
    key: string;
    label: string;
    enabled: boolean;
    isCustom?: boolean; // True for custom columns
    customLabel?: string; // Custom column name entered by user
}

export interface ExportOptions {
    format: ExportFormat;
    eventId?: string;
    eventName?: string;
    columns: ColumnOption[];
    data: any[];
}

// Available column options for guest registrations
export const AVAILABLE_COLUMNS: ColumnOption[] = [
    { key: 'registration_id', label: 'Registration ID', enabled: false },
    { key: 'name', label: 'Name', enabled: false },
    { key: 'email', label: 'Email', enabled: false },
    { key: 'whatsapp_phone', label: 'WhatsApp', enabled: false },
    { key: 'department', label: 'Department', enabled: false },
    { key: 'college', label: 'College', enabled: false },
    { key: 'event_1', label: 'Event 1', enabled: false },
    { key: 'event_2', label: 'Event 2', enabled: false },
    { key: 'event_1_team_name', label: 'Event 1 Team', enabled: false },
    { key: 'event_2_team_name', label: 'Event 2 Team', enabled: false },
    { key: 'upi_transaction_id', label: 'UPI Transaction ID', enabled: false },
    { key: 'created_at', label: 'Registered Date', enabled: false },
];

// Convert data to row format based on selected columns
function prepareData(data: any[], columns: ColumnOption[]): any[][] {
    const enabledColumns = columns.filter(col => col.enabled);
    const headers = enabledColumns.map(col => {
        // Use custom label if it's a custom column, otherwise use the regular label
        return col.isCustom && col.customLabel ? col.customLabel : col.label;
    });
    const rows = data.map(item => {
        return enabledColumns.map(col => {
            // Custom columns are always empty
            if (col.isCustom) {
                return '';
            }
            const value = getNestedValue(item, col.key);
            if (col.key === 'created_at' && value) {
                return new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            }
            if (col.key === 'event_1' || col.key === 'event_2') {
                return value?.name || value || '-';
            }
            if (col.key === 'registration_id' && !value) {
                // Fallback to id if registration_id is not available
                return item.id?.substring(0, 13) || item.id || '-';
            }
            return value || '-';
        });
    });
    return [headers, ...rows];
}

function getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        if (value && typeof value === 'object') {
            value = value[key];
        } else {
            return null;
        }
    }
    return value;
}

// Load image as base64 (returns full data URI for PDF, base64 string for Word)
async function loadImageAsBase64(src: string, forPdf: boolean = false): Promise<string> {
    try {
        const response = await fetch(src);
        if (!response.ok) {
            console.error(`Failed to load image ${src}: ${response.status} ${response.statusText}`);
            return '';
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                if (!base64) {
                    console.error(`Invalid base64 data for ${src}`);
                    resolve('');
                    return;
                }
                // For PDF, return full data URI; for Word, return just base64 string
                if (forPdf) {
                    resolve(base64); // Full data URI for jsPDF
                } else {
                    resolve(base64.includes(',') ? base64.split(',')[1] : base64); // Just base64 for docx
                }
            };
            reader.onerror = (error) => {
                console.error(`Error reading image ${src}:`, error);
                resolve(''); // Resolve with empty string instead of rejecting
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error(`Error loading image ${src}:`, error);
        return '';
    }
}

// Export to Excel
export async function exportToExcel(options: ExportOptions): Promise<void> {
    const { data, columns } = options;
    // Filter out custom columns for Excel (not supported)
    const excelColumns = columns.filter(col => !col.isCustom);
    const rows = prepareData(data, excelColumns);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    const fileName = options.eventName
        ? `Registrations_${options.eventName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`
        : `Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;

    XLSX.writeFile(wb, fileName);
}

// Export to PDF
export async function exportToPDF(options: ExportOptions): Promise<void> {
    const { data, columns, eventName } = options;
    const rows = prepareData(data, columns);

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    let yPos = margin;

    // Header with logos
    try {
        const creationLogo = await loadImageAsBase64('/Logo 4.png', true); // true for PDF
        const bcaLogo = await loadImageAsBase64('/Other photos/BCA logo.png', true); // true for PDF

        // Creation logo (left) - adjusted position
        if (creationLogo) {
            doc.addImage(creationLogo, 'PNG', margin, yPos + 2, 25, 18);
        }

        // BCA logo (right) - adjusted position
        if (bcaLogo) {
            doc.addImage(bcaLogo, 'PNG', pageWidth - margin - 25, yPos + 2, 25, 18);
        }

        // Title - reduced space above
        yPos += 5;
        doc.setFontSize(16);
        doc.setFont('times', 'bold'); // Times New Roman
        doc.text('CREATION 2K26 - Event Registrations', pageWidth / 2, yPos, { align: 'center' });

        if (eventName) {
            yPos += 7;
            doc.setFontSize(12);
            doc.setFont('times', 'normal');
            doc.text(`Event: ${eventName}`, pageWidth / 2, yPos, { align: 'center' });
        }

        // Date and time below title
        yPos += 7;
        const downloadDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text(`Downloaded on: ${downloadDate}`, pageWidth / 2, yPos, { align: 'center' });

        yPos += 8;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
    } catch (error) {
        console.error('Error loading logos:', error);
        // Continue without logos
        yPos += 5;
        doc.setFontSize(16);
        doc.setFont('times', 'bold');
        doc.text('CREATION 2K26 - Event Registrations', pageWidth / 2, yPos, { align: 'center' });
        yPos += 12;
        const downloadDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text(`Downloaded on: ${downloadDate}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 8;
    }

    // Table
    const colCount = rows[0].length;
    const colWidth = contentWidth / colCount;
    const rowHeight = 8;

    // Header row
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    rows[0].forEach((header, i) => {
        doc.rect(margin + (i * colWidth), yPos, colWidth, rowHeight);
        doc.text(header.toString(), margin + (i * colWidth) + 2, yPos + 5, { maxWidth: colWidth - 4 });
    });
    yPos += rowHeight;

    // Data rows
    doc.setFont('times', 'normal');
    for (let i = 1; i < rows.length; i++) {
        if (yPos + rowHeight > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
        }

        rows[i].forEach((cell, j) => {
            doc.rect(margin + (j * colWidth), yPos, colWidth, rowHeight);
            doc.text(cell.toString(), margin + (j * colWidth) + 2, yPos + 5, { maxWidth: colWidth - 4 });
        });
        yPos += rowHeight;
    }

    const fileName = eventName
        ? `Registrations_${eventName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        : `Registrations_${new Date().toISOString().split('T')[0]}.pdf`;

    doc.save(fileName);
}

// Export to Word
export async function exportToWord(options: ExportOptions): Promise<void> {
    const { data, columns, eventName } = options;
    const rows = prepareData(data, columns);

    try {
        const creationLogo = await loadImageAsBase64('/Logo 4.png');
        const bcaLogo = await loadImageAsBase64('/Other photos/BCA logo.png');

        // Header with logos in table (left logo, title, right logo)
        const downloadDate = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const headerTable = new Table({
            rows: [
                new TableRow({
                    children: [
                        // Left logo cell
                        new TableCell({
                            children: creationLogo ? [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: creationLogo,
                                            transformation: { width: 80, height: 60 },
                                            type: 'png',
                                        })
                                    ],
                                    alignment: AlignmentType.LEFT,
                                })
                            ] : [new Paragraph({ text: '' })],
                            width: { size: 30, type: WidthType.PERCENTAGE },
                        }),
                        // Title cell
                        new TableCell({
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: 'CREATION 2K26',
                                            bold: true,
                                            font: 'Times New Roman',
                                            size: 28,
                                        }),
                                        new TextRun({
                                            text: '\nEvent Registrations',
                                            bold: true,
                                            font: 'Times New Roman',
                                            size: 24,
                                        }),
                                        ...(eventName ? [
                                            new TextRun({
                                                text: `\nEvent: ${eventName}`,
                                                font: 'Times New Roman',
                                                size: 20,
                                            })
                                        ] : []),
                                        new TextRun({
                                            text: `\nDownloaded on: ${downloadDate}`,
                                            italics: true,
                                            font: 'Times New Roman',
                                            size: 18,
                                        })
                                    ],
                                    alignment: AlignmentType.CENTER,
                                })
                            ],
                            width: { size: 40, type: WidthType.PERCENTAGE },
                        }),
                        // Right logo cell
                        new TableCell({
                            children: bcaLogo ? [
                                new Paragraph({
                                    children: [
                                        new ImageRun({
                                            data: bcaLogo,
                                            transformation: { width: 80, height: 60 },
                                            type: 'png',
                                        })
                                    ],
                                    alignment: AlignmentType.RIGHT,
                                })
                            ] : [new Paragraph({ text: '' })],
                            width: { size: 30, type: WidthType.PERCENTAGE },
                        }),
                    ],
                })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
        });

        // Table rows
        const tableRows = rows.map((row, rowIndex) => {
            const cells = row.map(cell => {
                return new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: cell.toString(),
                            font: 'Times New Roman',
                            bold: rowIndex === 0, // Bold headers
                        })],
                        alignment: AlignmentType.CENTER,
                    })],
                    width: { size: 100 / row.length, type: WidthType.PERCENTAGE },
                });
            });

            return new TableRow({
                children: cells,
                tableHeader: rowIndex === 0,
            });
        });

        const dataTable = new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
        });

        const doc = new Document({
            sections: [{
                children: [
                    headerTable,
                    new Paragraph({ text: '', spacing: { after: 200 } }), // Spacing
                    dataTable,
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = eventName
            ? `Registrations_${eventName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.docx`
            : `Registrations_${new Date().toISOString().split('T')[0]}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting to Word:', error);
        throw error;
    }
}

// Main export function
export async function exportData(options: ExportOptions): Promise<void> {
    switch (options.format) {
        case 'excel':
            await exportToExcel(options);
            break;
        case 'pdf':
            await exportToPDF(options);
            break;
        case 'word':
            await exportToWord(options);
            break;
        default:
            throw new Error(`Unsupported format: ${options.format}`);
    }
}

