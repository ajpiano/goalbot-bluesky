<script lang="ts">
  import type { Fixture } from './types';
  import MatchCard from './MatchCard.svelte';

  export let fixtures: Fixture[] = [];
</script>

<div class="match-visualizer">
  {#each fixtures as fixture (fixture.id)}
    <MatchCard {fixture} />
  {/each}
</div>

<style>
  .match-visualizer {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
    padding: 0.75rem;
  }
</style>