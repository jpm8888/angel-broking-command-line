#! /usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const Setup = require('../src/cmd/Init/index');
const Login = require('../src/cmd/Angel/user');

const { argv } = yargs(hideBin(process.argv));

if (argv.init) {
  Setup.fire();
  return;
}

if (argv.auth){
  Login.auth().then(()=>{

  });
  return;
}


if (argv.login){
  Login.fire();
  return;
}



