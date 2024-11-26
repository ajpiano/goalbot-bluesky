import path from 'path';
import fs from 'fs/promises';
import supabase from './db.js';
import { SupabaseClient } from '@supabase/supabase-js';
import { LiveFixtureResponse } from './types';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LiveFixtureProcessor {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  public async processFixtures(fixtures: LiveFixtureResponse['response']) {
    if (fixtures.length === 0) {
      console.log("No live fixtures found. Loading sample data...");
      fixtures = await this.loadSampleData();
    }

    const currentLiveFixtureIds = fixtures.map(f => f.fixture.id);

    // Remove all fixtures not in the current live set
    await this.removeInactiveFixtures(currentLiveFixtureIds);

    for (const fixture of fixtures) {
      try {
        await this.upsertFixture(fixture);
        //console.log(`Processed fixture ${fixture.fixture.id}`);
      } catch (error) {
        console.error(`Failed to process fixture ${fixture.fixture.id}:`, error);
      }
    }
  }

  private async removeInactiveFixtures(currentLiveFixtureIds: number[]) {
    const { error } = await this.supabase
      .from('fixtures')
      .delete()
      .not('id', 'in', `(${currentLiveFixtureIds.join(',')})`);

    if (error) {
      console.error('Error removing inactive fixtures:', error);
    } else {
      //console.log('Inactive fixtures removed successfully');
    }
  }

  private async upsertFixture(item: LiveFixtureResponse['response'][0]) {
    const { fixture, league, teams, goals, score, events } = item;

    // Upsert league
    const { error: leagueError } = await this.supabase
      .from('leagues')
      .upsert({
        id: league.id,
        name: league.name,
        country: league.country,
        logo: league.logo,
        flag: league.flag,
        season: league.season,
        round: league.round
      });
    if (leagueError) throw leagueError;

    // Upsert teams
    const { error: teamsError } = await this.supabase
      .from('teams')
      .upsert([
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

    // Upsert venue
    if (fixture.venue.id) {
      const { error: venueError } = await this.supabase
        .from('venues')
        .upsert({
          id: fixture.venue.id,
          name: fixture.venue.name,
          city: fixture.venue.city
        });
      if (venueError) throw venueError;
    }

    // Upsert status
    const { error: statusError } = await this.supabase
      .from('statuses')
      .upsert({
        id: fixture.id,
        long: fixture.status.long,
        short: fixture.status.short,
        elapsed: fixture.status.elapsed,
        extra: fixture.status.extra
      });
    if (statusError) throw statusError;

    // Upsert score
    const { error: scoreError } = await this.supabase
    .from('scores')
    .upsert({
      id: fixture.id,
      halftime_home: score.halftime.home,
      halftime_away: score.halftime.away,
      fulltime_home: score.fulltime.home,
      fulltime_away: score.fulltime.away,
      extratime_home: score.extratime.home,
      extratime_away: score.extratime.away,
      penalty_home: score.penalty.home,
      penalty_away: score.penalty.away,
      current_home: goals.home,
      current_away: goals.away
    });
    if (scoreError) throw scoreError;

    // Upsert fixture
    const { error: fixtureError } = await this.supabase
      .from('fixtures')
      .upsert({
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

    // Update events
    await this.updateEvents(fixture.id, events);
  }

  private async updateEvents(fixtureId: number, events: any[]) {
    if (!events || events.length === 0) return;

    // Fetch existing events for this fixture
    const { data: existingEvents, error: fetchError } = await this.supabase
      .from('events')
      .select('time_elapsed, team_id, type, detail')
      .eq('fixture_id', fixtureId);

    if (fetchError) {
      console.error('Error fetching existing events:', fetchError);
      return;
    }

    // Filter out events that already exist
    const newEvents = events.filter(event =>
      !existingEvents?.some(existingEvent =>
        existingEvent.time_elapsed === event.time.elapsed &&
        existingEvent.team_id === event.team.id &&
        existingEvent.type === event.type &&
        existingEvent.detail === event.detail
      )
    );

    // Insert only new events
    if (newEvents.length > 0) {
      const { error: insertError } = await this.supabase
        .from('events')
        .insert(newEvents.map(event => ({
          time_elapsed: event.time.elapsed,
          time_extra: event.time.extra,
          team_id: event.team.id,
          player_name: event.player?.name,
          assist_name: event.assist?.name,
          type: event.type,
          detail: event.detail,
          comments: event.comments,
          fixture_id: fixtureId
        })));

      if (insertError) {
        console.error('Error inserting new events:', insertError);
      } else {
        console.log(`Inserted ${newEvents.length} new events for fixture ${fixtureId}`);
      }
    } else {
      //console.log(`No new events to insert for fixture ${fixtureId}`);
    }
  }

  private async loadSampleData(): Promise<LiveFixtureResponse['response']> {
    try {
      const sampleDataPath = path.join(__dirname, 'sampleLiveFixtures.json');
      const rawData = await fs.readFile(sampleDataPath, 'utf-8');
      const sampleData = JSON.parse(rawData);
      console.log(`Loaded ${sampleData.length} sample fixtures`);
      return sampleData;
    } catch (error) {
      console.error('Error loading sample data:', error);
      return [];
    }
  }
}

// Usage
const processor = new LiveFixtureProcessor();

// Fetch and process fixtures
export async function processFeed(feed: LiveFixtureResponse) {
  await processor.processFixtures(feed);
}