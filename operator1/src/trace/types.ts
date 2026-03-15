export type VerificationOutcome = {
  passed: boolean;
  reason?: string;
  violations: string[];
};

export type TraceAttempt<TOutput> = {
  attempt: number;
  result: TOutput;
  capabilityVerification: VerificationOutcome;
  runVerification: VerificationOutcome;
  accepted: boolean;
};

export type ExecutionTrace<TOutput> = {
  goal: string;
  capability: string;
  status: "accepted" | "rejected";
  attempts: Array<TraceAttempt<TOutput>>;
};
