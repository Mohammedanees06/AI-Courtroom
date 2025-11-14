import { Virtuoso } from "react-virtuoso";
import React, { useCallback } from "react";

function DocumentList({ documents, onRemove }) {
  const handleDelete = useCallback(
    (id) => {
      onRemove(id);
    },
    [onRemove]
  );

  return (
    <div className="mt-3">
      <h3 className="font-semibold mb-2">Uploaded Documents</h3>

      {documents.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <div className="border rounded bg-white overflow-hidden">
          <Virtuoso
            style={{ height: "300px" }}
            data={documents}
            itemContent={(index, doc) => (
              <div
                className="border-b p-2 bg-white flex justify-between items-center"
                key={doc._id}
              >
                <span>{doc.originalName}</span>

                <button
                  className="text-red-500 font-bold hover:text-red-700"
                  onClick={() => handleDelete(doc._id)}
                >
                  ✖
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(DocumentList);
