import LearningQuiz, { type Level } from "./LearningQuiz";

const verify = { label: "Verify independently before acting", reason: "Open the relevant official app or use a number you already trust. The message itself cannot confirm who sent it." };
const protect = { label: "Stop and keep the requested information private", reason: "Treat requests for sensitive credentials as a red flag and verify through an independent channel." };
const follow = { label: "Follow the instructions in the message", reason: "This gives an unverified sender control over the next step and can expose your account or money." };

const levels: Level[] = [
  {
    name: "Beginner", description: "OTP requests, receipts, prizes, and refunds", seconds: 40,
    lessons: [
      {
        title: "The caller asks for an OTP",
        scenario: "A caller says they work for your bank. They ask you to read out the OTP that just appeared on your phone.",
        question: "What is the safest first action?",
        hint: "An OTP may approve an action on your account.",
        choices: [follow, protect, { label: "Share it once the caller confirms your name", reason: "Knowing a name does not prove a caller works for your bank." }],
        answer: 1,
        steps: ["Spot the request for a code that could approve an account action.", "End the call without sharing the code. If you need help, use the bank’s app or a known number."],
        takeaway: "Keep OTPs, PINs and passwords private, even when someone claims to be from your bank.",
      },
      {
        title: "A payment receipt arrives",
        scenario: "An SMS says ₹420 was debited from your account. It contains no link and asks for no information. You do not recognise the payment.",
        question: "How can you check what actually happened?",
        hint: "The bank’s own transaction records can confirm whether there was a debit.",
        choices: [verify, { label: "Assume a message without a link is genuine", reason: "Sender names and message formats can be copied." }, { label: "Ignore it because there is no request", reason: "An unfamiliar debit deserves checking, even if the SMS might be fake." }],
        answer: 0,
        steps: ["The message contains no obvious demand, but that cannot verify the sender.", "Check transaction history inside your bank or UPI app. Contact your bank through its official channel if you find an unauthorised debit."],
        takeaway: "Distinguish an unverified message from a verified transaction.",
      },
      {
        title: "A prize with a fee",
        scenario: "You are told you won a prize in a draw you do not remember entering. The sender wants a release fee before giving you the prize.",
        question: "Which response addresses the strongest warning sign?",
        hint: "Notice the payment requested before the promised reward.",
        choices: [{ label: "Pay if the fee is small", reason: "Small fees can still be lost, and paying can lead to further demands." }, { label: "Ask for a photo of the prize", reason: "A photo does not prove the offer or the fee is genuine." }, verify],
        answer: 2,
        steps: ["The unexpected prize and upfront fee are two separate warning signs.", "Keep your money and use the organiser’s official contact details if you need to check the offer."],
        takeaway: "A payment demanded before an unexpected reward is a reason to pause and verify.",
      },
      {
        title: "A refund that asks for approval",
        scenario: "A seller says a refund is pending and asks you to approve a collect request in your UPI app.",
        question: "What should you do?",
        hint: "A collect request asks you to pay another person.",
        choices: [follow, { label: "Decline and check the refund through the original order", reason: "Approving a collect request can debit your account. An incoming transfer requires no UPI PIN." }, { label: "Approve only after checking the amount matches", reason: "A matching amount does not change the direction of the payment." }],
        answer: 1,
        steps: ["Check whether the app is asking you to pay or showing money received.", "Decline the request and verify the refund in the seller’s official order history or support channel."],
        takeaway: "Check the direction of a UPI payment before approving anything.",
      },
    ],
  },
  {
    name: "Intermediate", description: "Fake support, KYC, trusted contacts, and jobs", seconds: 45,
    lessons: [
      {
        title: "Support asks to see your screen",
        scenario: "A person claiming to troubleshoot your mobile banking asks you to install a screen-sharing app and open your bank app while connected.",
        question: "Which response protects your account?",
        hint: "Think about what the other person could see on your screen.",
        choices: [{ label: "Install it, but hide your bank balance", reason: "Screen sharing can expose approval prompts and other sensitive details beyond your balance." }, verify, { label: "Share the screen and keep your password private", reason: "Keeping a password private does not protect other sensitive information on the screen." }],
        answer: 1,
        steps: ["An unknown helper is asking for visibility into a banking session.", "Stop the session and use your bank’s official support channel from a trusted device."],
        takeaway: "Keep banking and payment screens private during remote support.",
      },
      {
        title: "KYC under pressure",
        scenario: "A message claims your account will be blocked today unless you update KYC through an unfamiliar link.",
        question: "What should you check before doing anything?",
        hint: "Urgency does not verify who sent the message.",
        choices: [verify, { label: "Open the link and look for the bank logo", reason: "Logos and page designs are easy to copy." }, { label: "Reply with your ID to save time", reason: "Sending identity information to an unverified sender can expose it." }],
        answer: 0,
        steps: ["The short deadline pressures you to skip checking the sender.", "Open the bank app or contact the bank through a known channel to check whether KYC is due."],
        takeaway: "Verify account warnings in the official app before sending identity information.",
      },
      {
        title: "A familiar photo, a new number",
        scenario: "A new WhatsApp number uses your cousin’s profile photo. The person says their phone broke and asks for immediate money.",
        question: "What is the best way to confirm the request?",
        hint: "Use a channel that the new sender did not supply.",
        choices: [{ label: "Ask them to send another profile photo", reason: "A photo can be copied and does not prove who is typing." }, { label: "Send a small amount as a test", reason: "A transfer shows only that an account received money." }, { label: "Call your cousin’s known number or check with another family member", reason: "A separate contact channel can confirm whether the request actually came from your cousin." }],
        answer: 2,
        steps: ["The new number and urgency are reasons to verify independently.", "Ask your cousin or a trusted relative through an existing contact before transferring money."],
        takeaway: "Verify emergency requests through a number you already know.",
      },
      {
        title: "The job starts with a deposit",
        scenario: "A recruiter promises easy home-based work, but says you must send a deposit before receiving the job details.",
        question: "What is the safer first action?",
        hint: "The recruiter wants money before you can verify the employer or work.",
        choices: [follow, verify, { label: "Send personal documents to make them trust you", reason: "An unverified recruiter can misuse personal information." }],
        answer: 1,
        steps: ["The upfront deposit and missing job details deserve closer scrutiny.", "Check the vacancy and recruiter through the company’s own contact channels before paying or sending documents."],
        takeaway: "Confirm the employer and job independently before paying fees or sharing documents.",
      },
    ],
  },
  {
    name: "Advanced", description: "Impersonation, payment direction, and recovery", seconds: 50,
    lessons: [
      {
        title: "An official-sounding threat",
        scenario: "A video caller says they are investigating a crime. They order you to stay on the call and transfer a deposit into a “safe account.”",
        question: "What should you do first?",
        hint: "Threats and instructions to stay on the call can make independent verification harder.",
        choices: [{ label: "End the call and contact the agency through an independently verified number", reason: "This breaks the pressure and lets you check the claim without using details supplied by the caller." }, { label: "Stay on the call and ask for an official-looking ID", reason: "An ID shown over video may be fabricated. Staying on the call can prolong pressure." }, follow],
        answer: 0,
        steps: ["Identify the transfer demand and the pressure to remain on the call.", "End the call and verify independently before taking any action."],
        takeaway: "Separate yourself from the caller before checking a threatening claim.",
      },
      {
        title: "A link looks reassuring",
        scenario: "An account alert includes an unfamiliar shortened link. The page preview shows the service logo, but you cannot see the destination.",
        question: "How should you check the alert?",
        hint: "A page preview only shows content the sender chose to share.",
        choices: [{ label: "Open it because the logo matches", reason: "A copied logo does not establish the destination or who operates it." }, { label: "Open the official app directly and check its alerts", reason: "This bypasses the unknown link and lets you check the alert with the actual service." }, { label: "Forward it so friends can test it", reason: "Forwarding could expose other people to the same risk." }],
        answer: 1,
        steps: ["An unfamiliar short link hides where it leads.", "Use a known bookmark or open the official app directly."],
        takeaway: "Verify the alert through a known channel before opening unfamiliar links.",
      },
      {
        title: "A promise of high returns",
        scenario: "A private group promises unusually high guaranteed returns and asks you to transfer money before the offer closes today.",
        question: "How can you evaluate the offer?",
        hint: "The sender is combining a guarantee with pressure to act quickly.",
        choices: [{ label: "Send a small amount to see if the guarantee works", reason: "An early payout or a small initial loss cannot verify the scheme." }, { label: "Trust it if group members say they were paid", reason: "Testimonials in a group can be selected or fabricated." }, { label: "Pause and check the investment and intermediary independently", reason: "Independent checks give you time to understand the product, who runs it and the risks before paying." }],
        answer: 2,
        steps: ["Treat the guarantee and same-day deadline as signals that need independent checking.", "Verify the intermediary through an official source and review the investment terms before deciding."],
        takeaway: "Pressure and testimonials do not substitute for independent checks.",
      },
      {
        title: "You already sent money",
        scenario: "You approved a transfer to someone you now suspect was pretending to be a service provider.",
        question: "What should you prioritise now?",
        hint: "Speed matters once money leaves the account.",
        choices: [{ label: "Contact your bank promptly and report suspected financial cyber fraud", reason: "Your bank can help secure the account. In India, call 1930 or use cybercrime.gov.in to report financial cyber fraud." }, { label: "Wait for the sender to reply before reporting", reason: "Waiting may reduce the time available to act on the transfer." }, { label: "Delete the chat so the scammer cannot contact you", reason: "Transaction references and message records can help with reporting. Avoid deleting them first." }],
        answer: 0,
        steps: ["Use your bank’s official channel to report the transfer and secure the account.", "Keep the transaction ID and message evidence. Report the incident through 1930 or cybercrime.gov.in in India."],
        takeaway: "Report promptly and keep the records that identify the transfer.",
      },
    ],
  },
];

export default function AdvancedFraudQuiz({ onComplete }: { onComplete: (score: number) => void }) {
  return <LearningQuiz levels={levels} onComplete={onComplete} />;
}
