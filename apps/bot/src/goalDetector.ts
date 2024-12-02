import supabase from './db.js';

interface EventPayload {
  new: {
    id: number;
    time_elapsed: number;
    time_extra: number | null;
    team_id: number;
    player_name: string | null;
    assist_name: string | null;
    type: string;
    detail: string;
    comments: string | null;
    fixture_id: number;
  };
}

function isGoalEvent(event: EventPayload['new']) {
  return event.type.toLowerCase() === 'goal';
}

export function subscribeToGoals(onGoalScored: (fixtureId: number, team: string, player: string | null, time: number, assistedBy: string | null, homeScore: number, awayScore: number) => void) {
  const handleEventChanges = async (payload: EventPayload) => {
    console.log('Event change:', payload.new);
    if (isGoalEvent(payload.new)) {
      const { fixture_id, team_id, player_name, time_elapsed, assist_name } = payload.new;
      
      // Fetch the updated score from the database
      const { data: fixture, error } = await supabase
        .from('fixtures')
        .select(`
          home_team:teams!fixtures_home_team_id_fkey(id, name),
          away_team:teams!fixtures_away_team_id_fkey(id, name),
          home_score:scores(current:current_home),
          away_score:scores(current:current_away)
        `)
        .eq('id', fixture_id)
        .single();

      if (error) {
        console.error('Error fetching fixture details:', error);
        return;
      }

      const homeScore = fixture.home_score.current ?? 0;
      const awayScore = fixture.away_score.current ?? 0;
      const team = team_id === fixture.home_team.id ? fixture.home_team.name : fixture.away_team.name;

      onGoalScored(fixture_id, team, player_name, time_elapsed, assist_name, homeScore, awayScore);
    }
  }

  const channel = supabase.channel('events')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'events' },
      handleEventChanges
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'events' },
      handleEventChanges
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}