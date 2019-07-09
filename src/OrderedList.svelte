<script context="module">
const ListItem = require("./ListItem.svelte").default;
</script>

<script>
export let items;
</script>

<ol>
  {#each items as item}
    <ListItem title={item}/>
  {/each}
</ol>
