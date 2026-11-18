export function redactFraudMessage(message: string) {
  return message
    .replace(/(https?:\/\/)[^/\s@]+@/giu, "$1[login removed]@")
    .replace(/((?:\bpassword\b|पासवर्ड)\s*[:=]\s*)[^\s,;]+/giu, "$1[password removed]")
    .replace(/((?:\b(?:otp|pin|cvv|passcode|code)\b|ओटीपी|पिन|सीवीवी)(?:\s+(?:is|was|है))?\s*[:=\-]?\s*)[\d०-९]{3,8}(?![\d०-९])/giu, "$1[code removed]")
    .replace(/((?:\b(?:otp|pin|cvv|passcode)\b|ओटीपी|पिन|सीवीवी)\D{0,10})[\d०-९]{3,8}(?![\d०-९])/giu, "$1[code removed]")
    .replace(/([?&](?:token|key|code|otp|pin|password|signature)=)[^&\s]+/giu, "$1[removed]")
    .replace(/\b[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\b/giu, "[email or UPI ID removed]")
    .replace(/(?<![\w\d])(?:\+?\d[\s-]?){10,19}(?![\w\d])/gu, "[number removed] ");
}
