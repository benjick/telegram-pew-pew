import { bot } from './telegram';
import { parse, parseArgs } from './helpers';
import log from './log';

function createDone(chatId) {
  return function (string) {
    bot.sendMessage(chatId, string);
  };
}

const listen = commands => {
  bot.on('message', (obj) => {
    log.info('Got message', obj);
    if (obj.text) {
      const msg = obj;
      const cmd = parse(msg.text);
      msg.args = parseArgs(msg.text);
      if (commands[cmd]) {
        const done = createDone(msg.chat.id);
        const result = commands[cmd].func(msg, done, bot);
        if (result) {
          bot.sendMessage(msg.chat.id, result);
        }
      }
    }
  });
};

export default listen;
