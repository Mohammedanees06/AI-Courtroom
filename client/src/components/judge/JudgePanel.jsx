export default function JudgePanel({ verdict, loading }) {
  return (
    <div className="bg-white border-l-4 border-amber-600 rounded shadow-md p-4 sm:p-6">
      <h2 className="font-bold text-lg sm:text-xl mb-4 text-slate-800 flex items-center gap-2">
        <span>⚖️</span>
        <span>Judge Panel</span>
      </h2>

      {loading ? (
        <div className="flex flex-col items-center text-gray-600 py-6">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="font-medium">Analyzing arguments...</p>
        </div>
      ) : verdict ? (
        <div className="bg-gray-50 border border-gray-300 rounded p-4 shadow-inner">
          <pre className="whitespace-pre-wrap font-sans text-sm sm:text-base text-gray-800 leading-relaxed">
            {verdict}
          </pre>
        </div>
      ) : (
        <div className="text-center text-gray-600 italic py-6 bg-gray-50 rounded border border-gray-200">
          No verdict yet. Submit arguments and request a ruling.
        </div>
      )}
    </div>
  );
}
