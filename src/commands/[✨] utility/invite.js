module.exports = {
  name: "invite",
  description: "Invite the bot",
  category: "[✨] utility",
  run: async (client, message) => {
    const link =
      "<https://discord.com/api/oauth2/authorize?client_id=969633016089546763&permissions=0&scope=bot%20applications.commands>";

    message.channel.send(`You can invite me using this link:\n${link}`);
  },
  interaction: {
    data: {
      name: "invite",
      type: 1,
      description: "Invite the bot",
    },
    run: async (client, interaction) => {
      const link =
        "<https://discord.com/api/oauth2/authorize?client_id=969633016089546763&permissions=0&scope=bot%20applications.commands>";

      interaction.reply(`You can invite me using this link:\n${link}`);
    },
  },
};
