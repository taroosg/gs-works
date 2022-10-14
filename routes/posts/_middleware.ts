import { MiddlewareHandlerContext } from "$fresh/server.ts";
import "dotenv/load.ts";

interface State {
  data: string;
}

const USER = Deno.env.get("AUTH_USER");
const PASSWORD = Deno.env.get("AUTH_PASSWORD");
const HOST = Deno.env.get("HOST");

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  if (req.headers.get("host") !== HOST) {
    return new Response("Forbidden", { status: 403 });
  }

  if (
    req.headers.get("Authorization") !== `Basic ${btoa(`${USER}:${PASSWORD}`)}`
  ) {
    const headers = new Headers({
      "WWW-Authenticate": 'Basic realm="Fake Realm"',
    });
    return new Response("Unauthorized", { status: 401, headers });
  }
  ctx.state.data = "myData";
  const resp = await ctx.next();
  resp.headers.set("server", "fresh server");
  return resp;
}
