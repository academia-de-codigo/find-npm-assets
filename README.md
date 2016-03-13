# find-npm-assets

[![NPM](https://nodei.co/npm/find-npm-assets.png?compact=true)](https://nodei.co/npm/find-npm-assets/)

Recursively find assets in npm packages.

To define assets in a package, add an `assets` field to the `package.json` containing an array of file globs to include.

## Example

Let's say you have a package name `my-site`, which contains some assets and npm dependencies that in turn contain additional assets:

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

You could retreive all your project assets with:

```js
var assets = require('find-npm-assets');

// Example output:
// ["src/app/assets/**/*", "logo.png", "background.jpg"]

```

## Gulp usage

Integrating find-npm-assets with gulp is extremely easy. The following gulp task copies all your project assets to a destination folder:
 
```js
var assets = require('find-npm-assets');

gulp.task('assets', function() {
    gulp.src(assets)
        .pipe(gulp.dest('build/assets'))
});

```

## License
See LICENSE file.