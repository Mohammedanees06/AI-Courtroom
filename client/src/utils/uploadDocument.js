import api from "./apiClient";

export async function uploadDocument(caseId, partyId, file) {
  const formData = new FormData();
  formData.append("caseId", caseId);
  formData.append("partyId", partyId);
  formData.append("file", file);

  const res = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.document; 
}
