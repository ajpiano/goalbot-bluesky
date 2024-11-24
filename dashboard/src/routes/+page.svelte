<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
  
    let fixtures = [];
  
    async function getActiveFixtures() {
      const { data, error } = await supabase
        .from('fixtures')
        .select(`
          id,
          status:statuses(long, short, elapsed),
          home_team:teams!fixtures_home_team_id_fkey(name),
          away_team:teams!fixtures_away_team_id_fkey(name),
          home_score:scores(ht:halftime_home, ft:fulltime_home, et:extratime_home),
          away_score:scores(ht:halftime_away, ft:fulltime_away, et:extratime_away),
          league:leagues(name, country)
        `);
  
      if (error) console.error('Error fetching fixtures:', error);
      else fixtures = data;
    }
  
    onMount(() => {
      getActiveFixtures();
      const interval = setInterval(getActiveFixtures, 60000); // Refresh every minute
      return () => clearInterval(interval);
    });
  </script>
  
  <main>
    <h1>Active Fixtures</h1>
    {#each fixtures as fixture}
      <div class="fixture">
        <h2>{fixture.home_team.name} vs {fixture.away_team.name}</h2>
        <p class="league-info">{fixture.league.name} ({fixture.league.country})</p>
        <p>Status: {fixture.status.long} ({fixture.status.elapsed}')</p>
        <p>Score: {fixture.home_score.ft ?? fixture.home_score.ht ?? 0} - {fixture.away_score.ft ?? fixture.away_score.ht ?? 0}</p>
      </div>
    {/each}
  </main>
  
  <style>
    .fixture {
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 10px;
    }
    .league-info {
      font-style: italic;
      color: #666;
    }
  </style>