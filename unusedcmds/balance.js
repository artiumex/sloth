const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows the balance of yourself or the user!')
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(false)),
	async execute(client, interaction, lib) {
		await interaction.deferReply({ephemeral: true});

		const userID = interaction.options.getUser('target') ? interaction.options.getUser('target').id : interaction.user.id;
		const [user] = await lib.getUsers([userID]);

		await interaction.editReply(`${user.name} has $${user.profile.currency}!`);
	},
};