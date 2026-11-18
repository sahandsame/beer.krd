import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, uploaded media, Next internals and files with an extension.
  matcher: ["/((?!api|media|_next|_vercel|.*\\..*).*)"],
};
