const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const guildId = ["402919650985246741", "781397300647559188"];
//const guildId = ["402919650985246741"]; //just test server
const clientId = "933753878615314552";

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

for (const guild of guildId){
	rest.put(Routes.applicationGuildCommands(clientId, guild), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
}