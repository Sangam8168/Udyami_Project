import { invokeAi } from "./aiFunctions";
import { findFraudSignals, type FraudSignal, type Severity } from "./fraudSignals";

export type FraudResult = {
  isSuspicious: boolean;
  severity: Severity;
  reason: string;
  category: string;
  source: "ai" | "local";
  signals: FraudSignal[];
};

const severityRank = { low: 0, medium: 1, high: 2 };

const categoryLabels: Record<string, string> = {
  phishing: "Phishing or credential theft",
  upi_scam: "UPI payment scam",
  impersonation: "Authority impersonation",
  remote_access: "Remote access scam",
  investment_scam: "Investment scam",
  advance_fee_fraud: "Advance fee scam",
  social_engineering: "Pressure or manipulation",
  suspicious_contact: "Suspicious link or contact",
  legitimate: "Ordinary message",
  educational_query: "Educational message",
  unverified: "Unverified",
};

const nextSteps: Record<string, string> = {
  phishing: "Open your bank’s app or use the number on your card to verify the request. Keep OTPs, PINs and passwords private.",
  upi_scam: "Open your UPI app directly and check whether the request would debit your account. Receiving money requires no UPI PIN.",
  impersonation: "End the call or conversation. Verify the claim with the agency using a number you find independently.",
  remote_access: "Decline screen-sharing or remote-access requests. If an unknown caller already has access, disconnect the device and contact your bank from another device.",
  investment_scam: "Check the investment and the intermediary independently before transferring money.",
  advance_fee_fraud: "Verify any fee or offer through the organisation’s official channel before paying.",
  suspicious_contact: "Open the organisation’s app or type its known website address instead of following the message link.",
};

export function fraudCategoryLabel(category: string) {
  return categoryLabels[category] ?? "Other suspicious activity";
}

export function fraudNextStep(category: string) {
  return nextSteps[category] ?? "Verify who sent the message through a contact you already trust before responding or paying.";
}

export function checkFraudSignals(message: string): FraudResult {
  const signals = findFraudSignals(message);
  const strongest = signals[0];
  return {
    isSuspicious: Boolean(strongest),
    severity: strongest?.severity ?? "low",
    reason: strongest?.label ?? "The on-device checks found no clear scam signals. The message remains unverified.",
    category: strongest?.category ?? "unverified",
    source: "local",
    signals,
  };
}

export async function analyzeFraud(message: string): Promise<FraudResult> {
  const local = checkFraudSignals(message);
  try {
    const data = await invokeAi<Omit<FraudResult, "source" | "signals"> & { confidence: number }>("ml-fraud-detection", message, "english");
    if (data && typeof data.isSuspicious === "boolean" && typeof data.reason === "string" && data.reason.trim() &&
        typeof data.category === "string" && Object.prototype.hasOwnProperty.call(categoryLabels, data.category) &&
        ["low", "medium", "high"].includes(data.severity) &&
        typeof data.confidence === "number" && data.confidence > 0 && data.confidence <= 100) {
      if (local.isSuspicious && (!data.isSuspicious || severityRank[local.severity] > severityRank[data.severity])) {
        return { ...local, source: "ai" };
      }
      return {
        isSuspicious: data.isSuspicious,
        severity: data.severity,
        reason: data.reason,
        category: data.category,
        source: "ai",
        signals: local.signals,
      };
    }
  } catch {
    // On-device signals remain available if the analysis service fails.
  }
  return local;
}
