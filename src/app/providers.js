"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { useSessionSync } from "@/hooks/useSessionSync";
import { persistor, store } from "@/services/redux/store";

function SessionSync() {
  useSessionSync();
  return null;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SessionSync />
          {children}
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
