const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fluey')
		.setDescription('Tells you how fuckable Fluey is!'),
	async execute(client, interaction, lib) {
		const replies = [
			'Fluey is really unfuckable',
			'Fluey is extremely unfuckable',
			'Fluey is kinda unfuckable tbh'
		]
		await interaction.reply(replies[Math.floor(Math.random() * replies.length)]);
	},
};