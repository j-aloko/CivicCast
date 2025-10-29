import {
  subscribeToDashboard,
  unsubscribeFromDashboard,
} from "../slices/realtimeSlice";

export const createDashboardRealtimeMiddleware = (realtimeService) => {
  return () => (next) => (action) => {
    const result = next(action);

    if (subscribeToDashboard.match(action)) {
      console.log(`[Dashboard Middleware] Subscribing to dashboard updates`);
      realtimeService.connectToDashboard();
    }

    if (unsubscribeFromDashboard.match(action)) {
      console.log(
        `[Dashboard Middleware] Unsubscribing from dashboard updates`
      );
      realtimeService.disconnectFromDashboard();
    }

    return result;
  };
};
