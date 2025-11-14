import { useEffect } from "react";
import { useGetUserCasesQuery } from "../features/case/caseApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCases, setPage } from "../features/case/caseSlice";


export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { page, limit, cases, totalPages } = useAppSelector((state) => state.case);

  const { data, isLoading, error } = useGetUserCasesQuery({ page, limit });

  useEffect(() => {
    if (data) {
      dispatch(setCases({ cases: data.cases, totalPages: data.totalPages }));
    }
  }, [data, dispatch]);


  const handlePrev = () => {
    if (page > 1) dispatch(setPage(page - 1));
  };

  const handleNext = () => {
    if (page < totalPages) dispatch(setPage(page + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-amber-600">
          <h1 className="text-3xl font-bold text-slate-800">⚖️ Your Cases</h1>
         
        </div>

        <button
          onClick={() => window.location.href = "/create-case"}
          className="bg-slate-700 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded shadow mb-6 transition-all"
        >
          + Create New Case
        </button>

        {isLoading && <p className="text-center text-gray-600 py-8">Loading cases...</p>}

        {error && <p className="text-red-600 bg-red-50 border border-red-300 p-4 rounded">Failed to load cases</p>}

        {cases?.length > 0 ? (
          <>
            <ul className="space-y-4">
              {cases.map((courtCase) => (
                <li key={courtCase._id} className="bg-white border-l-4 border-amber-600 p-5 rounded shadow hover:shadow-md transition-all">
                  <div className="font-bold text-xl text-slate-800 mb-2">{courtCase.title}</div>
                  <div className="text-sm text-gray-600 mb-3">{courtCase.jurisdiction} • {courtCase.caseType}</div>
                  <button
                    onClick={() => window.location.href = `/case/${courtCase._id}`}
                    className="text-slate-700 hover:text-slate-900 font-semibold border-b-2 border-amber-600 pb-1"
                  >
                    Open Case →
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex justify-center items-center gap-4 mt-8">
              <button onClick={handlePrev} disabled={page <= 1} className="px-5 py-2 bg-white border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                ← Prev
              </button>
              <span className="font-bold text-slate-800">Page {page} of {totalPages}</span>
              <button onClick={handleNext} disabled={page >= totalPages} className="px-5 py-2 bg-white border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Next →
              </button>
            </div>
          </>
        ) : (
          !isLoading && <p className="text-center text-gray-600 py-12 bg-white rounded border border-gray-200">No cases yet. Create one to begin.</p>
        )}
      </div>
    </div>
  );
}
