<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import type { Fixture, MatchEvent } from '$lib/types';
  import FootballGameWidget from '$lib/FootballGameWidget.svelte';

  let fixture: Fixture | null = null;
  let events: MatchEvent[] = [];

  function goBack() {
    goto('/');
  }

  onMount(async () => {
    const matchId = $page.params.id;
    await fetchMatchDetails(matchId);
    await fetchMatchEvents(matchId);
  });

  async function fetchMatchDetails(matchId: string) {
    const { data, error } = await supabase
      .from('fixtures')
      .select(`
        id,
        status:statuses(long, short, elapsed),
        home_team:teams!fixtures_home_team_id_fkey(id, name, logo),
        away_team:teams!fixtures_away_team_id_fkey(id, name, logo),
        home_score:scores(current:current_home, ht:halftime_home, ft:fulltime_home, et:extratime_home),
        away_score:scores(current:current_away, ht:halftime_away, ft:fulltime_away, et:extratime_away),
        league:leagues(name, country)
      `)
      .eq('id', matchId)
      .single();

    if (error) console.error('Error fetching match details:', error);
    else fixture = data;
  }

  async function fetchMatchEvents(matchId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('fixture_id', matchId)
      .order('time_elapsed', { ascending: true });

    if (error) console.error('Error fetching match events:', error);
    else events = data;
  }

  function getEventIcon(type: string) {
    switch (type.toLowerCase()) {
      case 'goal': return '⚽';
      case 'card': return '🟨';
      case 'subst': return '🔄';
      default: return '•';
    }
  }

  function formatSubstitution(event: MatchEvent) {
    const inPlayer = event.player_name;
    const outPlayer = event.assist_name; // In substitutions, the 'assist_name' field is used for the player going out
    return `${inPlayer} in, ${outPlayer} out`;
  }

  function getTeamLogo(event: MatchEvent): string {
    return event.team_id === fixture.home_team.id
      ? fixture.home_team.logo
      : fixture.away_team.logo;
  }

  function getTeamName(event: MatchEvent): string {
    return event.team_id === fixture.home_team.id
      ? fixture.home_team.name
      : fixture.away_team.name;
  }

  $: homeScore = fixture?.home_score.current ?? fixture?.home_score.et ?? fixture?.home_score.ft ?? fixture?.home_score.ht ?? 0;
  $: awayScore = fixture?.away_score.current ?? fixture?.away_score.et ?? fixture?.away_score.ft ?? fixture?.away_score.ht ?? 0
</script>

<div class="container mx-auto px-4 py-8">
  <button on:click={goBack} class="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    ← Back to All Matches
  </button>

  {#if fixture}
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-gray-100 p-4">
        <h1 class="text-2xl font-bold text-center">{fixture.league.name}</h1>
        <p class="text-center text-gray-600">{fixture.league.country}</p>
      </div>

      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <div class="text-center w-1/3">
            <img src={fixture.home_team.logo} alt={fixture.home_team.name} class="w-16 h-16 mx-auto mb-2" />
            <h2 class="font-semibold">{fixture.home_team.name}</h2>
          </div>
          <div class="text-center w-1/3">
            <p class="text-3xl font-bold">
              {homeScore} - {awayScore}
            </p>
            <p class="text-sm text-gray-600">{fixture.status.long} ({fixture.status.elapsed}')</p>
          </div>
          <div class="text-center w-1/3">
            <img src={fixture.away_team.logo} alt={fixture.away_team.name} class="w-16 h-16 mx-auto mb-2" />
            <h2 class="font-semibold">{fixture.away_team.name}</h2>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <h3 class="text-xl font-semibold p-4 bg-gray-100">Match Events</h3>
      <div class="p-4">
        {#each events as event}
          <div class="flex items-center mb-2 {event.team_id === fixture.home_team.id ? 'justify-start' : 'justify-end'}">
            {#if event.team_id === fixture.home_team.id}
              <img src={getTeamLogo(event)} alt={getTeamName(event)} class="w-6 h-6 mr-2" />
              <span class="mr-2">{event.time_elapsed}'</span>
              <span class="mr-2" aria-hidden="true">{getEventIcon(event.type)}</span>
              <span>
                {#if event.type.toLowerCase() === 'subst'}
                  {formatSubstitution(event)}
                {:else}
                  {event.player_name}
                  {#if event.assist_name}
                    (Assist: {event.assist_name})
                  {/if}
                {/if}
              </span>
            {:else}
              <span>
                {#if event.type.toLowerCase() === 'subst'}
                  {formatSubstitution(event)}
                {:else}
                  {event.player_name}
                  {#if event.assist_name}
                    (Assist: {event.assist_name})
                  {/if}
                {/if}
              </span>
              <span class="ml-2" aria-hidden="true">{getEventIcon(event.type)}</span>
              <span class="ml-2">{event.time_elapsed}'</span>
              <img src={getTeamLogo(event)} alt={getTeamName(event)} class="w-6 h-6 ml-2" />
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="mt-8">
      <FootballGameWidget matchId={$page.params.id} />
    </div>
  {:else}
    <p class="text-center text-xl">Loading match details...</p>
  {/if}
</div>