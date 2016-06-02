/*jshint -W097 */
'use strict';

var LOG_ID = 'find-npm-assets';
var NODE_MODULES_DIR = 'node_modules';
var PACKAGE_INFO = 'package.json';

var path = require('path');
var gutil = require('gulp-util');

var verbose = false;
var assets = [];

module.exports = {
    load: load
};

if (require.main === module) {
    if (process.argv[2] === '-v') {
        verbose = true;
    }

    load();
}

if (verbose) {
    gutil.log(LOG_ID, gutil.colors.green('assets'), assets);
}

function load(config) {

    if (config && config.debug) {
        verbose = true;
    }

    var cwd = process.cwd();
    processPkg(cwd);

    return assets;
}

function processPkg(curDir) {

    var meta;
    var metaPath = path.join(curDir, PACKAGE_INFO);

    try {
        if (verbose) {
            gutil.log(LOG_ID, gutil.colors.blue('reading', metaPath));
        }
        meta = require(metaPath);
        grabAssets(meta.name, curDir, meta.assets);
    } catch (err) {
        if (verbose) {
            gutil.log(LOG_ID, gutil.colors.yellow('not found', metaPath, 'skipping...'));
        }
    }

    if (!meta || !meta.dependencies) {
        return;
    }

    /*jshint -W089 */
    for (var pkg in meta.dependencies) {
        processPkg(path.join(curDir, NODE_MODULES_DIR, pkg));
    }

}

function grabAssets(pkgName, basePath, pkgAssets) {

    if (!pkgAssets || !basePath) {
        if (verbose) {
            gutil.log(LOG_ID, gutil.colors.yellow('no assets found in ', basePath));
        } else {
            gutil.log(LOG_ID, gutil.colors.yellow('no assets found in ', pkgName));
        }
        return;
    }

    if (verbose) {
        gutil.log(LOG_ID, gutil.colors.green('found assets in ', pkgName, pkgAssets));
    }

    if (Array.isArray(pkgAssets)) {
        pkgAssets.forEach(assetPush);
    } else {
        assetPush(pkgAssets);
    }

    function assetPush(asset) {
        assets.push(path.join(basePath, asset));
    }

}
