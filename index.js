/*jshint -W097 */
'use strict';

var LOG_ID = 'find-npm-assets';
var NODE_MODULES_DIR = 'node_modules';
var PACKAGE_INFO = 'package.json';

var path = require('path');
var gutil = require('gulp-util');

var verbose = false;
var pkgDir = false;
var assets = [];

module.exports = {
    load: load
};

if (require.main === module) {

    process.argv.forEach(function(arg) {

        if (arg === '-v') {
            verbose = true;
        }

        if (arg === '-m') {
            pkgDir = true;
        }
    });

    load();
}

if (verbose) {
    gutil.log(LOG_ID, gutil.colors.green('assets'), assets);
}

function load(config) {

    if (config && config.debug) {
        verbose = true;
    }

    if (config && config.pkgDir) {
        pkgDir = true;
    }

    var cwd = process.cwd();
    processPkg(cwd);

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
        }

        return;
    }

    var pkgObject = {
        name: pkgName,
        assets: []
    };

    if (Array.isArray(pkgAssets)) {
        pkgAssets.forEach(assetPush);
    } else {
        assetPush(pkgAssets);
    }

    if (pkgDir && !assets.find(isDuplicate)) {

        gutil.log(LOG_ID, gutil.colors.green('found assets in', pkgName, ':', pkgAssets));
        assets.push(pkgObject);

    }

    function assetPush(asset) {

        if (pkgDir) {

            pkgObject.assets.push(path.join(basePath, asset));

        } else {

            gutil.log(LOG_ID, gutil.colors.green('found assets in', pkgName, ':', pkgAssets));
            assets.push(path.join(basePath, asset));

        }
    }

    function isDuplicate(item) {
        return item.name === pkgName;
    }
}
