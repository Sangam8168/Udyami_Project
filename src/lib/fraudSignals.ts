export type Severity = "low" | "medium" | "high";
export type FraudSignal = { label: string; category: string; severity: Severity };

type Rule = FraudSignal & { matches: (message: string) => boolean };

const rules: Rule[] = [
  {
    label: "Asks for an OTP, PIN, password, or CVV",
    category: "phishing",
    severity: "high",
    matches: text => /(?:^|[.!?;\n]|\bplease\s+|\bkindly\s+|\band\s+|\bmust\s+)(?:\s*)(?:share|send|provide|enter|confirm|tell|forward|reply\s+with|give)\b.{0,35}\b(?:otp|pin|passcode|password|cvv)\b(?!\s+(?:with anyone|to anyone))/iu.test(text)
      || /(?:ओटीपी|पिन|पासवर्ड|सीवीवी).{0,22}(?:भेजें|दीजिए|बताएं|बताइए|शेयर करें)|\b(?:otp|pin|cvv)\b.{0,18}\b(?:bhejo|batao|bhejiye|share karo)\b/iu.test(text),
  },
  {
    label: "Requests a payment action to receive money or a refund",
    category: "upi_scam",
    severity: "high",
    matches: text => /\b(?:refund|cashback|receive money|receive payment|get money)\b|रिफंड|पैसे (?:पाने|लेने)|paise (?:lene|paane)/iu.test(text)
      && /\b(?<!never )(?<!don\x27t )(?<!do not )(?<!never need to )(?<!don\x27t need to )(?<!no need to )(?:enter (?:your |the |a )?upi pin|scan (?:the |this |a )?qr|approve (?:the |this |a )?(?:upi |collect |payment )?request)\b|(?:क्यूआर|qr).{0,15}(?<!न )(?<!मत )स्कैन|पिन डालें|pin (?:dalo|daliye)|qr scan karo/iu.test(text),
  },
  {
    label: "Demands money under threat of arrest or investigation",
    category: "impersonation",
    severity: "high",
    matches: text => /\b(?:digital arrest|arrest warrant|police case|money laundering case|cyber police|court notice|cbi|enforcement directorate)\b|डिजिटल अरेस्ट|गिरफ्तारी|पुलिस केस/iu.test(text)
      && /\b(?:pay|transfer|deposit|send money|security deposit|safe account|verification fee)\b|पैसे भेज|भुगतान|जमा करें|paise bhejo/iu.test(text),
  },
  {
    label: "Asks you to install software for remote access or screen sharing",
    category: "remote_access",
    severity: "high",
    matches: text => /\b(?<!never )(?<!don\x27t )(?<!do not )(?:install|download|enable|start|open|give me).{0,36}(?:anydesk|teamviewer|quicksupport|screen shar(?:e|ing)|remote access)\b|(?:एनीडेस्क|स्क्रीन शेयर|रिमोट एक्सेस).{0,20}(?:इंस्टॉल|चालू करें|डाउनलोड)|\b(?:anydesk|teamviewer).{0,15}(?:install karo|download karo)\b/iu.test(text),
  },
  {
    label: "Threatens a blocked account to pressure you to update KYC",
    category: "phishing",
    severity: "medium",
    matches: text => /\b(?:kyc|pan|aadhaar|account verification)\b|केवाईसी|आधार/iu.test(text)
      && /\b(?:account|card|wallet|sim).{0,25}(?:block(?:ed)?|suspend(?:ed)?|expir(?:e|ed)|deactivat(?:e|ed))\b|(?:खाता|सिम).{0,16}(?:बंद|ब्लॉक)|account band/iu.test(text)
      && /\b(?:update|verify|click|call|immediately|today)\b|अपडेट|क्लिक|तुरंत/iu.test(text),
  },
  {
    label: "Asks for a fee before releasing a prize, loan, refund, or job",
    category: "advance_fee_fraud",
    severity: "medium",
    matches: text => /\b(?:prize|lottery|loan|refund|job offer|grant|reward)\b|लॉटरी|इनाम|लोन|रिफंड/iu.test(text)
      && /\b(?:pay|transfer|deposit|send).{0,35}(?:fee|charge|tax|advance|security)\b|(?:फीस|शुल्क|टैक्स).{0,14}(?:भेजें|भरें|जमा करें)|(?:fee|paise) (?:bhejo|jama karo)/iu.test(text),
  },
  {
    label: "Promises unusually certain investment returns",
    category: "investment_scam",
    severity: "medium",
    matches: text => /\b(?:guaranteed (?:daily |weekly |monthly )?(?:returns|profit)|no[- ]risk investment|double your money|risk[- ]free investment)\b|गारंटी(?:ड)? रिटर्न|पैसे दोगुने|paisa double/iu.test(text),
  },
];

const shorteners = new Set(["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "is.gd", "rb.gy", "t.ly", "shorturl.at"]);

function inspectLinks(text: string): FraudSignal[] {
  const signals: FraudSignal[] = [];
  const urls = text.match(/(?:https?:\/\/|www\.)[^\s<>"']+/giu) ?? [];
  for (const candidate of urls) {
    try {
      const address = candidate.replace(/[).,!?;\]]+$/u, "");
      const url = new URL(/^www\./i.test(address) ? "https://" + address : address);
      const host = url.hostname.toLowerCase().replace(/\.$/, "");
      if (url.username || url.password) {
        signals.push({ label: "A link contains misleading sign-in information before the destination", category: "suspicious_contact", severity: "medium" });
      }
      if (shorteners.has(host) || shorteners.has(host.replace(/^www\./, ""))) {
        signals.push({ label: "A shortened link hides the destination", category: "suspicious_contact", severity: "medium" });
      }
      if (host.startsWith("[") || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(host)) {
        signals.push({ label: "A link uses a numeric address instead of a website name", category: "suspicious_contact", severity: "medium" });
      }
    } catch {
      // A malformed address provides no reliable destination to assess.
    }
  }
  return [...new Map(signals.map(signal => [signal.label, signal])).values()];
}

export function findFraudSignals(message: string): FraudSignal[] {
  const text = message.normalize("NFKC");
  const matches = rules.filter(rule => rule.matches(text)).map(({ label, category, severity }) => ({ label, category, severity }));
  return [...matches, ...inspectLinks(text)];
}
