import { combineReducers, configureStore } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { useDispatch, useSelector, useStore } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import { CookieStorage } from "redux-persist-cookie-storage";

import { authReducer } from "./slices/authSlice";

const sessionCookieStorage = new CookieStorage(Cookies, {
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
});

const authPersistConfig = {
  key: "auth",
  storage: sessionCookieStorage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(),
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
export const useAppStore = useStore;
