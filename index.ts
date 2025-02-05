import { Context, Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

// Libraries to use
import { Index } from "@upstash/vector";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const semanticSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 25, // 25 Letters
  separators: [" "], // Letter Separator
  chunkOverlap: 12, // 12 letters for maintain context
});

const app = new Hono();

type Environment = {
  VECTOR_URL: string;
  VECTOR_TOKEN: string;
};

app.use(cors());

// whitelist
const WHITELIST = ["swear"];
const PROFANITY_THRESHOLD = 0.86;

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
      cache: false, // Disable cache for deploy in Cloudflare Workers
    }); //  Declare new Instance of Vector

    const body = await c.req.json();
    let { message } = body as { message: string };

    if (!message) {
      return c.json({ error: "message is required" }, { status: 400 });
    }

    if (message.length > 1000) {
      return c.json({ error: "message is too long" }, { status: 413 });
    }

    // Filter messages for exclude words in whitelist
    message = message
      .split(/\s+/)
      .filter((word) => !WHITELIST.includes(word.toLowerCase()))
      .join(" ");

    // Check if one word is profane or chunk is profane or message is profane
    const [semanticChunks, wordChunks] = await Promise.all([
      splitTextIntoSemantics(message),
      splitTextIntoWords(message),
    ]);

    // Verify if any chunk is profane
    const flaggedFor = new Set<{ score: number; text: string }>();

    const vectorRes = await Promise.all([
      ...wordChunks.map(async (wordChunk) => {
        const [vector] = await index.query({
          topK: 1,
          data: wordChunk,
          includeMetadata: true,
        });
        if (vector && vector.score > 0.95) {
          flaggedFor.add({
            text: vector.metadata!.text as string,
            score: vector.score,
          });
        }
        return { score: 0 };
      }),

      ...semanticChunks.map(async (semanticChunk) => {
        const [vector] = await index.query({
          topK: 1,
          data: semanticChunk,
          includeMetadata: true,
        });
        if (vector && vector.score > PROFANITY_THRESHOLD) {
          flaggedFor.add({
            text: vector.metadata!.text as string,
            score: vector.score,
          });
        }
        return vector;
      }),
    ]);

    
    // Return the result to the user
    if (flaggedFor.size > 0) {
      const sordted = Array.from(flaggedFor).sort((a, b) =>
        b.score > a.score ? -1 : 1
      )[0];

      return c.json({
        isProfanity: true,
        score: sordted.score,
        flaggedFor: sordted.text,
      });
    } else {

      const mostProfaneChunk = vectorRes.sort((a, b) =>
        b.score > a.score ? -1 : 1
      )[0];

      return c.json({ isProfanity: false, score: mostProfaneChunk.score });
    }
  } catch (error) {
    console.log(error);
    return c.json({ error: "Internal Server Error" }, { status: 500 });
  }
});


function splitTextIntoWords(text: string) {
  return text.split(/\s+/);
}

async function splitTextIntoSemantics(text: string) {
  if (text.split(/\s+/).length === 1) return [];
  const documents = await semanticSplitter.createDocuments([text]);
  const chunks = documents.map((chunk) => chunk.pageContent); // returns removing the additional information from the documents such as metadata, etc.
  return chunks;
}

export default app;
