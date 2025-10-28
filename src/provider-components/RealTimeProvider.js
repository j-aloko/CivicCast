"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import { updatePollRealtime } from "@/services/redux/slices/pollsSlice";
import {
  setSocket,
  setConnectionStatus,
  subscribeToPoll,
  unsubscribeFromPoll,
} from "@/services/redux/slices/realtimeSlice";

const PollSocketContext = createContext();

export function PollSocketProvider({ children }) {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const subscribedPolls = useSelector((state) => state.socket.subscribedPolls);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });

    dispatch(setSocket(newSocket));
    dispatch(setConnectionStatus(true));

    newSocket.on("pollUpdate", (data) => {
      dispatch(updatePollRealtime(data));
    });

    return () => {
      newSocket.close();
      dispatch(setSocket(null));
      dispatch(setConnectionStatus(false));
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (socket) {
        subscribedPolls.forEach((pollId) => {
          socket.emit("unsubscribe", { pollId });
        });
      }
    };
  }, [subscribedPolls, socket]);

  const subscribe = useCallback(
    (pollId) => {
      if (socket) {
        socket.emit("subscribe", { pollId });
        dispatch(subscribeToPoll(pollId));
      }
    },
    [socket, dispatch]
  );

  const unsubscribe = useCallback(
    (pollId) => {
      if (socket) {
        socket.emit("unsubscribe", { pollId });
        dispatch(unsubscribeFromPoll(pollId));
      }
    },
    [socket, dispatch]
  );

  const contextValue = useMemo(
    () => ({ subscribe, unsubscribe }),
    [subscribe, unsubscribe]
  );

  return (
    <PollSocketContext.Provider value={contextValue}>
      {children}
    </PollSocketContext.Provider>
  );
}

export const usePollSocket = () => {
  const context = useContext(PollSocketContext);
  if (!context) {
    throw new Error("usePollSocket must be used within a PollSocketProvider");
  }
  return context;
};
