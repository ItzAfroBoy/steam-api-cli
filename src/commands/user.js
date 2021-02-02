const { Command, flags } = require('@oclif/command');

class UserCommand extends Command {
	async run() {
		const { flags } = this.parse(UserCommand);
		const name = flags.name || 'world';
		this.log(`hello ${name} from C:\\Users\\xb0xl\\Documents\\steam-api-cli\\src\\commands\\user.js`);
	}
}

UserCommand.description = `Describe the command here
...
Extra documentation goes here
`;

UserCommand.flags = {
	name: flags.string({ char: 'n', description: 'name to print' })
};

module.exports = UserCommand;
