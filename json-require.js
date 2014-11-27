(function(exports){

  var moduleCache = {};

  var _getCachedModule = function(path) {
    return moduleCache[path]
  }

  var _setCachedModule = function(path, module) {
    moduleCache[path] = module
  }

	var _concatPaths = function(path, addition) {
    var base = (path.length > 0) ? path.join(',').split(',') : []

    for(var i = 0, part; part = addition[i++];) {
      if (part.length === 0 || /^\.$/.test(part))
        continue
      if (/^\.\.$/.test(part)) {
        if (base.length > 0) 
          base.pop()
        continue
      }
      base.push(part)
    }

    return base
  }

  var _traverseContextByPath = function(path, context) {
    for(var i = 0, part; part = path[i++];)
      if (context) 
        context = context[part]
      else
        break

    return context
  }

  var _removeFileExtension = function(filename) {
    var pos = filename.lastIndexOf('.')
    return (pos > -1) ? filename.substr(0, pos) : filename
  }

  var _resolvePath =function(name, basepath, context) {
    var path = [], current, namepath, fileOrdir, test_path, test_ctx

    current = context
    // validate basepath
    if (basepath && basepath.length > 0) {
      path = _concatPaths(path, basepath.split('/'))
      current = _traverseContextByPath(path, context)
      if (!current)
        return {error: 'unknown_path', reason: 'unresolvable basepath ' + basepath}
    } else {
      basepath = ''
    }

    // split potential path in name and remove file extension
    namepath = name.split('/')
    fileOrdir = _removeFileExtension(namepath.pop())
    namepath.push(fileOrdir)

    // try to resolve the namepath 'as is' relative from the basepath
    test_path = _concatPaths(path,namepath)
    test_ctx = _traverseContextByPath(test_path, context)
    
    // when the namepath not begins with ./ or ../ begin to lookup in other contexts
    if (!test_ctx && !/^\.\.?\//.test(namepath[0])) {
      // alternatively try to resolve the namepath relative from the basepath + node_modules
      if (current.node_modules) {
        test_path = _concatPaths(_concatPaths(path, ['node_modules']),namepath)
        test_ctx = _traverseContextByPath(test_path, context)
      }
      if (!test_ctx) {
        // alternatively try to resolve the namepath 'as is' from root of the context (ignoring basepath)
        test_path = _concatPaths(path,namepath)
        test_ctx = _traverseContextByPath(test_path, context)
        // alternatively try to resolve the namepath from root of the context + node_modules (ignoring basepath)
        if (!test_ctx && context.node_modules) {
          test_path = _concatPaths([],namepath)
          test_path.unshift('node_modules')
          test_ctx = _traverseContextByPath(test_path, context)
        }
      }
    }
    
    if (test_ctx) {
      current = test_ctx
      path = test_path
    } else {
      return {error: 'unknown_path', reason: 'unresolvable name ' + name}
    }

    var filename, subpath = []
    if (typeof current !== 'string') {
      if (current.package && current.package.main) {
        subpath = _concatPaths([],current.package.main.split('/'))
        filename = _removeFileExtension(subpath.pop())
        current = _traverseContextByPath(subpath,current)
        if (current && current[filename] && typeof current[filename] === 'string') {
          path = _concatPaths(path, subpath)
        } else {
          return {error: 'broken_package_main', reason: 'unresolvable path in main ' + subpath.join('/') + '/' + name}
        }
      }

      if (!filename && current[fileOrdir]) filename = fileOrdir
      if (!filename && current.index) filename = 'index'
      if (filename && typeof current[filename] === 'string') {
        current = current[filename]
      } else {
        return {error: 'unknown_package_main', reason: 'could not find package main file for ' + name}
      }
    } else {
      filename = fileOrdir
      path.pop()
    }

    basepath = path.join('/')
    path.push(filename)

    return {
      basepath: basepath,
      filepath: path.join('/'),
      funstring: current
    }
  }

  var _validateConfiguration = function(ddoc, name, basepath) {
    // validating mandantory parameters
    if (!name || typeof name !== 'string' || name.length === 0)
      return {error: 'unknown_name', reason: 'empty module name string'}
    if (!ddoc || typeof ddoc !== 'object')
      return {error: 'unknown_context', reason: 'empty context object'}
  }

  var makeRequire =function(ddoc, debug) {
    debug = debug || false

    var require = function(name, basepath) {

      _validateConfiguration(ddoc, name, basepath)

      //try to resolve the modules path in doc
      var result = _resolvePath(name, basepath, ddoc)

      //failed to detect the module path 
      if (result.error)
        throw['error',result.error,'Module require( ' + name + ' ) raised error: ' + result.reason]

      var basepath = result.basepath
        , filepath = result.filepath
        , funstring = result.funstring
 			    
      var cachedModule = _getCachedModule(filepath);
      if (cachedModule)
        return cachedModule;

      if (debug)
        console.log(filepath + ((cachedModule) ? ' (cached)': ''))

      //set module and module.exports global to cache evaluated modules
      var exports = {}, module = {exports: exports}
      //evaluation
      var s = 'var func = function (exports, require, module) {\n' + funstring + '\n};'
      try {
        eval(s)
        //apply this=ddoc and  exports/require/module
        func.apply(ddoc, [exports, function(name) {return require(name, basepath)}, module])
      } catch(e) { 
        throw ['error','compilation_error','Module require( ' + name + ' ) raised error ' + e + '\n' + filepath + '\n' + e.stack]
      }
      //cache the module
      _setCachedModule(filepath, module.exports)
      return module.exports
    }
    return require
  }

  //public API - require function builder
  exports.makeRequire = makeRequire
  //private API for testing
  exports._validateConfiguration = _validateConfiguration
  exports._resolvePath = _resolvePath
  exports._removeFileExtension = _removeFileExtension
  exports._traverseContextByPath = _traverseContextByPath
  exports._concatPaths = _concatPaths
  exports._getCachedModule = _getCachedModule
  exports._setCachedModule = _setCachedModule

})(typeof exports === 'undefined'? this['JSONRequire']={}: exports);