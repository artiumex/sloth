const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cookie')
		.setDescription('Gives someone a cookie!')
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),
	async execute(client, interaction, lib) {
		await interaction.deferReply();

		const [self, them] = await lib.displaynames(interaction,[interaction.options.getUser('target')]);

		const replies = [
			`${self} gave ${them} a cookie!`,
			`${self} gave ${them} a cookie! It was broken and crumbly, but it's the thought that counts!`,
			`${self} opens their fist and reveals to ${them} a... cookie? Yeah. It's a cookie. I think.`,			
			`${self} hands ${them} a cookie and runs away!`,
		]
		const reply_final = replies[Math.floor(Math.random()*replies.length)] + '\n:cookie:';

		await interaction.editReply(reply_final);
	},
};