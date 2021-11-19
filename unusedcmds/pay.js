const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Gives someone money!')
		.addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))
		.addIntegerOption(option => option.setName('amount').setDescription('Amount to pay').setRequired(true)),
	async execute(client, interaction, lib) {
		await interaction.deferReply({ephemeral: true});

		const pay_amt = interaction.options.getInteger('amount');
		const [self, them] = await lib.getUsers([
			interaction.user.id,
			interaction.options.getUser('target').id
		]);
		
		const isAdmin = config.admins.includes(self.user.id) ? true : false;

		if (self.user.id == them.user.id){
			if (isAdmin) {
				self.profile.currency += pay_amt;
				try {
					self.profile.save();
				} catch (err) {
					console.log(err);
				}
				return await interaction.editReply(`Slid $${pay_amt} under the table 😉`);
			} else {
				return await interaction.editReply(`You can't pay yourself, lol`);
			}
		} else if (pay_amt > self.profile.currency){
			if (isAdmin) {
				them.profile.currency += pay_amt;
				try {
					them.profile.save();
				} catch (err) {
					console.log(err);
				}
				return await interaction.editReply(`Gave $${pay_amt} 😉😉😉`);
			} else {
				return await interaction.editReply(`You don't have enough money!`);
			}
		} else {
			them.profile.currency += pay_amt;
			self.profile.currency -= pay_amt;
			try {
				self.profile.save();
				them.profile.save();
			} catch (err) {
				console.log(err);
			}
			await interaction.editReply(`Success!`);
			return await interaction.followUp(`${self.name} gave ${them.name} $${pay_amt}!`);			
		}
	},
};