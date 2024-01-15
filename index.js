import { Client, GatewayIntentBits } from 'discord.js';
import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ],
  });
const TOKEN = process.env.DCTOKEN;

const fetchBtcFees = async () => {
  try {
    const response = await fetch('https://mempool.space/api/v1/fees/recommended');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching BTC fees:', error);
    return null;
  }
};

const updateBtcFees = async () => {
  const btcFees = await fetchBtcFees();
  return btcFees;
};

client.once('ready', () => {
    console.log('Bot is ready!');
    updateBtcFees(); // Initial update on bot start
    setInterval(updateBtcFees, 5* 60 * 1000); // Update every 5 minutes
    // Update the bot's presence with BTC fees information
    const updatePresence = async () => {
    const btcFees = await updateBtcFees();
    if (btcFees) {
      const statusText = `⚡️${btcFees.fastestFee}|🚶${btcFees.halfHourFee}|🐢${btcFees.hourFee}|${new Date().toLocaleTimeString()}`;
      client.user.setPresence({ activities: [{ name: `${statusText}` }], status: 'online' });
    }
  };
  
  // Update the presence initially and then every 5 minutes
  updatePresence();
  setInterval(updatePresence, 5* 60 * 1000);
  
});



// URL for bot: https://discord.com/api/oauth2/authorize?client_id=1192608883961778227&permissions=70368744177655&scope=bot

client.login(TOKEN);
