import { useState } from "react";
import { useCreateCaseMutation } from "../features/case/caseApi";
import { useNavigate } from "react-router-dom";


export default function CaseCreate() {
  const navigate = useNavigate();
  const [createCase, { isLoading }] = useCreateCaseMutation();

  const [title, setTitle] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [caseType, setCaseType] = useState("");
  const [reliefs, setReliefs] = useState("");

  const [createdCaseId, setCreatedCaseId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      title,
      jurisdiction,
      caseType,
      reliefs: reliefs ? reliefs.split(",").map((r) => r.trim()) : [],
    };

    console.log(" Sending case data:", body);

    try {
      const res = await createCase(body);

      if (res?.error) {
        const errorMessage = res.error.data?.message || res.error.error || "Error creating case";
        alert(errorMessage);
        return;
      }

      if (res?.data) {
        console.log("Case created successfully:", res.data);
        setCreatedCaseId(res.data.caseId);
      }
    } catch (err) {
      console.error("Caught error:", err);
      alert("Unexpected error occurred");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdCaseId);
    alert("Case ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg border-t-4 border-amber-600 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-800 border-b-2 border-gray-200 pb-3">⚖️ Create New Case</h1>

          {createdCaseId ? (
            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-emerald-700">🎉 Case created successfully!</p>
              <p className="text-gray-700">Share this <strong>Case ID</strong> with the other participant:</p>

              <div className="flex justify-center items-center gap-3 mt-4">
                <span className="font-mono text-lg text-slate-800 bg-gray-100 px-4 py-2 rounded border-2 border-gray-300">{createdCaseId}</span>
                <button onClick={handleCopy} className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded shadow transition-all">
                  Copy
                </button>
              </div>

              <button onClick={() => navigate(`/case/${createdCaseId}`)} className="mt-8 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold w-full py-3 rounded shadow-md transition-all">
                Proceed to Case Room →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-slate-700">Case Title</label>
                <input className="border-2 border-gray-300 focus:border-amber-600 focus:outline-none p-3 rounded w-full" placeholder="Eg: Property Dispute" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">Jurisdiction</label>
                <input className="border-2 border-gray-300 focus:border-amber-600 focus:outline-none p-3 rounded w-full" placeholder="Eg: Supreme Court / Karnataka High Court" value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} required />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">Case Type</label>
                <input className="border-2 border-gray-300 focus:border-amber-600 focus:outline-none p-3 rounded w-full" placeholder="Eg: Civil / Criminal / Contract" value={caseType} onChange={(e) => setCaseType(e.target.value)} required />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-slate-700">Reliefs (optional)</label>
                <input className="border-2 border-gray-300 focus:border-amber-600 focus:outline-none p-3 rounded w-full" placeholder="Comma separated (Eg: Compensation, Injunction)" value={reliefs} onChange={(e) => setReliefs(e.target.value)} />
              </div>

              <button disabled={isLoading} className="bg-slate-700 hover:bg-slate-800 text-white font-semibold w-full py-3 rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Creating..." : "Create Case"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
