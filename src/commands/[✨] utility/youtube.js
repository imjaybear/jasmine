const yts = require("yt-search");
const Paginate = require("../../utils/pagination");
const Error = require("../../utils/Error");

module.exports = {
	name: "youtube",
	category: "[✨] utility",
	description: "Search youtube videos",
	usage: "<title>",
	run: async (client, message, args) => {
		if (!args.length)
			return new Error(module.exports, client, message).argsError();

		const m = await message.channel.send("*Please wait...*");

		yts(args.join(" "), async (err, res) => {
			if (err) return message.reply("I didn't found a video with that name");

			const pages = [];

			for (let i = 0; i < res.videos.length; i++) {
				const content = `Video ${i + 1}/${res.videos.length}\n${
					res.videos[i].url
				}`;

				pages.push(content);
			}

			m.delete();

			new Paginate.Paginate(client, message, pages).init();
		});
	},
};
