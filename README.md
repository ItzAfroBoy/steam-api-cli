<h1 align='center'>steam-api-cli</h1>

<p align='center'>Steam for nerds</p>

<p align='center'>
  <a href='https://oclif.io'><img src='https://img.shields.io/badge/cli-oclif-%233B4554?style=for-the-badge&logo=heroku'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/npm/v/steam-api-cli?color=%23FB8516&logo=npm&style=for-the-badge'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/npm/dw/steam-api-cli?color=%23ec3b2b&style=for-the-badge'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/github/license/ItzAfroBoy/steam-api-cli?color=%23161B22&logo=Github&style=for-the-badge'></a>
</p>

# Usage

<!-- usage -->
```sh-session
$ npm install -g steam-api-cli
$ steam COMMAND
running command...
$ steam (-v|--version|version)
steam-api-cli/1.1.0 win32-x64 node-v14.15.4
$ steam --help [COMMAND]
USAGE
  $ steam COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g steam-api-cli
$ steam COMMAND
running command...
$ steam (-v|--version|version)
steam-api-cli/1.1.0 win32-x64 node-v14.15.4
$ steam --help [COMMAND]
USAGE
  $ steam COMMAND
...
```
<!-- usagestop -->

# Commands
<!-- commands -->
* [`steam help [COMMAND]`](#steam-help-command)
* [`steam inv`](#steam-inv)

## `steam help [COMMAND]`

display help for steam

```
USAGE
  $ steam help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `steam inv`

Grab your items from your inventory

```
USAGE
  $ steam inv

OPTIONS
  -d, --default      Use this to set the given user as the default
  -g, --game=game    Change the default game setting
  -t, --trade=trade  Change the default show-tradeable-item setting
  -u, --user=user    Change the default steamID setting
```

_See code: [src/commands/inv.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.1.0/src/commands/inv.js)_
<!-- commandsstop -->
* [`steam help [COMMAND]`](#steam-help-command)
* [`steam inv`](#steam-inv)

## `steam help [COMMAND]`

Display help for Steam

```
USAGE
  $ steam help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `steam inv`

Grab your items from your inventory

```
USAGE
  $ steam inv

OPTIONS
  -d, --default      Use this to set the given user as the default
  -g, --game=game    Change the default game setting
  -t, --trade=trade  Change the default show-tradeable-item setting
  -u, --user=user    Change the default steamID setting
```

_See code: [src/commands/inv.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.1.0/src/commands/inv.js)_
<!-- commandsstop -->

* [`steam help [COMMAND]`](#steam-help-command)
* [`steam inv`](#steam-inv)

## `steam help [COMMAND]`

Display `help` for `steam`

```sh-session
USAGE
  $ steam help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `steam inv`

Grab your items from your inventory

```sh-session
USAGE
  $ steam inv

OPTIONS
  -d, --default      Use this to set the given user as the default
  -g, --game=game    Change the default game setting
  -t, --trade=trade  Change the default show-tradeable-item setting
  -u, --user=user    Change the default steamID setting
```

_See code: [src/commands/inv.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.0.0/src/commands/inv.js)_
<!-- commandsstop -->

## Updates

This current version of `steam-api-cli` is a first launch  
and all features have not been implemented yet but are in progress  

### Future

```markdown
* Retrieve info of Steam user
* View owned games
* Launch games
```

### Change Log

```markdown
* 1.1.0 Pricing available for CS:GO
* 1.0.0 Inital Release
```
