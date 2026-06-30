const win = new Deno.BrowserWindow({
  title: "Todo List",
  width: 400,
  height: 560,
  transparentTitlebar: true,
});

win.navigate(`file://${Deno.cwd()}/index.html`);
