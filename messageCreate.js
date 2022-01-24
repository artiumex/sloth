module.exports = {
	name: 'messageCreate',
	async execute(message, client, lib) {
		if (["499251616059359232","256880604359032832"].includes(message.author.id)){
			message.react("💩");
		}
	},
};