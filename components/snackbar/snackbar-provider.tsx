"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type SnackbarType = "success" | "error" | "info";

interface SnackbarItem {
  id: number;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, type?: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarItem | null>(null);
  const [counter, setCounter] = useState(0);

  const showSnackbar = useCallback(
    (message: string, type: SnackbarType = "error") => {
      const id = counter + 1;
      setCounter(id);
      setSnackbar({ id, message, type });

      setTimeout(() => {
        setSnackbar((prev) => (prev?.id === id ? null : prev));
      }, 3000);
    },
    [counter]
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* Snackbar Render */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
        {snackbar && (
          <div
            key={snackbar.id}
            className={`
              pointer-events-auto
              px-5 py-3 rounded-xl shadow-lg text-sm font-medium
              flex items-center gap-2
              animate-in fade-in slide-in-from-bottom-2 duration-300
              ${
                snackbar.type === "success"
                  ? "bg-emerald-600 text-white"
                  : snackbar.type === "error"
                    ? "bg-red-600 text-white"
                    : "bg-[#0a1628] text-white"
              }
            `}
          >
            {snackbar.type === "success" && (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {snackbar.type === "error" && (
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            {snackbar.message}
          </div>
        )}
      </div>
    </SnackbarContext.Provider>
  );
}
