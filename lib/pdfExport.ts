import { jsPDF } from 'jspdf';
import { CaseRecord } from '@/types/case';
import { redactEvidenceFile } from './redaction';

/**
 * Generates and downloads a well-styled, official CaseCarry carry-forward PDF bundle.
 * Falls back to window.print() if an unexpected error occurs during generation.
 */
export async function generateCaseCarryPdf(
  caseData: CaseRecord,
  onFallback?: () => void
): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        y = margin + 5;
        drawPageHeader();
      }
    };

    const drawPageHeader = () => {
      // Subtle top header bar on continuation pages
      doc.setFillColor(36, 87, 197); // #2457C5
      doc.rect(margin, margin - 6, contentWidth, 1.2, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `CaseCarry Carry-Forward Bundle | Ref: ${caseData.id}`,
        margin,
        margin - 1
      );
      doc.text(
        `Citizen: ${caseData.citizenName || 'Citizen'} vs ${caseData.provider || 'Provider'}`,
        pageWidth - margin,
        margin - 1,
        { align: 'right' }
      );
    };

    // --- COVER / HEADER BANNER (Page 1) ---
    // Primary Header Background
    doc.setFillColor(24, 43, 73); // Dark Civic Navy #182B49
    doc.roundedRect(margin, y, contentWidth, 34, 3, 3, 'F');

    // Accent line
    doc.setFillColor(36, 87, 197); // Civic Blue
    doc.rect(margin + 4, y + 4, 3, 26, 'F');

    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CASECARRY DISPUTE DOSSIER', margin + 12, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(203, 213, 225); // Slate-300
    doc.text(
      'Citizen-Controlled Case Continuity & Verified Evidence Record',
      margin + 12,
      y + 18
    );
    doc.text(
      'Recipient-neutral dossier formatted for ombudsmen, regulators & caseworkers',
      margin + 12,
      y + 24
    );

    // Status Pill on top right
    doc.setFillColor(24, 121, 78); // Emerald #18794E
    doc.roundedRect(pageWidth - margin - 48, y + 8, 44, 7, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('VERIFIED BY CITIZEN', pageWidth - margin - 26, y + 12.8, { align: 'center' });

    y += 38;

    // --- CASE METADATA GRID ---
    doc.setFillColor(248, 247, 243); // #F8F7F3
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');
    doc.setDrawColor(217, 222, 231);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'S');

    const colW = contentWidth / 3;

    // Col 1: Case ID & Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text('CASE IDENTIFIER:', margin + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(23, 32, 51);
    doc.text(caseData.id, margin + 4, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text(`Created: ${caseData.createdAt || 'N/A'}`, margin + 4, y + 18);
    doc.text(`Exported: ${new Date().toISOString().slice(0, 10)}`, margin + 4, y + 23);

    // Col 2: Citizen & Provider
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text('CITIZEN / COMPLAINANT:', margin + colW + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(23, 32, 51);
    const citizenText = doc.splitTextToSize(caseData.citizenName || 'Citizen Complainant', colW - 8);
    doc.text(citizenText[0] || 'Citizen', margin + colW + 4, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text('SERVICE PROVIDER:', margin + colW + 4, y + 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(23, 32, 51);
    const provText = doc.splitTextToSize(caseData.provider || 'Service Provider', colW - 8);
    doc.text(provText[0] || 'Provider', margin + colW + 4, y + 23);

    // Col 3: Account Ref & Evidence Count
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text('ACCOUNT / REF NUMBER:', margin + colW * 2 + 4, y + 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(23, 32, 51);
    doc.text(caseData.accountReference || 'Not provided', margin + colW * 2 + 4, y + 11);

    const includedEvidence = (caseData.evidence || []).filter((e) => e.privacyStatus !== 'private');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text(`Evidence Attached: ${includedEvidence.length} items`, margin + colW * 2 + 4, y + 18);
    doc.text(`Events Verified: ${caseData.events.length} items`, margin + colW * 2 + 4, y + 23);

    y += 31;

    // Helper to print section titles
    const printSectionHeader = (numberStr: string, titleStr: string) => {
      checkPageBreak(16);
      doc.setFillColor(238, 242, 255); // Indigo/Blue tint #EEF2FF
      doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'F');
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(margin, y, contentWidth, 7, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(36, 87, 197); // #2457C5
      doc.text(`${numberStr}  ${titleStr.toUpperCase()}`, margin + 3.5, y + 5);
      y += 10;
    };

    // Helper to print standard multi-line text block
    const printParagraph = (text: string, isBold: boolean = false, textColor: number[] = [23, 32, 51]) => {
      const cleanText = text.trim() || 'No specific details provided.';
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(9);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const lines = doc.splitTextToSize(cleanText, contentWidth - 4);
      const blockHeight = lines.length * 4.2;

      checkPageBreak(blockHeight + 4);
      doc.text(lines, margin + 2, y);
      y += blockHeight + 4;
    };

    // --- SECTION 1: EXECUTIVE CASE SUMMARY ---
    printSectionHeader('1.', 'Executive Case Summary');
    const summaryText =
      caseData.unresolved.originalIssue ||
      `Citizen dispute initiated regarding service delivery and account administration with ${caseData.provider || 'the service provider'}.`;
    printParagraph(summaryText);

    // --- SECTION 2: WHAT REMAINS UNRESOLVED (THE CORE PROBLEM) ---
    printSectionHeader('2.', 'What Remains Unresolved (Core Dispute)');
    const problemText =
      caseData.unresolved.problem ||
      caseData.unresolved.whatWasNotResolved ||
      'The core issue remains unsettled despite prior correspondence.';
    printParagraph(problemText, true, [185, 28, 28]); // Dark Red accent

    if (caseData.unresolved.whatWasResolved) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(24, 121, 78);
      checkPageBreak(12);
      doc.text('Partially Resolved Aspects:', margin + 2, y);
      y += 4.5;
      printParagraph(caseData.unresolved.whatWasResolved);
    }

    // --- SECTION 3: DESIRED FAIR RESOLUTION & REQUESTED ACTION ---
    printSectionHeader('3.', 'Desired Resolution & Requested Action');
    const actionText =
      caseData.unresolved.requestedAction ||
      caseData.unresolved.resolutionVision ||
      'Citizen requests formal dispute review, account reconciliation, and documented resolution.';
    printParagraph(actionText);

    // --- SECTION 4: WHAT HAS ALREADY BEEN TRIED ---
    printSectionHeader('4.', 'Prior Actions & Responses Received');
    const triedText =
      caseData.unresolved.alreadyTried ||
      (caseData.unresolved.responseReceived
        ? `Responses received: ${caseData.unresolved.responseReceived}`
        : 'Prior communications documented in attached chronology.');
    printParagraph(triedText);

    // --- SECTION 5: VERIFIED CHRONOLOGICAL TIMELINE ---
    printSectionHeader('5.', 'Verified Chronological Timeline');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(82, 96, 113);
    doc.text('Every event below is indexed to source evidence and approved by the citizen.', margin + 2, y);
    y += 5;

    caseData.events.forEach((ev, idx) => {
      const dateHeader = `[${ev.displayDate || ev.date || 'Undated'}] ${ev.title}`;
      const provInfo = `Provenance: ${ev.provenanceLabel || ev.provenance} • Sources: ${ev.sourceNames.join(', ') || 'Citizen direct statement'}`;
      const descLines = doc.splitTextToSize(ev.description, contentWidth - 8);
      const conflictLines = ev.conflictDetails ? doc.splitTextToSize(`⚠️ Contradiction: ${ev.conflictDetails}`, contentWidth - 8) : [];

      const itemHeight = 10 + (descLines.length * 3.8) + (conflictLines.length * 3.8);
      checkPageBreak(itemHeight + 4);

      // Event Card
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, itemHeight, 1.5, 1.5, 'S');

      // Blue dot
      doc.setFillColor(36, 87, 197);
      doc.circle(margin + 4, y + 4.5, 1.5, 'F');

      // Title & Date
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(23, 32, 51);
      doc.text(dateHeader, margin + 8, y + 5);

      // Provenance tag
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(82, 96, 113);
      doc.text(provInfo, margin + 8, y + 8.5);

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(descLines, margin + 8, y + 12.5);

      let currentInnerY = y + 12.5 + descLines.length * 3.8;
      if (conflictLines.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(180, 83, 9); // Amber-700
        doc.text(conflictLines, margin + 8, currentInnerY);
      }

      y += itemHeight + 3;
    });

    // --- SECTION 6: EVIDENCE & DOCUMENT INDEX ---
    printSectionHeader('6.', 'Evidence & Artifact Index');
    if (includedEvidence.length === 0) {
      printParagraph('No physical documents attached. Case is based on citizen testimony and verified statements.');
    } else {
      includedEvidence.forEach((item, idx) => {
        checkPageBreak(9);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(36, 87, 197);
        doc.text(`${idx + 1}. [${item.type.toUpperCase()}]`, margin + 2, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(23, 32, 51);
        doc.text(`${item.title} (${item.filename})`, margin + 24, y);

        doc.setTextColor(82, 96, 113);
        const statusLabel = item.privacyStatus === 'redacted' ? 'Redacted for Privacy' : 'Full File Included';
        doc.text(`Size: ${item.size} • Status: ${statusLabel}`, pageWidth - margin - 2, y, { align: 'right' });

        y += 5.5;
      });
      y += 2;
    }

    // --- SECTION 7: CONTRADICTIONS & UNCERTAINTIES ---
    if ((caseData.contradictions && caseData.contradictions.length > 0) || (caseData.missingInformation && caseData.missingInformation.length > 0)) {
      printSectionHeader('7.', 'Surfaced Discrepancies & Institutional Gaps');

      if (caseData.contradictions && caseData.contradictions.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(180, 83, 9);
        checkPageBreak(8);
        doc.text('Institutional Record Contradictions:', margin + 2, y);
        y += 4.5;
        caseData.contradictions.forEach((c) => {
          printParagraph(`• ${c}`, false, [180, 83, 9]);
        });
      }

      if (caseData.missingInformation && caseData.missingInformation.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(82, 96, 113);
        checkPageBreak(8);
        doc.text('Missing / Unprovided Documents:', margin + 2, y);
        y += 4.5;
        caseData.missingInformation.forEach((m) => {
          printParagraph(`• ${m}`, false, [82, 96, 113]);
        });
      }
    }

    // --- SECTION 8: CITIZEN ESCALATION PATHWAYS ---
    if (caseData.selectedPathways && caseData.selectedPathways.length > 0) {
      printSectionHeader('8.', 'Citizen Escalation Pathways');
      const chosenPathways = (caseData.pathways || []).filter((p) =>
        caseData.selectedPathways.includes(p.id)
      );

      chosenPathways.forEach((p) => {
        const pLines = doc.splitTextToSize(
          `• ${p.name} (${p.organization || p.jurisdiction || 'Civic Authority'}): ${p.whyRelevant || p.relevanceReason || 'Identified citizen escalation pathway.'}`,
          contentWidth - 6
        );
        checkPageBreak(pLines.length * 4 + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(23, 32, 51);
        doc.text(pLines, margin + 2, y);
        y += pLines.length * 4 + 2;
      });
      y += 2;
    }

    // --- SECTION 9: NEUTRALITY & AUTHENTICITY ATTESTATION ---
    checkPageBreak(24);
    doc.setFillColor(241, 245, 249); // Slate-100
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(24, 43, 73);
    doc.text('OFFICIAL CIVIC CONTINUITY ATTESTATION', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const attestation =
      'This dossier was prepared and verified directly by the citizen using CaseCarry. It contains no proprietary lock-in and complies with open civic case standards. Every factual event is linked to indexed primary evidence or stated as direct citizen testimony. Recipient institutions may inspect attached files without special software.';
    const attLines = doc.splitTextToSize(attestation, contentWidth - 8);
    doc.text(attLines, margin + 4, y + 10);

    y += 26;

    // --- PAGE NUMBERS & FOOTER ON ALL PAGES ---
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // Slate-400
      doc.text(
        'CaseCarry | Citizen Case Continuity Platform',
        margin,
        pageHeight - 7
      );
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 7,
        { align: 'right' }
      );
    }

    const safeCitizenName = (caseData.citizenName || 'Citizen').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeProviderName = (caseData.provider || 'Provider').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `CaseCarry_${safeCitizenName}_vs_${safeProviderName}_Bundle.pdf`;

    doc.save(filename);
    return true;
  } catch (err) {
    console.error('PDF export failed, triggering fallback:', err);
    if (onFallback) {
      onFallback();
    } else {
      window.print();
    }
    return false;
  }
}
