"use client";

import { useEffect, useState } from "react";

// Простой in-memory кэш, чтобы не дёргать /api/auth/me на каждой карточке.
let cachedUser = undefined; // undefined = ещё не запрашивали; null = анонимный
let inflight = null;
const subscribers = new Set();

function notify() {
  for (const cb of subscribers) cb(cachedUser);
}

async function fetchUser() {
  if (inflight) return inflight;
  inflight = fetch("/api/auth/me", { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      cachedUser = d?.user ?? null;
      notify();
      return cachedUser;
    })
    .catch(() => {
      cachedUser = null;
      notify();
      return null;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useCurrentUser() {
  const [user, setUser] = useState(cachedUser ?? null);
  const [loading, setLoading] = useState(cachedUser === undefined);

  useEffect(() => {
    let alive = true;
    const cb = (u) => {
      if (alive) {
        setUser(u);
        setLoading(false);
      }
    };
    subscribers.add(cb);
    if (cachedUser === undefined) {
      fetchUser();
    }
    return () => {
      alive = false;
      subscribers.delete(cb);
    };
  }, []);

  return { user, loading };
}

export function getCachedCurrentUser() {
  return cachedUser ?? null;
}
