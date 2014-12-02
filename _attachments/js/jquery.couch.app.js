// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License.  You may obtain a copy
// of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
// License for the specific language governing permissions and limitations under
// the License.

// Usage: The passed in function is called when the page is ready.
// CouchApp passes in the app object, which takes care of linking to 
// the proper database, and provides access to the CouchApp helpers.
// $.couch.app(function(app) {
//    app.db.view(...)
//    ...
// });

(function($) {

  function Design(db, name, code) {
    this.doc_id = "_design/"+name;
    if (code) {
      this.code_path = this.doc_id + "/" + code;
    } else {
      this.code_path = this.doc_id;
    }
    this.view = function(view, opts) {
      if (view.indexOf('/') === -1) {
        db.view(name+'/'+view, opts);
      } else {
        db.view(view, opts);
      }
    };
    this.list = function(list, view, opts) {
      db.list(name+'/'+list, view, opts);
    };
  }

  function concatPaths(path, addition) {
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

  function traverseContextByPath(path, context) {
    for(var i = 0, part; part = path[i++];)
      if (context) 
        context = context[part]
      else
        break

    return context
  }

  function removeFileExtension(filename) {
    var pos = filename.lastIndexOf('.')
    return (pos > -1) ? filename.substr(0, pos) : filename
  }

  function resolveModule(name, basepath, context) {
    var path = [], current, namepath, fileOrdir, test_path, test_ctx

    // validating mandantory parameters
    if (!name || typeof name !== 'string' || name.length === 0)
      return {error: 'unknown_name', reason: 'empty module name string'}
    if (!context || typeof context !== 'object')
      return {error: 'unknown_context', reason: 'empty context object'}

    current = context
    // validate basepath
    if (basepath && basepath.length > 0) {
      path = concatPaths(path, basepath.split('/'))
      current = traverseContextByPath(path, context)
      if (!current)
        return {error: 'unknown_path', reason: 'unresolvable basepath ' + basepath}
    } else {
      basepath = ''
    }

    // split potential path in name and remove file extension
    namepath = name.split('/')
    fileOrdir = removeFileExtension(namepath.pop())
    namepath.push(fileOrdir)

    // try to resolve the namepath "as is" relative from the basepath
    test_path = concatPaths(path,namepath)
    test_ctx = traverseContextByPath(test_path, context)
    
    // when the namepath not begins with ./ or ../ begin to lookup in other contexts
    if (!test_ctx && !/^\.\.?\//.test(namepath[0])) {
      // alternatively try to resolve the namepath relative from the basepath + node_modules
      if (current.node_modules) {
        test_path = concatPaths(concatPaths(path, ['node_modules']),namepath)
        test_ctx = traverseContextByPath(test_path, context)
      }
      if (!test_ctx) {
        // alternatively try to resolve the namepath "as is" from root of the context (ignoring basepath)
        test_path = concatPaths(path,namepath)
        test_ctx = traverseContextByPath(test_path, context)
        // alternatively try to resolve the namepath from root of the context + node_modules (ignoring basepath)
        if (!test_ctx && context.node_modules) {
          test_path = concatPaths([],namepath)
          test_path.unshift('node_modules')
          test_ctx = traverseContextByPath(test_path, context)
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
        subpath = concatPaths([],current.package.main.split('/'))
        filename = removeFileExtension(subpath.pop())
        current = traverseContextByPath(subpath,current)
        if (current && current[filename] && typeof current[filename] === 'string') {
          path = concatPaths(path, subpath)
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

  function makeRequire(ddoc) {
    var moduleCache = {};
    function getCachedModule(path) {
      return moduleCache[path]
    }
    function setCachedModule(path, module) {
      moduleCache[path] = module
    }
    var require = function (name, basepath) {

      var result = resolveModule(name, basepath, ddoc)

      if (result.error) {
        console.error(["error",result.error,"Module require('" + name + "') raised error: " + result.reason])
        throw []
      }

      var basepath = result.basepath
        , filepath = result.filepath
        , funstring = result.funstring
 console.log(filepath)     
      var cachedModule = getCachedModule(filepath);
      if (cachedModule)
        return cachedModule;
      
      var exports = {}
        , module = {exports: exports}

      var s = "var func = function (exports, require, module) {\n" + funstring + "\n};"
      try {
        eval(s)
        func.apply(ddoc, [exports, function(name) {return require(name, basepath)}, module])
      } catch(e) { 
        throw ["error","compilation_error","Module require('" + name + "') raised error " + e + '\n' + filepath + '\n' + e.stack]
      }
      setCachedModule(filepath, module.exports)
      return module.exports
    }
    return require
  }

  function mockReq() {
    var p = document.location.pathname.split('/'),
      qs = document.location.search.replace(/^\?/,'').split('&'),
      q = {};
    qs.forEach(function(param) {
      var ps = param.split('='),
        k = decodeURIComponent(ps[0]),
        v = decodeURIComponent(ps[1]);
      if (["startkey", "endkey", "key"].indexOf(k) != -1) {
        q[k] = JSON.parse(v);
      } else {
        q[k] = v;
      }
    });
    p.shift();
    return {
      path : p,
      query : q
    };
  };

  $.couch.app = $.couch.app || function(appFun, opts) {
    opts = opts || {};
    var urlPrefix = (opts.urlPrefix || ""),
      index = urlPrefix.split('/').length,
      fragments = unescape(document.location.href).split('/'),
      dbname = opts.db || fragments[index + 2],
      dname = opts.design || fragments[index + 4];
    $.couch.urlPrefix = urlPrefix;
    var db = $.couch.db(dbname),
      design = new Design(db, dname, opts.load_path);
    var appExports = $.extend({
      db : db,
      design : design,
      view : design.view,
      list : design.list,
      req : mockReq()
    }, $.couch.app.app);
    function handleDDoc(ddoc) {        
      if (ddoc) {
        appExports.ddoc = ddoc;
        appExports.require = makeRequire(ddoc);
      }
      appFun.apply(appExports, [appExports]);
    }
    if (opts.ddoc) {
      // allow the ddoc to be embedded in the html
      // to avoid a second http request
      $.couch.app.ddocs[design.doc_id] = opts.ddoc;
    }
    if ($.couch.app.ddocs[design.doc_id]) {
      $(function() {handleDDoc($.couch.app.ddocs[design.doc_id])});
    } else {
      // only open 1 connection for this ddoc 
      if ($.couch.app.ddoc_handlers[design.doc_id]) {
        // we are already fetching, just wait
        $.couch.app.ddoc_handlers[design.doc_id].push(handleDDoc);
      } else {
        $.couch.app.ddoc_handlers[design.doc_id] = [handleDDoc];
        // use getDbProperty to bypass %2F encoding on _show/app
        db.getDbProperty(design.code_path, {
          success : function(doc) {
            $.couch.app.ddocs[design.doc_id] = doc;
            $.couch.app.ddoc_handlers[design.doc_id].forEach(function(h) {
              $(function() {h(doc)});
            });
            $.couch.app.ddoc_handlers[design.doc_id] = null;
          },
          error : function() {
            $.couch.app.ddoc_handlers[design.doc_id].forEach(function(h) {
              $(function() {h()});
            });
            $.couch.app.ddoc_handlers[design.doc_id] = null;
          }
        });
      }
    }
  }
  $.couch.app.ddocs = {}
  $.couch.app.ddoc_handlers = {}
})(jQuery);