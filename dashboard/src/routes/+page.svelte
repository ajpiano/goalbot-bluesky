<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import MatchVisualizer from '$lib/MatchVisualizer.svelte';

    let fixtures = [];

    async function getActiveFixtures() {
      const { data, error } = await supabase
        .from('fixtures')
        .select(`
          id,
          status:statuses(long, short, elapsed),
          home_team:teams!fixtures_home_team_id_fkey(name, logo),
          away_team:teams!fixtures_away_team_id_fkey(name, logo),
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
    <MatchVisualizer {fixtures} />
  </main>

  <style>
    main {
    }
  </style>