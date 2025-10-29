import { subscribeToPoll, unsubscribeFromPoll } from "../slices/realtimeSlice";

export const createRealtimeMiddleware = (realtimeService) => {
  return () => (next) => (action) => {
    const result = next(action);

    if (subscribeToPoll.match(action)) {
      const pollId = action.payload;
      console.log(`[Middleware] Subscribing to poll ${pollId}`);
      realtimeService.connectToPoll(pollId);
    }

    if (unsubscribeFromPoll.match(action)) {
      const pollId = action.payload;
      console.log(`[Middleware] Unsubscribing from poll ${pollId}`);
      realtimeService.disconnectFromPoll(pollId);
    }

    return result;
  };
};
