//load env
require("dotenv").config();

const db = require("./queries");
const VkBot = require("node-vk-bot-api");
const Markup = require("node-vk-bot-api/lib/markup");

const bot = new VkBot({
	token: process.env.VK_BOT,
	execute_timeout: process.env.EXECUTE_TIMEOUT, // in ms   (50 by default)
	polling_timeout: process.env.POLLING_TIMEOUT, // in secs (25 by default)
});

bot.use(async (ctx, next) => {
	try {
		await next();
	} catch (e) {
		console.error(e);
	}
});

// 1 - 35-37
// 2 - 38-39
// 3 - 40-42
// 4 - 43-44
// 5 - 45-47
// 6 - 48 и выше
// 7 - первокурсник бакалавр или специалитет
// 8 - первокурсник магистратура
// 9 - социальная
bot.command("Стипендия", (ctx) => {
	const id = ctx.message.from_id;

	db.getStudent(id).then(async (student) => {
		let text = "";
		let keyboard = null;

		if (student) {
			await db.getSchoolarship().then(async (schoolarship) => {
				if (schoolarship.length) {
					text += "\n\nСтипендия студентам первого семестра:";
					text += `\n• Бакалавриат      | ${schoolarship[7].value} ₽`;
					text += `\n• Специалитет     | ${schoolarship[7].value} ₽`;
					text += `\n• Магистратура   | ${schoolarship[6].value} ₽`;

					text +=
						"\n\nСтипендия студентам второго и более старших семестров:";
					text += "\nРейтинг | Стипендия";
					text += `\n35-37     | ${schoolarship[0].value} ₽`;
					text += `\n38-39     | ${schoolarship[1].value} ₽`;
					text += `\n40-42     | ${schoolarship[2].value} ₽`;
					text += `\n43-44     | ${schoolarship[3].value} ₽`;
					text += `\n45-47     | ${schoolarship[4].value} ₽`;
					text += `\n>48         | ${schoolarship[5].value} ₽`;

					text += `\n\nСоциальная стипендия: ${schoolarship[8].value} ₽`;

					keyboard = Markup.keyboard([
						Markup.button({
							action: {
								type: "open_app",
								app_id: "7010368",
								label: "Узнать рейтинг",
								payload: JSON.stringify({
									button:
										"Упс!😒 Кажется, старая версия ВК не поддерживает новые технологии...\n\nОткройте модули вручную!\nhttps://vk.com/stankin.moduli",
								}),
								hash: "marks",
							},
						}),
					]).inline();
				} else text += "Нет информации о стипендиях";
			});
		} else text += "Вас нет в системе:\nhttps://vk.com/stankin.moduli";

		ctx.reply(text, null, keyboard);
	});
});

bot.command("Академическая стипендия", (ctx) => {
	const id = ctx.message.from_id;

	const { text, keyboard } = placeholder();

	ctx.reply(text, null, keyboard);
});

bot.command("Социальная стипендия", (ctx) => {
	const id = ctx.message.from_id;

	const { text, keyboard } = placeholder();

	ctx.reply(text, null, keyboard);
});

function placeholder() {
	return {
		keyboard: Markup.keyboard([Markup.button("Стипендия", "secondary")], {
			columns: 1,
		}),
		text:
			'Теперь, чтобы узнать информацию о стипендиях нужно написать "Стипендия"!',
	};
}

bot.command("Начать", (ctx) => {
	const keyboard = Markup.keyboard(
		[Markup.button("Стипендия", "secondary")],
		{
			columns: 1,
		}
	);

	ctx.reply("СТАНКИН приветствует!", null, keyboard);
});

bot.startPolling();
