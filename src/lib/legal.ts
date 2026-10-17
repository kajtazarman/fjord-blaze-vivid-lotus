export type DocSection = { heading: string; paragraphs: string[] };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: DocSection[];
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    summary: "What DigiSef collects, how it is used, and how it is stored.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Welcome",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "Welcome to DigiSef. Operated by the SideQuest studio, we are committed to protecting the privacy and security of our B2B users, including small business owners, operations managers, and fleet managers.",
        ],
      },
      {
        heading: "Information we collect",
        paragraphs: [
          "To deliver our automated compliance tracking services, we collect and process the following data:",
          "Account data: we collect your email address, local timezone (IANA format), and passwords, which are securely hashed using Argon2id.",
          "Federated authentication: if you opt for third-party logins, we collect identity data from Google OAuth or Auth0.",
          "Document metadata: we store the data you input, including document names, categories, expiry dates, plain text notes, and actionable renewal links.",
          "File uploads: you may optionally upload PDF or JPG files up to 10MB in size.",
          "Payment metadata: we process Stripe customer IDs and subscription statuses to manage premium accounts.",
          "Product telemetry: we collect analytics events (for example document_created and paywall_impression), associated user IDs, and contextual payloads to improve application performance.",
        ],
      },
      {
        heading: "How we use your data",
        paragraphs: [
          "We use your timezone and document metadata exclusively to dispatch automated email alerts with embedded renewal links at exactly 08:00 AM in your local time. Payment metadata is used solely to manage billing and enforce our freemium access limits.",
        ],
      },
      {
        heading: "Data storage and security",
        paragraphs: [
          "Encryption at rest: uploaded files are stored in AWS S3 or self-hosted SeaweedFS utilizing standard AES-256 server-side encryption (SSE-S3).",
          "Database security: authentication tokens are secured using SHA-256 hashing. Database backups are locally encrypted via GPG and synced securely to offsite Cloudflare R2 object storage.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of service",
    summary: "What DigiSef does, how the free and paid plans work, and the limits of the service.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Contact",
        paragraphs: ["Contact: sidequestbh@gmail.com"],
      },
      {
        heading: "1. Service description",
        paragraphs: [
          "DigiSef is a lightweight automated expiration tracker designed to help businesses monitor compliance deadlines for assets such as vehicle registrations, commercial insurance, and office leases. The service dispatches email reminders at 30, 7, and 1-day intervals prior to expiration.",
        ],
      },
      {
        heading: "2. Freemium model and billing",
        paragraphs: [
          "Free tier: users may track up to 3 documents completely free of charge.",
          "Paywall restrictions: attempting to track a fourth document will place the new record in a locked state. Automated reminders for locked documents remain paused until the user activates a paid Stripe subscription.",
        ],
      },
      {
        heading: "3. User limitations and responsibilities",
        paragraphs: [
          "Manual data entry: expiration dates must be manually inputted. DigiSef does not currently support OCR or AI-based extraction from uploaded files.",
          "Access constraints: accounts are restricted to single-user logins. Multi-user role-based access control (RBAC) is not currently supported.",
        ],
      },
      {
        heading: "4. Limitation of liability",
        paragraphs: [
          "SideQuest is not legally or financially responsible for missed compliance deadlines, operational halts, late fees, or fines resulting from user input errors, ignored alerts, or misconfigured reminders.",
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Report security issues",
    summary: "How to report a vulnerability in DigiSef.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Contact",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "SideQuest treats the security of B2B infrastructure and client data as our absolute highest priority.",
          "If you discover a vulnerability in the DigiSef application, API, or cloud storage architecture, please report it immediately. Critical production vulnerabilities (P0), such as unauthorized data access or broken authentication, are treated as emergencies. Our engineering team will immediately halt all active feature development to deploy a hotfix.",
        ],
      },
    ],
  },
  {
    slug: "trademark",
    title: "Trademark",
    summary: "Who owns the DigiSef and SideQuest names.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Ownership",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "“DigiSef” and “SideQuest” are brand assets owned and operated by the SideQuest founding team: Haris Nuspahić, Belmin Kadić, and Arman Kajtaz.",
          "All intellectual property associated with the DigiSef platform, including the monorepo codebase, database schemas, UI component systems, logos, and trade secrets, is exclusively assigned to the joint SideQuest entity. Users and third parties may not utilize the DigiSef name, logo, or proprietary assets without explicit written authorization.",
        ],
      },
    ],
  },
  {
    slug: "privacy-choices",
    title: "Your privacy choices",
    summary: "How you control what DigiSef stores.",
    updated: "13 October 2026",
    sections: [
      {
        heading: "Your choices",
        paragraphs: [
          "Contact: sidequestbh@gmail.com",
          "DigiSef is designed to minimize data friction and grant you total control over your business compliance records.",
          "Explicitly optional storage: uploading files to our servers is entirely optional. If you prefer, you can track your deadlines using text-based metadata alone to completely bypass cloud storage.",
          "Authentication freedom: you may authenticate using a secure password or utilize federated identity providers (Google OAuth, Auth0) to limit the credentials you share.",
          "Right to erasure: should you choose to delete your DigiSef account, our database enforces a strict cascading delete rule (ON DELETE CASCADE) that permanently purges all of your associated documents, files, metadata, and analytics from our systems.",
        ],
      },
    ],
  },
];

export function legalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((doc) => doc.slug === slug);
}
