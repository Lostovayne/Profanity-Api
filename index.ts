import { Index } from "@upstash/vector";
import { Context, Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

const app = new Hono();

type Environment = {
  VECTOR_URL: string;
  VECTOR_TOKEN: string;
};

app.use(cors());

app.post("/", async (c: Context) => {
  if (c.req.header("Content-Type") !== "application/json") {
    return c.json(
      { error: "Content-Type must be application/json" },
      { status: 406 }
    );
  }

  try {
    // Declare env variables in wrangler toml file for create a type Environment
    const { VECTOR_URL, VECTOR_TOKEN } = env<Environment>(c);

    const index = new Index({
      url: VECTOR_URL,
      token: VECTOR_TOKEN,
      cache: false // Disable cache for deploy in Cloudflare Workers
    }); //  Declare new Instance of Vector
  } catch (error) {}
});
