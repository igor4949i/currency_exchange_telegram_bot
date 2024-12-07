const { Telegraf } = require('telegraf')
const BOT_TOKEN = process.env.BOT_TOKEN || 'put_your_token_bot_here'
const axios = require('axios')
var cc = require('currency-codes')
const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => ctx.reply('Welcome to Monobank Currency Bot'))

bot.hears(/^[A-Z]+$/i, async (ctx) => {
  const currency = cc.code(ctx.message.text)

  // checking currency
  if (!currency) {
    return ctx.reply('Currency not found')
  }

  try {
    const currencyObj = await axios.get('https://api.monobank.ua/bank/currency');

    const foundCurrency = currencyObj.data.find((cur) => {
      return cur.currencyCodeA.toString().toLowerCase() === currency.number.toLowerCase()
    })

    if (
      !foundCurrency
      || !foundCurrency.rateBuy
      || !foundCurrency.rateSell
    ) {
      return ctx.reply('Currency not found in Monobank API')
    }

    return ctx.replyWithMarkdown(`
Валюта: ${currency.code}
Покупка: *${foundCurrency.rateBuy}*
Продаж: *${foundCurrency.rateSell}*
    `)

  } catch (error) {
    console.error(`status: ${error.response.status}, \nstatusText: ${error.response.statusText}`);
    return ctx.reply(`Ви занадто часто використовуєте перевірку валюти! \nЗачекайте, будь ласка, декілька секунд!`)
  }

})


bot.launch()