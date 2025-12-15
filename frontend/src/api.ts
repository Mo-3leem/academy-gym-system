// src/api.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// ====== Types ======
export interface Sport {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  code: string | null;
  name: string;
  phone: string | null;
  gender?: string | null;
  birthDate?: string | null;
  interests?: unknown;
  notes?: string | null;
  createdAt?: string;
}

export interface Plan {
  id: number;
  name?: string | null;
  type: "gym" | "sport";
  durationDays: number;
  price?: number | null;
}

export interface Coach {
  id: number;
  name: string;
  phone?: string | null;
}

export interface Group {
  id: number;
  name: string;
  sportId: number;
  coachId?: number | null;

  // when included from backend (include: { sport, coach })
  sport?: Sport;
  coach?: Coach | null;
}

export interface Subscription {
  id: number;
  type: "gym" | "sport";

  memberId: number;
  planId: number;
  sportId?: number | null;
  groupId?: number | null;
  coachId?: number | null;

  privateTrainer?: boolean | null;
  classTypes?: unknown;

  startDate: string;
  endDate: string;

  // computed in backend (via getSubscriptionStatus)
  status?: "active" | "expiringSoon" | "expired";

  // when included from backend (include: { plan, sport, group, coach })
  plan?: Plan;
  sport?: Sport | null;
  group?: Group | null;
  coach?: Coach | null;
}

export interface AttendanceResponse {
  message: string;
  member: Member;
  subscriptions: Subscription[];
}

// ====== API functions ======

// Sports
export const getSports = async (): Promise<Sport[]> => {
  const res = await axios.get<Sport[]>(`${API_BASE}/sports`);
  return res.data;
};

export const createSport = async (data: { name: string }): Promise<void> => {
  await axios.post(`${API_BASE}/sports`, data);
};

// Members
export const createMember = async (data: {
  name: string;
  phone?: string;
  gender?: string;
  birthDate?: string;
  interests?: unknown;
  notes?: string;
}): Promise<void> => {
  await axios.post(`${API_BASE}/members`, data);
};

export const searchMembers = async (search: string): Promise<Member[]> => {
  const res = await axios.get<Member[]>(`${API_BASE}/members`, {
    params: { search },
  });
  return res.data;
};

// Attendance
export const registerAttendance = async (data: {
  search: string;
  type: "gym" | "sport";
}): Promise<AttendanceResponse> => {
  const res = await axios.post<AttendanceResponse>(
    `${API_BASE}/attendance`,
    data
  );
  return res.data;
};

// Plans
export const getPlans = async (type?: "gym" | "sport"): Promise<Plan[]> => {
  const res = await axios.get<Plan[]>(`${API_BASE}/plans`, {
    params: type ? { type } : {},
  });
  return res.data;
};

export const createPlan = async (data: {
  name?: string;
  type: "gym" | "sport";
  durationDays: number;
  price?: number;
}): Promise<void> => {
  await axios.post(`${API_BASE}/plans`, data);
};

// Coaches
export const getCoaches = async (): Promise<Coach[]> => {
  const res = await axios.get<Coach[]>(`${API_BASE}/coaches`);
  return res.data;
};

export const createCoach = async (data: {
  name: string;
  phone?: string;
}): Promise<void> => {
  await axios.post(`${API_BASE}/coaches`, data);
};

// Groups
export const getGroups = async (sportId?: number): Promise<Group[]> => {
  const res = await axios.get<Group[]>(`${API_BASE}/groups`, {
    params: sportId ? { sportId } : {},
  });
  return res.data;
};

export const createGroup = async (data: {
  name: string;
  sportId: number;
  coachId?: number;
}): Promise<void> => {
  await axios.post(`${API_BASE}/groups`, data);
};

// Subscriptions
export interface CreateSubscriptionPayload {
  memberId: number;
  planId: number;
  type: "gym" | "sport";
  sportId?: number;
  groupId?: number;
  coachId?: number;
  privateTrainer?: boolean;
  classTypes?: unknown;
  startDate?: string;
}

export const createSubscription = async (
  data: CreateSubscriptionPayload
): Promise<void> => {
  await axios.post(`${API_BASE}/subscriptions`, data);
};

export const getMemberSubscriptions = async (
  memberId: number
): Promise<Subscription[]> => {
  const res = await axios.get<Subscription[]>(
    `${API_BASE}/subscriptions/member/${memberId}`
  );
  return res.data;
};
