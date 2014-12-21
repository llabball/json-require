describe('#### testing the file json-require.js ####\n', function () {

  var assert = require('assert')
    , lib = require('../json-require')
    //, vm = require('vm')
    //, fs = require('fs')
    , json_modules

  beforeEach(function() {
    //Example of a JSON object with function strings (modules)
    json_modules = {
      modules: {
        module1: "function () {exports.module1 = function() {return 'module1'}}",
        module2: {
          index: "function () {exports.module2 = function() {return 'module2'}}",
          modules: {
            module3: "function () {exports.module3 = function() {return 'module3'}}"
          }
        }
      }
    }//JSONModules
  })


  describe('initialized lib', function () {
    it('should have a "makeRequire" property', function (done) {
      assert.ok(Object.keys(lib).indexOf('makeRequire') > -1)
      done()
    })
    xit('should have only one property', function (done) {
      var lib_methods = Object.keys(lib)
      assert.ok(lib_methods.length === 1, 'the makeRequire object should have only one property but has more: ' + lib_methods.join(', '))
      done()
    })
  })

  describe('#makeRequire()', function () {
    it('should exists as function (method)', function () {
      assert.equal(typeof lib.makeRequire, 'function')
    })
    it('should return (the new require) a function', function () {
      assert.equal(typeof lib.makeRequire(json_modules), 'function')
    })
  })

  // describe('lib initialization', function () {

  //   // The lib initializes as anonymous function:
  //   // 
  //   // (function (exports) {
  //   //   ...
  //   // })(typeof exports === 'undefined'? this['JSONRequire']={}: exports);
  //   //
  //   // To test that the results are the same no matter the environment the
  //   // lib will be initialized in twice and the results should be 
  //   // identically.
  //   //
  //   // All other test cases will asume that the tests will have the same
  //   // results in the environments and NOT executed for every plattform

  //   var lib_in_commonjs_env, lib_in_browser_env

  //   before(function () {
  //     lib_in_commonjs_env = require('../json-require')

  //     var browser_context = vm.createContext({window: {}})
  //       , JSONRequire_string = fs.readFileSync(__dirname + '/../json-require.js')

  //     vm.runInContext(JSONRequire_string, browser_context)
  //     lib_in_browser_env = browser_context.JSONRequire
  //   })
    
  //   describe('in an environment with a global "exports" object (commonjs, e.g. nodejs)', function () {
  //     it('should return an object', function () {
  //       assert.equal(typeof lib_in_commonjs_env, 'object')
  //     })
  //     it('should provide a property "makeRequire" in the returned object', function () {
  //       assert.ok(Object.keys(lib_in_commonjs_env).indexOf('makeRequire') > -1)
  //     })
  //   })
    
  //   describe('in an environment without a global "exports" object (e.g. browser)', function () {
  //     it('should bind a property "JSONRequire" (object with a property "makeRequire") to the global scope', function () {
  //       assert.ok(lib_in_browser_env !== undefined)
  //     })
  //     it('should provide a property "makeRequire" in the global "JSONRequire" property', function () {
  //       assert.ok(Object.keys(lib_in_browser_env).indexOf('makeRequire') > -1)
  //     })
  //   })

  //   describe('in an browser and commonjs environment', function () {
  //     it('should result in the same library code', function () {
  //       assert.deepEqual(JSON.stringify(lib_in_commonjs_env), JSON.stringify(lib_in_browser_env), 'results are not identically')
  //     })
  //   })

  // })//lib initialization


  // function testWithContext (lib) {
  //   describe('initialized lib', function () {
  //     it('should have a "makeRequire" property', function () {
  //       assert.ok(Object.keys(lib).indexOf('makeRequire') > -1)
  //     })
  //   })
  //   xit('should have only one property', function () {
  //     var lib_methods = Object.keys(lib)
  //     assert.ok(lib_methods.length === 1, 'the makeRequire object should have only one property but has more: ' + lib_methods.join(', '))
  //   })

  //   describe('#makeRequire()', function () {
  //     it('should exists as function (method)', function () {
  //       assert.equal(typeof lib.makeRequire, 'function')
  //     })
  //     it('should return (the new require) a function', function () {
  //       assert.equal(typeof lib.makeRequire(json_modules), 'function')
  //     })
  //   })
  // }//testWithContext


  // xdescribe('lib initialization in "test mode', function () {
  //   it('should have a "_getCachedModule" property in an environment with a global "exports', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('makeRequire') > -1)
  //   })
  //   it('should have a "_setCachedModule" property in an environment with a global "exports', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_getCachedModule') > -1)
  //   })
  //   it('should have a "_concatPaths" property in an environment with a global "exports', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_concatPaths') > -1)
  //   })
  //   it('should have a "_traverseContextByPath" property in an environment with a global "exports"', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_traverseContextByPath') > -1)
  //   })
  //   it('should have a "_removeFileExtension" property in an environment with a global "exports"', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_removeFileExtension') > -1)
  //   })
  //   it('should have a "_resolvePath" property in an environment with a global "exports"', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_resolvePath') > -1)
  //   })
  //   it('should have a "_validateConfiguration" property in an environment with a global "exports"', function () {
  //     assert.ok(Object.keys(JSONRequire).indexOf('_validateConfiguration') > -1)
  //   })
  // })


});//global describe