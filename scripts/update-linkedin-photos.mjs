import fs from "node:fs/promises";

const MEMBERS_PATH = "data/members.json";
const INDEX_PATH = "data/linkedin-photos.json";
const PHOTO_DIR = "assets/images/linkedin";
const UNAVATAR = "https://unavatar.io";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function linkedinUsername(url = "") {
  const raw = String(url || "").trim();
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    const match = parsed.pathname.match(/\/in\/([^/]+)/i);
    return match ? decodeURIComponent(match[1]).replace(/\/+$/, "") : "";
  } catch {
    const match = raw.match(/linkedin\.com\/in\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]).replace(/\/+$/, "") : "";
  }
}

function fileSlug(username) {
  return String(username)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isRealLinkedinPhoto(url = "") {
  const value = String(url || "").toLowerCase();
  if (!value) return false;
  if (value.includes("static.licdn.com") || value.includes("ghost")) return false;
  return value.includes("media.licdn.com") && value.includes("profile-displayphoto");
}

function extensionFor(contentType = "", bytes) {
  const type = String(contentType || "").toLowerCase();
  if (type.includes("png") || bytes[0] === 0x89) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpg";
}

async function readPreviousIndex() {
  try {
    const previous = JSON.parse(await fs.readFile(INDEX_PATH, "utf8"));
    return previous && typeof previous === "object" ? previous : { photos: {} };
  } catch {
    return { photos: {} };
  }
}

async function fetchJson(username) {
  const url = `${UNAVATAR}/linkedin/user:${encodeURIComponent(username)}?json`;
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "DSLab-IUST-linkedin-photos" },
  });
  if (response.status === 404) return { found: false, url: "" };
  if (!response.ok) {
    const err = new Error(`unavatar JSON HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const data = await response.json();
  return { found: Boolean(data?.url), url: String(data?.url || "") };
}

async function downloadPhoto(username) {
  const url = `${UNAVATAR}/linkedin/user:${encodeURIComponent(username)}?fallback=false`;
  const response = await fetch(url, {
    headers: { "User-Agent": "DSLab-IUST-linkedin-photos" },
    redirect: "follow",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const err = new Error(`unavatar image HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 800) return null;
  return {
    buffer,
    ext: extensionFor(response.headers.get("content-type"), buffer),
  };
}

async function main() {
  const members = JSON.parse(await fs.readFile(MEMBERS_PATH, "utf8"));
  if (!Array.isArray(members)) {
    throw new Error(`${MEMBERS_PATH} must be a JSON array.`);
  }

  const previous = await readPreviousIndex();
  const photos = { ...(previous.photos || {}) };
  const alumni = members.filter((member) => member?.leadership === "alumni" && linkedinUsername(member?.linkedin));

  await fs.mkdir(PHOTO_DIR, { recursive: true });
  console.log(`Refreshing LinkedIn photos for ${alumni.length} alumni with profile links ...`);

  for (let i = 0; i < alumni.length; i += 1) {
    const member = alumni[i];
    const username = linkedinUsername(member.linkedin);
    const slug = fileSlug(username);
    process.stdout.write(`[${i + 1}/${alumni.length}] ${member.name} (@${username}) ... `);

    try {
      const meta = await fetchJson(username);
      if (!meta.found || !isRealLinkedinPhoto(meta.url)) {
        delete photos[username];
        console.log("no profile photo");
      } else {
        const image = await downloadPhoto(username);
        if (!image) {
          delete photos[username];
          console.log("empty image");
        } else {
          const publicPath = `${PHOTO_DIR}/${slug}.${image.ext}`;
          await fs.writeFile(publicPath, image.buffer);
          photos[username] = publicPath;
          console.log(`saved ${publicPath} (${image.buffer.length} bytes)`);
        }
      }
    } catch (error) {
      if (photos[username]) {
        console.log(`failed (${error.message}); keeping previous photo`);
      } else {
        console.log(`failed (${error.message})`);
      }
    }

    await sleep(250);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    photos,
    notes: {
      photos: "Cached LinkedIn profile photos for alumni who have a public profile picture. Used in preference to local member photos.",
    },
  };

  await fs.mkdir("data", { recursive: true });
  await fs.writeFile(INDEX_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Done: ${Object.keys(photos).length} alumni LinkedIn photos cached.`);
}

main().catch((error) => {
  console.error(`LinkedIn photo update failed: ${error.message}`);
  process.exit(1);
});
