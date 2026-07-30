import { apiFetch } from "./client";
import type { ContactFormData, ContactResponse } from "@/types/contact";

export function submitContact(
  data: ContactFormData
): Promise<ContactResponse> {
  const { name, email, message } = data;
  return apiFetch<ContactResponse>("/api/contact", {
    method: "POST",
    body: JSON.stringify({ name, email, message }),
  });
}
