import { useEffect, useRef } from "react";

import { realtimeService } from "@/lib/utils/realtime-service";
import {
  subscribeToPoll,
  unsubscribeFromPoll,
} from "@/services/redux/slices/realtimeSlice";
import { useAppDispatch } from "@/services/redux/store";

export const useRealtime = (pollId) => {
  const dispatch = useAppDispatch();
  const pollIdRef = useRef(null);

  useEffect(() => {
    if (!pollId || pollId === pollIdRef.current) {
      return undefined;
    }
    pollIdRef.current = pollId;
    console.log(`[useRealtime] Connecting to poll ${pollId}`);
    realtimeService.connectToPoll(pollId);
    dispatch(subscribeToPoll(pollId));
    return () => {
      console.log(`[useRealtime] Disconnecting from poll ${pollId}`);
      realtimeService.disconnectFromPoll(pollId);
      dispatch(unsubscribeFromPoll(pollId));
      pollIdRef.current = null;
    };
  }, [pollId, dispatch]);

  return {
    isConnected: realtimeService.getConnectionStatus(pollId),
  };
};
