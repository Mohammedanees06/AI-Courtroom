import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sideA: [],
  sideB: [],
  round: 1,
  maxPerRound: 2,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Set messages from backend response; handles messages array or object with currentRound
    setMessages(state, action) {
      let messages = action.payload;
      let currentRound = null;

      // Handle backend response: { messages: [...], currentRound: X }
      if (messages && typeof messages === 'object' && !Array.isArray(messages)) {
        currentRound = messages.currentRound;
        messages = messages.messages; // Extract messages array
      }

      if (!Array.isArray(messages)) {
        console.error('setMessages expects an array, got:', messages);
        return;
      }

      // Separate messages by side, mapping to simplified format
      state.sideA = messages
        .filter(m => m.side === "A")
        .map(m => ({
          text: m.content,
          round: m.round || 1,
        }));

      state.sideB = messages
        .filter(m => m.side === "B")
        .map(m => ({
          text: m.content,
          round: m.round || 1,
        }));

      // Update current round from payload or compute max round from messages
      if (currentRound) {
        state.round = currentRound;
      } else if (messages.length > 0) {
        const maxRound = Math.max(...messages.map(m => m.round || 1));
        state.round = maxRound;
      }
    },

    // Add a new message to the appropriate side array with current round
    addMessage(state, action) {
      const { side, text } = action.payload;
      const message = { text, round: state.round };

      if (side === "sideA") {
        state.sideA.push(message);
      } else if (side === "sideB") {
        state.sideB.push(message);
      }
    },

    // Increment round, max limit 5
    nextRound(state) {
      if (state.round < 5) {
        state.round++;
      }
    },

    // Explicitly set round number
    setRound(state, action) {
      state.round = action.payload;
    },

    // Clear chat state resetting messages and round
    clearChat(state) {
      state.sideA = [];
      state.sideB = [];
      state.round = 1;
    },
  },
});

export const { setMessages, addMessage, clearChat, nextRound, setRound } = chatSlice.actions;
export default chatSlice.reducer;
