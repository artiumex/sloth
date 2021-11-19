const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cookie')
		.setDescription('Gives someone a cookie!')
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true)),
	async execute(client, interaction, lib) {
		await interaction.deferReply();

		const [self, them] = lib.getUsers([
			interaction.user.id,
			interaction.options.getUser('target').id
		]);

		const replies = [
			`${self.name} gave ${them.name} a cookie!`,
			`${self.name} gave ${them.name} a cookie! It was broken and crumbly, but it's the thought that counts!`,
			`${self.name} opens their fist and reveals to ${them.name} a... cookie? Yeah. It's a cookie. I think.`,			
			`${self.name} hands ${them.name} a cookie and runs away!`,
		]
		const reply_final = replies[Math.floor(Math.random()*replies.length)] + '\n:cookie:';

		await interaction.editReply(reply_final);
	},
};