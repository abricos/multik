#!/usr/bin/env node

/*
 Many features and technologies used by bower:
 https://github.com/bower/bower
 Bower - A package manager for the web http://bower.io
 */

process.bin = process.title = 'multik';

var path = require('path');
var mout = require('mout');
var updateNotifier = require('update-notifier');
var Logger = require('bower-logger');
var osenv = require('osenv');

var multik = require('../lib'); // !multik!
var pkg = require(path.join(__dirname, '..', 'package.json'));
var cli = require('../lib/util/cli');
var rootCheck = require('../lib/util/rootCheck');

// --------

var options;
var renderer;
var loglevel;
var command;
var commandFunc;
var logger;
var notifier;
var levels = Logger.LEVELS;

options = cli.readOptions({
    version: { type: Boolean, shorthand: 'v' },
    help: { type: Boolean, shorthand: 'h' },
    'allow-root': { type: Boolean }
});

// Handle print of version
if (options.version) {
    process.stdout.write(pkg.version + '\n');
    process.exit();
}

// Root check
rootCheck(options, multik.config); // !multik!

// Set loglevel
if (multik.config.silent) {
    loglevel = levels.error;
} else if (multik.config.verbose) {
    loglevel = -Infinity;
} else if (multik.config.quiet) {
    loglevel = levels.warn;
} else {
    loglevel = levels[multik.config.loglevel] || levels.info;
}

// Get the command to execute
while (options.argv.remain.length) {
    command = options.argv.remain.join(' ');

    // Alias lookup
    if (multik.abbreviations[command]) {
        command = multik.abbreviations[command].replace(/\s/g, '.');
        break;
    }

    command = command.replace(/s/g, '.');

    // Direct lookup
    if (mout.object.has(multik.commands, command)) {
        break;
    }

    options.argv.remain.pop();
}

// Execute the command
commandFunc = command && mout.object.get(multik.commands, command);
command = command && command.replace(/\./g, ' ');

// If no command was specified, show multik help
// Do the same if the command is unknown
if (!commandFunc) {
    logger = multik.commands.help();
    command = 'help';
// If the user requested help, show the command's help
// Do the same if the actual command is a group of other commands (e.g.: cache)
} else if (options.help || !commandFunc.line) {
    logger = multik.commands.help(command);
    command = 'help';
// Call the line method
} else {
    logger = commandFunc.line(process.argv);

    // If the method failed to interpret the process arguments
    // show the command help
    if (!logger) {
        logger = multik.commands.help(command);
        command = 'help';
    }
}

// Get the renderer and configure it with the executed command
renderer = cli.getRenderer(command, logger.json, multik.config);

logger
    .on('end', function (data) {
        if (!multik.config.silent) {
            renderer.end(data);
        }
    })
    .on('error', function (err)  {
        if (levels.error >= loglevel) {
            renderer.error(err);
        }

        process.exit(1);
    })
    .on('log', function (log) {
        if (levels[log.level] >= loglevel) {
            renderer.log(log);
        }
    })
    .on('prompt', function (prompt, callback) {
        renderer.prompt(prompt)
            .then(function (answer) {
                callback(answer);
            });
    });

// Warn if HOME is not SET
if (!osenv.home()) {
    logger.warn('no-home', 'HOME not set, user configuration will not be loaded');
}

// Check for newer version of Multik
notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
});

if (notifier.update && levels.info >= loglevel) {
    renderer.updateNotice(notifier.update);
}
