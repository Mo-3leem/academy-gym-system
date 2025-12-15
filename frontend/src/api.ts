// src/api.ts
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// ====== Types ======
export interface Sport {
  _id: string;
  name: string;
  description?: string;
}

export interface Member {
  _id: string;
  code: string;
  name: string;
  phone: string;
}

export interface Subscription {
  _id: string;
  type: "gym" | "sport";
  planId?: {
    _id: string;
    name: string;
  };
  sportId?: {
    _id: string;
    name: string;
  };
  groupId?: {
    _id: string;
    name: string;
  };
  coachId?: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  status?: "active" | "expiringSoon" | "expired";
}

export interface AttendanceResponse {
  message: string;
  member: Member;
  subscriptions: Subscription[];
}

export interface Plan {
  _id: string;
  name: string;
  type: "gym" | "sport";
  durationDays: number;
  price?: number;
}

export interface Coach {
  _id: string;
  name: string;
  phone?: string;
  specialty?: string;
}

export interface Group {
  _id: string;
  name: string;
  sportId: Sport;
  coachId?: Coach;
  schedule?: string;
}

// ====== API functions ======
export const getSports = async (): Promise<Sport[]> => {
  const res = await axios.get<Sport[]>(`${API_BASE}/sports`);
  return res.data;
};

export const createSport = async (data: {
  name: string;
  description?: string;
}): Promise<void> => {
  await axios.post(`${API_BASE}/sports`, data);
};

export const createMember = async (data: unknown): Promise<void> => {
  await axios.post(`${API_BASE}/members`, data);
};

export const searchMembers = async (search: string): Promise<Member[]> => {
  const res = await axios.get<Member[]>(`${API_BASE}/members`, {
    params: { search },
  });
  return res.data;
};

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
  name: string;
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
  specialty?: string;
}): Promise<void> => {
  await axios.post(`${API_BASE}/coaches`, data);
};

// Groups
export const getGroups = async (sportId?: string): Promise<Group[]> => {
  const res = await axios.get<Group[]>(`${API_BASE}/groups`, {
    params: sportId ? { sportId } : {},
  });
  return res.data;
};

export const createGroup = async (data: {
  name: string;
  sportId: string;
  coachId?: string;
  schedule?: string;
}): Promise<void> => {
  await axios.post(`${API_BASE}/groups`, data);
};

// Subscriptions
export interface CreateSubscriptionPayload {
  memberId: string;
  planId: string;
  type: "gym" | "sport";
  sportId?: string;
  groupId?: string;
  coachId?: string;
  privateTrainer?: boolean;
  classTypes?: string[];
  startDate?: string;
}

export const createSubscription = async (
  data: CreateSubscriptionPayload
): Promise<void> => {
  await axios.post(`${API_BASE}/subscriptions`, data);
};

export const getMemberSubscriptions = async (
  memberId: string
): Promise<Subscription[]> => {
  const res = await axios.get<Subscription[]>(
    `${API_BASE}/subscriptions/member/${memberId}`
  );
  return res.data;
};
