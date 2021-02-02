steam-api-cli
=============

Steam on the command line

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/steam-api-cli.svg)](https://npmjs.org/package/steam-api-cli)
[![Downloads/week](https://img.shields.io/npm/dw/steam-api-cli.svg)](https://npmjs.org/package/steam-api-cli)
[![License](https://img.shields.io/npm/l/steam-api-cli.svg)](https://github.com/ItzAfroBoy/steam-api-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g steam-api-cli
$ steam COMMAND
running command...
$ steam (-v|--version|version)
steam-api-cli/1.0.0 win32-x64 node-v14.15.4
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
* [`steam user`](#steam-user)

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
  -u, --user=user    Change the default steamID64 setting
```

_See code: [src/commands/inv.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.0.0/src/commands/inv.js)_

## `steam user`

Describe the command here

```
USAGE
  $ steam user

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/user.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.0.0/src/commands/user.js)_
<!-- commandsstop -->
