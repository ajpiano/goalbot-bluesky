import { Bot } from "@skyware/bot";
import 'dotenv/config';
import axios from 'axios';
import { RapidApi } from 'rapidapi-node-sdk';
import Keyv from 'keyv';
import KeyvPostgres from '@keyv/postgres';
import cron from 'node-cron';

//import data from "./testlivefixtures.json" assert { type: "json" };
const store = new KeyvPostgres({uri: process.env.POSTGRES_URL, table: 'cache'});
const cache = new Keyv({store: store, ttl: 2 * 60 * 1000, namespace: 'keyv'});

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
    //params: {team: '1604', next: '1'}
    params: {live: 'all'}
  };
  const data = await rapidApi.call(options);

  var aMatch = data.response.response[Math.floor(Math.random() * data.response.response.length)];

  const text = `Coming to you live from ${aMatch.fixture.venue.name}, we have ${aMatch.league.name} action in ${aMatch.fixture.venue.city}, it's ${aMatch.teams.home.name} vs ${aMatch.teams.away.name}! It's currently the ${aMatch.fixture.status.elapsed}' of the match with the score ${aMatch.goals.home} - ${aMatch.goals.away}!`;

  console.log(text);

  try {
      const post = await bot.post({ text });
  } catch (error) {
    console.error(error);
  }
}


cron.schedule('*/10 * * * *', () => {
  loadActiveFixtures();
});
