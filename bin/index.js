#! /usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Setup = require('../src/cmd/Init/index');
const User = require('../src/cmd/Angel/user');
const Portfolio = require('../src/cmd/Angel/portfolio');

const { argv } = yargs(hideBin(process.argv));

if (argv.init) {
  Setup.fire();
  return;
}

if (argv.auth){
  User.auth().then(()=>{});
  return;
}

if (argv.login){
  User.fire();
  return;
}

if (argv.profile){
  User.getProfile().then(()=>{});
  return;
}

if (argv.funds){
  User.funds().then(()=>{});
  return;
}

if (argv.holdings){
  Portfolio.getHoldings().then(()=>{});
}



