//* Dependencies *//
const { Command, flags } = require('@oclif/command');
const { cli } = require('cli-ux');

const conf = require('conf').default;
const { flagsCheck, grabUser} = require('../utils');

const config = new conf();

//* Command *//
class UserCommand extends Command {
	async run() {
		const { flags } = this.parse(UserCommand);

		let steamid, key;

		if (flags.default) {
			if (config.has('steamid')) {
				flagsCheck(flags, config);

				steamid = config.get('steamid');
				key = config.get('key');

				grabUser(steamid, key);
			} else {
				for (let i = 1; i > 0; i++) {
					await cli.prompt('Please enter the SteamID').then((one) => (steamid = one));
					if (steamid.length == 17) {
						i = -10;
					} else if (steamid.length < 17 || steamid.length > 17) {
						this.warn(`Try Again! Length should be 17 numbers (${steamid.length})`);
					}
				}

				await cli.prompt('Please enter your Steam API key', { type: 'hide' }).then((two) => (key = two));

				config.set('steamid', steamid);
				config.set('key', key);

				grabUser(steamid, key);
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

			if (!config.has('key')) {
				await cli.prompt('Please enter your Steam API key', { type: 'hide' }).then((two) => (key = two));
				config.set('key', key);
				this.log('Your API Key will now be stored for easier use');
			} else {
				key = config.get('key');
			}

			grabUser(steamid, key);
		}
	}
}

//* Description *//
UserCommand.description = `Grabs your Steam profile data`;

//* Examples *//
UserCommand.examples = `
$ steam user
$ steam user -d
$ steam user -d -u 76561198378367745
`;

//* Flags *//
UserCommand.flags = {
	default: flags.boolean({ char: 'd', description: 'Use this to set the given user as the default' }),
	user: flags.string({ char: 'u', description: 'Change the default steamID setting' }),
	key: flags.string({ char: 'k', description: 'Change the current Steam API Key' })
};

//* Export *//
module.exports = UserCommand;
