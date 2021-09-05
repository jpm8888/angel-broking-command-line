#! /usr/bin/env node

const yargs = require('yargs');
const Setup = require('../src/cmd/Init/index');
const Portfolio = require('../src/cmd/Angel/user/portfolio');
const SayHello = require('../src/cmd/Angel/hello');
const Instruments = require('../src/cmd/Angel/instruments');
const Login = require('../src/cmd/Angel/user/login');
const UserAdd = require('../src/cmd/Angel/user/add');
const UserAll = require('../src/cmd/Angel/user/all');
const UserProfile = require('../src/cmd/Angel/user/profile');
const UserSelect = require('../src/cmd/Angel/user/select');
const UserWhich = require('../src/cmd/Angel/user/which');
const UserFunds = require('../src/cmd/Angel/user/funds');
const UserAuth = require('../src/cmd/Angel/user/auth');
const OrderBuy = require('../src/cmd/Angel/order/buy');
const OrderBook = require('../src/cmd/Angel/order/book');

yargs
  .command(Setup)
  .command(UserAuth.command)
  .command(Instruments.commandUpdateInstruments)
  .command(UserAdd.command)
  .command(UserAll.command)
  .command(Login.commandLogin)
  .command(UserProfile.command)
  .command(UserSelect.command)
  .command(UserWhich.command)
  .command(UserFunds.command)
  .command(Portfolio)
  .command(OrderBuy.command)
  .command(OrderBook.command)
  .command(SayHello)
  .parse();
