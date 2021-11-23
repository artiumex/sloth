const fs = require('fs');
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios').default;

const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const djs_builders = require('@discordjs/builders');

const mongoose = require('mongoose');
const Users = require('./models/users');
const VoteBot = require('./models/votebot');

mongoose.connect(process.env.mongodb);
mongoose.Promise = global.Promise;

mongoose.connection.on('connected', async () => {
	//console.log(await Users.find({}));
	console.log(`The bot has connected to the database.`);
});
mongoose.connection.on('disconnected', () => {
	console.log(`The bot has disconnected from the database.`);
});
mongoose.connection.on('err', (err) => {
	console.log(`There was an error with the connection to the databse:  ${err}`);
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
	console.log('Ready!');
	/*cron.schedule('* * * * *', async () => {
		await client.channels.cache.get('906373797425328179').send(await client.users.fetch('642193362924994570').toString());
	});*/
});

/*client.on('messageCreate', async message => {
	if (message.author.bot) return;
	const random = Math.floor(Math.random() * 5);
	if (random == 0){
		console.log(`${message.author.username} got some money!`); 
		const [user] = await lib.getUsers([message.author.id]);
		user.profile.currency += Math.floor(Math.random() * 4) + 1
		try {
			user.profile.save();
		} catch (err) {
			console.log(err);
		}
	}
});*/



client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction, lib);
	} catch (error) {
		console.error(error);
	}
});

client.login(process.env.token);

const lib = {
	Users: Users,
	VoteBot: VoteBot,
	embed(){
		return new MessageEmbed().setColor(Math.floor(Math.random() * 16777215))
	},
	admins: "905543028763164733",
	async getUsers(userids){
		var output = [];
		for (const u of userids){
			const user = await client.users.fetch(u);
			name = djs_builders.bold(user.username);
			var profile = await Users.findOne({userid: u});
			if (!profile){
				profile = new Users({
					_id: mongoose.Types.ObjectId(),
					userid: u,
				})
			}
			output.push({
				name: name,
				user: user,
				profile: profile,
			});
		}
		return output
	},
	async voteBot(){
		const output = {
			guildID: '905525060427730994',
			channelID: '905576746320027710',
			partrole: '909943070034894848',
			winnerrole: '909942497680171038',
			history: await VoteBot.find({}).sort({date: -1})
		};
		return output
	}
}