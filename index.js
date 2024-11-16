import { Bot } from "@skyware/bot";
import 'dotenv/config';
import axios from 'axios';
import { RapidApi } from 'rapidapi-node-sdk';
import Keyv from 'keyv';
//import data from "./testlivefixtures.json" assert { type: "json" };


const rapidApi = new RapidApi({
    rapidApiHost: process.env.RAPIDAPI_HOST,
    rapidApiKey: process.env.RAPIDAPI_KEY,
    baseUrl: process.env.RAPIDAPI_BASE_URL,
    logger: console,
    cache: new Keyv()
});



const options = {
  method: 'GET',
  uri: 'fixtures',
  //params: {team: '1604', next: '1'}
  params: {live: 'all'}
};
const data = await rapidApi.call(options);

const bot = new Bot();
await bot.login({
	identifier: process.env.BSKY_USERNAME,
	password: process.env.BSKY_PASSWORD,
});

//var nextMatch = data.response.response[0];

//const text = `Get ready for the big one! It's ${nextMatch.teams.home.name} vs ${nextMatch.teams.away.name} on ${nextMatch.fixture.date} in the ${nextMatch.league.round}! Wowie!`


console.log(data);
var aMatch = data.response.response[Math.floor(Math.random() * data.response.response.length)];

console.log(aMatch.fixture);
const text = `Coming to you live from ${aMatch.fixture.venue.name}, we have ${aMatch.league.name} action in ${aMatch.fixture.venue.city}, it's ${aMatch.teams.home.name} vs ${aMatch.teams.away.name}! It's currently the ${aMatch.fixture.status.elapsed}' of the match with the score ${aMatch.goals.home} - ${aMatch.goals.away}!`;

console.log(text);



try {
    const post = await bot.post({ text });
} catch (error) {
	console.error(error);
}


process.exit();