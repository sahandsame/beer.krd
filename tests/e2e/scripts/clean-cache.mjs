// Next keeps cached data (unstable_cache) in .next/cache between builds; the e2e database is
// fresh every run, so stale cache entries would leak state from the previous run.
import { rmSync } from "node:fs";
import path from "node:path";

for (const app of ["web", "admin"]) {
  rmSync(path.resolve(import.meta.dirname, `../../../apps/${app}/.next/cache`), {
    recursive: true,
    force: true,
  });
}
