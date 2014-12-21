# json-require [![Build Status](https://travis-ci.org/llabball/json-require.svg?branch=develop)](https://travis-ci.org/llabball/json-require) [![browser support](https://ci.testling.com/llabball/json-require.png)](https://ci.testling.com/llabball/json-require)

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
		module1: function () {exports.fun = ...},
		module2: {
			index: function () {exports.fun = ...},
			modules: {
				module3: function () {exports.fun = ...}
			}
	}
}

// initialize a require function
// the second parameter is "debug" (into the console)
var require = JSONRequire.makeRequire(modules, true);

// require your module
// when the required path points to a string it will be
// evaluated as valid JavaScript automatically
var module = require('modules/module1')

```
## License

**MIT**