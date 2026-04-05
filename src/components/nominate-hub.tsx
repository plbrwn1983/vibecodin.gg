"use client";

import { useState } from "react";

export function NominateHub() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setErrorMsg("");

    const res = await fetch("/api/nominate-hub", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, reason }),
    });

    setSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setErrorMsg(data?.error ?? "Failed to send nomination. Please try again.");
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setName("");
      setDescription("");
      setReason("");
    }, 3000);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
      >
        <span>+</span> Nominate a new Hub
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold text-foreground">
              Nominate a new Hub
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Suggest a new business domain hub for the vibecodin.gg community.
            </p>

            {submitted ? (
              <div className="mt-6 text-center">
                <p className="text-sm text-green-400">
                  Nomination submitted! We&apos;ll review your suggestion.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground">
                    Hub Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Healthcare, Education"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground">
                    Description
                  </label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What would this hub cover?"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground">
                    Why should this hub exist?
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="What skills or agents would belong here? What problem does it solve?"
                    className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Submit Nomination"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
