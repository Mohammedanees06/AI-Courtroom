import { useNavigate } from "react-router-dom";
import JudgePanel from "../judge/JudgePanel";
import UploadBox from "../documents/UploadBox";
import DocumentList from "../documents/DocumentList";
import { uploadDocument } from "../../utils/uploadDocument";

export default function CenterPanel({
  partyInfo,
  chat,
  judge,
  caseId,
  documents,
  triggerJudgeEvaluation,
  handleRemoveDocument,
  onNextRound,
  onAddDocument,
}) {
  const navigate = useNavigate();

  if (!partyInfo) return <div />;

  return (
    <div className="h-full overflow-y-auto bg-gray-100 p-4 sm:p-6">
      {/* User Info Card */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-white rounded border-l-4 border-amber-600 shadow">
        <p className="text-xs sm:text-sm text-gray-600 font-medium">
          Participant:
        </p>
        <p className="text-lg sm:text-xl font-bold text-slate-800 wrap-b">
          Side {partyInfo?.side} • {partyInfo?.name}
        </p>
      </div>

      {/* Round Display */}
      <div className="mb-4 sm:mb-6 text-center bg-white rounded border border-gray-300 shadow p-4 sm:p-6">
        <div className="inline-block bg-slate-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Round {chat.round}
            <span className="text-xl sm:text-2xl text-gray-300">/5</span>
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-700 mt-2 font-medium">
          {chat.maxPerRound} arguments per side, per round
        </p>

        {/* Progress Bar */}
        <div className="mt-3 sm:mt-4 w-full bg-gray-300 rounded h-2">
          <div
            className="bg-amber-600 h-2 rounded transition-all duration-500"
            style={{ width: `${(chat.round / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Judge Panel */}
      <div className="mb-4">
        <JudgePanel verdict={judge.verdict} loading={judge.loading} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <button
          onClick={triggerJudgeEvaluation}
          disabled={judge.loading}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded border border-slate-600 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {judge.loading ? (
            <>
              <span className="animate-spin">⚖️</span>
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <span>⚖️</span>
              <span>Request Verdict</span>
            </>
          )}
        </button>

        <button
          onClick={() => navigate(`/case/${caseId}/export`)}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded border border-emerald-600 shadow transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>📄</span>
          <span>Export Case PDF</span>
        </button>

        <button
          onClick={onNextRound}
          disabled={chat.round >= 5}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded border border-amber-500 shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {chat.round >= 5 ? (
            <>
              <span>✓</span>
              <span className="hidden sm:inline">All Rounds Complete</span>
              <span className="sm:hidden">Complete</span>
            </>
          ) : (
            <>
              <span>→</span>
              <span className="hidden sm:inline">
                Advance to Round {chat.round + 1}
              </span>
              <span className="sm:hidden">Round {chat.round + 1}</span>
            </>
          )}
        </button>
      </div>

      {/* Documents Section */}
      <div className="bg-white rounded border border-gray-300 shadow p-3 sm:p-4">
        <h3 className="font-bold text-base sm:text-lg mb-3 text-slate-800 flex items-center gap-2">
          <span>📎</span>
          <span>Case Documents</span>
        </h3>

        <UploadBox
          onUpload={async (file) => {
            try {
              const doc = await uploadDocument(caseId, partyInfo?._id, file);
              onAddDocument(doc);
            } catch {
              alert("Upload failed");
            }
          }}
        />

        <DocumentList documents={documents} onRemove={handleRemoveDocument} />
      </div>
    </div>
  );
}
