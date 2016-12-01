/*jshint -W097 */
'use strict';

var LOG_ID = 'find-npm-assets';
var NODE_MODULES_DIR = 'node_modules';
var PACKAGE_INFO = 'package.json';

var path = require('path');
var gutil = require('gulp-util');

var verbose = false;
var verticalDirStructure = false;
var assets = [];

module.exports = {
    load: load
};

if (require.main === module) {
    if (process.argv[2] === '-v') {
        verbose = true;
    }

    if (process.argv[3] === '-m') {
        verticalDirStructure = true;
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

    if (config && config.verticalDirStructure) {
        verticalDirStructure = true;
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
        return;
    }

    var pkgObject = {
        name: pkgName,
        assets: []
    };

    gutil.log(LOG_ID, gutil.colors.green('found assets in package:', pkgName,
        '\nassets:', pkgAssets));

    if (Array.isArray(pkgAssets)) {
        pkgAssets.forEach(assetPush);
    } else {
        assetPush(pkgAssets);
    }

    assets.push(pkgObject);

    function assetPush(asset) {

        if (verticalDirStructure) {
            pkgObject.assets.push(path.join(basePath, asset));
        } else {
            assets.push(path.join(basePath, asset));
        }

    }
}
