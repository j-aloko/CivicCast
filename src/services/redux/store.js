import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { useDispatch, useSelector, useStore } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";

import { authReducer } from "./slices/authSlice";
import { pollsReducer } from "./slices/pollsSlice";
import { realtimeReducer } from "./slices/realtimeSlice";
import { uiReducer } from "./slices/uiSlice";

const sessionCookieStorage = new CookieStorage(Cookies, {
  expiration: {
    default: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
});

const authPersistConfig = {
  key: "auth",
  storage: sessionCookieStorage,
  whitelist: ["user", "isAuthenticated"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  polls: pollsReducer,
  realtime: realtimeReducer,
  ui: uiReducer,
});

export const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "realtime/setSocket",
        ],
        ignoredPaths: ["realtime.socket", "register", "rehydrate"],
      },
    }),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
