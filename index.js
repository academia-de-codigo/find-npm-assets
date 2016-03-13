/*jshint -W097 */
'use strict';

var NODE_MODULES_DIR = 'node_modules';
var PACKAGE_INFO = 'package.json';

var path = require('path');
var assets = [];

module.exports = assets;

processPkg('.');

function processPkg(curDir) {

    var meta = require(path.join(curDir, PACKAGE_INFO));
    grabAssets(curDir, meta.assets);

    if (!meta.dependencies) {
        return;
    }

    /*jshint -W089 */
    for (var pkg in meta.dependencies) {
        processPkg(path.join(curDir, NODE_MODULES_DIR, pkg));
    }

}

function grabAssets(basePath, pkgAssets) {

    if (!pkgAssets || !basePath) {
        return;
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
