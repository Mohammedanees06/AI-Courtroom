import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import ChatBox from "../components/chat/ChatBox";
import SplitScreenLayout from "../components/layout/SplitScreenLayout";
import CenterPanel from "../components/caseroom/CenterPanel";
import { setMessages, addMessage, nextRound } from "../features/chat/chatSlice";
import { useSubmitArgumentMutation, useRequestVerdictMutation } from "../features/judge/judgeApi";
import { setVerdict, setJudgeLoading } from "../features/judge/judgeSlice";
import { addDocument, removeDocument } from "../features/documents/uploadSlice";
import { setPartyId } from "../features/case/caseSlice";
import api from "../utils/apiClient";

export default function CaseRoom() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const chat = useAppSelector((state) => state.chat);
  const judge = useAppSelector((state) => state.judge);
  const token = useAppSelector((state) => state.auth.token);
  const documents = useAppSelector((state) => state.documentsUpload.documents);

  const [submitArgument] = useSubmitArgumentMutation();
  const [requestVerdict] = useRequestVerdictMutation();

  const [partyInfo, setPartyInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const lastProcessedRound = useRef(0);

  //  Fetch party info (inside component)
  useEffect(() => {
    async function fetchPartyInfo() {
      try {
        const response = await api.get(`/parties/case/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPartyInfo(response.data);
        dispatch(setPartyId(response.data._id));
        setLoading(false);
      } catch (error) {
        alert("You need to join this case first");
        navigate(`/case/${caseId}`, error);
      }
    }

    fetchPartyInfo();
  }, [caseId, token, dispatch, navigate]);

  // Fetch messages with polling
  const fetchMessages = useCallback(async () => {
    if (!partyInfo) return;

    try {
      const res = await api.get(`/cases/${caseId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setMessages(res.data));
    } catch (err) {
      console.error("Msg fetch err:", err);
    }
  }, [caseId, token, dispatch, partyInfo]);

  useEffect(() => {
    if (!loading) fetchMessages();

    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages, loading]);

  //  Poll verdict every 3 seconds for updates (keeps both sides in sync)
  useEffect(() => {
    if (!partyInfo) return;

    const fetchVerdict = async () => {
      try {
        const res = await api.get(`/judge/verdict/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.verdict) {
          dispatch(setVerdict(res.data.verdict));
        }
      } catch (error) {
        console.error("Failed to fetch verdict:", error);
      }
    };

    fetchVerdict();

    const interval = setInterval(fetchVerdict, 3000);

    return () => clearInterval(interval);
  }, [caseId, token, dispatch, partyInfo]);

  // Auto-advance round when both sides complete
  useEffect(() => {
    const sideACount = chat.sideA.filter((m) => m.round === chat.round).length;
    const sideBCount = chat.sideB.filter((m) => m.round === chat.round).length;

    if (
      sideACount >= chat.maxPerRound &&
      sideBCount >= chat.maxPerRound &&
      chat.round < 5 &&
      lastProcessedRound.current !== chat.round
    ) {
      console.log(
        `Round ${chat.round} complete! Side A: ${sideACount}, Side B: ${sideBCount}`,
      );

      lastProcessedRound.current = chat.round;

      setTimeout(() => {
        dispatch(nextRound());
        console.log(` Advanced to Round ${chat.round + 1}`);
      }, 1500);
    }
  }, [chat.sideA, chat.sideB, chat.round, chat.maxPerRound, dispatch]);

  //  Send argument
  const sendArgument = useCallback(
    async (side, text) => {
      dispatch(addMessage({ side, text }));

      try {
        const backendSide = side === "sideA" ? "A" : "B";

        await submitArgument({
          caseId,
          side: backendSide,
          text,
        }).unwrap();

        setTimeout(fetchMessages, 500);
      } catch (error) {
        alert(error.data?.message || "Failed to submit");
      }
    },
    [caseId, submitArgument, dispatch, fetchMessages],
  );

  //Judge evaluation
  const triggerJudgeEvaluation = useCallback(async () => {
    dispatch(setJudgeLoading(true));
    try {
      const result = await requestVerdict(caseId).unwrap();
      dispatch(setVerdict(result.verdict));
    } catch (err) {
      alert(err.data?.message || "Failed to get verdict");
    } finally {
      dispatch(setJudgeLoading(false));
    }
  }, [caseId, requestVerdict, dispatch]);

  //  Remove document
  const handleRemoveDocument = useCallback(
    async (docId) => {
      try {
        await api.delete(`/documents/${docId}`);
        dispatch(removeDocument(docId));
      } catch (err) {
        alert("Failed to delete", err.message);
      }
    },
    [dispatch],
  );

  //  Memoized UI Panels
  const leftPanel = useMemo(
    () => (
      <div className="h-full flex flex-col p-4 bg-slate-50">
        <ChatBox
          label="Side A (Plaintiff)"
          messages={chat.sideA}
          onSend={(msg) => sendArgument("sideA", msg)}
          side="sideA"
          userSide={partyInfo?.side}
        />
      </div>
    ),
    [chat.sideA, sendArgument, partyInfo],
  );

  const rightPanel = useMemo(
    () => (
      <div className="h-full flex flex-col p-4 bg-slate-50">
        <ChatBox
          label="Side B (Defendant)"
          messages={chat.sideB}
          onSend={(msg) => sendArgument("sideB", msg)}
          side="sideB"
          userSide={partyInfo?.side}
        />
      </div>
    ),
    [chat.sideB, sendArgument, partyInfo],
  );

  const centerPanel = useMemo(
    () => (
      <CenterPanel
        partyInfo={partyInfo}
        chat={chat}
        judge={judge}
        caseId={caseId}
        documents={documents}
        triggerJudgeEvaluation={triggerJudgeEvaluation}
        handleRemoveDocument={handleRemoveDocument}
        onNextRound={() => dispatch(nextRound())}
        onAddDocument={(doc) => dispatch(addDocument(doc))}
      />
    ),
    [
      partyInfo,
      chat,
      judge,
      caseId,
      documents,
      triggerJudgeEvaluation,
      handleRemoveDocument,
      dispatch,
    ],
  );

  //  Conditional rendering
  if (loading) return <div className="p-6">Loading case room...</div>;
  if (!partyInfo)
    return <div className="p-6 text-red-600">Join the case first</div>;

  // Render's final layout
  return (
    <SplitScreenLayout left={leftPanel} center={centerPanel} right={rightPanel} />
  );
}
