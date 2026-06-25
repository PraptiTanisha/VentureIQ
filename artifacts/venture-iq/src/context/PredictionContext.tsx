import { createContext, useContext, useState } from "react";
import type { PredictionResult } from "@workspace/api-client-react";

type PredictionContextType = {
  result: PredictionResult | null;
  setResult: (r: PredictionResult | null) => void;
};

const PredictionContext = createContext<PredictionContextType>({ result: null, setResult: () => {} });

export function PredictionProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<PredictionResult | null>(null);
  return <PredictionContext.Provider value={{ result, setResult }}>{children}</PredictionContext.Provider>;
}

export const usePrediction = () => useContext(PredictionContext);
