# find-npm-assets

[![NPM](https://nodei.co/npm/find-npm-assets.png?compact=true)](https://nodei.co/npm/find-npm-assets/)

Recursively find assets in npm packages.

To define assets in a package, add an `assets` field to the `package.json` containing an array of file globs to include.

## Example

Let's say you have a package named `my-site`, which contains some assets and npm dependencies that in turn contain additional assets:

```json
{
  "name": "mysite",
  "assets": [
    "src/app/assets/**/*",
    "logo.png"
  ],
  "dependencies": {
  	"mysite-dep": "*"
  }
}
```

```json
{
  "name": "mysite-dep",
  "assets": "background.jpg"
}
```

You could retrieve all your project assets with:

```js
var assets = require('find-npm-assets').load();

// Example output:
// ["src/app/assets/**/*", "logo.png", "background.jpg"]

```

## Gulp usage

Integrating find-npm-assets with gulp is extremely easy. The following gulp task copies all your project assets to a destination folder:

```js
var assets = require('find-npm-assets').load();

gulp.task('assets', function() {
    gulp.src(assets)
        .pipe(gulp.dest('build/assets'))
});

```

For projects with assets coming from multiple packages it is recommended to set the `pkgDir` property, which allows assets to be organized by project name:

```js
var assets = require('find-npm-assets').load({pkgDir: true});

gulp.task('assets', function() {
    assets.forEach(function(pkg){
        gulp.src(pkg.assets).pipe(gulp.dest('build/assets/' + pkg.name));
    });
})

// Example output:
// [{
//  name: project1,
//  assets: ["src/app/assets/**/*", "logo.png", "background.jpg"]
// }, {
//  name: project2,
//  assets: ["src/app/assets/**/*", "logo.png", "background.jpg"]
// }]

```

## Reference

To output debug information, pass an object with a `debug` property set to true to the `load` method:

```js
var assetFind = require('find-npm-assets');
assetFind.load({debug: true});
```

You can run `find-npm-assets` from the command line, the `-v` argument will trigger debug information and `-m` will trigger the `pkgDir` option.


## License
See LICENSE file.
