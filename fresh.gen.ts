// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[name].tsx";
import * as $1 from "./routes/admin/[id].tsx";
import * as $2 from "./routes/admin/_middleware.ts";
import * as $3 from "./routes/admin/index.tsx";
import * as $4 from "./routes/api/joke.ts";
import * as $5 from "./routes/index.tsx";
import * as $6 from "./routes/posts/[id].tsx";
import * as $7 from "./routes/posts/_middleware.ts";
import * as $8 from "./routes/posts/create.tsx";
import * as $9 from "./routes/posts/index.tsx";
import * as $$0 from "./islands/Counter.tsx";

const manifest = {
  routes: {
    "./routes/[name].tsx": $0,
    "./routes/admin/[id].tsx": $1,
    "./routes/admin/_middleware.ts": $2,
    "./routes/admin/index.tsx": $3,
    "./routes/api/joke.ts": $4,
    "./routes/index.tsx": $5,
    "./routes/posts/[id].tsx": $6,
    "./routes/posts/_middleware.ts": $7,
    "./routes/posts/create.tsx": $8,
    "./routes/posts/index.tsx": $9,
  },
  islands: {
    "./islands/Counter.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
