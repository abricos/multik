#!/usr/bin/env node

/*
 Copyright (c) 2014, Alexander Kuzmin <roosit@abricos.org>
 Code licensed under the MIT License:
 https://github.com/abricos/multik/blob/master/LICENSE
 */

var mout = require('mout');
var path = require('path');
var multik = require('../lib');
var pkg = require(path.join(__dirname, '..', 'package.json'));
var cli = require('../lib/util/cli');

var options;

options = cli.readOptions({
    version: { type: Boolean, shorthand: 'v' },
    help: { type: Boolean, shorthand: 'h' }
    // 'allow-root': { type: Boolean }
});

// console.log(options);