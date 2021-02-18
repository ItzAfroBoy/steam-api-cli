//* Dependencies

const { Currency, Application } = require('@node-steam/data');
const { Market, error } = require('@node-steam/market-pricing');
const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');

const InventoryApi = require('steam-inventory-api');
const axios = require('axios').default;
const clear = require('clear');
const chalk = require('chalk');
const conf = require('conf');
const fs = require('fs');

const API = new Market({ id: Application.CSGO, currency: Currency.USD });
const invAPI = Object.create(InventoryApi);
const config = new conf();

//* Command
class invCommand extends Command {
	async run() {
		const { flags } = this.parse(invCommand);

		//* Default definitions
		const contextid = 2;
		const count = 5000;
		const language = 'english';
		let prices = [];
		let inv = [];
		let steamid, appid, start_assetid, tradable, username, key;

		if (flags.default) {
			if (!config.get('steamid')) {
				this.warn('Please use a SteamID64, AppID and Steam API key');
				await cli.wait(500);
				this.warn('You can use https://steamid.io to get ID');
				await cli.wait(550);
				this.warn('AppID can be found in the properties of the game');
				await cli.wait();

				Number(
					await cli.prompt('Please enter the steamID').then((one) => {
						steamid = one;
					})
				);

				Number(
					await cli.prompt('Please enter the appID').then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Please enter your API key').then((three) => {
					key = three;
				});

				await cli.prompt('Want to only show tradeable items? (y/n)', { default: 'n' }).then((four) => {
					if (four == 'y') {
						tradable = true;
					} else {
						tradable = false;
					}
				});

				config.set('key', key);
				config.set('appid', appid);
				config.set('steamid', steamid);
				config.set('tradable', tradable);

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
						cli.action.start('Collecting', null, {stdout: true});
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`
							)
							.then(async (res) => {
								this.log(chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`));
								for await (let i of invRes.items) {
									inv.push(i.market_hash_name);
								}
							})
							.then(async () => {
								for await (let item of inv) {
									if (item.includes('Graffiti')) {
										prices.push('Sticker');
									} else {
										let x = await API.getPrice(item);
										prices.push(`$${x.price.median}`);
									}
								}
							})
							.then(async () => {
								let j = 0;
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();

								for await (let yolo of inv) {
									subtree.insert(`${chalk.redBright(yolo)} | ${chalk.yellow(prices[j])}`);
									j++;
								}

								tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);
								tree.display();
								cli.action.stop('Done');
								process.exit();
							});
					});
			} else {
				if (flags.user) {
					config.set('steamid', flags.user);
				} else if (flags.game) {
					config.set('appid', flags.game);
				} else if (flags.trade) {
					if (flags.trade == 'true') {
						config.set('tradable', true);
					} else if (flags.trade == 'false') {
						config.set('tradable', false);
					}
				}

				key = config.get('key');
				appid = config.get('appid');
				steamid = config.get('steamid');
				tradable = config.get('tradable');

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
						cli.action.start('Collecting', null, {stdout: true});
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`
							)
							.then(async (res) => {
								this.log(chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`));
								for await (let i of invRes.items) {
									inv.push(i.market_hash_name);
								}
							})
							.then(async () => {
								for await (let item of inv) {
									if (item.includes('Graffiti')) {
										prices.push('Sticker');
									} else {
										let x = await API.getPrice(item);
										prices.push(`$${x.price.median}`);
									}
								}
							})
							.then(async () => {
								let j = 0;
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();

								for await (let yolo of inv) {
									subtree.insert(`${chalk.redBright(yolo)} | ${chalk.hex('#F78464')(prices[j])}`);
									j++;
								}

								tree.nodes.Inventory.insert(`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`, subtree);
								tree.display();
								cli.action.stop('Done');
								process.exit();
							});
					});
			}
		} else {
			if (!config.get('key')) {
				this.warn('Please use a SteamID, AppID and Steam API key');
				cli.wait(500);
				this.warn('You can use https://steamid.io to get ID');
				cli.wait(600);
				this.warn('AppID can be found in the properties of the game');
				cli.wait();

				Number(
					await cli.prompt('Please enter the SteamID').then((one) => {
						steamid = one;
					})
				);

				Number(
					await cli.prompt('Please enter the appID?').then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Please enter your Steam API key').then((three) => {
					key = three;
					config.set('key', key);
				});

				await cli.prompt('Want to only show tradeable items? (y/n)', { default: 'n' }).then((four) => {
					if (four == 'y') {
						tradable = true;
					} else {
						tradable = false;
					}
				});

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
						cli.action.start('Collecting', null, {stdout: true});
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamid}`
							)
							.then(async (res) => {
								this.log(chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`));
								for await (let i of invRes.items) {
									inv.push(i.market_hash_name);
								}
							})
							.then(async () => {
								for await (let item of inv) {
									if (item.includes('Graffiti')) {
										prices.push('Sticker');
									} else {
										let x = await API.getPrice(item);
										prices.push(`$${x.price.median}`);
									}
								}
							})
							.then(async () => {
								let j = 0;
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();

								for await (let yolo of inv) {
									subtree.insert(`${chalk.redBright(yolo)} | ${chalk.hex('#F78464')(prices[j])}`);
									j++;
								}

								tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);
								tree.display();
								cli.action.stop('Done');
								process.exit();
							});
					});
			} else {
				this.warn('Please use a SteamID and AppID to use this CLI');
				cli.wait(500);
				this.warn('You can use https://steamid.io to get ID');
				cli.wait(600);
				this.warn('AppID can be found in the properties of the game');
				cli.wait();

				Number(
					await cli.prompt('Please enter the SteamID').then((one) => {
						steamid = one;
					})
				);

				Number(
					await cli.prompt('Please enter the appID?').then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Want to only show tradeable items? (y/n)', { default: 'n' }).then((three) => {
					if (three == 'y') {
						tradable = true;
					} else {
						tradable = false;
					}
				});

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
						cli.action.start('Collecting', null, {stdout: true});
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.get(
									'key'
								)}&steamids=${steamid}`
							)
							.then(async (res) => {
								this.log(chalk.blueBright(`Hello, ${res.data.response.players[0].personaname}`));
								for await (let i of invRes.items) {
									inv.push(i.market_hash_name);
								}
							})
							.then(async () => {
								for await (let item of inv) {
									if (item.includes('Graffiti')) {
										prices.push('Sticker');
									} else {
										let x = await API.getPrice(item);
										prices.push(`$${x.price.median}`);
									}
								}
							})
							.then(async () => {
								let j = 0;
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();

								for await (let yolo of inv) {
									subtree.insert(`${chalk.redBright(yolo)} | ${chalk.yellow(prices[j])}`);
									j++;
								}

								tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);
								tree.display();
								cli.action.stop('Done');
								process.exit();
							});
					});
			}
		}
	}
}

//* Description
invCommand.description = `Grab your items from your inventory`;

//* Flags
invCommand.flags = {
	default: flags.boolean({ char: 'd', description: 'Use this to set the given user as the default' }),
	user: flags.integer({ char: 'u', description: 'Change the default steamID setting' }),
	game: flags.integer({ char: 'g', description: 'Change the default game setting' }),
	trade: flags.string({ char: 't', description: 'Change the default show-tradeable-item setting' })
};

invCommand.strict = false;

module.exports = invCommand;