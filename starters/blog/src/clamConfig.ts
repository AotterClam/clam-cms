import {
  AssetsAssetServer,
  D1DatabaseDriver,
  D1SessionRepository,
  KvCacheBinding,
  StubOAuthVerifier,
  type CmsConfig,
} from "@aotterclam/clam-cms-cloudflare";
import { handlers } from "./handlers/index.js";
import { loadManifests } from "./loadManifests.js";
import { buildTemplates } from "./templates/index.js";

/**
 * `Env` shape. Wrangler typegen would normally produce this — for the
 * starter we hand-author it to keep dependencies thin.
 */
export interface Env {
  readonly DB: D1Database;
  readonly KV: KVNamespace;
  readonly ASSETS?: Fetcher;
  readonly CLAM_ALLOW_STUB_OAUTH?: string;
}

/**
 * Build the per-isolate `CmsConfig` from the worker's `env` bindings.
 * The starter calls this once at module-init time inside `index.ts`
 * (under the `let runtimeRef` guard) so the runtime + decorator
 * chain is built once per isolate.
 */
export function buildCmsConfig(env: Env): CmsConfig {
  return {
    manifests: loadManifests(),
    handlers,
    templates: buildTemplates(),
    siteDefaults: {
      brand: "Clam Blog",
      title: "Clam Blog",
      description: "Reference starter for clam-cms — localized posts + contact form.",
      origin: "https://example.com",
      locales: ["en", "zh-TW"],
    },
    bindings: {
      db: new D1DatabaseDriver(env.DB),
      kv: new KvCacheBinding(env.KV),
      sessions: new D1SessionRepository(env.DB),
      assets: env.ASSETS
        ? new AssetsAssetServer(env.ASSETS)
        : { fetch: async () => null },
      oauth: new StubOAuthVerifier({ CLAM_ALLOW_STUB_OAUTH: env.CLAM_ALLOW_STUB_OAUTH }),
    },
  };
}
