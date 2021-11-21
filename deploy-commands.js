const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const guildId = ["402919650985246741", "905525060427730994"];
const clientId = "905998455812530176";

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