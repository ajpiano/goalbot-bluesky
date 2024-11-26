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

export function subscribeToGoals(onGoalScored: (fixtureId: number, team: string, player: string | null, time: number, assistedBy: string | null) => void) {
  const handleEventChanges = (payload: EventPayload) => {
    console.log('Event change:', payload.new);
    if (isGoalEvent(payload.new)) {
      const { fixture_id, team_id, player_name, time_elapsed, assist_name } = payload.new;
      const team = team_id.toString(); // You might want to map this to 'home' or 'away' based on the fixture data
      onGoalScored(fixture_id, team, player_name, time_elapsed, assist_name);
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