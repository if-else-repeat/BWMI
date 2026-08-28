import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  db,
  processSyncQueue,
  logAuditEvent,
  initializeSyntheticDatabase,
} from "../db/dexie";

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);
  const [latencyMode, setLatencyMode] = useState("FAST_4G"); // 'FAST_4G', 'SLOW_3G', 'HEAVY_PEAK'
  const [isSyncing, setIsSyncing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [inspectorOpen, setInspectorOpen] = useState(false);

  // Live Dexie query for pending sync items
  const pendingQueue =
    useLiveQuery(
      () => db.syncQueue.where("status").equals("QUEUED_OFFLINE").toArray(),
      [],
    ) || [];

  const pendingCount = pendingQueue.length;

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
      timestamp: new Date().toLocaleTimeString(),
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync execution handler
  const executeSync = useCallback(async () => {
    if (!isOnline || isSyncing) return;
    setIsSyncing(true);
    try {
      const results = await processSyncQueue();
      if (results.length > 0) {
        addToast({
          type: "success",
          title: "BACKGROUND SYNC RESOLVED",
          message: `Successfully flushed ${results.length} queued claim(s) to central gateway! Acknowledgement generated.`,
        });
      }
    } catch (err) {
      console.error("Auto sync failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, addToast]);

  // Toggle network state
  const toggleNetwork = useCallback(() => {
    setIsOnline((prev) => {
      const nextState = !prev;
      logAuditEvent(
        "NETWORK_TOGGLE_SIMULATION",
        { nextState: nextState ? "ONLINE" : "OFFLINE" },
        nextState ? "ONLINE" : "OFFLINE",
      );

      if (!nextState) {
        addToast({
          type: "warning",
          title: "SIMULATED OFFLINE MODE ACTIVE",
          message:
            "All form inputs are now locally cached in IndexedDB via Dexie.js. Submissions will enter syncQueue.",
        });
      } else {
        addToast({
          type: "info",
          title: "NETWORK RECONNECTED",
          message:
            "Simulating gateway reconnection. Replaying Dexie.js background sync queue...",
        });
      }
      return nextState;
    });
  }, [addToast]);

  // When network transitions from offline to online, auto-process queue
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      const timer = setTimeout(() => {
        executeSync();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount, executeSync]);

  // Initialize DB on boot
  useEffect(() => {
    initializeSyntheticDatabase();
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        setIsOnline,
        toggleNetwork,
        latencyMode,
        setLatencyMode,
        pendingCount,
        pendingQueue,
        isSyncing,
        executeSync,
        toasts,
        addToast,
        removeToast,
        inspectorOpen,
        setInspectorOpen,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
