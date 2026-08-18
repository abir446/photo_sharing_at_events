import dns from "node:dns";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    dns.setDefaultResultOrder("ipv4first");
  }
}
