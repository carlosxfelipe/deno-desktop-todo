# Todo List - Deno Desktop

A native desktop application built with Deno Desktop and Webview.

![App Preview](assets/preview.png)

## Development

```sh
deno task dev
```

## Build

```sh
deno task build
```

### Running on Linux (Post-Build)

The build process generates a standalone bundle folder (`TodoList/`). You can
run the application by executing the startup script via terminal:

```sh
cd TodoList
./TodoList
```

### Packaging for Linux (AppImage)

To generate a standalone `.AppImage` file for distribution, run the packaging
script after building:

```sh
deno task build:linux
```

This will create a `TodoList-x86_64.AppImage` file in your root directory.

## Known Issues

- **macOS Minimize Bug**: In the current experimental version of Deno Desktop,
  clicking the Dock icon does not restore a minimized window, making it
  unrecoverable without restarting the application.
