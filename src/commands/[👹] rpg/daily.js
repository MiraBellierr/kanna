const schemas = require("../../database/schemas");
const economies = require("../../utils/economies");
const constants = require("../../utils/constants");

module.exports = {
	name: "daily",
	description: "Daily to earn coins",
	category: "[🎩] economy",
	run: async (client, message) => {
		const coins = await economies.getCoins(message.author);

		if (!coins)
			return message.reply(
				`You haven't registered yet! Please use \`${constants.prefix}register <class>\` to register.`
			);

		const timer = await economies.getCooldown(message.author, "daily", 864e5);

		if (timer)
			return message.reply(
				`**${message.author.username}**, Please wait **${timer.hours}h ${timer.seconds}s** before you can claim your daily again.`
			);

		schemas.timer().update(
			{
				daily: Date.now(),
			},
			{ where: { userID: message.author.id } }
		);

		schemas.coins().update(
			{
				wallet: coins.get("wallet") + 50,
			},
			{ where: { userID: message.author.id } }
		);

		const amount = `${constants.coins.emoji} 100`;

		return message.reply(`You claimed your daily and got ${amount}!`);
	},
};
