export interface HttpLogEntry {
  ts: number;
  method: string;
  url: string;
  status: number;
  ms: number;
}

const MAX = 500;
const buf: HttpLogEntry[] = [];

export function pushLog(entry: HttpLogEntry): void {
  buf.push(entry);
  if (buf.length > MAX) buf.shift();
}

export function getLogs(limit = 100): HttpLogEntry[] {
  const n = Math.min(limit, MAX);
  return buf.slice(-n).reverse();
}
