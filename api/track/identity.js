import { repassar } from "./_proxy.js";
export function GET(request) {
  return repassar(request, "identity");
}
