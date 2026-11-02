import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

const handler = (request) => getAuth().handler(request);

export const { GET, POST } = toNextJsHandler(handler);
