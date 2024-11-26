import { Bot } from "@skyware/bot";
import 'dotenv/config';
import axios from 'axios';
import { RapidApi } from 'rapidapi-node-sdk';
import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';
import cron from 'node-cron';

import supabase from './db.js';
import { processFeed } from './processLiveFixtures.ts';

//import data from "./testlivefixtures.json" assert { type: "json" };
const store = new KeyvPostgres({uri: process.env.POSTGRES_URL, table: 'cache'});
const cache = new Keyv({store: store, ttl: 1 * 60 * 1000, namespace: 'keyv'});

cache.on('error', (err) => {
    console.error(err);
});

const bot = new Bot();
await bot.login({
	identifier: process.env.BSKY_USERNAME,
	password: process.env.BSKY_PASSWORD,
});

const rapidApi = new RapidApi({
    rapidApiHost: process.env.RAPIDAPI_HOST,
    rapidApiKey: process.env.RAPIDAPI_KEY,
    baseUrl: process.env.RAPIDAPI_BASE_URL,
    logger: console,
    cache: cache
});

async function loadActiveFixtures() {
  console.log(`Loading active fixtures at ${new Date()}`);
  const options = {
    method: 'GET',
    uri: 'fixtures',
    params: {live: 'all'}
  };
  let data;
  try {
    data = await rapidApi.call(options);
  } catch (error) {
    console.error('Error fetching live fixtures:', error);
    data = { response: { response: [] } };  // Empty response if API call fails
  }

  await processFeed(data.response.response);

  const { data: activeFixtures, error } = await supabase
    .from('fixtures')
    .select('status:statuses(elapsed),home_team:teams!fixtures_home_team_id_fkey(name),away_team:teams!fixtures_away_team_id_fkey(name),home_score:scores(ht:halftime_home,ft:fulltime_home,et:extratime_home),away_score:scores(ht:halftime_away,ft:fulltime_away, et:extratime_away)');

  if (error) {
    console.error('Error fetching fixtures:', error);
    return;
  }

  console.log(activeFixtures);

  let summaryText = `There are currently ${activeFixtures.length} matches being played:\n`;
  activeFixtures.forEach(match => {
    let homeScore = match.home_score.et ?? match.home_score.ft ?? match.home_score.ht ?? 0;
    let awayScore = match.away_score.et ?? match.away_score.ft ?? match.away_score.ht ?? 0;
    summaryText += `${match.home_team.name} ${homeScore} - ${awayScore} ${match.away_team.name} (${match.status.elapsed}')\n`;
  });
  console.log(summaryText);

  if (summaryText.length > 300) {
    summaryText = summaryText.substring(0, 297) + '...';
  }

  try {
    //const post = await bot.post({ text: summaryText });
  } catch (error) {
    console.error(error);
  }

  /*
  var aMatch = data.response.response[Math.floor(Math.random() * data.response.response.length)];

  const text = `Coming to you live from ${aMatch.fixture.venue.name}, we have ${aMatch.league.name} action in ${aMatch.fixture.venue.city}, it's ${aMatch.teams.home.name} vs ${aMatch.teams.away.name}! It's currently the ${aMatch.fixture.status.elapsed}' of the match with the score ${aMatch.goals.home} - ${aMatch.goals.away}!`;

  console.log(text);

  try {
      const post = await bot.post({ text });
  } catch (error) {
    console.error(error);
  }
    */
}


cron.schedule('* * * * *', () => {
  loadActiveFixtures();
});



/*
async function loadCountries() {
  const countries = await supabase
    .from('countries')
    .select('*')
    .eq('continent', 'Oceania');
    return countries;
}

const countries = await loadCountries();
console.log(countries);
*/
loadActiveFixtures();