export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Scores {
  ht: number | null;
  ft: number | null;
  et: number | null;
}

export interface Status {
  long: string;
  short: string;
  elapsed: number | null;
}

export interface Fixture {
  id: number;
  status: Status;
  home_team: Team;
  away_team: Team;
  home_score: Scores;
  away_score: Scores;
  league: {
    name: string;
    country: string;
  };
}

export interface MatchEvent {
  id: number;
  fixture_id: number;
  time_elapsed: number;
  time_extra: number | null;
  team_id: number;
  player_name: string | null;
  assist_name: string | null;
  type: string;
  detail: string;
  comments: string | null;
}