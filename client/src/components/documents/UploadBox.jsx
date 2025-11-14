import { useState, useCallback } from "react";

function UploadBox({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      onUpload(files[0]); // You can upload multiple if you want
    },
    [onUpload]
  );

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  // Drag enter
  const onDragEnter = () => setIsDragging(true);
  const onDragLeave = () => setIsDragging(false);
  const onDragOver = (e) => e.preventDefault();

  // Drop event
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded p-6 text-center transition cursor-pointer
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-400"}
      `}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <label className="cursor-pointer text-gray-700">
        📄 Click or Drag & Drop to Upload
        <input type="file" className="hidden" onChange={handleFileInput} />
      </label>

      <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, Images</p>
    </div>
  );
}

export default UploadBox;
