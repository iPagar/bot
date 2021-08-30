const Markup = require("node-vk-bot-api/lib/markup");
const VkBot = require("node-vk-bot-api");
const { createSchoolarshipReply } = require("./src/schollarship");

const bot = new VkBot({
  token: process.env.VK_BOT,
  execute_timeout: process.env.EXECUTE_TIMEOUT, // in ms   (50 by default)
  polling_timeout: process.env.POLLING_TIMEOUT, // in secs (25 by default)
});

bot.command("Стипендия", async (ctx) => {
  const id = ctx.message.from_id;

  const { message, keyboard } = await createSchoolarshipReply();

  await ctx.reply(message, null, keyboard);
});

bot.command("Начать", async (ctx) => {
  const message = "СТАНКИН приветствует!";
  const keyboard = Markup.keyboard([Markup.button("Стипендия", "secondary")], {
    columns: 1,
  });

  await ctx.reply(message, null, keyboard);
});

bot.startPolling();
