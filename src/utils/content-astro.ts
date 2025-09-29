// scripts/fetchDatoSnapshot.ts
import fs from "fs-extra";
import path from "path";
import { buildClient } from "@datocms/cma-client-node";

const SNAPSHOT_DIR = path.join(process.cwd(), "content-snapshot");

interface FetchOptions {
  slug?: string;
  locale?: string;
  filters?: Record<string, any>;
}

/**
 * Fetches content from DatoCMS and stores it as a local JSON snapshot
 */
export async function fetchDatoSnapshot(options: FetchOptions = {}) {
  const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN! });

  // Ensure clean snapshot directory
  await fs.remove(SNAPSHOT_DIR);
  await fs.ensureDir(SNAPSHOT_DIR);

  // Example queries – customize based on your models
  const nav = await client.items.list({ filter: { type: "navigation" }, version: "published" });
  const pages = await client.items.list({
    filter: {
      type: "page",
      ...(options.slug ? { fields: { slug: { eq: options.slug } } } : {}),
      ...(options.filters || {}),
    },
    version: "published",
    ...(options.locale ? { locale: options.locale } : {}),
  });

  // Write snapshot files
  await fs.writeJSON(path.join(SNAPSHOT_DIR, "navigation.json"), nav, { spaces: 2 });
  await fs.writeJSON(path.join(SNAPSHOT_DIR, "pages.json"), pages, { spaces: 2 });

  console.log(`✅ Snapshot written to ${SNAPSHOT_DIR}`);
}

// Allow script execution directly via `ts-node` or npm script
if (require.main === module) {
  fetchDatoSnapshot()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Error fetching DatoCMS snapshot:", err);
      process.exit(1);
    });
}

// lib/content.ts
import fs from "fs";
import path from "path";

const SNAPSHOT_DIR = path.join(process.cwd(), "content-snapshot");

export function getNavigation() {
  const file = path.join(SNAPSHOT_DIR, "navigation.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getPages() {
  const file = path.join(SNAPSHOT_DIR, "pages.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getPageBySlug(slug: string, locale?: string) {
  const pages = getPages();
  return pages.find((p: any) => p.slug === slug && (!locale || p.locale === locale));
}

// scripts/fetchDatoSnapshot.ts
import fs from "fs-extra";
import path from "path";
import { GraphQLClient } from "graphql-request";
import {
  NAVIGATION_QUERY,
  HOMEPAGE_QUERY,
  ABOUT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  BLOGS_QUERY,
  SINGLE_BLOG_QUERY,
} from "./queries";

const SNAPSHOT_DIR = path.join(process.cwd(), "content-snapshot");
const DATOCMS_API_URL = "https://graphql.datocms.com/";

const client = new GraphQLClient(DATOCMS_API_URL, {
  headers: {
    authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
  },
});

const LOCALES: Array<"en" | "en_IE"> = ["en", "en_IE"];

export async function fetchDatoSnapshot() {
  await fs.remove(SNAPSHOT_DIR);
  await fs.ensureDir(SNAPSHOT_DIR);

  for (const locale of LOCALES) {
    const localeDir = path.join(SNAPSHOT_DIR, locale);
    await fs.ensureDir(localeDir);

    // Navigation
    const nav = await client.request(NAVIGATION_QUERY, { locale });
    await fs.writeJSON(path.join(localeDir, "navigation.json"), nav, { spaces: 2 });

    // Homepage
    const homepage = await client.request(HOMEPAGE_QUERY, { locale });
    await fs.writeJSON(path.join(localeDir, "homepage.json"), homepage, { spaces: 2 });

    // About
    const about = await client.request(ABOUT_PAGE_QUERY, { locale });
    await fs.writeJSON(path.join(localeDir, "about.json"), about, { spaces: 2 });

    // Contact
    const contact = await client.request(CONTACT_PAGE_QUERY, { locale });
    await fs.writeJSON(path.join(localeDir, "contact.json"), contact, { spaces: 2 });

    // Blog list (with pagination)
    const pageSize = 10;
    let offset = 0;
    let allBlogs: any[] = [];
    let hasMore = true;

    while (hasMore) {
      const blogs = await client.request(BLOGS_QUERY, { locale, limit: pageSize, offset });
      allBlogs = [...allBlogs, ...blogs.allBlogs];
      offset += pageSize;
      hasMore = offset < blogs._allBlogsMeta.count;
    }

    await fs.writeJSON(path.join(localeDir, "blogs.json"), allBlogs, { spaces: 2 });

    // Fetch individual blogs
    for (const blog of allBlogs) {
      const blogData = await client.request(SINGLE_BLOG_QUERY, {
        slug: blog.slug,
        locale,
      });
      await fs.writeJSON(path.join(localeDir, `blog-${blog.slug}.json`), blogData, { spaces: 2 });
    }
  }

  console.log("✅ Snapshot generated at:", SNAPSHOT_DIR);
}

// run directly
if (require.main === module) {
  fetchDatoSnapshot()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Error fetching snapshot:", err);
      process.exit(1);
    });
}


const chunks = [];
for (let i = 0; i < allSlugs.length; i += 50) {
  chunks.push(allSlugs.slice(i, i + 50));
}

for (const group of chunks) {
  await Promise.all(
    group.map(async ({ slug }) => {
      const { blog } = await client.request(BLOG_BY_SLUG_QUERY, { slug, locale });
      await fs.writeJSON(
        path.join(localeDir, `${slug}.json`),
        blog,
        { spaces: 2 }
      );
    })
  );
}


