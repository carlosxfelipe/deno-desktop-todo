async function exists(path: string) {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
}

const APP_DIR = "TodoList";
const APPIMAGE_TOOL = "appimagetool";
const APPIMAGE_TOOL_URL =
  "https://github.com/AppImage/appimagetool/releases/download/continuous/appimagetool-x86_64.AppImage";

async function main() {
  console.log("📦 Checking build directory...");
  if (!(await exists(APP_DIR))) {
    console.error(
      `❌ Directory ${APP_DIR} not found. Please run 'deno task build' first.`,
    );
    Deno.exit(1);
  }

  // 1. Download appimagetool if not exists
  if (!(await exists(APPIMAGE_TOOL))) {
    console.log(
      "⬇️ Downloading appimagetool (this only happens on the first run)...",
    );
    const response = await fetch(APPIMAGE_TOOL_URL);
    if (!response.ok) {
      console.error("❌ Failed to download appimagetool.");
      Deno.exit(1);
    }
    const file = await Deno.open(APPIMAGE_TOOL, { write: true, create: true });
    await response.body?.pipeTo(file.writable);
    await Deno.chmod(APPIMAGE_TOOL, 0o755); // Make executable
    console.log("✅ appimagetool downloaded successfully.");
  }

  // 2. Prepare AppDir format
  console.log("🔧 Preparing AppDir structure...");

  // Copy icon
  if (await exists("assets/icon_source.svg")) {
    await Deno.copyFile("assets/icon_source.svg", `${APP_DIR}/AppIcon.svg`);
  } else if (await exists("assets/icon.png")) {
    await Deno.copyFile("assets/icon.png", `${APP_DIR}/AppIcon.png`);
    await Deno.copyFile("assets/icon.png", `${APP_DIR}/TodoList.png`);
  } else {
    console.warn(
      "⚠️ Icon not found at assets/icon_source.svg or assets/icon.png",
    );
  }

  // Create AppRun symlink (Required format for AppImage)
  const appRunPath = `${APP_DIR}/AppRun`;
  if (!(await exists(appRunPath))) {
    // We use a symlink to save space and point to the real binary
    await Deno.symlink("TodoList", appRunPath);
  }

  // 3. Build AppImage
  console.log("🚀 Building AppImage...");
  const command = new Deno.Command(`./${APPIMAGE_TOOL}`, {
    args: ["--appimage-extract-and-run", APP_DIR, "TodoList-x86_64.AppImage"],
    stdout: "inherit",
    stderr: "inherit",
  });

  const { success, code } = await command.output();

  if (success) {
    console.log("🎉 AppImage created successfully: TodoList-x86_64.AppImage");
  } else {
    console.error(`❌ Failed to create AppImage. Exit code: ${code}`);
  }
}

main();
