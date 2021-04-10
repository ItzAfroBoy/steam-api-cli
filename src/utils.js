//* Dependencies *//

const { Currency, Application } = require('@node-steam/data');
const { Market } = require('@node-steam/market-pricing');
const { cli } = require('cli-ux');

const InvAPI = require('steam-inventory-api');
const axios = require('axios').default;
const clear = require('clear');
const chalk = require('chalk');

const API = new Market({ id: Application.CSGO, currency: Currency.USD });
const invAPI = Object.create(InvAPI);

//* Inventory Grabber *//
exports.grabInv = function(
	appid,
	contextid,
	steamid,
	tradable,
	key,
	start_assetid = appid,
	language = 'english',
	count = 5000
) {
	let errors = [];
	let prices = [];
	let inv = [];

	invAPI.init({
		id: 'V.1',
		proxyRepeat: 1,
		maxUse: 25,
		requestInterval: 60 * 1000
	});

	invAPI
		.get({
			appid,
			contextid,
			steamid,
			start_assetid,
			count,
			language,
			tradable
		})
		.then((invRes) => {
			clear();
			let bar = cli.progress({ format: '[{bar}] {percentage}% | {value}/{total} items' });
			let value = 0;
			axios
				.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
				.then(async (res) => {
					for await (let i of invRes.items) {
						inv.push(i.market_hash_name);
					}
					return chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`);
				})
				.then(async (personaname) => {
					bar.start(inv.length, 0);
					for await (let item of inv) {
						await API.getPrice(item)
							.then((x) => {
								prices.push(`$${x.price.median}`);
							})
							.catch(async (_err) => {
								if (_err.code == 'RATELIMIT_EXCEEDED') {
									bar.stop();
									cli.warn('The Steam API Rate Limit has been hit. Prices Unavailable');
									await cli.wait(2000);
									clear();
									await cli.wait();
									console.log(personaname);
									let j = 0;
									let tree = cli.tree();
									tree.insert('Inventory');

									let subtree = cli.tree();

									for await (let item of inv) {
										subtree.insert(`${chalk.redBright(item)}`);
										j++;
									}

									tree.nodes.Inventory.insert(
										`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`,
										subtree
									);
									await cli.wait();
									tree.display();
									await cli.wait();
									process.exit();
								} else if (_err.code == 'ITEM_NOT_FOUND') {
									prices.push('No Price');
								}
							})
							.then(() => {
								value++;
								bar.update(value);
							});
					}
					if (bar.getTotal() == inv.length) {
						bar.stop();
					}
					console.log(personaname);
				})
				.then(async () => {
					let j = 0;
					let tree = cli.tree();
					tree.insert('Inventory');

					let subtree = cli.tree();

					for await (let item of inv) {
						subtree.insert(`${chalk.redBright(item)} | ${chalk.hex('#F78464')(prices[j])}`);
						j++;
					}

					tree.nodes.Inventory.insert(`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`, subtree);
					tree.display();
				});
		})
		.catch((error) => {
			console.error(`Something is wrong:\n${error}`);
		});
};

//* User Grabber *//
exports.grabUser = function(steamid, key) {
	axios
		.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
		.then(async (res) => {
			let user = res.data.response.players[0];
			let date = new Date(user.lastlogoff * 1000);
			let tree = cli.tree();
			clear();
			await cli.wait();
			console.log(chalk.blueBright(`Hello, ${user.personaname}`));
			await cli.wait();
			tree.insert(`${chalk.redBright(`Profile URL: ${user.profileurl}`)}`);
			tree.insert(`${chalk.redBright(`Profile State: ${stateCheck(user.personastate)}`)}`);
			tree.insert(`${chalk.redBright(`Last logoff: ${date.toLocaleString()}`)}`);
			if (user.communityvisibilitystate == 3) {
				date = new Date(user.timecreated * 1000);
				tree.insert(`${chalk.redBright(`Account Created: ${date.toLocaleString()}`)}`);
				tree.insert(`${chalk.redBright(`Real Name: ${user.realname}`)}`);
				tree.insert(`${chalk.redBright(`Country: ${user.loccountrycode}`)}`);
				tree.insert(`${chalk.redBright(`Currently playing: ${user.gameextrainfo || "Fuck all"}`)}`);
			}
			tree.display();
		});
};

//* Profile State Checker *//
function stateCheck(state) {
	if (state == 0) {
		return 'Offline';
	} else if (state == 1) {
		return 'Online';
	} else if (state == 2) {
		return 'Busy';
	} else if (state == 3) {
		return 'Away';
	} else if (state == 4) {
		return 'Snooze';
	} else if (state == 5) {
		return 'Looking to Trade';
	} else if (state == 6) {
		return 'Looking to Play';
	}
}

//* Flag Checker *//
exports.flagsCheck = function(flags, config) {
	if (flags.context) {
		config.set('contextid', flags.context);
		console.log(`${flags.context} set`);
	}
	if (flags.user) {
		config.set('steamid', flags.user);
		console.log(`${flags.user} set`);
	}
	if (flags.game) {
		config.set('appid', flags.game);
		console.log(`${flags.key} set`);
	}
	if (flags.key) {
		config.set('key', flags.key);
		console.log(`${flags.key} set`);
	}
	if (flags.trade) {
		if (flags.trade == 'true') {
			config.set('tradable', true);
			console.log(`${flags.trade} set`);
		} else if (flags.trade == 'false') {
			config.set('tradable', false);
			console.log(`${flags.trade} set`);
		}
	}
};
