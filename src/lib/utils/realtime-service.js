import { updatePollRealtime } from "@/services/redux/slices/pollsSlice";
import {
  updateLiveData,
  setConnectionStatus,
} from "@/services/redux/slices/realtimeSlice";
import { store } from "@/services/redux/store";

class RealtimeService {
  constructor() {
    this.eventSources = new Map();
    this.reconnectTimeouts = new Map();
    this.connectionStatus = new Map();
    const updateGlobalConnectionStatus = () => {
      const anyConnected = Array.from(this.connectionStatus.values()).some(
        (s) => s
      );
      store.dispatch(setConnectionStatus(anyConnected));
    };
    this.updateGlobalConnectionStatus = updateGlobalConnectionStatus;
  }

  connectToPoll(pollId) {
    if (this.eventSources.has(pollId)) {
      console.log(`[RealtimeService] Already connected to poll ${pollId}`);
      return;
    }

    console.log(`[RealtimeService] Connecting to SSE for poll: ${pollId}`);

    try {
      const eventSource = new EventSource(`/api/polls/${pollId}/live`);

      eventSource.onopen = () => {
        console.log(`[RealtimeService] SSE connected for poll: ${pollId}`);
        this.connectionStatus.set(pollId, true);
        this.updateGlobalConnectionStatus();

        const timeout = this.reconnectTimeouts.get(pollId);
        if (timeout) {
          clearTimeout(timeout);
          this.reconnectTimeouts.delete(pollId);
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.heartbeat) return;

          if (data.success && data.data) {
            const { poll, results, likeCount } = data.data;

            store.dispatch(
              updateLiveData({
                data: data.data,
                pollId,
              })
            );

            store.dispatch(
              updatePollRealtime({
                pollId,
                updates: { likeCount, poll, results },
              })
            );
          }
        } catch (error) {
          console.error(`[RealtimeService] Parse error:`, error);
        }
      };

      eventSource.onerror = () => {
        console.error(`[RealtimeService] SSE error for poll ${pollId}`);
        this.connectionStatus.set(pollId, false);
        this.updateGlobalConnectionStatus();

        eventSource.close();
        this.eventSources.delete(pollId);
        this.scheduleReconnect(pollId);
      };

      this.eventSources.set(pollId, eventSource);
    } catch (error) {
      console.error(`[RealtimeService] Failed to create EventSource:`, error);
      this.scheduleReconnect(pollId);
    }
  }

  scheduleReconnect(pollId) {
    if (this.reconnectTimeouts.has(pollId)) return;
    const timeout = setTimeout(() => {
      this.reconnectTimeouts.delete(pollId);
      this.connectToPoll(pollId);
    }, 5000);
    this.reconnectTimeouts.set(pollId, timeout);
  }

  disconnectFromPoll(pollId) {
    const es = this.eventSources.get(pollId);
    if (es) {
      es.close();
      this.eventSources.delete(pollId);
    }
    const timeout = this.reconnectTimeouts.get(pollId);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(pollId);
    }
    this.connectionStatus.delete(pollId);
    this.updateGlobalConnectionStatus();
  }

  getConnectionStatus(pollId) {
    return this.connectionStatus.get(pollId) || false;
  }

  connectSSE = (pollId) => this.connectToPoll(pollId);

  subscribeToPoll = (pollId) => this.connectToPoll(pollId);

  unsubscribeFromPoll = (pollId) => this.disconnectFromPoll(pollId);
}

export const realtimeService = new RealtimeService();
