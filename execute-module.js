#!/usr/bin/env node

var weather = require('./index.js');
var city = process.argv[2];
weather(city);