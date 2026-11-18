import LearningQuiz, { type Level } from "./LearningQuiz";

const levels: Level[] = [
  {
    name: "Beginner", description: "Needs, monthly income, and savings goals", seconds: 45,
    lessons: [
      {
        title: "Give every rupee a job",
        scenario: "Meena pays her essential expenses first. She has already set aside the money she needs for other spending this month.",
        facts: [{ label: "Take-home pay", value: "₹15,000" }, { label: "Essential expenses", value: "₹8,000" }, { label: "Other spending set aside", value: "₹2,000" }],
        question: "How much can Meena put toward savings this month?",
        hint: "Subtract both spending amounts from take-home pay.",
        choices: [
          { label: "₹7,000", reason: "This subtracts essentials and leaves out the ₹2,000 already set aside." },
          { label: "₹5,000", reason: "Both planned expenses are covered, and the remaining money goes to savings." },
          { label: "₹3,000", reason: "That would leave an additional ₹2,000 unassigned under this plan." },
        ],
        answer: 1,
        steps: ["Add planned spending: ₹8,000 + ₹2,000 = ₹10,000.", "Subtract planned spending from take-home pay: ₹15,000 − ₹10,000 = ₹5,000."],
        takeaway: "Use take-home income and count every planned expense before deciding what you can save.",
      },
      {
        title: "Cover the essentials",
        scenario: "Shanti has ₹3,000 until payday. Her groceries and bus fare for the week will cost ₹2,200. The ₹1,400 celebration outfit is optional.",
        question: "Which plan covers the essentials and keeps some money available?",
        hint: "Check how much remains after the ₹2,200 she's committed to spend.",
        choices: [
          { label: "Set aside ₹2,200 for essentials and keep ₹800", reason: "Groceries and travel are covered, and ₹800 remains for the next decision." },
          { label: "Buy the outfit first and use the rest for essentials", reason: "The outfit leaves ₹1,600, which is ₹600 short of what she needs." },
          { label: "Spend ₹1,500 on essentials and ₹1,500 on other things", reason: "The arbitrary split leaves her ₹700 short for groceries and travel." },
        ],
        answer: 0,
        steps: ["Identify spending that cannot be postponed: ₹2,200.", "Subtract that amount from ₹3,000. The remaining ₹800 is less than the price of the outfit."],
        takeaway: "Set aside enough for essential bills before deciding what to do with the remaining money.",
      },
      {
        title: "Prepare for a school bill",
        scenario: "Lata needs ₹12,000 for a school fee in six months. She has already saved ₹3,000 for that bill.",
        question: "What is the smallest monthly amount that reaches the goal on time?",
        hint: "Divide the amount still needed by six.",
        choices: [
          { label: "₹2,000 per month", reason: "This would reach the goal early or leave a surplus because it ignores savings already set aside." },
          { label: "₹1,000 per month", reason: "Six deposits add ₹6,000 and leave her ₹3,000 short." },
          { label: "₹1,500 per month", reason: "Six deposits add exactly the ₹9,000 she still needs." },
        ],
        answer: 2,
        steps: ["Remaining fee: ₹12,000 − ₹3,000 = ₹9,000.", "Monthly contribution: ₹9,000 ÷ 6 = ₹1,500."],
        takeaway: "Start with the gap between the goal and what you have already saved.",
      },
    ],
  },
  {
    name: "Intermediate", description: "Variable income and spending trade-offs", seconds: 50,
    lessons: [
      {
        title: "Budget for a lean month",
        scenario: "Asha earned ₹20,000, ₹12,000 and ₹16,000 over three months. Her essential monthly bills are ₹10,000.",
        question: "Which plan keeps essentials covered even if her income falls to ₹12,000 again?",
        hint: "Plan what you can commit in the lean month before allocating money from better months.",
        choices: [
          { label: "Commit ₹16,000 every month", reason: "The average is ₹16,000, but a ₹12,000 month would leave a ₹4,000 gap." },
          { label: "Keep regular commitments within ₹12,000 and set aside extra earnings", reason: "The lower example income covers the regular budget, and stronger months can build a buffer." },
          { label: "Spend up to ₹20,000 and borrow when income falls", reason: "The highest month is a poor basis for recurring bills and leaves a large borrowing gap." },
        ],
        answer: 1,
        steps: ["The leanest month in the example brought in ₹12,000.", "After ₹10,000 of essential bills, only ₹2,000 is available for other regular commitments in a lean month."],
        takeaway: "Use a conservative income figure for recurring commitments when earnings fluctuate.",
      },
      {
        title: "Make space for a payment",
        scenario: "Rekha takes home ₹18,000, pays ₹12,000 in living expenses and already has a ₹2,000 EMI. She wants to keep at least ₹1,500 free each month.",
        question: "What is the largest new EMI that leaves her chosen buffer?",
        hint: "Subtract expenses, the existing EMI, and the buffer.",
        choices: [
          { label: "₹2,500", reason: "This leaves exactly ₹1,500 after both EMIs and living expenses." },
          { label: "₹4,000", reason: "This uses the entire amount left after current bills and leaves no buffer." },
          { label: "₹6,000", reason: "This subtracts only living expenses and ignores the existing EMI and buffer." },
        ],
        answer: 0,
        steps: ["Current spare cash: ₹18,000 − ₹12,000 − ₹2,000 = ₹4,000.", "Leave ₹1,500 untouched. That makes ₹4,000 − ₹1,500 = ₹2,500 the limit for this exercise."],
        takeaway: "An affordable payment depends on what is left after current bills and the buffer you choose.",
      },
      {
        title: "Prioritise a nearer deadline",
        scenario: "Farida can save ₹5,000 a month. She needs ₹9,000 for a course in three months and wants to put the rest toward equipment.",
        question: "How should she split this month's ₹5,000 if she will repeat the same split for three months?",
        hint: "What monthly contribution would reach ₹9,000 in three equal deposits?",
        choices: [
          { label: "₹2,000 for the course and ₹3,000 for equipment", reason: "The course fund would reach only ₹6,000 by the deadline." },
          { label: "₹4,000 for the course and ₹1,000 for equipment", reason: "This covers the course, but allocates ₹1,000 more than necessary each month." },
          { label: "₹3,000 for the course and ₹2,000 for equipment", reason: "This meets the nearer deadline and leaves the greatest amount for equipment under the stated plan." },
        ],
        answer: 2,
        steps: ["Course target per month: ₹9,000 ÷ 3 = ₹3,000.", "Amount available for equipment each month: ₹5,000 − ₹3,000 = ₹2,000."],
        takeaway: "Set deadlines first, then fund each goal at the pace its deadline requires.",
      },
    ],
  },
  {
    name: "Advanced", description: "Cash-flow timing, loan costs, and changing prices", seconds: 60,
    lessons: [
      {
        title: "Bridge a timing gap",
        scenario: "A tailoring business pays ₹40,000 in supplier bills every month. Its ₹55,000 customer payment arrives one month after delivery. The first month's bills are due before any customer payment arrives.",
        question: "How much working cash covers the first month's supplier bills without borrowing?",
        hint: "Look at the cash available on the day the bills are due.",
        choices: [
          { label: "₹15,000", reason: "That is the difference between eventual receipts and supplier bills. It is not cash available before payment." },
          { label: "₹40,000", reason: "The business needs enough cash to cover the supplier bill while it waits for the first payment." },
          { label: "₹55,000", reason: "That is the eventual customer payment. The bill due first is ₹40,000." },
        ],
        answer: 1,
        steps: ["On the due date, this sale has brought in ₹0 in cash.", "The supplier bill is ₹40,000, so the timing gap is ₹40,000 − ₹0."],
        takeaway: "A profitable sale can still create a cash shortage when bills come due before payment arrives.",
      },
      {
        title: "Compare full borrowing costs",
        scenario: "Two hypothetical offers lend the same ₹30,000 for 12 months. Both have the same features, and both monthly payments fit the practice budget.",
        facts: [{ label: "Offer A", value: "₹2,700 a month + ₹900 fee" }, { label: "Offer B", value: "₹2,750 a month + ₹0 fee" }],
        question: "Which offer costs less overall?",
        hint: "Multiply each monthly EMI by 12, then add its fee.",
        choices: [
          { label: "Offer B by ₹300", reason: "Offer B totals ₹33,000. Offer A totals ₹33,300 after including its fee." },
          { label: "Offer A by ₹600", reason: "That compares the payments alone and leaves out Offer A’s ₹900 fee." },
          { label: "They cost the same", reason: "The same loan amount and term can still produce different total repayment costs." },
        ],
        answer: 0,
        steps: ["Offer A: ₹2,700 × 12 + ₹900 = ₹33,300.", "Offer B: ₹2,750 × 12 = ₹33,000. The difference is ₹300."],
        takeaway: "Compare the total amount payable, including fees, when the offers meet the same need.",
      },
      {
        title: "Update a goal when prices rise",
        scenario: "A stove costs ₹20,000 today. For this practice scenario, assume its price will be 10% higher when you buy it in 10 months. You have ₹4,000 saved and expect no interest.",
        question: "How much do you need to save each month under these assumptions?",
        hint: "Apply the price increase before subtracting existing savings.",
        choices: [
          { label: "₹1,600", reason: "This divides today’s price minus existing savings. It leaves a ₹2,000 gap at the higher price." },
          { label: "₹2,200", reason: "This uses the future price but omits the ₹4,000 already saved." },
          { label: "₹1,800", reason: "This funds the remaining ₹18,000 evenly over 10 months." },
        ],
        answer: 2,
        steps: ["Projected price: ₹20,000 + 10% of ₹20,000 = ₹22,000.", "Remaining amount: ₹22,000 − ₹4,000 = ₹18,000.", "Monthly target: ₹18,000 ÷ 10 = ₹1,800."],
        takeaway: "Review the target price as the deadline approaches, especially if your plan spans many months.",
      },
    ],
  },
];

export default function AdvancedBudgetingGame({ onComplete }: { onComplete: (score: number) => void }) {
  return <LearningQuiz levels={levels} onComplete={onComplete} />;
}
