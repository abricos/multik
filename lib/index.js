/*
 Copyright (c) 2014, Alexander Kuzmin
 Code licensed under the MIT License:
 https://github.com/multik/mk/blob/master/LICENSE
 */

var log = require('./log'),
    CWD = process.cwd();

exports.cwd = function() {
    return CWD;
};

exports.init = function(opts, initCallback) {

    log.info('OK');
   
   initCallback();
};