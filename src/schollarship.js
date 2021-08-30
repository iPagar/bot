const Markup = require("node-vk-bot-api/lib/markup");
const db = require("./queries");
const { mockSchollarships } = require("./db.mock");

// 1 - 35-37
// 2 - 38-39
// 3 - 40-42
// 4 - 43-44
// 5 - 45-47
// 6 - 48 и выше
// 7 - первокурсник бакалавр или специалитет
// 8 - первокурсник магистратура
// 9 - социальная
function getSchollarshipsMessage(schoolarship) {
  return !schoolarship.length
    ? "Нет информации о стипендиях"
    : `Стипендия студентам первого семестра:
        • Бакалавриат | ${schoolarship[7].value} ₽
  
        Стипендия студентам первого семестра:
        •  Бакалавриат  | ${schoolarship[7].value} ₽
        • Специалитет  | ${schoolarship[7].value} ₽
        • Магистратура | ${schoolarship[6].value} ₽
  
        Стипендия студентам второго и более старших семестров:
        Рейтинг | Стипендия
        35-37     | ${schoolarship[0].value} ₽
        38-39     | ${schoolarship[1].value} ₽
        40-42     | ${schoolarship[2].value} ₽
        43-44     | ${schoolarship[3].value} ₽
        45-47     | ${schoolarship[4].value} ₽
        >48         | ${schoolarship[5].value} ₽
  
        Социальная стипендия: ${schoolarship[8].value} ₽`;
}

async function createSchoolarshipReply() {
  const schoolarship =
    process.env.NODE_ENV === "development"
      ? mockSchollarships
      : await db.getSchoolarship();
  const message = getSchollarshipsMessage(schoolarship);

  const keyboard = Markup.keyboard([
    Markup.button({
      action: {
        type: "open_app",
        app_id: "7010368",
        label: "Узнать рейтинг",
        payload: JSON.stringify({
          button: `
              Упс!😒 Кажется, старая версия ВК не поддерживает новые технологии...
  
              \n\nОткройте модули вручную!
              \nhttps://vk.com/stankin.moduli
              `,
        }),
        hash: "marks",
      },
    }),
  ]).inline();

  return { message, keyboard };
}

module.exports = {
  createSchoolarshipReply,
};
