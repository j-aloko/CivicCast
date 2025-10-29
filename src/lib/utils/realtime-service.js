class RealtimeService {
  constructor() {
    this.eventSources = new Map();
    this.dashboardEventSource = null;
    this.reconnectTimeouts = new Map();
    this.connectionStatus = new Map();
    this.dashboardConnected = false;
    this.connectionAttempts = new Map();
    this.store = null;
    this.dispatch = null;
  }

  initialize(store, dispatch) {
    this.store = store;
    this.dispatch = dispatch;
  }

  connectToPoll(pollId) {
    if (!this.dispatch) {
      console.error("[RealtimeService] Not initialized with store");
      return;
    }
    const lastAttempt = this.connectionAttempts.get(pollId);
    const now = Date.now();
    if (lastAttempt && now - lastAttempt < 1000) {
      console.log(
        `[RealtimeService] Skipping rapid reconnection for poll ${pollId}`
      );
      return;
    }

    this.connectionAttempts.set(pollId, now);

    if (this.eventSources.has(pollId)) {
      console.log(`[RealtimeService] Already connected to poll ${pollId}`);
      return;
    }

    console.log(
      `[RealtimeService] Creating SSE connection for poll: ${pollId}`
    );

    try {
      const eventSource = new EventSource(`/api/polls/${pollId}/live`);

      eventSource.onopen = () => {
        console.log(`[RealtimeService] SSE connected for poll: ${pollId}`);
        this.connectionStatus.set(pollId, true);

        import("@/services/redux/slices/realtimeSlice").then(
          ({ setPollConnectionStatus }) => {
            this.dispatch(
              setPollConnectionStatus({ isConnected: true, pollId })
            );
          }
        );

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
            const { poll, results, likeCount, userLiked, userVote } = data.data;
            import("@/services/redux/slices/pollsSlice").then(
              ({ updatePollRealtime }) => {
                this.dispatch(
                  updatePollRealtime({
                    pollId,
                    updates: { likeCount, poll, results, userLiked, userVote },
                  })
                );
              }
            );
          }
        } catch (error) {
          console.error(`[RealtimeService] Parse error:`, error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`[RealtimeService] SSE error for poll ${pollId}:`, error);
        this.connectionStatus.set(pollId, false);

        import("@/services/redux/slices/realtimeSlice").then(
          ({ setPollConnectionStatus }) => {
            this.dispatch(
              setPollConnectionStatus({ isConnected: false, pollId })
            );
          }
        );

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

    console.log(
      `[RealtimeService] Scheduling reconnect for poll ${pollId} in 3 seconds`
    );

    const timeout = setTimeout(() => {
      this.reconnectTimeouts.delete(pollId);
      console.log(`[RealtimeService] Attempting reconnect for poll ${pollId}`);
      this.connectToPoll(pollId);
    }, 3000);

    this.reconnectTimeouts.set(pollId, timeout);
  }

  disconnectFromPoll(pollId) {
    console.log(`[RealtimeService] Disconnecting from poll ${pollId}`);

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
    this.connectionAttempts.delete(pollId);

    if (this.dispatch) {
      import("@/services/redux/slices/realtimeSlice").then(
        ({ setPollConnectionStatus }) => {
          this.dispatch(
            setPollConnectionStatus({ isConnected: false, pollId })
          );
        }
      );
    }
  }

  getConnectionStatus(pollId) {
    return this.connectionStatus.get(pollId) || false;
  }

  // Dashboard Connection Methods
  connectToDashboard() {
    if (!this.dispatch) {
      console.error("[RealtimeService] Not initialized with store");
      return;
    }

    if (this.dashboardEventSource) {
      console.log(`[RealtimeService] Already connected to dashboard`);
      return;
    }

    console.log(`[RealtimeService] Connecting to dashboard SSE`);

    try {
      const eventSource = new EventSource("/api/dashboard/live");

      eventSource.onopen = () => {
        console.log(`[RealtimeService] Dashboard SSE connected`);
        this.dashboardConnected = true;

        import("@/services/redux/slices/realtimeSlice").then(
          ({ setDashboardConnectionStatus }) => {
            this.dispatch(setDashboardConnectionStatus(true));
          }
        );

        const timeout = this.reconnectTimeouts.get("dashboard");
        if (timeout) {
          clearTimeout(timeout);
          this.reconnectTimeouts.delete("dashboard");
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.heartbeat) return;

          if (data.success && data.data.polls) {
            console.log(
              `[RealtimeService] Received dashboard update for ${data.data.polls.length} polls`
            );

            // Import action dynamically
            import("@/services/redux/slices/pollsSlice").then(
              ({ updatePollInList }) => {
                data.data.polls.forEach((poll) => {
                  this.dispatch(
                    updatePollInList({
                      pollId: poll.id,
                      updates: {
                        _count: {
                          likes: poll._count?.likes || 0,
                          votes: poll._count?.votes || 0,
                        },
                        likeCount: poll._count?.likes || 0,
                        results: {
                          options: (poll.options || []).map((o) => ({
                            id: o.id,
                            percentage: o.percentage || 0,
                            voteCount: o.voteCount || 0,
                          })),
                          totalVotes: poll._count?.votes || 0,
                        },
                      },
                    })
                  );
                });
              }
            );
          }
        } catch (error) {
          console.error(`[RealtimeService] Dashboard parse error:`, error);
        }
      };

      eventSource.onerror = (error) => {
        console.error(`[RealtimeService] Dashboard SSE error:`, error);
        this.dashboardConnected = false;

        import("@/services/redux/slices/realtimeSlice").then(
          ({ setDashboardConnectionStatus }) => {
            this.dispatch(setDashboardConnectionStatus(false));
          }
        );

        eventSource.close();
        this.dashboardEventSource = null;
        this.scheduleDashboardReconnect();
      };

      this.dashboardEventSource = eventSource;
    } catch (error) {
      console.error(
        `[RealtimeService] Failed to create dashboard EventSource:`,
        error
      );
      this.scheduleDashboardReconnect();
    }
  }

  scheduleDashboardReconnect() {
    if (this.reconnectTimeouts.has("dashboard")) return;

    console.log(
      `[RealtimeService] Scheduling dashboard reconnect in 5 seconds`
    );

    const timeout = setTimeout(() => {
      this.reconnectTimeouts.delete("dashboard");
      console.log(`[RealtimeService] Attempting dashboard reconnect`);
      this.connectToDashboard();
    }, 5000);

    this.reconnectTimeouts.set("dashboard", timeout);
  }

  disconnectFromDashboard() {
    console.log(`[RealtimeService] Disconnecting from dashboard`);

    if (this.dashboardEventSource) {
      this.dashboardEventSource.close();
      this.dashboardEventSource = null;
    }

    const timeout = this.reconnectTimeouts.get("dashboard");
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete("dashboard");
    }

    this.dashboardConnected = false;

    if (this.dispatch) {
      import("@/services/redux/slices/realtimeSlice").then(
        ({ setDashboardConnectionStatus }) => {
          this.dispatch(setDashboardConnectionStatus(false));
        }
      );
    }
  }

  getDashboardConnectionStatus() {
    return this.dashboardConnected;
  }

  // Utility Methods
  disconnectAll() {
    console.log(`[RealtimeService] Disconnecting all connections`);

    this.eventSources.forEach((eventSource, pollId) => {
      eventSource.close();
      if (this.dispatch) {
        import("@/services/redux/slices/realtimeSlice").then(
          ({ setPollConnectionStatus }) => {
            this.dispatch(
              setPollConnectionStatus({ isConnected: false, pollId })
            );
          }
        );
      }
    });
    this.eventSources.clear();

    if (this.dashboardEventSource) {
      this.dashboardEventSource.close();
      this.dashboardEventSource = null;
      if (this.dispatch) {
        import("@/services/redux/slices/realtimeSlice").then(
          ({ setDashboardConnectionStatus }) => {
            this.dispatch(setDashboardConnectionStatus(false));
          }
        );
      }
    }

    this.reconnectTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.reconnectTimeouts.clear();

    this.connectionStatus.clear();
    this.connectionAttempts.clear();
    this.dashboardConnected = false;
  }

  getActiveConnections() {
    return {
      dashboard: this.dashboardConnected,
      polls: Array.from(this.eventSources.keys()),
      totalPollConnections: this.eventSources.size,
    };
  }
}

export const realtimeService = new RealtimeService();
