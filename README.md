<h1 align='center'>Steam CLI</h1>

<p align='center'>Steam for nerds</p>

<p align='center'>
  <a href='https://oclif.io'><img src='https://img.shields.io/badge/cli-oclif-%233B4554?style=for-the-badge&logo=heroku'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/npm/v/steam-api-cli?color=%23FB8516&logo=npm&style=for-the-badge'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/npm/dw/steam-api-cli?color=%23ec3b2b&style=for-the-badge'></a>
  <a href='https://npmjs.org/package/steam-api-cli'><img src='https://img.shields.io/github/license/ItzAfroBoy/steam-api-cli?color=%23161B22&logo=Github&style=for-the-badge'></a>
  <a href='https://makeapullrequest.com'><img src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge'></a>
</p>

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
* [Updates](#updates)
<!-- tocstop -->

# Usage
 
 <!-- usage -->
```sh-session
$ npm install -g steam-api-cli
$ steam COMMAND
running command...
$ steam (-v|--version|version)
steam-api-cli/1.2.0 win32-x64 node-v14.16.0
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `steam inv`

Grab items from a Steam Inventory

```
USAGE
  $ steam inv

OPTIONS
  -d, --default      Use this to set the given user as the default
  -g, --game=game    Change the default game setting
  -k, --key=key      Change the current Steam API Key setting
  -t, --trade=trade  Change the default show-tradable-item setting
  -u, --user=user    Change the default steamID setting

DESCRIPTION
  Grab items from a Steam Inventory
  You will need to use:
  * Steam API Key
  * Steam ID
  * Game ID

  Note: Your API Key is will be stored no matter how the CLI is run.
  This is for easier use and it is not shared or used outside of
  the program on this system.

EXAMPLES

  $ steam inv //* Runs using one-time settings
  $ steam inv -d //* Runs using default settings
  $ steam inv -d --game 440 //* Runs but changes default game to TF2
```

_See code: [src/commands/inv.js](https://github.com/ItzAfroBoy/steam-api-cli/blob/v1.2.0/src/commands/inv.js)_
<!-- commandsstop -->

# Updates

This current version of `steam-api-cli` is a first launch  
and all features have not been implemented yet but are in progress  

## Future

```markdown
* Retrieve info of Steam user
* View owned games
* Launch games
```

## Change Log

```markdown
* 1.2.0 Code clean up and new error handling  
* 1.1.1 Error handling and Info update
* 1.1.0 Pricing available for CS:GO
* 1.0.0 Inital Release
```

## Contribution

Everyone is absolutly welcome to contribute to this project  
Just fork it, make changes and create a PR and I'll check it out

### License

```license
MIT License

Copyright (c) 2021 ItzAfroBoy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
