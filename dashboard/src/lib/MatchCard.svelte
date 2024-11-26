<script lang="ts">
  import { goto } from '$app/navigation';
  import type { Fixture, MatchEvent } from './types';

  export let fixture: Fixture;
  export let events: MatchEvent[] = [];

  $: homeScore = fixture.home_score.current ?? fixture.home_score.et ?? fixture.home_score.ft ?? fixture.home_score.ht ?? 0;
  $: awayScore = fixture.away_score.current ?? fixture.away_score.et ?? fixture.away_score.ft ?? fixture.away_score.ht ?? 0;

  function handleClick() {
    goto(`/match/${fixture.id}`);
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
    const outPlayer = event.assist_name;
    return `${inPlayer} in, ${outPlayer} out`;
  }
</script>

<button class="match-card" on:click={handleClick} aria-label="View match details for {fixture.home_team.name} vs {fixture.away_team.name}">
  <div class="league-info">
    {fixture.league.name}, {fixture.league.country}
  </div>
  <div class="teams">
    <div class="team home">
      <img src={fixture.home_team.logo} alt="" class="team-logo" />
      <span class="team-name">{fixture.home_team.name}</span>
    </div>
    <div class="score" aria-label="Score: {homeScore} to {awayScore}">
      {homeScore} - {awayScore}
    </div>
    <div class="team away">
      <img src={fixture.away_team.logo} alt="" class="team-logo" />
      <span class="team-name">{fixture.away_team.name}</span>
    </div>
  </div>
  <div class="match-status">
    {fixture.status.long} ({fixture.status.elapsed}')
  </div>
</button>


<style>
  .match-card {
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    width: 220px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: transform 0.1s ease-in-out;
  }

  .match-card:hover {
    transform: scale(1.05);
  }

  .league-info {
    font-size: 0.7rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .teams {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  .team {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
  }

  .team-logo {
    width: 30px;
    height: 30px;
    object-fit: contain;
    margin-bottom: 0.15rem;
  }

  .team-name {
    font-size: 0.75rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .score {
    font-size: 1rem;
    font-weight: bold;
  }

  .match-status {
    font-size: 0.7rem;
    color: #666;
    text-align: center;
  }
</style>