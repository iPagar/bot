//load env
require("dotenv").config();

const db = require("./queries");
const VkBot = require("node-vk-bot-api");
const Markup = require("node-vk-bot-api/lib/markup");

const bot = new VkBot(process.env.VK_BOT);

// 1 - 35-37
// 2 - 38-39
// 3 - 40-42
// 4 - 43-44
// 5 - 45-47
// 6 - 48 и выше
// 7 - первокурсник бакалавр или специалитет
// 8 - первокурсник магистратура
// 9 - социальная

bot.command("Академическая стипендия", (ctx) => {
	const id = ctx.message.from_id;

	db.getStudent(id).then(async (student) => {
		let text = "";
		let keyboard = null;

		if (student) {
			await db.getSchoolarship().then(async (schoolarship) => {
				if (schoolarship.length)
					await db.getSemesters(id).then(async (semesters) => {
						const length = semesters.length;

						if (length > 1) {
							text += "Рейтинг | Стипендия";

							text += `\n35-37     | ${schoolarship[0].value} ₽`;
							text += `\n38-39     | ${schoolarship[1].value} ₽`;
							text += `\n40-42     | ${schoolarship[2].value} ₽`;
							text += `\n43-44     | ${schoolarship[3].value} ₽`;
							text += `\n45-47     | ${schoolarship[4].value} ₽`;
							text += `\n>48         | ${schoolarship[5].value} ₽`;

							keyboard = Markup.keyboard([
								Markup.button({
									action: {
										type: "open_app",
										app_id: "7010368",
										label: "Узнать рейтинг",
										payload: JSON.stringify({
											url:
												"https://vk.com/stankin.moduli",
										}),
									},
								}),
							]).inline();
						} else {
							text += "Стипендия студентам первого семестра:";

							text += `\n• Бакалавриат/Специалитет: ${schoolarship[7].value} ₽`;
							text += `\n• Магистратура: ${schoolarship[6].value} ₽`;
						}
					});
				else text += "Нет информации о стипендиях";
			});
		} else text += "Вас нет в системе:\nhttps://vk.com/stankin.moduli";

		ctx.reply(text, null, keyboard);
	});
});

bot.command("Социальная стипендия", (ctx) => {
	const id = ctx.message.from_id;

	db.getStudent(id).then(async (student) => {
		let text = "";
		let keyboard = null;

		if (student) {
			await db.getSchoolarship().then(async (schoolarship) => {
				if (schoolarship.length)
					text += `Социальная стипендия: ${schoolarship[8].value} ₽`;
				else text += "Нет информации о стипендиях";
			});
		} else {
			text += "Вас нет в системе";
			keyboard = Markup.keyboard([
				Markup.button({
					action: {
						type: "open_app",
						app_id: "7010368",
						label: "Войти",
						payload: JSON.stringify({
							url: "https://vk.com/stankin.moduli",
						}),
					},
				}),
			]).inline();
		}

		ctx.reply(text, null, keyboard);
	});
});

bot.command("Начать", (ctx) => {
	console.log("Начать received");
	const keyboard = Markup.keyboard(
		["Академическая стипендия", "Социальная стипендия"],
		{
			columns: 1,
		}
	);

	ctx.reply("СТАНКИН приветствует!", null, keyboard);
});

bot.startPolling();
