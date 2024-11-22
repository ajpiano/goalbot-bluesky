import supabase from './db.js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LiveFixtureResponse } from './types'; // Adjust the path as necessary

class LiveFixtureProcessor {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async processFixtures(data: LiveFixtureResponse) {
    await this.deleteOldFixtures(data);
    for (const item of data) {
      try {
        await this.insertFixture(item);
      } catch (error) {
        console.error(`Failed to process fixture ${item.fixture.id}:`, error);
      }
    }
  }

  private async deleteOldFixtures(data: LiveFixtureResponse) {
    const currentFixtureIds = data.map(item => item.fixture.id);
    const { error } = await this.supabase
      .from('fixtures')
      .delete()
      .not('id', 'in', `(${currentFixtureIds.join(', ')})`);

    if (error) {
      console.error('Error deleting old fixtures:', error);
    } else {
      console.log('Old fixtures deleted successfully');
    }
  }

  private async insertFixture(item: LiveFixtureResponse['response'][0]) {
    const { fixture, league, teams, goals, score, events } = item;
    
    // Insert league
    const { error: leagueError } = await this.supabase.from('leagues').upsert({
      id: league.id,
      name: league.name,
      country: league.country,
      logo: league.logo,
      flag: league.flag,
      season: league.season,
      round: league.round
    });
    if (leagueError) throw leagueError;

    // Insert teams
    const { error: teamsError } = await this.supabase.from('teams').upsert([
      {
        id: teams.home.id,
        name: teams.home.name,
        logo: teams.home.logo,
        winner: teams.home.winner
      },
      {
        id: teams.away.id,
        name: teams.away.name,
        logo: teams.away.logo,
        winner: teams.away.winner
      }
    ]);
    if (teamsError) throw teamsError;

    // Insert venue
    if (fixture.venue.id) {
      const { error: venueError } = await this.supabase.from('venues').upsert({
        id: fixture.venue.id,
        name: fixture.venue.name,
        city: fixture.venue.city
      });
      if (venueError) throw venueError;
    }

    // Insert status
    const { error: statusError } = await this.supabase.from('statuses').upsert({
      id: fixture.id, // Using fixture.id as status.id
      long: fixture.status.long,
      short: fixture.status.short,
      elapsed: fixture.status.elapsed,
      extra: fixture.status.extra
    });
    if (statusError) throw statusError;

    // Insert score
    const { error: scoreError } = await this.supabase.from('scores').upsert({
      id: fixture.id,
      halftime_home: score.halftime.home,
      halftime_away: score.halftime.away,
      fulltime_home: score.fulltime.home,
      fulltime_away: score.fulltime.away,
      extratime_home: score.extratime.home,
      extratime_away: score.extratime.away,
      penalty_home: score.penalty.home,
      penalty_away: score.penalty.away
    });
    if (scoreError) throw scoreError;

    // Insert fixture
    const { error: fixtureError } = await this.supabase.from('fixtures').upsert({
      id: fixture.id,
      referee: fixture.referee,
      timezone: fixture.timezone,
      date: fixture.date,
      timestamp: fixture.timestamp,
      venue_id: fixture.venue.id,
      status_id: fixture.id,
      league_id: league.id,
      home_team_id: teams.home.id,
      away_team_id: teams.away.id,
      score_id: fixture.id
    });
    if (fixtureError) throw fixtureError;

    // Insert events
    if (events.length > 0) {
      const { error: eventTrunctationError } = await this.supabase.from('events').delete().eq('fixture_id', fixture.id);
      if (eventTrunctationError) throw eventTrunctationError;
      const { error: eventsError } = await this.supabase.from('events').upsert(
        events.map(event => ({
          time_elapsed: event.time.elapsed,
          time_extra: event.time.extra,
          team_id: event.team.id,
          player_name: event.player?.name,
          assist_name: event.assist?.name,
          type: event.type,
          detail: event.detail,
          comments: event.comments,
          fixture_id: fixture.id
        }))
      );
      if (eventsError) throw eventsError;
    }
  }
}

// Usage
const processor = new LiveFixtureProcessor();

// Fetch and process fixtures
export async function processFeed(feed: LiveFixtureResponse) {
  await processor.processFixtures(feed);
}