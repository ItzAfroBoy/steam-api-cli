//* Dependencies *//
const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');

const { flagsCheck, grabInv } = require('../../utils');
const conf = require('conf').default;

const config = new conf();

//* Command *//
class invCommand extends Command {
	async run() {
		const { flags } = this.parse(invCommand);

		let contextid, tradable, steamid, appid, key;

		if (flags.default) {
			if (config.has('steamid')) {
				flagsCheck(flags, config);

				contextid = config.get('contextid');
				tradable = config.get('tradable');
				steamid = config.get('steamid');
				appid = config.get('appid');
				key = config.get('key');

				grabInv(appid, contextid, steamid, tradable, key);
			} else {
				for (let i = 1; i > 0; i++) {
					await cli.prompt('Please enter the SteamID').then((one) => (steamid = one));
					if (steamid.length == 17) {
						i = -10;
					} else if (steamid.length < 17 || steamid.length > 17) {
						this.warn(`Try Again! Length should be 17 numbers (${steamid.length})`);
					}
				}

				await cli.prompt('Please enter the appID', { default: '730' }).then((two) => {
					appid = Number(two);
				});

				await cli.prompt('Please enter the Context ID', { default: '2' }).then((three) => (contextid = three));

				await cli.prompt('Please enter your Steam API key', { type: 'hide' }).then((four) => (key = four));

				await cli.prompt('Want to only show tradable items? (y/n)', { default: 'n' }).then((five) => {
					if (five == 'y') {
						tradable = true;
					} else {
						tradable = false;
					}
				});

				config.set('contextid', contextid);
				config.set('tradable', tradable);
				config.set('steamid', steamid);
				config.set('appid', appid);
				config.set('key', key);

				grabInv(appid, contextid, steamid, tradable, key);
			}
		} else {
			for (let i = 1; i > 0; i++) {
				await cli.prompt('Please enter the SteamID').then((one) => (steamid = one));
				if (steamid.length == 17) {
					i = -10;
				} else if (steamid.length < 17 || steamid.length > 17) {
					this.warn(`Try Again! Length should be 17 numbers (${steamid.length})`);
				}
			}

			await cli.prompt('Please enter the appID', { default: '730' }).then((two) => {
				appid = Number(two);
			});

			await cli.prompt('Please enter the Context ID', { default: '2' }).then((three) => (contextid = three));

			if (config.has('key')) {
				key = config.get('key');
			} else {
				await cli.prompt('Please enter your Steam API key', { type: 'hide' }).then((four) => (key = four));
				config.set('key', key);
				this.log('Your API Key will now be stored for easier use');
			}

			await cli.wait();

			await cli.prompt('Want to only show tradable items? (y/n)', { default: 'n' }).then((five) => {
				if (five == 'y') {
					tradable = true;
				} else {
					tradable = false;
				}
			});

			grabInv(appid, contextid, steamid, tradable, key);
		}
	}
}

//* Description *//
invCommand.description = `Grab items from a Steam Inventory`;

//* Examples *//
invCommand.examples = `
$ steam user:inv
$ steam user:inv -d
$ steam user:inv -d --game 440
`;

//* Flags *//
invCommand.flags = {
	default: flags.boolean({ char: 'd', description: 'Use this to set the given user as the default' }),
	trade: flags.string({ char: 't', description: 'Change the default show-tradable-item setting' }),
	context: flags.integer({ char: 'c', description: 'Changes the default context id setting' }),
	user: flags.string({ char: 'u', description: 'Change the default steamID setting' }),
	game: flags.integer({ char: 'g', description: 'Change the default game setting' }),
	key: flags.string({ char: 'k', description: 'Change the current Steam API Key' })
};

//* Export *//
module.exports = invCommand;
