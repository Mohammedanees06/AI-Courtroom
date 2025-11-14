import { useAppSelector } from "../app/hooks";
import Navbar from "../components/layout/Navbar";
import { jsPDF } from "jspdf";

export default function ExportOrder() {
  const caseData = useAppSelector((state) => state.case);
  const chat = useAppSelector((state) => state.chat);
  const judge = useAppSelector((state) => state.judge);
  const documents = useAppSelector((state) => state.documentsUpload.documents);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    // Title
    doc.setFontSize(16);
    doc.text(caseData.title || "Case Summary", 10, y);
    y += 10;

    // Case Info
    doc.setFontSize(12);
    doc.text(`Jurisdiction: ${caseData.jurisdiction}`, 10, y);
    y += 6;
    doc.text(`Case Type: ${caseData.caseType}`, 10, y);
    y += 10;

    // Documents
    doc.setFontSize(14);
    doc.text("Documents Submitted:", 10, y);
    y += 8;

    documents.forEach((d) => {
      doc.setFontSize(12);
      doc.text(`• ${d.originalName}`, 12, y);
      y += 6;
    });

    y += 10;

    // Chat Transcript
    doc.setFontSize(14);
    doc.text("Argument Transcript:", 10, y);
    y += 8;

    const addMessages = (sideName, messages) => {
      doc.setFontSize(13);
      doc.text(`${sideName}:`, 10, y);
      y += 6;
      messages.forEach((m) => {
        doc.setFontSize(11);
        doc.text(`- ${m.text}`, 12, y);
        y += 6;
      });
      y += 6;
    };

    addMessages("Side A (Plaintiff)", chat.sideA);
    addMessages("Side B (Defendant)", chat.sideB);

    // Verdict
    doc.setFontSize(14);
    doc.text("Final Verdict:", 10, y);
    y += 8;

    const verdictLines = doc.splitTextToSize(judge.verdict || "No verdict yet.", 180);
    verdictLines.forEach((line) => {
      doc.text(line, 10, y);
      y += 6;
    });

    // Save PDF
    doc.save("Case_Order_Summary.pdf");
  };

  return (
    <div>
     
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold">Export Case Order</h1>

        <div className="bg-white shadow p-4 rounded">
          <p className="text-gray-700 mb-4">
            You can export the full transcript and verdict as a PDF.
          </p>

          <button
            onClick={handleExportPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Download Case PDF
          </button>
        </div>
      </div>
    </div>
  );
}
