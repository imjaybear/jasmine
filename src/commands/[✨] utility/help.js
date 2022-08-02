const {
	EmbedBuilder,
	SelectMenuBuilder,
	ActionRowBuilder,
	ComponentType,
	Colors,
} = require("discord.js");

module.exports = {
	name: "help",
	aliases: ["h"],
	category: "[✨] utility",
	description: "Returns all commands, or one specific command info",
	usage: "[command | alias]",
	run: async (client, message, args) => {
		if (args[0]) {
			return getCMD(client, message, args[0]);
		} else {
			return await getAll(client, message);
		}
	},
};

async function getAll(client, message) {
	const commands = (category) => {
		return client.commands
			.filter((cmd) => cmd.category === category)
			.map((cmd) => " " + `\`${cmd.name}\``);
	};

	const embed = new EmbedBuilder()
		.setAuthor({
			name: message.author.username,
			iconURL: message.author.displayAvatarURL(),
		})
		.setColor("#CD1C6C")
		.setDescription(
			"<:discord:885340297733746798> [Invite Kanna](https://discord.com/api/oauth2/authorize?client_id=969633016089546763&permissions=0&scope=bot%20applications.commands)\n<:kanna:885340978834198608> [Kanna's Kawaii Klubhouse](https://discord.gg/NcPeGuNEdc)"
		)
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp()
		.setFooter({
			text: "Please select the category in the select menu to see the command list",
			iconURL: client.user.displayAvatarURL(),
		});

	const options = [];

	client.categories.forEach((category) => {
		embed.addFields([
			{
				name: `${category}`,
				value: `List of the ${category.slice(4)} commands`,
				inline: true,
			},
		]);

		options.push({
			label: category,
			description: `List of the ${category.slice(4)} commands`,
			value: category,
		});
	});

	const selectMenu = new SelectMenuBuilder()
		.setCustomId("helpMenu")
		.setPlaceholder("Nothing Selected")
		.addOptions(options);

	const row = new ActionRowBuilder().addComponents([selectMenu]);

	const m = await message.channel.send({
		embeds: [embed],
		components: [row],
	});

	collector();

	function collector() {
		m.awaitMessageComponent({
			componentType: ComponentType.SelectMenu,
			time: 30000,
		}).then((i) => {
			const commandEmbed = new EmbedBuilder()
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL(),
				})
				.setColor("#CD1C6C")
				.addFields([
					{ name: `${i.values[0]}`, value: `${commands(i.values[0])}` },
				])
				.setDescription(
					"<:discord:885340297733746798> [Invite Kanna](https://discord.com/api/oauth2/authorize?client_id=969633016089546763&permissions=0&scope=bot%20applications.commands)\n<:kanna:885340978834198608> [Kanna's Kawaii Klubhouse](https://discord.gg/NcPeGuNEdc)"
				)
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp()
				.setFooter({
					text: "Please select the category in the select menu to see the command list",
					iconURL: client.user.displayAvatarURL(),
				});

			i.update({ embeds: [commandEmbed] });

			collector();
		});
	}
}

function getCMD(client, message, input) {
	const embed = new EmbedBuilder();

	const cmd =
		client.commands.get(input.toLowerCase()) ||
		client.commands.get(client.aliases.get(input.toLowerCase()));

	let info = `No information found for command **${input.toLowerCase()}**`;

	if (!cmd) {
		return message.reply({
			embeds: [embed.setColor("RED").setDescription(info)],
		});
	}

	if (cmd.name) info = `**Command name**: ${cmd.name}`;
	if (cmd.aliases)
		info += `\n**Aliases**: ${cmd.aliases.map((a) => `\`${a}\``).join(", ")}`;
	if (cmd.description) info += `\n**Description**: ${cmd.description}`;
	if (cmd.usage) {
		info += `\n**Example**: \`${client.prefixes.get(message.guild.id)}${
			cmd.name
		} ${cmd.usage}\``;
		embed.setFooter({ text: "Syntax: <> = required, [] = optional" });
	} else {
		info += `\n**Example**: \`${client.prefixes.get(message.guild.id)}${
			cmd.name
		}\``;
	}

	return message.reply({
		embeds: [
			embed
				.setColor(Colors.Green)
				.setDescription(info)
				.setAuthor({
					name: message.author.username,
					iconURL: message.author.displayAvatarURL(),
				})
				.setTimestamp(),
		],
	});
}
