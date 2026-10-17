import { repassar } from "./_proxy.js";
export function POST(request) {
  return repassar(request, "track");
}
