import { useParams, useNavigate } from "react-router-dom";
import {
  useGetCaseByIdQuery,
  useJoinCaseMutation,
} from "../features/case/caseApi";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCase, setPartyId } from "../features/case/caseSlice";
import { useEffect, useState } from "react";
import api from "../utils/apiClient";

export default function CaseEntry() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, error } = useGetCaseByIdQuery(caseId);
  const [joinCase, { isLoading: isJoining }] = useJoinCaseMutation();

  const [alreadyJoined, setAlreadyJoined] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [sidesTaken, setSidesTaken] = useState({ A: false, B: false });

  // Check if user already joined this case
  useEffect(() => {
    const checkParticipation = async () => {
      try {
        if (!token || !caseId) return;

        const response = await api.get(`/parties/case/${caseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setAlreadyJoined(response.data.side);
        dispatch(setPartyId(response.data._id));
        console.log("Already joined as Side", response.data.side);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(" Not yet joined this case");
          setAlreadyJoined(null);
        } else {
          console.error(" Unexpected error:", error.message);
        }
      } finally {
        setCheckingStatus(false);
      }
    };

    checkParticipation();
  }, [caseId, token, dispatch]);

  // Check which sides have been taken
  useEffect(() => {
    const fetchSides = async () => {
      try {
        const res = await api.get(`/parties?caseId=${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setSidesTaken(res.data.sidesTaken || { A: false, B: false });
          console.log("Sides taken:", res.data.sidesTaken);
        }
      } catch (err) {
        console.error("Error fetching sides:", err);
      }
    };

    if (token && caseId) fetchSides();
  }, [caseId, token]);

  // Dispatch case data when available
  useEffect(() => {
    if (data) {
      dispatch(setCase(data));
    }
  }, [data, dispatch]);

  // Join case as Side A or B
  const handleSelectSide = async (side) => {
    try {
      console.log("Joining case:", { caseId, side });
      const result = await joinCase({ caseId, side }).unwrap();

      dispatch(setCase({ caseId, title: data?.title, selectedSide: side }));
      dispatch(setPartyId(result.partyId));

      navigate(`/case/${caseId}/room`);
    } catch (error) {
      console.error("Join error:", error);
      const msg = error?.data?.message || error.message;

      if (msg.includes("already joined")) {
        navigate(`/case/${caseId}/room`);
      } else {
        alert(`Failed to join case: ${msg}`);
      }
    }
  };

  // Loading or checking status
  if (isLoading || checkingStatus) {
    return <div className="p-6">Loading case...</div>;
  }

  // Error or case not found
  if (error || !data) {
    return <div className="p-6 text-red-600">Case not found.</div>;
  }

  // Utility to generate button class names
  const buttonClass = (taken, baseColor) =>
    `px-5 py-3 rounded text-white ${
      taken ? "bg-gray-400 cursor-not-allowed" : `bg-${baseColor}-600 hover:bg-${baseColor}-700`
    }`;

  return (
    <div className="p-6 flex flex-col gap-4 items-center text-center">
      <h1 className="text-2xl font-semibold">{data.title}</h1>
      <p className="text-gray-600">
        {data.jurisdiction} • {data.caseType}
      </p>

      {alreadyJoined ? (
        <>
          <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-3 rounded mt-6">
            ✓ You already joined as <strong>Side {alreadyJoined}</strong>
          </div>
          <button
            onClick={() => navigate(`/case/${caseId}/room`)}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 mt-3"
          >
            Enter Case Room →
          </button>
        </>
      ) : (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => handleSelectSide("A")}
            disabled={isJoining || sidesTaken.A}
            className={buttonClass(sidesTaken.A, "blue")}
          >
            {sidesTaken.A
              ? "Side A Taken"
              : isJoining
              ? "Joining..."
              : "Join as Side A (Plaintiff)"}
          </button>

          <button
            onClick={() => handleSelectSide("B")}
            disabled={isJoining || sidesTaken.B}
            className={buttonClass(sidesTaken.B, "green")}
          >
            {sidesTaken.B
              ? "Side B Taken"
              : isJoining
              ? "Joining..."
              : "Join as Side B (Defendant)"}
          </button>
        </div>
      )}
    </div>
  );
}
