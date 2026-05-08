// AA fixture — account aggregator consent flow data.
// Used by AASim.

// ── AA consent benefits ────────────────────────────────────────

export const AA_BENEFITS = [
  {
    title: "Deeper spending insights",
    subtitle: "Let Ryan analyse your full transaction history across accounts",
  },
  {
    title: "All your accounts, one place",
    subtitle: "Track balances and patterns across every bank you use",
  },
  {
    title: "100% secure process",
    subtitle: "RBI-licensed system ensures safe and consent-based access",
    cta: "Learn more",
  },
];

// ── AA Consent cards ────────────────────────────────────────────

export const AA_CONSENT_CARDS = [
  {
    title: "Spending analysis",
    subtitle: "To analyse your spending patterns",
    details: [
      { label: "Frequency", value: "One time" },
      { label: "Time period", value: "13 months" },
    ],
  },
  {
    title: "Ongoing tracking",
    subtitle: "To keep your insights up to date",
    details: [
      { label: "Frequency", value: "Up to 5x per month" },
      { label: "Consent validity", value: "12 months" },
    ],
  },
];

// ── AA Consent detail rows ──────────────────────────────────────

export const AA_CONSENT_DETAILS = [
  {
    title: "Spending analysis",
    rows: [
      { label: "Purpose", value: "To analyse your spending patterns" },
      { label: "Consent type", value: "Profile, summary, transactions" },
      { label: "Statement period", value: "13 Jan '25 - 14 Mar '25", hasInfo: true },
      { label: "Frequency", value: "Once" },
      { label: "Consent validity", value: "1 month" },
      { label: "Data life", value: "1 month", hasInfo: true },
    ],
  },
  {
    title: "Ongoing tracking",
    rows: [
      { label: "Purpose", value: "To keep your financial insights current" },
      { label: "Consent type", value: "Profile, summary, transactions" },
      { label: "Statement period", value: "13 Jan '25 - 14 Mar '25", hasInfo: true },
      { label: "Frequency", value: "Periodic (max 5x per month)" },
      { label: "Consent validity", value: "12 months" },
      { label: "Data life", value: "1 month", hasInfo: true },
    ],
  },
];

// ── AA Learn More (detail screen) ───────────────────────────────

export const AA_LEARN_MORE = {
  title: "Understanding account aggregator",
  subtitle: "Account aggregator is a RBI regulated consent based financial data sharing system.",
  benefits: [
    { title: "Safe", subtitle: "Your information is encrypted end to end and only used for your financial insights" },
    { title: "Trust", subtitle: "The AA framework is jointly created by RBI, SEBI, IRDAI & PFRDA" },
    { title: "Privacy", subtitle: "You are in charge of your data and can choose to share it" },
    { title: "Ease of access", subtitle: "AA allows you to manage all banking data in one place" },
  ],
  supportedBanks: ["SBI", "Axis", "HDFC", "Kotak", "ICICI"],
  aggregators: ["Perfios", "FINVU", "saafe", "N@DL", "Onemoney"],
};

// ── Banks ───────────────────────────────────────────────────────

export const BANKS = [
  { id: "hdfc", label: "HDFC Bank", initial: "H", color: "#004C8F" },
  { id: "axis", label: "Axis Bank", initial: "A", color: "#97144D" },
  { id: "ippb", label: "India Post Payments Ba...", initial: "I", color: "#E8350E" },
  { id: "kotak", label: "Kotak Mahindra Bank", initial: "K", color: "#ED1C24" },
  { id: "kvb", label: "Karur Vyasa Bank", initial: "K", color: "#6B2D8B" },
  { id: "other", label: "Other bank", initial: "🏦", color: "#78808B" },
];
