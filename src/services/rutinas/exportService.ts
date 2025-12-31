/**
 * src/services/rutinas/exportService.ts
 * -------------------------------------------------------------------------
 * Servicio para la generación de reportes clínicos en formato PDF.
 * Utiliza jsPDF para la estructura y html2canvas para capturar los gráficos.
 * -------------------------------------------------------------------------
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Interfaces para los datos del reporte
interface ReportMetadata {
  childName: string;
  childId: number;
  establishment?: string;
  therapistName?: string;
  period: string;
}

export const exportService = {
  /**
   * Genera y descarga el informe clínico en PDF
   */
  async downloadRoutinePDF(metadata: ReportMetadata, chartElements: HTMLElement[], aiText: string, summaryMetrics: any) {
    // 1. Crear instancia de jsPDF (Formato A4)
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let currentY = 20;

    // --- ENCABEZADO INSTITUCIONAL ---
    doc.setFillColor(37, 99, 235); // Azul Divermind
    doc.rect(margin, currentY, 5, 5, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(26, 32, 44);
    doc.text("DIVERMIND - REPORTE CLÍNICO", margin + 8, currentY + 4);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`ID Reporte: #RT-${metadata.childId}-${Date.now().toString().slice(-6)}`, pageWidth - margin, currentY + 4, { align: 'right' });
    
    currentY += 15;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    // --- INFORMACIÓN DEL PACIENTE ---
    currentY += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL PACIENTE", margin, currentY);

    currentY += 8;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 20, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(`Paciente: ${metadata.childName}`, margin + 5, currentY + 7);
    doc.text(`Centro: ${metadata.establishment || 'Centro de Innovación Divermind'}`, margin + 5, currentY + 13);
    doc.text(`Período: ${metadata.period}`, pageWidth / 2, currentY + 7);
    doc.text(`Fecha Emisión: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY + 13);

    // --- MÉTRICAS CLAVE (KPIs) ---
    currentY += 30;
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 44);
    doc.text("MÉTRICAS DE RENDIMIENTO", margin, currentY);

    currentY += 8;
    const kpiWidth = (pageWidth - (margin * 2) - 10) / 3;
    
    const drawKPI = (x: number, label: string, value: string) => {
      doc.setDrawColor(241, 245, 249);
      doc.rect(x, currentY, kpiWidth, 15);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(label, x + 5, currentY + 5);
      doc.setFontSize(11);
      doc.setTextColor(37, 99, 235);
      doc.text(value, x + 5, currentY + 11);
    };

    drawKPI(margin, "INDEPENDENCIA", `${summaryMetrics.independence_pct}%`);
    drawKPI(margin + kpiWidth + 5, "RATING PROMEDIO", `${summaryMetrics.avg_independence} / 5.0`);
    drawKPI(margin + (kpiWidth * 2) + 10, "SESIONES", `${summaryMetrics.total_executions}`);

    // --- CAPTURA Y PROCESAMIENTO DE GRÁFICOS ---
    currentY += 25;
    doc.setFontSize(11);
    doc.setTextColor(26, 32, 44);
    doc.text("VISUALIZACIÓN DE EVOLUCIÓN", margin, currentY);
    currentY += 5;

    for (const element of chartElements) {
      if (currentY > 230) { // Salto de página si el gráfico no cabe
        doc.addPage();
        currentY = 20;
      }

      // Capturar el componente de Chart.js como imagen
      const canvas = await html2canvas(element, {
        scale: 2, // Alta resolución
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 15;
    }

    // --- ANÁLISIS CUALITATIVO (IA) ---
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(11);
    doc.text("ANÁLISIS CLÍNICO Y OBSERVACIONES (IA)", margin, currentY);
    
    currentY += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);

    // Formatear texto largo para que respete los márgenes del PDF
    const splitText = doc.splitTextToSize(aiText, pageWidth - (margin * 2));
    doc.text(splitText, margin, currentY);

    // --- PIE DE PÁGINA Y FIRMA ---
    const footerY = 270;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, footerY - 15, margin + 60, footerY - 15);
    doc.setFontSize(8);
    doc.text("Firma del Profesional Responsable", margin, footerY - 10);
    
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("Este documento es confidencial y para uso exclusivo del equipo clínico y tutores legales.", pageWidth / 2, 285, { align: 'center' });

    // 5. Guardar Archivo
    const fileName = `Reporte_${metadata.childName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);
  }
};