const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('6103447361:AAEUlqFKQ_tTSVkFLlMFCkZEi-ggU36n2ew', { polling: true });


const lightThemeCommand = {
  command: 'light',
  description: 'Switch to the light theme',
  switch_pm_parameter: 'light'
};

const darkThemeCommand = {
  command: 'dark',
  description: 'Switch to the dark theme',
  switch_pm_parameter: 'dark'
};

bot.setMyCommands([lightThemeCommand, darkThemeCommand]);

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const theme = query.data;

  // Do something based on the theme
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = 'Choose a theme:';
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Light', callback_data: 'light' },
          { text: 'Dark', callback_data: 'dark' }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, message, options);
});
