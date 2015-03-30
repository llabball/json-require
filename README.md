# json-require [![Build Status](https://travis-ci.org/llabball/json-require.svg?branch=develop)](https://travis-ci.org/llabball/json-require) [![Sauce Test Status](https://saucelabs.com/browser-matrix/llabball.svg)](https://saucelabs.com/u/llabball)

Browser- and server-side require function. It acts on a JSON object like the nodejs require function on the file system.

## load in the Browser

```html
<script src="path/to/json-require.js" type="text/javascript"></script>
```

## load in nodejs

will be published at npmjs.org soon ...

## Example Usage

``` js
// an example JSON structured modules object
// the names of the "folders" can be any - they
// have to be referenced correctly in the loading step
// e.g. var module = require('path/to/module')
var modules = {
	modules: {
		module1: "module.exports = function module1 () {...}",
		module2: {
			index: "exports.module2 = function () {...}",
			modules: {
				module3: "..."
			}
	}
}

// initialize a require function
//
// rootpath: string (rootpath will be prepend to all required modules) 
// debug: true|false (into the console)
//
var require = JSONRequire.makeRequire(modules, rootpath, true);

// require your module
// when the required path points to a string it will be
// evaluated as valid JavaScript automatically
var module = require('modules/module1')

```
## License

**MIT**