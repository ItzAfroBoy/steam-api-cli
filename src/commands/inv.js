//? Requiring node modules ⤵
const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');

const InventoryApi = require('steam-inventory-api');
const market = require('steam-market-pricing');
const axios = require('axios').default;
const clear = require('clear');
const chalk = require('chalk');
const conf = require('conf');
const fs = require('fs');

const invAPI = Object.create(InventoryApi);
const config = new conf();

config.set('key', '2C49CCD0F3246F55FBAE752F8EFD607E');

//* The actual command ⬇
class invCommand extends Command {
	async run() {
		const { flags } = this.parse(invCommand); //* Get flags

		//* Default definitions
		const contextid = 2;
		const count = 5000;
		const language = 'english';

		let steamid, appid, start_assetid, tradable, username;

		if (flags.default) {
			if (!config.get('steamid')) {
				this
					.warn(`You will need the steamID64 of the profile and the appID of the game to retrieve the invtntory
        You can use https://steamid.io and input there profile URL
        This can be retrieved by visiting their profile and copy the URL
        Setting default settings`);

				Number(
					await cli.prompt('What is the steamID64?').then((one) => {
						steamid = one;
					})
				);
				Number(
					await cli.prompt('What is the appID?').then((two) => {
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
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.get(
									'key'
								)}&steamids=${steamid}`
							)
							.then((res) => {
								username = res.data.response.players[0].personaname;
								this.log(chalk.blueBright(`Hello, ${username}`));
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();
								for (let i = 0; i < invRes.total; i++) {
									subtree.insert(`${chalk.redBright(invRes.items[i].market_hash_name)}`);
								}
								tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);

								tree.display();
								cli.wait(500);
								process.exit();
							});
					});
			} else {
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
						axios
							.get(
								`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.get(
									'key'
								)}&steamids=${steamid}`
							)
							.then((res) => {
								username = res.data.response.players[0].personaname;
								this.log(chalk.blueBright(`Hello, ${username}`));
								let tree = cli.tree();
								tree.insert('Inventory');

								let subtree = cli.tree();
								for (let i = 0; i < invRes.total; i++) {
									subtree.insert(`${chalk.redBright(invRes.items[i].market_hash_name)}`);
								}
								tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);

								tree.display();
								cli.wait(500);
								process.exit();
							});
					});
			}
		} else {
			this.warn('You will need the steamID64 of the profile and the appID of the game to retrieve the inventory');
			this.warn('You can use https://steamid.io and input there profile URL');
			this.warn('This can be retrieved by visiting their profile and copy the URL');

			Number(
				await cli.prompt('What is the steamID64?').then((one) => {
					steamid = one;
				})
			);
			Number(
				await cli.prompt('What is the appID?').then((two) => {
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
					axios
						.get(
							`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.get(
								'key'
							)}&steamids=${steamid}`
						)
						.then(async (res) => {
							username = res.data.response.players[0].personaname;
							this.log(chalk.blueBright(`Hello, ${username}`));
							let tree = cli.tree();
							tree.insert('Inventory');

							let subtree = cli.tree();
							for (let i = 0; i < invRes.total; i++) {
								subtree.insert(`${chalk.redBright(invRes.items[i].market_hash_name)}`);
							}
							tree.nodes.Inventory.insert(`${chalk.cyan(`${invRes.total} items`)}`, subtree);

							tree.display();
							cli.wait(500);
							process.exit();
						});
				});
		}
	}
}

invCommand.description = `Grab your items from your inventory`;

invCommand.flags = {
	default: flags.boolean({ char: 'd', description: 'Use this to set the given user as the default' }),
	user: flags.integer({ char: 'u', description: 'Change the default steamID64 setting' }),
	game: flags.integer({ char: 'g', description: 'Change the default game setting' }),
	trade: flags.string({ char: 't', description: 'Change the default show-tradeable-item setting' })
};

invCommand.strict = false;

module.exports = invCommand;
