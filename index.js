/*
 * gulp-merge-with-master
 * 
 * Copyright (c) 2017 Yaser, contributors
 * Licensed under the MIT license.
 * https://github.com/Yaser-Amin/gulp-merge-with-master/blob/master/LICENSE
 */

// through2 is a thin wrapper around node transform streams
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const deepMerge = require('deepmerge');
const fs = require('fs');

// ConstsÍ
const PLUGIN_NAME = 'gulp-merge-master';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

function mergeContents(obj, masterObj) {
  return deepMerge(masterObj, obj, {
    arrayMerge:
    (destinationArray, sourceArray, options) => {
      destinationArray
      sourceArray
      options
      return destinationArray.concat(sourceArray)
    }
  });
}

// Plugin level function(dealing with files)
function gulpMergeMaster(masterFilePath) {

  if (typeof masterFilePath !== 'string') throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
  let masterFileContent = JSON.parse(fs.readFileSync(masterFilePath)); // allocate ahead of time

  // Creating a stream through which each file will pass
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    let fileContent = JSON.stringify(mergeContents(JSON.parse(file.contents), masterFileContent));
    if (file.isBuffer()) {
      file.contents = new Buffer(fileContent);
    }
    if (file.isStream()) {
      file.contents = prefixStream(fileContent);
    }

    cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpMergeMaster;