import api from "@/services/api";

export type TimeOffRow = {
  timeOffID: number;
  start: string; // ISO
  end: string;   // ISO
  reason: string | null;
};

export type TimeOffCreate = {
  start: string; // ISO
  end: string;   // ISO
  reason?: string | null;
};

export type TimeOffUpdate = Partial<TimeOffCreate>;

export async function getFutureTimeOff(): Promise<TimeOffRow[]> {
  const { data } = await api.get("/time-off");
  return data;
}

export async function createTimeOff(payload: TimeOffCreate): Promise<TimeOffRow> {
  const { data } = await api.post("/time-off", payload);
  return data;
}

export async function updateTimeOff(id: number, payload: TimeOffUpdate): Promise<TimeOffRow> {
  const { data } = await api.put(`/time-off/${id}`, payload);
  return data;
}

export async function deleteTimeOff(id: number): Promise<void> {
  await api.delete(`/time-off/${id}`);
}
