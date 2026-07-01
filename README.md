# Todo List - Deno Desktop

A native desktop application built with Deno Desktop and Webview.

## Development

```sh
deno task dev
```

## Build

```sh
deno task build
```

## Known Issues

- **macOS Minimize Bug**: In the current experimental version of Deno Desktop, clicking the Dock icon does not restore a minimized window. To unminimize, right-click the application icon in the Dock and select the window name ("Todo List").
