#! /usr/bin/env node

const yargs = require('yargs');
const Setup = require('../src/cmd/Init/index');
const User = require('../src/cmd/Angel/user');
const Portfolio = require('../src/cmd/Angel/portfolio');
const SayHello = require('../src/cmd/Angel/hello');

yargs
  .command(Setup)
  .command({
    command: 'auth',
    describe: 'To sign in angel broking system via web-browser (required to use this utility.)',
    handler: () => {
      User.auth().then(() => {});
    },
  })

  .command({
    command: 'login',
    describe: 'login using your username and password.',
    handler: () => {
      User.fire();
    },
  })
  .command({
    command: 'profile',
    describe: 'shows information about your profile.',
    handler: () => {
      User.getProfile().then(() => {});
    },
  })
  .command({
    command: 'funds',
    describe: 'check your funds status.',
    handler: () => {
      User.funds().then(() => {});
    },
  })
  .command(Portfolio)
  .command(SayHello)

  .parse();
