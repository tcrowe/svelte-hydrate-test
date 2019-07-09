const App = require("./App.svelte").default;
const hydrate = true;

function load() {
  const target = document.getElementById("test-outer");
  let props = document.getElementById("props");
  props = props.innerHTML;
  props = atob(props);
  props = JSON.parse(props);
  console.log("props from server", props);
  const app = new App({ target, props, hydrate });
  console.log("loaded");
}

setTimeout(load, 1000);
console.log("loading in 1 sec");
