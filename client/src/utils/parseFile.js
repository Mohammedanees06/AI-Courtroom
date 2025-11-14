export async function parseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // PDF or Word as ArrayBuffer (for preview / text extraction later)
    if (file.type === "application/pdf" || 
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      reader.readAsArrayBuffer(file);
    } else {
      // Normal text/image files
      reader.readAsText(file);
    }

    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
}
