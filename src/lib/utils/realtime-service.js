import { updatePollRealtime } from "@/services/redux/slices/pollsSlice";
import {
  setConnectionStatus,
  updateLiveData,
} from "@/services/redux/slices/realtimeSlice";
import { store } from "@/services/redux/store";

class RealtimeService {
  constructor() {
    this.eventSource = null;
    this.socket = null;
  }

  connectSSE(pollId) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`/api/polls/${pollId}/live`);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        store.dispatch(updateLiveData({ data: data.data, pollId }));
        store.dispatch(
          updatePollRealtime({
            pollId,
            updates: data.data,
          })
        );
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      store.dispatch(setConnectionStatus(false));
    };

    this.eventSource.onopen = () => {
      store.dispatch(setConnectionStatus(true));
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    store.dispatch(setConnectionStatus(false));
  }
}

export const realtimeService = new RealtimeService();
