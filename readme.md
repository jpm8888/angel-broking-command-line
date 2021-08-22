![ci](https://github.com/yargs/yargs/workflows/ci/badge.svg)
[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]

## Description
`angel` helps you manage portfolios and trading on multiple accounts using command line interface.

## Usage
```
angel --help

Commands
Basic Authentication:
  angel init              initialise with angel api_keys / secret key
  angel user:auth         this is required before log-in, One time everyday.

User Management
  angel user:add            Adds a new user, client id and password is required.
  angel user:login          To start login process. (You can be logged into multiple users at the same time);
  angel user:select         Selects user for the current session.
  angel user:which          User with current session.
  angel user:profile        Profile details of the user.
  angel user:portfolio      Portfolio of the user.
```

## Installation

Stable version:
```bash
npm install -g angel-broking-cli
```

Verify Installation
```bash
angel sayHello
```


[npm-url]: https://www.npmjs.com/package/angel-broking-cli
[npm-image]: https://img.shields.io/npm/v/angel-broking-cli.svg
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
