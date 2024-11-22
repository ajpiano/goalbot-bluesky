type Fixture = {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    periods: {
      first: number | null;
      second: number | null;
    };
    venue: {
      id: number | null;
      name: string;
      city: string;
    };
    status: {
      long: string;
      short: string;
      elapsed: number | null;
      extra: number | null;
    };
  }

  type MatchEvent = {
    id: number;
    fixture_id: number;
    time: {
      elapsed: number;
      extra: number | null;
    };
    team: {
      id: number;
      name: string;
      logo: string;
    };
    player: {
      id: number;
      name: string;
    } | null;
    assist: {
      id: number;
      name: string;
    } | null;
    type: string;
    detail: string;
    comments: string | null;
  };
  
  type LiveFixtureResponse = {
    get: string;
    parameters: { live: string };
    errors: any[];
    results: number;
    response: Array<{
      fixture: Fixture;
      league: League;
      teams: Teams;
      goals: Goals;
      score: Score;
      events: MatchEvent[];
    }>;
  }