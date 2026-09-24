// src/lib/tracker.ts
// Portfolio interaction tracking — Rhea Index + Analytics

const STORAGE_KEY = "rhea_portfolio_v1";

interface TrackingData {
  events: string[];           // unique event names (for Rhea Index)
  sectionsViewed: string[];   // section IDs viewed
  projectsOpened: number;     // total project card expansions
  recruiterRole: string | null;
  aiQuestions: number;
  cvClicks: number;
  sessionStart: number;       // epoch ms
  lastUpdated: number;
}

// Points per unique event (totals to 100)
const EVENT_POINTS: Record<string, number> = {
  recruiter_mode:       20,
  experience_opened:    15,
  red_entertainment:    20,
  ai_question:          15,
  achievement_opened:   15,
  cv_clicked:           15,
};

export const MILESTONES = [
  { pct: 25,  label: "INTRODUCED" },
  { pct: 50,  label: "CURIOUS" },
  { pct: 75,  label: "CONNECTED" },
  { pct: 100, label: "FULL PROFILE" },
];

// ── Internal helpers ──────────────────────────────────────────

function getDefault(): TrackingData {
  return {
    events: [],
    sectionsViewed: [],
    projectsOpened: 0,
    recruiterRole: null,
    aiQuestions: 0,
    cvClicks: 0,
    sessionStart: Date.now(),
    lastUpdated: Date.now(),
  };
}

function getData(): TrackingData {
  if (typeof window === "undefined") return getDefault();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefault();
    const parsed = JSON.parse(raw) as TrackingData;
    // Reset session start if last update was over 30min ago (new session)
    if (Date.now() - parsed.lastUpdated > 30 * 60 * 1000) {
      parsed.sessionStart = Date.now();
    }
    return parsed;
  } catch {
    return getDefault();
  }
}

function saveData(data: TrackingData): void {
  if (typeof window === "undefined") return;
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* storage full or unavailable */ }
}

function emit(eventName: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

// ── Public API ────────────────────────────────────────────────

/** Fire a unique gamification event. Returns new index. */
export function fireEvent(eventName: string): number {
  const data = getData();
  if (!data.events.includes(eventName)) {
    data.events.push(eventName);
    saveData(data);
  }
  const idx = getIndex(data);
  emit("rheaIndexUpdated", { index: idx });
  return idx;
}

/** Track a section view (for Analytics). */
export function trackSection(sectionId: string): void {
  const data = getData();
  if (!data.sectionsViewed.includes(sectionId)) {
    data.sectionsViewed.push(sectionId);
    saveData(data);
  }
  emit("analyticsUpdated");
}

/** Track a project/card open (fires experience_opened event once). */
export function trackProjectOpened(): void {
  const data = getData();
  data.projectsOpened += 1;
  saveData(data);
  fireEvent("experience_opened");
  emit("analyticsUpdated");
}

/** Track Ask Rhea question. */
export function trackAIQuestion(): void {
  const data = getData();
  data.aiQuestions += 1;
  saveData(data);
  fireEvent("ai_question");
  emit("analyticsUpdated");
}

/** Track CV click. */
export function trackCVClick(): void {
  const data = getData();
  data.cvClicks += 1;
  saveData(data);
  fireEvent("cv_clicked");
  emit("analyticsUpdated");
}

/** Set recruiter role. */
export function setRecruiterRole(role: string): void {
  const data = getData();
  data.recruiterRole = role;
  saveData(data);
  fireEvent("recruiter_mode");
  emit("recruiterRoleChanged", { role });
  emit("analyticsUpdated");
}

/** Fire achievement viewed. */
export function trackAchievementOpened(): void {
  fireEvent("achievement_opened");
}

/** Fire Red Entertainment viewed. */
export function trackRedEntertainment(): void {
  fireEvent("red_entertainment");
  trackSection("red-entertainment");
}

/** Get current Rhea Index (0–100). */
export function getIndex(data?: TrackingData): number {
  const d = data ?? getData();
  let total = 0;
  for (const ev of d.events) {
    total += EVENT_POINTS[ev] ?? 0;
  }
  return Math.min(100, total);
}

/** Get current milestone label. */
export function getMilestone(index: number): string {
  let label = "";
  for (const m of MILESTONES) {
    if (index >= m.pct) label = m.label;
  }
  return label;
}

/** Get full analytics snapshot for the drawer. */
export function getAnalytics() {
  const data = getData();
  const now = Date.now();
  const elapsed = Math.max(0, Math.floor((now - (data.sessionStart ?? now)) / 1000));
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return {
    timeSpent: `${minutes}m ${seconds}s`,
    sectionsViewed: data.sectionsViewed.length,
    projectsOpened: data.projectsOpened,
    recruiterRole: data.recruiterRole,
    aiQuestions: data.aiQuestions,
    cvClicks: data.cvClicks,
    index: getIndex(data),
    milestone: getMilestone(getIndex(data)),
    topWork: data.sectionsViewed.includes("red-entertainment")
      ? "Red Entertainment"
      : data.projectsOpened > 0
      ? "Experience Cards"
      : "—",
  };
}

/** Get the stored recruiter role. */
export function getRecruiterRole(): string | null {
  return getData().recruiterRole;
}
