import alchemy from "alchemy";
import { GitHubComment } from "alchemy/github";
import { CloudflareStateStore } from "alchemy/state";
import { D1Database, Nuxt } from "alchemy/cloudflare";

// Initialize Alchemy - stage comes from CLI: --stage prod, --stage pr-123, etc.
const app = await alchemy("fruitcards", {
  password: process.env.ALCHEMY_PASSWORD || process.env.ALCHEMY_SECRET_PASSWORD,
  // Use local filesystem for development, cloud for production
  stateStore: process.env.NODE_ENV === "production"
    ? (scope) => new CloudflareStateStore(scope)
    : undefined // Uses default FileSystemStateStore
});

// Create D1 Database for the application with migrations
export const db = await D1Database("fruitcards-db", {
  name: `fruitcards-${app.stage}-db`,
  adopt: true,
  migrationsDir: "./migrations",
  dev: {
    remote: true, // Use deployed remote database instead of local emulation
  },
});

// Ensure database is ready before starting the app
console.log("Initializing database resources...");
await Promise.resolve(db);
console.log("Database resources ready!");

export const worker = await Nuxt("fruitcards", {
  name: `fruitcards-${app.stage}`,
  adopt: true,
  placement: { mode: "smart" },
  observability: { enabled: true },
  domains: app.stage === "prod" ? ["fruit.cards"] : undefined,
  bindings: {
    DB: db,
  },
  dev: {
    command: "nuxt dev",
  },
});

console.log({
  url: worker.url,
});


if (process.env.PULL_REQUEST) {
  const previewUrl = worker.url;

  await GitHubComment("pr-preview-comment", {
    owner: process.env.GITHUB_REPOSITORY_OWNER || "Butch78",
    repository: process.env.GITHUB_REPOSITORY_NAME || "fruitcards",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `
## 🚀 Preview Deployed

Your preview is ready!

**Preview URL:** ${previewUrl}

This preview was built from commit ${process.env.GITHUB_SHA}

---
<sub>🤖 This comment will be updated automatically when you push new commits to this PR.</sub>`,
  });
}

await app.finalize();
