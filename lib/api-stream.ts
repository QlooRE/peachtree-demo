"use client";

import type { QlooCall } from "@/lib/qloo";

export type { QlooCall };

const calls: QlooCall[] = [];
const listeners = new Set<() => void>();
let snapshot: QlooCall[] = calls;

function notify() {
  snapshot = calls.slice();
  listeners.forEach((l) => l());
}

export function recordCalls(newCalls: QlooCall[] | undefined) {
  if (!newCalls?.length) return;
  for (const c of newCalls) calls.push(c);
  notify();
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSnapshot(): QlooCall[] {
  return snapshot;
}

export function getServerSnapshot(): QlooCall[] {
  return [];
}

type WithCalls = { _qloo_calls?: QlooCall[] };

export async function trackedFetch<T = unknown>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = (await res.json()) as T & WithCalls;
  if (data && typeof data === "object" && Array.isArray(data._qloo_calls)) {
    recordCalls(data._qloo_calls);
  }
  return data;
}
