// start.js

const { init, start } = require("./src/lib/server");

(async () => {
  await init();
  start();
})();
