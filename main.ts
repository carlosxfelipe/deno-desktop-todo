import { serveDir } from "@std/http/file-server";

// In dev mode (--hmr), the working directory is the project root, so "src" exists.
// In build mode (.app bundle), we use import.meta.dirname to access the embedded files.
let fsRoot = "src";
try {
  Deno.statSync(fsRoot);
} catch {
  fsRoot = `${import.meta.dirname}/src`;
}

const server = Deno.serve({ port: 0, hostname: "127.0.0.1" }, (req) => {
  return serveDir(req, { fsRoot });
});

const win = new Deno.BrowserWindow({
  title: "Todo List",
  width: 400,
  height: 560,
  transparentTitlebar: true,
});

// Force the window to the front on macOS
win.setAlwaysOnTop(true);
setTimeout(() => win.setAlwaysOnTop(false), 200);

win.navigate(`http://127.0.0.1:${server.addr.port}/index.html`);

// Handle window close
win.onclose = () => {
  Deno.exit(0);
};

// Configure application menu to let macOS natively handle minimize/restore
win.setApplicationMenu([
  {
    submenu: {
      label: "Window",
      items: [
        { item: { label: "Minimize", role: "minimize", enabled: true } },
        { item: { label: "Close", role: "close", enabled: true } },
      ],
    },
  },
  // deno-lint-ignore no-explicit-any
] as any);
