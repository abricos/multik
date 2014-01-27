var abbrev = require('abbrev');
var mout = require('mout');
var commands = require('./commands');
// var PackageRepository = require('./core/PackageRepository'); // !multik!

var abbreviations = abbrev(expandNames(commands));
// abbreviations.i = 'install'; // !multik!
// abbreviations.rm = 'uninstall'; // !multik!
// abbreviations.ls = 'list'; // !multik!

function expandNames(obj, prefix, stack) {
    prefix = prefix || '';
    stack = stack || [];

    mout.object.forOwn(obj, function (value, name) {
        name = prefix + name;

        stack.push(name);

        if (typeof value === 'object' && !value.line) {
            expandNames(value, name + ' ', stack);
        }
    });

    return stack;
}

/*  // !multik!
function clearRuntimeCache() {
    // Note that in edge cases, some architecture components instance's
    // in-memory cache might be skipped.
    // If that's a problem, you should create and fresh instances instead.
    PackageRepository.clearRuntimeCache();
}
/**/

module.exports = {
    commands: commands,
    config: require('./config'),
    abbreviations: abbreviations
    // ,reset: clearRuntimeCache // !multik!
};
