import { Resvg } from "@resvg/resvg-js";

const SVG_FILE = "icon_source.svg";
const ICONSET_DIR = "icon.iconset";
const ICNS_FILE = "app.icns";

try {
  const svg = Deno.readFileSync(SVG_FILE);

  try {
    Deno.removeSync(ICONSET_DIR, { recursive: true });
  } catch {
    // Ignore if not exists
  }
  Deno.mkdirSync(ICONSET_DIR, { recursive: true });

  const sizes = [
    { name: "icon_16x16.png", size: 16 },
    { name: "icon_16x16@2x.png", size: 32 },
    { name: "icon_32x32.png", size: 32 },
    { name: "icon_32x32@2x.png", size: 64 },
    { name: "icon_128x128.png", size: 128 },
    { name: "icon_128x128@2x.png", size: 256 },
    { name: "icon_256x256.png", size: 256 },
    { name: "icon_256x256@2x.png", size: 512 },
    { name: "icon_512x512.png", size: 512 },
    { name: "icon_512x512@2x.png", size: 1024 },
  ];

  console.log("Generating PNGs directly from SVG (perfect rasterization)...");

  for (const { name, size } of sizes) {
    console.log(`  -> ${name} (${size}x${size})`);
    const resvg = new Resvg(svg, {
      fitTo: { mode: "width", value: size },
      shapeRendering: 2, // 2 is geometricPrecision
    });
    const pngData = resvg.render();
    Deno.writeFileSync(`${ICONSET_DIR}/${name}`, pngData.asPng());
  }

  console.log("Converting to ICNS using iconutil...");
  const command = new Deno.Command("iconutil", {
    args: ["-c", "icns", ICONSET_DIR, "-o", ICNS_FILE],
  });
  const output = command.outputSync();

  if (!output.success) {
    console.error("iconutil failed:", new TextDecoder().decode(output.stderr));
    Deno.exit(1);
  }

  // Clean up
  Deno.removeSync(ICONSET_DIR, { recursive: true });

  console.log(`Success! Created ${ICNS_FILE} with perfect transparency.`);
} catch (err) {
  console.error("Error generating icon:", err);
  Deno.exit(1);
}
