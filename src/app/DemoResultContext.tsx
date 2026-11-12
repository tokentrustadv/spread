"use client";

import { createContext, useContext, useState, useMemo } from "react";

export type DemoResult = {
  title: string;
  restaurantName: string;
  itemName: string;
  price: number;
  quantity: number;
} | null;

type DemoResultContextValue = {
  demoResult: DemoResult;
  setDemoResult: (result: DemoResult) => void;
};

const DemoResultContext = createContext<DemoResultContextValue | null>(null);

export function DemoResultProvider({ children }: { children: React.ReactNode }) {
  const [demoResult, setDemoResult] = useState<DemoResult>(null);
  const value = useMemo(() => ({ demoResult, setDemoResult }), [demoResult]);
  return (
    <DemoResultContext.Provider value={value}>
      {children}
    </DemoResultContext.Provider>
  );
}

export function useDemoResult() {
  const ctx = useContext(DemoResultContext);
  if (!ctx) {
    throw new Error("useDemoResult must be used within a DemoResultProvider");
  }
  return ctx;
}
