describe('#### testing the file json-require.js ####\n', function () {

  var JSONRequire = require('../json-require')
    , assert = require('assert')
    , vm = require('vm')
    , fs = require('fs')
    , modules

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


  describe('lib initialization', function () {
    
    describe('in an environment with a global "exports" object (commonjs, e.g. nodejs)', function () {
      //lib init is taken from the test file head
      it('should return an object', function () {
        assert.equal(typeof JSONRequire, 'object')
      })
      testWithContext(JSONRequire)
    })
    
    describe('in an environment without a global "exports" object (e.g. browser)', function () {
      //lib initialization in a browser-like context
      var browser_context = vm.createContext({window: {}})
        , JSONRequire_string = fs.readFileSync(__dirname + '/../json-require.js')
      vm.runInContext(JSONRequire_string, browser_context)

      it('should bind a property "JSONRequire" to the global scope', function () {
        assert.ok(Object.keys(browser_context).indexOf('JSONRequire') > -1)
      })

      testWithContext(browser_context.JSONRequire)
    })

  })//lib initialization


  function testWithContext (lib) {
    describe('initialized lib', function () {
      it('should have a "makeRequire" property', function () {
        assert.ok(Object.keys(lib).indexOf('makeRequire') > -1)
      })
    })
    xit('should have only one property', function () {
      var lib_methods = Object.keys(lib)
      assert.ok(lib_methods.length === 1, 'the makeRequire object should have only one property but has more: ' + lib_methods.join(', '))
    })

    describe('#makeRequire()', function () {
      it('should exists as function (method)', function () {
        assert.equal(typeof lib.makeRequire, 'function')
      })
      it('should return (the new require) a function', function () {
        assert.equal(typeof lib.makeRequire(json_modules), 'function')
      })
    })
  }//testWithContext


  xdescribe('lib initialization in "test mode', function () {
    it('should have a "_getCachedModule" property in an environment with a global "exports', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('makeRequire') > -1)
    })
    it('should have a "_setCachedModule" property in an environment with a global "exports', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_getCachedModule') > -1)
    })
    it('should have a "_concatPaths" property in an environment with a global "exports', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_concatPaths') > -1)
    })
    it('should have a "_traverseContextByPath" property in an environment with a global "exports"', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_traverseContextByPath') > -1)
    })
    it('should have a "_removeFileExtension" property in an environment with a global "exports"', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_removeFileExtension') > -1)
    })
    it('should have a "_resolvePath" property in an environment with a global "exports"', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_resolvePath') > -1)
    })
    it('should have a "_validateConfiguration" property in an environment with a global "exports"', function () {
      assert.ok(Object.keys(JSONRequire).indexOf('_validateConfiguration') > -1)
    })
  })

  

  



});//global describe