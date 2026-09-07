import fs from "node:fs/promises";
import path from "node:path";

const MEMBERS_PATH = "data/members.json";
const OUTPUT_DIR = "assets/images/placeholders";
const SIZE = 256;

const PALETTE = [
  "#10141F", // fabric
  "#F5F6F8", // paper
  "#5B6478", // wire
  "#D6A93B", // quorum
  "#2FA6A6", // link
  "#C0533E", // fault
];

function memberSlug(name) {
  return String(name || "")
    .normalize("NFKD")
    .replace(/^(prof\.?|dr\.?|professor)\s+/i, "")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashSeed(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = seed || 1;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function trianglePoints(cx, cy, radius, rotationDeg) {
  const points = [];
  for (let i = 0; i < 3; i += 1) {
    const angle = ((rotationDeg + i * 120) * Math.PI) / 180;
    points.push([
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
    ]);
  }
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function diamondPoints(cx, cy, radius, rotationDeg) {
  const points = [];
  for (let i = 0; i < 4; i += 1) {
    const angle = ((rotationDeg + i * 90) * Math.PI) / 180;
    points.push([
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
    ]);
  }
  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function renderIdenticon(seed) {
  const rng = createRng(hashSeed(seed));
  const bg = pick(rng, PALETTE);
  const accent = pick(rng, PALETTE.filter((color) => color !== bg));
  const highlight = pick(rng, PALETTE.filter((color) => color !== bg && color !== accent));

  const shapes = [];
  const grid = 4;
  const cell = SIZE / grid;

  for (let row = 0; row < grid; row += 1) {
    for (let col = 0; col < Math.ceil(grid / 2); col += 1) {
      if (rng() < 0.42) continue;
      const mirrorCol = grid - col - 1;
      const color = rng() < 0.55 ? accent : highlight;
      const opacity = 0.35 + rng() * 0.55;
      for (const xCol of new Set([col, mirrorCol])) {
        const x = xCol * cell;
        const y = row * cell;
        if (rng() < 0.5) {
          shapes.push(
            `<rect x="${x + 6}" y="${y + 6}" width="${cell - 12}" height="${cell - 12}" fill="${color}" opacity="${opacity.toFixed(2)}" />`,
          );
        } else {
          shapes.push(
            `<polygon points="${diamondPoints(x + cell / 2, y + cell / 2, cell * 0.34, rng() * 360)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`,
          );
        }
      }
    }
  }

  const overlays = [];
  const overlayCount = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < overlayCount; i += 1) {
    const cx = 40 + rng() * (SIZE - 80);
    const cy = 40 + rng() * (SIZE - 80);
    const radius = 26 + rng() * 48;
    const color = pick(rng, PALETTE);
    const opacity = 0.18 + rng() * 0.28;
    if (rng() < 0.5) {
      overlays.push(
        `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`,
      );
    } else {
      overlays.push(
        `<polygon points="${trianglePoints(cx, cy, radius, rng() * 360)}" fill="${color}" opacity="${opacity.toFixed(2)}" />`,
      );
    }
  }

  const lineCount = 3 + Math.floor(rng() * 4);
  const lines = [];
  for (let i = 0; i < lineCount; i += 1) {
    const x1 = rng() * SIZE;
    const y1 = rng() * SIZE;
    const x2 = rng() * SIZE;
    const y2 = rng() * SIZE;
    lines.push(
      `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${highlight}" stroke-opacity="${(0.12 + rng() * 0.18).toFixed(2)}" stroke-width="${(1 + rng() * 2).toFixed(1)}" />`,
    );
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}" role="img" aria-hidden="true">`,
    `<rect width="${SIZE}" height="${SIZE}" fill="${bg}" />`,
    ...lines,
    ...shapes,
    ...overlays,
    "</svg>",
    "",
  ].join("\n");
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const members = JSON.parse(await fs.readFile(MEMBERS_PATH, "utf8"));
  if (!Array.isArray(members)) {
    throw new Error(`${MEMBERS_PATH} must be a JSON array.`);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let created = 0;
  let skipped = 0;

  for (const member of members) {
    const photo = String(member?.photo || "").trim();
    if (photo) continue;

    const slug = memberSlug(member?.name || "");
    if (!slug) {
      console.warn(`Skipping member without a slug: ${member?.name || "(unknown)"}`);
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${slug}.svg`);
    if (await fileExists(outputPath)) {
      skipped += 1;
      continue;
    }

    const svg = renderIdenticon(slug);
    await fs.writeFile(outputPath, svg, "utf8");
    created += 1;
    console.log(`Created ${outputPath}`);
  }

  console.log(`Placeholders: ${created} created, ${skipped} skipped (already present).`);
}

main().catch((error) => {
  console.error(`Placeholder generation failed: ${error.message}`);
  process.exit(1);
});
