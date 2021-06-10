//* Dependencies *//
const { Currency, Application } = require('@node-steam/data');
const { Market } = require('@node-steam/market-pricing');
const { cli } = require('cli-ux');

const InvAPI = require('steam-inventory-api');
const axios = require('axios').default;
const crypto = require('crypto-js');
const clear = require('clear');
const chalk = require('chalk');

const invAPI = Object.create(InvAPI);

//* Inventory Grabber *//
exports.grabInv = (
	appid,
	contextid,
	steamid,
	tradable,
	key,
	start_assetid = appid,
	language = 'english',
	count = 5000
) => {
	let API = new Market({ id: appid, currency: Currency.USD });
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
			let bar = cli.progress({
				format: `${theme.arrow('//==')}${theme.bar('{bar}')}${theme.arrow('=>>')} ${theme.text(
					'{percentage}%'
				)} | ${theme.text('Taken:')} ${theme.time('{duration_formatted}')} | ${theme.text('ETA:')} ${theme.time(
					'{eta_formatted}'
				)} | ${theme.text('{value}/{total} items')}`,
				fps: 60,
				position: 'center',
				stopOnComplete: true
			});
			let value = 0;
			axios
				.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
				.then(async (res) => {
					for await (let i of invRes.items) {
						inv.push(i.market_hash_name);
					}
					inv.sort();
					return chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`);
				})
				.then(async (personaname) => {
					bar.start(inv.length, 0);
					for await (let item of inv) {
						await API.getPrice(item)
							.then((x) => {
								prices.push(parseFloat(x.price.median.toFixed(2)));
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
										entry(subtree, item);
										j++;
									}

									tree.nodes.Inventory.insert(`${theme.items(`${invRes.total} items`)}`, subtree);
									await cli.wait();
									tree.display();
									await cli.wait();
									process.exit();
								} else if (_err.code == 'ITEM_NOT_FOUND') {
									prices.push(0);
								}
							})
							.then(() => {
								value++;
								bar.update(value);
							});
					}
					console.log(personaname);
				})
				.then(async () => {
					let j = 0;
					let tree = cli.tree();
					tree.insert('Inventory');

					let subtree = cli.tree();

					for await (let item of inv) {
						entry(subtree, item, `$${prices[j].toFixed(2)}`, '|');
						j++;
					}

					tree.nodes.Inventory.insert(theme.items(`${invRes.total} items`), subtree);
					tree.nodes.Inventory.insert(theme.price(`Total Value: $${invWorth(prices)}`));
					tree.display();
					process.exit();
				});
		})
		.catch((error) => {
			console.error(`Something is wrong:\n${error}`);
			process.exit();
		});
};

//* User Grabber *//
exports.grabUser = (steamid, key) => {
	axios
		.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`)
		.then(async (res) => {
			let user = res.data.response.players[0];
			let date = new Date(user.lastlogoff * 1000);
			let tree = cli.tree();
			clear();
			await cli.wait();
			console.log(theme.name(`Hello, ${user.personaname}`));
			await cli.wait();
			entry(tree, 'Profile URL', user.profileurl, ':');
			entry(tree, 'Profile State', stateCheck(user.personastate), ':');
			entry(tree, 'Last logoff', date.toLocaleString(), ':');
			if (user.communityvisibilitystate == 3) {
				date = new Date(user.timecreated * 1000);
				entry(tree, 'Account Created', date.toLocaleString(), ':');
				entry(tree, 'Real Name', user.realname, ':');
				entry(tree, 'Country', user.loccountrycode, ':');
				entry(tree, 'Currently playing', user.gameextrainfo || 'Nothing you donkey', ':');
			}
			tree.display();
		});
};

//* Flag Checker *//
exports.flagsCheck = (flags, config) => {
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

exports.hasher = (message) => {
	return;
};

//* Profile State Checker *//
const stateCheck = (state) => {
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
};

//* Tree Insert Helper *//
const entry = (tree, title, value, seperator) => {
	if (value != undefined && seperator == undefined) seperator = '|';
	else if (value == undefined && seperator == undefined) return tree.insert(`${theme.title(title)}`);
	let re = /[\*\~\-\+\^\¦\|\.\>]/;
	let reTwo = /[\:]/;
	let match = re.exec(seperator);
	let matchTwo = reTwo.exec(seperator);
	let sep;
	if (match) sep = ` ${match[0]}`;
	else if (matchTwo) sep = `${matchTwo[0]}`;
	return tree.insert(`${theme.title(title)}${sep} ${theme.value(value)}`);
};

//* Inventory Value Checker *//
const invWorth = (inv) => {
	let x = inv.reduce((a, b) => a + b, 0);
	return x.toFixed(2);
};

//* Theme *//
const theme = {
	bar: chalk.yellow,
	name: chalk.blueBright,
	title: chalk.redBright,
	text: chalk.hex('#EC9192'),
	time: chalk.hex('#35A7FF'),
	value: chalk.hex('#F78464'),
	arrow: chalk.hex('#6D9DC5'),
	price: chalk.hex('#AEECEF'),
	items: chalk.hex('#98A2DF')
};
