import { apiFetch } from "./client";
import type { ContactMessageResponse } from "@/types/contact";

export function getMessages(): Promise<ContactMessageResponse[]> {
  return apiFetch<ContactMessageResponse[]>("/api/admin/messages");
}

export function toggleMessageRead(id: number, read: boolean): Promise<ContactMessageResponse> {
  return apiFetch<ContactMessageResponse>(`/api/admin/messages/${id}/read`, {
    method: "PATCH",
    body: JSON.stringify({ read }),
  });
}

export function deleteMessage(id: number): Promise<void> {
  return apiFetch<void>(`/api/admin/messages/${id}`, { method: "DELETE" });
}
