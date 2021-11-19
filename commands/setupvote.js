const { bold, SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios').default;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setupvote')
		.setDescription('Admin Command. Setups voting!'),
	async execute(client, interaction, lib) {
		if(!interaction.member.roles.cache.some(role => role.id === process.env.admins)) {
			await interaction.reply({
				content: "You need to be an admin to use that command!",
				ephemeral: true
			});
			return
		} else {
			await interaction.deferReply(/*{ephemeral: true}*/);
		}

		var answers = [];
		const vote_stuff = await lib.voteBot();
		const guild = interaction.guild;
		const participant_role = await guild.roles.fetch(vote_stuff.partrole);
		const winner_role = await guild.roles.fetch(vote_stuff.winnerrole);
		
		await guild.members.fetch();
		guild.members.cache.forEach(m=>{
			if (m.roles.cache.some(role => role.id === vote_stuff.partrole)){
				answers.push({
					name: m.nickname ? m.nickname : m.user.username,
					at: m.toString()
				});
			}
		});

		const data = { 
			"poll": {
				"title": "Who is the Glory Hole?",
				"answers": answers.map(e => e.name),
				"priv": true,
				"ma": false
			}
		}

		const headers = {
			'API-KEY': process.env.strawpoll
		}

		const sp = await axios.post('https://strawpoll.com/api/poll', data, {headers: headers});

		console.log(sp.data);
		if (sp.data.success){
			await interaction.editReply({
				content: `${bold("Here's the list of the participants")}:\n${answers.map(e => e.at).join('\n')}\n\nLink: https://strawpoll.com/${sp.data.content_id}`
			});
		} else {
			await interaction.editReply({
				content: `Something went wrong.... try again!`,
				ephemeral: true
			});
		}
	},
};