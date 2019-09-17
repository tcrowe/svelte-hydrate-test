const path = require("path");
const express = require("express");
const nocache = require("nocache");
const server = express();
const noop = function() {};
const { PORT, HOST } = process.env;
const port = PORT || 12998;
const host = HOST || "127.0.0.1";
const staticPath = path.join(__dirname, "..", "dist");
let httpServer;

// get the svelte app for use in `render`
const unregisterSvelte = require("svelte/register");
const App = require("./App.svelte").default;
unregisterSvelte();

/**
 * Try to gracefully bind to the host and port and give the URL
 * @method listening
 * @param {object} [err]
 */
function listening(err) {
  if (err !== undefined && err !== null) {
    const { message, stack } = err;
    console.error("error binding http server");
    console.log("port", port);
    console.log("host", host);
    console.log("message", message);
    console.log("stack", stack);
    return;
  }

  console.log(`listening http://${host}:${port}`);
}

/**
 * Close the HTTP server so it doesn't annoyingly stay open
 * @method stop
 * @param {number} code
 */
function stop(code = 0) {
  if (httpServer !== undefined) {
    try {
      httpServer.close();
    } catch (err) {
      console.error("error closing http server", err);
      code = 1;
    }
  }

  process.exit(code);
}

/**
 * A random number stringified
 * @method random
 * @returns {string}
 */
const random = () =>
  Math.random()
    .toString()
    .substring(2);

function randomProps() {
  const props = {
    topItems: [],
    midItems: [],
    bottomItems: []
  };

  for (let index = 0; index < 10; index += 1) {
    props.topItems.push(random());
    props.midItems.push(random());
    props.bottomItems.push(random());
  }

  return props;
}

/**
 * Render the Svetle App and send the output HTML to the client
 * @method render
 * @param {object} req
 * @param {object} res
 */
function render(req, res) {
  const uri = req.pathname;
  let props = randomProps();
  const { head, html, css } = App.render(props);
  let headStyle = "";

  if (css !== undefined && css.code !== undefined) {
    headStyle = `<style>${css.code}</style>`;
  }

  props = JSON.stringify(props);
  props = Buffer.from(props, "utf8").toString("base64");

  let op = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>svelte-hydrate-test</title>
  ${headStyle}
</head>
<body>
<div id="test-outer">${html}</div>
<template id="props">${props}</template>
<script src="/index.js"></script>
</body>
</html>
  `;

  op = op.trim();

  res
    .status(200)
    .type("html")
    .end(op);
}

// disable and tweak express settings
server
  .disable("x-powered-by")
  .disable("etag")
  .enable("case sensitive routing")
  .enable("strict routing")
  .set("query parser", "simple")
  .use(nocache());

// disable express' caching on the static handler
server.use(
  express.static(staticPath, {
    etag: false,
    lastModified: false,
    setHeaders: res => nocache(null, res, noop)
  })
);

server.use(
  express.static(__dirname, {
    etag: false,
    lastModified: false,
    setHeaders: res => nocache(null, res, noop)
  })
);

// all URLs goto render
server.get("*", render);

// listen / bind
httpServer = server.listen(port, host, listening);

// graceful shutdown
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("SIGHUP", stop);
process.on(
  "unhandledException",
  err => console.error("unhandledException", err) && stop(1)
);
