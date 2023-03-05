const TelegramApi = require("node-telegram-bot-api");
const token = "6236822507:AAHI7Vftv_IbIjHjzA49tatMdltWKG-0af0";
const {gameOptions, againOptions} = require('./options.js')
const bot = new TelegramApi(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  bot.sendMessage(chatId, `${randomNumber}`);
  await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
};

const start = () => {
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    bot.setMyCommands([
      { command: "/start", description: "Начальное приветствие" },
      { command: "/info", description: "Информация о пользователе" },
      { command: "/game", description: "Сыграем в игру?" },
    ]);

    if (text === "/start") {
      return bot.sendMessage(chatId, `Добро пожаловать в бот`);
    }

    if (text === "/info") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/3d2/135/3d213551-8cac-45b4-bdf3-e24a81b50526/1.webp"
      );
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name}, ${msg.from.last_name}!`
      );
    }

    if (text === "/game") {
      await bot.sendMessage(
        chatId,
        `Сейчас я загадаю число от 0 до 9, а ты отгадывай`
      );
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    if (Number(data) === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Ты выбрал цыфру ${data} и это правильно`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты выбрал цыфру ${data} и это не верно, бот загадал цыфру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
