const { bold, SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios').default;

var emojis = "😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 🧳 🌂 ☂️ 🧵 🪡 🪢 🧶 👓 🥽 🥼 🦺 👔 👕 👖 🧣 🧤 🧥 🧦 🩴 🩱 🩲 🩳 👙 🎒 👑 👒 🎩 🎓 🧢 ⛑ 🪖 💄 💍 💼".split(' ');

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
			await interaction.deferReply();
		}

		var answers = [], voted = [];
		const vote_stuff = await lib.voteBot();
		const guild = interaction.guild;
		const participant_role = await guild.roles.fetch(vote_stuff.partrole);
		
		const history_f = vote_stuff.history.map(e => e.userId);
		const history = history_f.length > 3 ? history_f.slice(0,3) : history_f;

		function grabEmoji(){
			const randInd = Math.floor(Math.random() * emojis.length);
			const emoji = emojis.splice(randInd,1)[0];
			return emoji
		}

		await guild.members.fetch();
		guild.members.cache.forEach(m=>{
			if (m.roles.cache.some(role => role.id === vote_stuff.partrole) && !history.includes(m.user.id)){
				const data = {
					name: m.nickname ? m.nickname : m.user.username,
					at: m.user.toString(),
					emoji: grabEmoji(),
					id: m.user.id
				}
				answers.push(data);
			}
		});


		const reply = await interaction.editReply({
			content: `${bold("Here's the list of the participants")}:\n${answers.map(e => `${e.emoji} ${e.at}`).join('\n')}\n\n@everyone`,
			fetchReply: true
		});

		const emoji_list = answers.map(e=>e.emoji);
		for (const e of emoji_list){
			await reply.react(e);
		}
	},
};