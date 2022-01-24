const fs = require('fs');
const { Collection, Client, Intents, MessageEmbed } = require('discord.js');
const { bold } = require('@discordjs/builders');


const axios = require('axios').default;

const lib = {
	async getNick(guild,userids){
		guild.members.fetch();
		const output = [];
		for (const x of userids){
			const member = await guild.members.fetch(x);
			if (!member) return
			console.log(member);
			if (!member.nickname || member.nickname == null){
				output.push(member.user.username);
			} else {
				output.push(member.nickname);
			}
		}
		return output
	},
	async displaynames(int, arr){
		const ids = [];
		for (const x of [int.member.user].concat(arr)){
			ids.push(x.id);
		}
		const output = await this.getNick(int.guild, ids);
		return output
	},
	rand(min, max){
		return Math.floor(Math.random() * (max - min)) + min
	},
	embed(){
		const embed = new MessageEmbed().setColor(this.rand(0, 16777215));
		return embed
	}
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, lib));
	}
}

client.login(process.env.token);