<!--
  @component
  Generates an SVG radar chart.
 -->
<script>
  import { getContext } from 'svelte';
  import { line, curveLinearClosed } from 'd3-shape';

  const { data, width, height, xGet, config } = getContext('LayerCake');

  /**  @type {String} [fill='#f0c'] The radar's fill color. */
  export let fill = '#f0c';

  /**  @type {String} [stroke='#f0c'] The radar's stroke color. */
  export let stroke = '#f0c';

  /**  @type {Number} [strokeWidth=2] The radar's stroke width. */
  export let strokeWidth = 2;

  /**  @type {Number} [fillOpacity=0.5] The radar's fill opacity. */
  export let fillOpacity = 0.5;

  /**  @type {Object} [paddleData=null] Individual paddle data. */
  export let paddleData = null;

  $: angleSlice = (Math.PI * 2) / $config.x.length;

  $: path = line()
    .curve(curveLinearClosed)
    .x((d, i) => d * Math.cos(angleSlice * i - Math.PI / 2))
    .y((d, i) => d * Math.sin(angleSlice * i - Math.PI / 2));
</script>

<g transform="translate({$width / 2}, {$height / 2})">
  {#if paddleData}
    {@const xVals = $xGet(paddleData)}
    <path
      class="path-line"
      d={path(xVals)}
      {stroke}
      stroke-width={strokeWidth}
      {fill}
      fill-opacity={fillOpacity}
    />
  {:else}
    {#each $data as row}
      {@const xVals = $xGet(row)}
      <path
        class="path-line"
        d={path(xVals)}
        {stroke}
        stroke-width={strokeWidth}
        {fill}
        fill-opacity={fillOpacity}
      />
    {/each}
  {/if}
</g>

<style>
  .path-line {
    stroke-linejoin: round;
    stroke-linecap: round;
  }
</style>
