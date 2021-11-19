const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cat')
		.setDescription('Gib cat!'),
	async execute(client, interaction, lib) {
		await interaction.deferReply();

		const response = await lib.get('https://api.thecatapi.com/v1/images/search', {
			params: {
				"x-api-key": process.env.dogapikey
			}
		});

		const embed = lib.embed().setImage(response.data[0].url)
		await interaction.editReply({embeds: [embed]});
	},
};