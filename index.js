'use strict';

var through = require('through2');
var path = require('path');
var fs = require('fs');
var PluginError = require('gulp-util').PluginError;
var deepMerge = require('deepmerge');

/**
 * gulp MergeMaster method
 * @param {string} destination
 * @param {object} opts
 * @returns {object}
 */
function gulpMergeMaster(destination, opts) {
    var throughOptions = { objectMode: true };

    // Make sure a destination was verified
    if (typeof destination !== 'string') {
        throw new PluginError('gulp-merge-master', 'No valid destination specified');
    }

    // Default options
    if (opts === undefined) {
        opts = opts || {};
    }
    else if (typeof opts !== 'object' || opts === null) {
        throw new PluginError('gulp-merge-master', 'No valid options specified');
    }
    else if (!opt.master) throw new PluginError('gulp-merge-master', 'master option is is required');

    return through(throughOptions, transform);

    /**
     * Transform method, copies the file to its new destination
     * @param {object} file
     * @param {string} encoding
     * @param {function} cb
     */
    function transform(file, encoding, cb) {
        var rel = null;
        var fileDestination = null;

        if (file.isStream()) {
            return cb(new PluginError('gulp-merge-master', 'Streaming not supported'));
        }

        if (!file.isNull()) {
            rel = path.relative(file.cwd, file.path).replace(/\\/g, '/');

            // Strip path prefixes
            if (opts.prefix) {
                var p = opts.prefix;
                while (p-- > 0) {
                    rel = rel.substring(rel.indexOf('/') + 1);
                }
            }

            fileDestination = destination + '/' + rel;

            // Make sure destination exists
            if (!doesPathExist(fileDestination)) {
                createDestination(fileDestination.substr(0, fileDestination.lastIndexOf('/')));
            }

            // MergeMaster the file
            MergeMasterFile(file.path, fileDestination, opt.master, function (error) {
                if (error) {
                    throw new PluginError('gulp-merge-master', 'Could not merge file <' + file.path + '>: ' + error.message);
                }

                // Update path for file so this path is used later on
                file.path = fileDestination;
                cb(null, file);
            });
        }
        else {
            cb(null, file);
        }
    }
}

/**
 * Recursively creates the path
 * @param {string} destination
 */
function createDestination(destination) {
    var folders = destination.split('/');
    var path = [];
    var l = folders.length;
    var i = 0;

    for (i; i < l; i++) {
        path.push(folders[i]);

        if (folders[i] !== '' && !doesPathExist(path.join('/'))) {
            try {
                fs.mkdirSync(path.join('/'));
            } catch (error) {
                throw new PluginError('gulp-merge-master', 'Could not create destination <' + destination + '>: ' + error.message);
            }
        }
    }
}

/**
 * Check if the path exists
 * @param path
 * @returns {boolean}
 */
function doesPathExist(path) {
    var pathExists = true;

    try {
        fs.accessSync(path);
    }
    catch (error) {
        pathExists = false;
    }

    return pathExists;
}

/**
 * MergeMaster a file to its new destination
 * @param {string} source
 * @param {string} target
 * @param {function} MergeMasterCallback
 */
function MergeMasterFile(source, target, masterPath, MergeMasterCallback) {
    var done = false;

    const masterContent = JSON.parse(fs.readFileSync(masterPath));
    const fileContent = JSON.parse(fs.readFileSync(source));
    let content = deepMerge(masterContent, fileContent, { arrayMerge: concatMerge });
    fs.writeFileSync(target,JSON.stringify(content));

    /*var readStream = fs.createReadStream(source);
    var writeStream = fs.createWriteStream(target);

    readStream.on('error', MergeMasterDone);
    writeStream.on('error', MergeMasterDone);

    writeStream.on('close', function () {*/
        MergeMasterDone(null);
    /*});

    readStream.pipe(writeStream);*/

    /**
     * Finish MergeMastering. Reports error when needed
     * @param [error] optional error
     */
    function MergeMasterDone(error) {
        if (!done) {
            done = true;
            MergeMasterCallback(error);
        }
    }
}

module.exports = gulpMergeMaster;