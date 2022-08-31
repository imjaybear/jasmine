const puppeteer = require("puppeteer");
const ch = require("cheerio");
const error = require("../../utils/errors");
const { setTimeout } = require("timers/promises");

module.exports = {
  name: "ask",
  description: "Ask a question to the bot",
  usage: "<question>",
  run: async (client, message, args) => {
    if (!args.length) return error.argsError(module.exports, client, message);

    const question = args.join(" ");
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      question
    )}`;
    message.channel.send("let me think... <:LumineThink:1014510903665889331>");
    const results = [];
    puppeteer
      .launch()
      .then(function (browser) {
        return browser.newPage();
      })
      .then(async function (page) {
        return await page.goto(url).then(async function () {
          return page.content();
        });
      })
      .then(async function (html) {
        const $ = ch.load(html);

        $(".hgKElc", html).each(function () {
          if ($(this).text().split(" ").length > 3) {
            results.push($(this).text());
          }
        });

        if (results.length > 0) {
          let text = results[0];

          if (text.trim().endsWith("...")) {
            const splitted = text.replace("...", "").split(".");
            splitted.pop();
            text = splitted.join(".");
          }
          message.channel.send(`${text} <:foxnote:1014517679576592505>`);
          return;
        }
        message.channel.send(
          "I don't quite sure how to answer that but wait a second... <:Chibi_Raiden_Explaining:1014518350208049224>"
        );
        await setTimeout("2000");

        if (results.length < 1) {
          results.push($(".kno-rdesc > span", html).first().text().trim());
        }

        if (results.length < 1 || results[0].length < 1) {
          const text = $(
            "div.webanswers-webanswers_table__webanswers-table:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)",
            html
          ).text();
          results.push(text);
        }

        if (results.length < 1 || results[0].length < 1) {
          message.channel.send(
            "I'm sorry, I don't know how to answer that question <a:CatCry:1014518651900133386>"
          );
          return;
        }

        message.channel.send(
          `${results.join("\n")} <:foxnote:1014517679576592505>`
        );
      })
      .catch(function (err) {
        console.log(`Error: ${err}`);
        message.channel.send(
          "I'm sorry, I don't know how to answer that question <a:CatCry:1014518651900133386>"
        );
      });
  },
  interaction: {
    data: {
      name: "ask",
      description: "Ask a question to the bot",
      type: 1,
      options: [
        {
          name: "question",
          description: "The question to ask",
          type: 3,
          required: true,
        },
      ],
    },
    run: async (client, interaction) => {
      const question = interaction.options.getString("question");
      const url = `https://www.google.com/search?q=${encodeURIComponent(
        question
      )}`;
      interaction.reply("let me think... <:LumineThink:1014510903665889331>");
      const results = [];
      puppeteer
        .launch()
        .then(function (browser) {
          return browser.newPage();
        })
        .then(async function (page) {
          return await page.goto(url).then(async function () {
            return page.content();
          });
        })
        .then(async function (html) {
          const $ = ch.load(html);

          $(".hgKElc", html).each(function () {
            if ($(this).text().split(" ").length > 3) {
              results.push($(this).text());
            }
          });

          if (results.length > 0) {
            let text = results[0];

            if (text.trim().endsWith("...")) {
              const splitted = text.replace("...", "").split(".");
              splitted.pop();
              text = splitted.join(".");
            }
            interaction.followUp(`${text} <:foxnote:1014517679576592505>`);
            return;
          }
          interaction.followUp(
            "I don't quite sure how to answer that but wait a second... <:Chibi_Raiden_Explaining:1014518350208049224>"
          );
          await setTimeout("2000");

          if (results.length < 1) {
            results.push($(".kno-rdesc > span", html).first().text().trim());
          }

          if (results.length < 1 || results[0].length < 1) {
            const text = $(
              "div.webanswers-webanswers_table__webanswers-table:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > b:nth-child(1)",
              html
            ).text();
            results.push(text);
          }

          if (results.length < 1 || results[0].length < 1) {
            interaction.followUp(
              "I'm sorry, I don't know how to answer that question <a:CatCry:1014518651900133386>"
            );
            return;
          }

          interaction.followUp(
            `${results.join("\n")} <:foxnote:1014517679576592505>`
          );
        })
        .catch(function (err) {
          console.log(`Error: ${err}`);
          interaction.followUp(
            "I'm sorry, I don't know how to answer that question <a:CatCry:1014518651900133386>"
          );
        });
    },
  },
};
