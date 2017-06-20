# gulp-merge-with-master 0.0.1
> A gulp plugin to merge JSON files with master file


## Getting Started

```shell
npm install gulp-merge-with-master --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
var mergeWithMaser = require('gulp-merge-with-master');
```

### Usage

```js
gulp.src(['src/**/*.json', '!src/api.json'])
    .pipe(masterMerge('src/api.json'))
    .pipe(gulp.dest('dest/')))
```

### API

### mergeWithMaser(masterFilePath)

#### masterFilePath

Type: `string`

Default: ``

Path for the master JSON file

## License

MIT © [Yaser Amin](https://github.com/Yaser-Amin)
