<script context="module">
const OrderedList = require("./OrderedList.svelte").default;
</script>

<script>
export let topItems;
export let midItems;
export let bottomItems;
</script>

<style>
#test-inner {
  font-family: monospace;
  font-size: 12px;
}

.num-box {
  padding: 0.3rem 0.6rem;
  margin-bottom: 0.3rem;
}

#top {
  background-color: rgba(200, 0, 0, 0.1);
}

#mid {
  background-color: rgba(0, 200, 0, 0.1);
}

#bottom {
  background-color: rgba(0, 0, 200, 0.1);
}
</style>

<div id="test-inner">
  <img src="/svelte-logo-horizontal.svg" alt="svelte logo">
  <p><small>If you open the console you should notice that the client
  loads after 1sec and there should be no visible difference.</small></p>
  <div id="top" class="num-box">
    <p>top items</p>
    <OrderedList items={topItems}/>
  </div>
  <div id="mid" class="num-box">
    <p>mid items</p>
    <OrderedList items={midItems}/>
  </div>
  <div id="bottom" class="num-box">
    <p>bottom items</p>
    <OrderedList items={bottomItems}/>
  </div>
</div>
