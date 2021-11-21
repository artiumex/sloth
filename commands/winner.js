const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('winner')
		.setDescription('Admin command. Wins the winner!')
		.addUserOption(option => option.setName('user').setDescription('The user who won').setRequired(true)),
	async execute(client, interaction, lib) {
		if(!interaction.member.roles.cache.some(role => role.id === process.env.admins)) {
			await interaction.reply({
				content: "You need to be an admin to use that command!",
				ephemeral: true
			});
			return
		} else {
			await interaction.deferReply(/*{ephemeral:true}*/);
		}

		const winner = interaction.options.getUser('user');

		const vote_stuff = await lib.voteBot();
		const history_f = vote_stuff.history.map(e => e.userId);
		const history = history_f.length > 3 ? history_f.slice(0,3) : history_f;
		if (history.includes(winner.id)){
			await interaction.editReply({
				content: "That person already won once in the last three contests!"
			});
			return
		}
		
		const winner_db = new lib.VoteBot({
			_id: mongoose.Types.ObjectId(),
			userId: winner.id,
			date: new Date(),
		});

		try {
			winner_db.save();
		} catch (err) {
			console.log(err);
		}

		await interaction.editReply({
			content: `${winner.toString()} is the winner!`
		})
	},
};