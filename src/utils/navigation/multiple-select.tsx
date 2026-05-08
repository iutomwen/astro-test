“use client”;

import { useState, useRef, useEffect } from “react”;

// — Mock user data (replace with your actual data source) —
const ALL_USERS = [
{ id: “1”, name: “Alice Johnson”, email: “alice@example.com” },
{ id: “2”, name: “Bob Smith”, email: “bob@example.com” },
{ id: “3”, name: “Carol White”, email: “carol@example.com” },
{ id: “4”, name: “David Lee”, email: “david@example.com” },
{ id: “5”, name: “Eva Martinez”, email: “eva@example.com” },
{ id: “6”, name: “Frank Chen”, email: “frank@example.com” },
];

// — Avatar initials helper —
function Initials({ name }) {
const parts = name.trim().split(” “);
const letters =
parts.length >= 2
? parts[0][0] + parts[parts.length - 1][0]
: parts[0].slice(0, 2);
return (
<span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase select-none shrink-0">
{letters}
</span>
);
}

// — Main Component —
export default function UserMultiSelect() {
const [selectedUsers, setSelectedUsers] = useState([]);
const [query, setQuery] = useState(””);
const [open, setOpen] = useState(false);
const [submitted, setSubmitted] = useState(false);
const containerRef = useRef(null);
const inputRef = useRef(null);

// Close dropdown on outside click
useEffect(() => {
function handleClickOutside(e) {
if (containerRef.current && !containerRef.current.contains(e.target)) {
setOpen(false);
setQuery(””);
}
}
document.addEventListener(“mousedown”, handleClickOutside);
return () => document.removeEventListener(“mousedown”, handleClickOutside);
}, []);

const filtered = ALL_USERS.filter(
(u) =>
!selectedUsers.find((s) => s.id === u.id) &&
(u.name.toLowerCase().includes(query.toLowerCase()) ||
u.email.toLowerCase().includes(query.toLowerCase()))
);

function addUser(user) {
setSelectedUsers((prev) => […prev, user]);
setQuery(””);
inputRef.current?.focus();
}

function removeUser(id) {
setSelectedUsers((prev) => prev.filter((u) => u.id !== id));
}

function handleSubmit(e) {
e.preventDefault();
// The array of user IDs ready to store in Cloudflare D1:
const userIds = selectedUsers.map((u) => u.id);
console.log(“Storing user IDs in D1:”, userIds);
// Example D1 usage:
//   await db.prepare(“INSERT INTO events (user_ids) VALUES (?)”).bind(JSON.stringify(userIds)).run();
setSubmitted(true);
setTimeout(() => setSubmitted(false), 3000);
}

return (
<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
<div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
{/* Header */}
<div className="bg-indigo-600 px-6 py-5">
<h1 className="text-white text-xl font-semibold tracking-tight">
Add Users to Event
</h1>
<p className="text-indigo-200 text-sm mt-0.5">
Select one or more attendees from the dropdown.
</p>
</div>

```
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Event name field (bonus) */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Event Name
        </label>
        <input
          type="text"
          placeholder="e.g. Team Standup"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>

      {/* Multi-user select */}
      <div ref={containerRef}>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Attendees
        </label>

        {/* Input box with tags */}
        <div
          className={`flex flex-wrap gap-1.5 min-h-[42px] w-full rounded-lg border bg-white px-2.5 py-2 cursor-text transition ${
            open
              ? "border-indigo-500 ring-2 ring-indigo-500/20"
              : "border-slate-300"
          }`}
          onClick={() => {
            setOpen(true);
            inputRef.current?.focus();
          }}
        >
          {/* Selected tags */}
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="flex items-center gap-1 bg-indigo-50 text-indigo-800 text-xs font-medium rounded-md pl-1.5 pr-1 py-0.5 border border-indigo-200"
            >
              <Initials name={user.name} />
              {user.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeUser(user.id);
                }}
                className="ml-0.5 text-indigo-400 hover:text-indigo-700 transition"
                aria-label={`Remove ${user.name}`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </span>
          ))}

          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[120px] text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            placeholder={
              selectedUsers.length === 0 ? "Search users…" : ""
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="relative z-10">
            <ul className="absolute top-1.5 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg max-h-52 overflow-y-auto divide-y divide-slate-100">
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <li key={user.id}>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 transition text-left"
                      onMouseDown={(e) => e.preventDefault()} // prevent blur
                      onClick={() => addUser(user)}
                    >
                      <Initials name={user.name} />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-sm text-slate-400 text-center">
                  {query ? "No users found" : "All users selected"}
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedUsers.length > 0 && (
        <p className="text-xs text-slate-500">
          {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
          &nbsp;·&nbsp;IDs:{" "}
          <code className="bg-slate-100 px-1 rounded text-slate-600">
            [{selectedUsers.map((u) => `"${u.id}"`).join(", ")}]
          </code>
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={selectedUsers.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg px-4 py-2.5 transition"
      >
        {submitted ? "✓ Saved!" : "Save Event"}
      </button>
    </form>
  </div>
</div>
```

);
}

/*
── D1 Integration Notes ──────────────────────────────────────────────

In your Next.js route handler (e.g. app/api/events/route.js):

import { getRequestContext } from “@cloudflare/next-on-pages”;

export async function POST(request) {
const { DB } = getRequestContext().env;
const { eventName, userIds } = await request.json();

```
await DB.prepare(
  "INSERT INTO events (name, user_ids) VALUES (?, ?)"
)
  .bind(eventName, JSON.stringify(userIds))   // store as JSON string
  .run();

return Response.json({ ok: true });
```

}

Your D1 schema:
CREATE TABLE events (
id        INTEGER PRIMARY KEY AUTOINCREMENT,
name      TEXT NOT NULL,
user_ids  TEXT NOT NULL   – JSON array e.g. ‘[“1”,“3”,“5”]’
);

To read back:
const row = await DB.prepare(“SELECT * FROM events WHERE id = ?”).bind(id).first();
const userIds = JSON.parse(row.user_ids); // [“1”,“3”,“5”]

─────────────────────────────────────────────────────────────────────
*/