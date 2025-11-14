import { configureStore } from "@reduxjs/toolkit";
import { caseApi } from "../features/case/caseApi";

// Local import reducers
import authReducer from "../features/auth/authSlice";
import caseReducer from "../features/case/caseSlice";
import chatReducer from "../features/chat/chatSlice";
import roundReducer from "../features/chat/roundLimitSlice";
import uploadReducer from "../features/documents/uploadSlice";
import previewReducer from "../features/documents/previewSlice";
import judgeReducer from "../features/judge/judgeSlice";
import citationReducer from "../features/judge/citationSlice";
import { judgeApi } from "../features/judge/judgeApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    case: caseReducer,
    chat: chatReducer,
    rounds: roundReducer,
    documentsUpload: uploadReducer,
    documentPreview: previewReducer,
    judge: judgeReducer,
    citations: citationReducer,

    // RTK Query reducer 
    [caseApi.reducerPath]: caseApi.reducer,
    [judgeApi.reducerPath]: judgeApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(caseApi.middleware)
      .concat(judgeApi.middleware), 
});