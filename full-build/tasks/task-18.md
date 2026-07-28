---
id: task-18
task: Build admin Messages inbox with read/unread toggle and delete
agent: frontend
status: approved
depends_on: [task-15]
skills:
  - languages/javascript
  - tooling/eslint
  - global/security
context:
  project: professional-profile
  branch: feature/full-build
  files:
    - frontend/src/app/admin/messages/page.tsx
    - frontend/src/lib/api/messages.ts
    - frontend/src/types/contact.ts
acceptance_criteria:
  - Messages page at /admin/messages lists all contact messages sorted newest first
  - Each row shows sender name, email, date, and read/unread status indicator
  - Clicking a row expands to show the full message body inline
  - Mark as Read / Mark as Unread toggle button calls PATCH /api/admin/messages/{id}/read
  - Delete button calls DELETE /api/admin/messages/{id} after confirmation
  - Unread messages are visually distinct (bolder text, different background)
  - Empty state message shown when inbox is empty
  - Page updates optimistically on toggle/delete (no full reload)
  - ESLint passes with no violations
---

## Implementation Instructions

### 1. Add ContactMessageResponse type to `frontend/src/types/contact.ts`

```ts
// Append to existing contact.ts

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}
```

### 2. Create `frontend/src/lib/api/messages.ts`

```ts
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
```

### 3. Create `frontend/src/app/admin/messages/page.tsx`

```tsx
"use client";
import { useState, useEffect } from "react";
import { getMessages, toggleMessageRead, deleteMessage } from "@/lib/api/messages";
import { formatDate } from "@/lib/utils/formatDate";
import type { ContactMessageResponse } from "@/types/contact";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    getMessages()
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleRead = async (msg: ContactMessageResponse) => {
    // Optimistic update
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: !m.read } : m));
    try {
      const updated = await toggleMessageRead(msg.id, !msg.read);
      setMessages(prev => prev.map(m => m.id === updated.id ? updated : m));
    } catch {
      // Revert on failure
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: msg.read } : m));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    // Optimistic remove
    setMessages(prev => prev.filter(m => m.id !== id));
    try {
      await deleteMessage(id);
    } catch {
      // Restore on failure — re-fetch
      getMessages().then(setMessages);
    }
  };

  if (loading) return <p>Loading messages...</p>;

  if (messages.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <p style={{ color: "var(--secondary)" }}>No messages yet. Your contact form inbox is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Messages
        {messages.filter(m => !m.read).length > 0 && (
          <span className="ml-2 text-sm px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--primary)", color: "#fff" }}>
            {messages.filter(m => !m.read).length} unread
          </span>
        )}
      </h1>

      <div className="space-y-2">
        {messages.map(msg => (
          <div key={msg.id}>
            {/* Summary row */}
            <div
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors"
              style={{
                backgroundColor: msg.read ? "var(--card)" : "var(--muted)",
                borderColor: "var(--border)",
                fontWeight: msg.read ? "normal" : "600",
              }}
              onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
            >
              {/* Unread indicator dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: msg.read ? "transparent" : "var(--primary)" }}
                aria-label={msg.read ? "Read" : "Unread"}
              />

              <div className="flex-1 min-w-0">
                <p className="truncate">{msg.name}</p>
                <p className="text-xs truncate" style={{ color: "var(--secondary)" }}>{msg.email}</p>
              </div>

              <p className="text-xs flex-shrink-0" style={{ color: "var(--secondary)" }}>
                {formatDate(msg.createdAt)}
              </p>

              <div className="flex gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleToggleRead(msg)}
                  className="text-xs px-3 py-1 rounded border transition-colors"
                  style={{ borderColor: "var(--border)", color: "var(--secondary)" }}
                  aria-label={msg.read ? "Mark as unread" : "Mark as read"}
                >
                  {msg.read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="text-xs px-3 py-1 rounded border"
                  style={{ borderColor: "#ef4444", color: "#ef4444" }}
                  aria-label="Delete message"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Expanded message body */}
            {expandedId === msg.id && (
              <div
                className="p-4 rounded-b-lg border border-t-0"
                style={{ backgroundColor: "var(--muted)", borderColor: "var(--border)" }}
              >
                <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--card-foreground)" }}>
                  {msg.message}
                </p>
                <p className="text-xs mt-3" style={{ color: "var(--secondary)" }}>
                  Reply to: <a href={`mailto:${msg.email}`} style={{ color: "var(--primary)" }}>{msg.email}</a>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Security Notes

- Message content is rendered as plain text (`whitespace-pre-wrap`) — NOT as HTML. This prevents any XSS risk from message content submitted through the contact form.
- The reply link uses `mailto:` which is safe for email addresses (validated by the backend's `@Email` constraint).
- Do NOT render `msg.message` with `dangerouslySetInnerHTML` — contact form content is untrusted user input.
