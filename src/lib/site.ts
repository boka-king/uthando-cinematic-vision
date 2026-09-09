export const SITE_NAME = "Uthandolwamandla Managing and Distribution (Pty) Ltd";
export const SITE_SHORT = "Uthandolwamandla";

export const CONTACTS = [
  { name: "Zanele Mabuza", role: "Managing Member & Founder", phone: "+27738583423" },
  { name: "Thami", role: "Client liaison", phone: "+27837804145" },
  { name: "Jessica", role: "Client liaison", phone: "+27691668419" },
] as const;

export const EMAIL = "admin@uthandolwamandlasa.co.za";
export const ADDRESS = "4131 Mpinga Street, Daveyton, Benoni";

export function prettyPhone(phone: string) {
  // +27738583423 -> +27 73 858 3423
  const rest = phone.replace("+27", "");
  return `+27 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5)}`;
}

export function whatsappLink(phone: string, text: string) {
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(text)}`;
}

export const SERVICES = [
  {
    id: "recruitment",
    index: "01",
    title: "Recruitment",
    lead: "The right person, verified before they reach your door.",
    body: "End-to-end sourcing, screening, competency interviewing, reference and qualification verification, offer management and onboarding — for permanent, fixed-term and high-volume placements across South Africa.",
  },
  {
    id: "hr-functions",
    index: "02",
    title: "HR functions",
    lead: "A full HR department, without carrying one.",
    body: "Contracts of employment, policies and procedures, job profiling, performance management, employee files and record keeping, BCEA and EEA compliance, and day-to-day advisory for line managers.",
  },
  {
    id: "ir-er-ccma",
    index: "03",
    title: "IR / ER and CCMA representation",
    lead: "Ninety-nine percent success at the CCMA.",
    body: "Disciplinary enquiries, grievances, incapacity and retrenchment processes chaired and documented correctly — then conciliation, con-arb and arbitration representation at the CCMA and bargaining councils, with a 99% success rate for the employers we represent.",
  },
  {
    id: "payroll",
    index: "04",
    title: "Payroll",
    lead: "Paid accurately, on the day, every month.",
    body: "Monthly and weekly payroll processing, payslips, leave and overtime administration, PAYE, UIF, SDL and COIDA submissions, third-party reconciliations and year-end reporting.",
  },
  {
    id: "training",
    index: "05",
    title: "Training",
    lead: "Skills that hold after the workshop ends.",
    body: "Practical training for managers and staff: labour law essentials, chairing disciplinary hearings, performance conversations, workplace conduct and induction programmes, delivered on site or remotely.",
  },
  {
    id: "health-safety",
    index: "06",
    title: "Health & safety",
    lead: "Compliance that protects people first.",
    body: "OHS Act compliance, risk assessments, appointments and committees, incident investigation and reporting, toolbox talks, and audit-ready documentation for inspections.",
  },
] as const;
