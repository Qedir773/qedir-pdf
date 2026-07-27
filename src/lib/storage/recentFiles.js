import { get, set } from "idb-keyval";

const STORE_KEY = "omni.recentFiles";
const MAX_ENTRIES = 20;

let nextId = 1;

async function readAll() {
  return (await get(STORE_KEY)) ?? [];
}

export async function addRecentFile(blob, name) {
  const entries = await readAll();
  const entry = {
    id: `${Date.now()}-${nextId++}`,
    name,
    size: blob.size,
    type: blob.type,
    createdAt: Date.now(),
    blob,
  };
  const updated = [entry, ...entries].slice(0, MAX_ENTRIES);
  await set(STORE_KEY, updated);
  return entry.id;
}

export async function getRecentFiles() {
  const entries = await readAll();
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

export async function deleteRecentFile(id) {
  const entries = await readAll();
  await set(STORE_KEY, entries.filter((e) => e.id !== id));
}

export async function clearRecentFiles() {
  await set(STORE_KEY, []);
}
