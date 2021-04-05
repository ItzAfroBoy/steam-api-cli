//* Dependencies //

const { Currency, Application } = require('@node-steam/data');
const { Market } = require('@node-steam/market-pricing');
const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');

const InvAPI = require('steam-inventory-api');
const axios = require('axios').default;
const clear = require('clear');
const chalk = require('chalk');
const conf = require('conf');
const fs = require('fs');

const API = new Market({ id: Application.CSGO, currency: Currency.USD });
const invAPI = Object.create(InvAPI);
const config = new conf();

//* Command *//
class invCommand extends Command {
	async run() {
		const { flags } = this.parse(invCommand);

		let steamid, appid, start_assetid, tradable, key;
		const contextid = 2;
		const count = 5000;
		const language = 'english';

		let errors = [];
		let prices = [];
		let inv = [];

		if (flags.default) {
			if (!config.get('steamid')) {
				for (let i = 1; i > 0; i++) {
					Number(await cli.prompt('Please enter the SteamID').then((one) => (steamid = one)));
					if (String(steamid).length == 17) {
						i = -10;
					} else if (String(steamid).length < 17 || String(steamid).length > 17) {
						this.warn(`Try Again! Length should be 17 numbers (${String(steamid).length})`);
					}
				}

				Number(
					await cli.prompt('Please enter the appID', { default: '730' }).then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Please enter your API key', { type: 'hide' }).then((three) => (key = three));

				await cli.prompt('Want to only show tradable items? (y/n)', { default: 'n' }).then((four) => {
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
						cli.action.start('Collecting');
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
									await API.getPrice(item)
										.then((x) => {
											prices.push(`$${x.price.median}`);
										})
										.catch((_err) => {
											prices.push('Not Tradable');
											errors.push(`${item} has no price`);
										});
								}
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

								tree.nodes.Inventory.insert(
									`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`,
									subtree
								);
								tree.display();
								fs.writeFile(this.config.errlog, `${errors.join('\n')}`, function(err) {
									if (err) {
										throw err;
									}
								});
								cli.action.stop('Done');
								process.exit();
							});
					})
					.catch((error) => {
						this.error(`Something is wrong:\n${error}`);
					});
			} else {
				if (flags.user) {
					config.set('steamid', flags.user);
				} else if (flags.game) {
					config.set('appid', flags.game);
				} else if (flags.key) {
					config.set('key', flags.key);
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
						cli.action.start('Collecting');
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
									await API.getPrice(item)
										.then((x) => {
											prices.push(`$${x.price.median}`);
										})
										.catch((_err) => {
											prices.push('Not Tradable');
											errors.push(`${item} has no price`);
										});
								}
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

								tree.nodes.Inventory.insert(
									`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`,
									subtree
								);
								tree.display();
								fs.writeFile(this.config.errlog, `${errors.join('\n')}`, function(err) {
									if (err) {
										throw err;
									}
								});
								cli.action.stop('Done');
								process.exit();
							});
					})
					.catch((error) => {
						this.error(`Something is wrong:\n${error}`);
					});
			}
		} else {
			if (!config.get('key')) {
				for (let i = 1; i > 0; i++) {
					Number(await cli.prompt('Please enter the SteamID').then((one) => (steamid = one)));
					if (String(steamid).length == 17) {
						i = -10;
					} else if (String(steamid).length < 17 || String(steamid).length > 17) {
						this.warn(`Try Again! Length should be 17 numbers (${String(steamid).length})`);
					}
				}

				Number(
					await cli.prompt('Please enter the appID?', { default: '730' }).then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Please enter your Steam API key', { type: 'hide' }).then((three) => (key = three));

				await cli.prompt('Want to only show tradable items? (y/n)', { default: 'n' }).then((four) => {
					if (four == 'y') {
						tradable = true;
					} else {
						tradable = false;
					}
				});

				config.set('key', key);

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
						cli.action.start('Collecting');
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
									await API.getPrice(item)
										.then((x) => {
											prices.push(`$${x.price.median}`);
										})
										.catch((_err) => {
											prices.push('Not Tradable');
											errors.push(`${item} has no price`);
										});
								}
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

								tree.nodes.Inventory.insert(
									`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`,
									subtree
								);
								tree.display();
								fs.writeFile(this.config.errlog, `${errors.join('\n')}`, function(err) {
									if (err) {
										throw err;
									}
								});
								cli.action.stop('Done');
								process.exit();
							});
					})
					.catch((error) => {
						this.error(`Something is wrong:\n${error}`);
					});
			} else {
				for (let i = 1; i > 0; i++) {
					Number(await cli.prompt('Please enter the SteamID').then((one) => (steamid = one)));
					if (String(steamid).length == 17) {
						i = -10;
					} else if (String(steamid).length < 17 || String(steamid).length > 17) {
						this.warn(`Try Again! Length should be 17 numbers (${String(steamid).length})`);
					}
				}

				Number(
					await cli.prompt('Please enter the appID?', { default: '730' }).then((two) => {
						appid = Number(two);
						start_assetid = Number(two);
					})
				);

				await cli.prompt('Want to only show tradable items? (y/n)', { default: 'n' }).then((three) => {
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
						cli.action.start('Collecting');
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
									await API.getPrice(item)
										.then((x) => {
											prices.push(`$${x.price.median}`);
										})
										.catch((_err) => {
											prices.push('Not Tradable');
											errors.push(`${item} has no price`);
										});
								}
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

								tree.nodes.Inventory.insert(
									`${chalk.hex('#7FE0EB')(`${invRes.total} items`)}`,
									subtree
								);
								tree.display();
								fs.writeFile(this.config.errlog, `${errors.join('\n')}`, function(err) {
									if (err) {
										throw err;
									}
								});
								cli.action.stop('Done');
								process.exit();
							});
					})
					.catch((error) => {
						this.error(`Something is wrong:\n${error}`);
					});
			}
		}
	}
}

//* Description
invCommand.description = `
Grab items from a Steam Inventory
You will need to use:
* Steam API Key
* Steam ID
* Game ID

Note: Your API Key is will be stored no matter how the CLI is run.
	  This is for easier use and it is not shared or used outside of
	  the program on this system.
`;

invCommand.usage = `steam inv [-d --default [-u --user <ID>] [-g --game <ID>] [-t --trade <true> || <false>] [-k --key <key>] ]`;

invCommand.examples = `
$ steam inv //* Runs using one-time settings
$ steam inv -d //* Runs using default settings
$ steam inv -d --game 440 //* Runs but changes default game to TF2
`;

//* Flags
invCommand.flags = {
	default: flags.boolean({ char: 'd', description: 'Use this to set the given user as the default' }),
	user: flags.integer({ char: 'u', description: 'Change the default steamID setting' }),
	game: flags.integer({ char: 'g', description: 'Change the default game setting' }),
	trade: flags.string({ char: 't', description: 'Change the default show-tradable-item setting' }),
	key: flags.string({ char: 'k', description: 'Change the current Steam API Key setting' })
};

module.exports = invCommand;
