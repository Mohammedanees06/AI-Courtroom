import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinCase() {
  const [caseId, setCaseId] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!caseId.trim()) return alert("Please enter a Case ID");
    navigate(`/case/${caseId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg border-t-4 border-amber-600 p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 border-b-2 border-gray-200 pb-3">⚖️ Join Existing Case</h2>

        <input
          className="border-2 border-gray-300 focus:border-amber-600 focus:outline-none p-3 w-full mb-4 rounded"
          placeholder="Enter Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        />

        <button
          onClick={handleJoin}
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold w-full py-3 rounded shadow-md transition-all"
        >
          Join Case →
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have a case?{" "}
          <a href="/create-case" className="text-emerald-700 hover:text-emerald-800 font-semibold border-b-2 border-emerald-700">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
