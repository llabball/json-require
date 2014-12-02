## Ampersand.js DEMO as CouchDB Couchapp

This couchapp ([CouchDB design doc](http://docs.couchdb.org/en/latest/api/design.html)) is port of the [Ampersandjs](http://ampersandjs.com/) demo application that can be generated with the [Ampersand Cli tool](http://ampersandjs.com/docs/#ampersand-starting-a-new-app).

The main goal for the port was to show that an Ampersand.js-Project consisting of many commonjs-modules can be hosted at a CouchDB, loaded as JSON app and started in the Browser.

Ampersand-Modules like state, model and view are recommended to initialise via a `extend(options)` function. The `options` are a JavaScript object. The router implementation show what potential other structure a Ampersand.js-Couchapp can have because its JSON in result. The most advantage is expected in source code management tasks because the Ampersand.js app will be splitted in more and smaller files.

The test are continuing ...

## installation

You will need a CouchDB installed/hosted and one of the upload tools [couchapp](https://github.com/couchapp/couchapp) or [erica](https://github.com/benoitc/erica)

Clone the repo and enter the branch and the directory.

```sh
$ couchapp push http://admin:password@couchdbdomain:port/databasename
```
Upload the couchapp. Alternatively upload targets can be defined in the `.couchapprc` file.

The repo contains some seed data in the `_docs` folder which is automatically uploaded too.

## configuration

The demo app uses server API endpoints like `/api` or `/person`. To start the app correctly the `_rewrite` handler must be used. A resulting app url after upload will look like `[path/to/couchdb]/[dbname]/_design/ampersand-couchapp/_rewrite/`

Because thats a huuuge URI you may want change that by using a vhost config in the local.ini.

```ini
//subdomain with endpoint path
[vhosts]
sub.domain.tld=[dbname]/_design/ampersand-couchapp/_rewrite
```

**No matter the original path or a vhost is used** - the path must be included in the property `browser.urlRoot` of the `package.json`.


## get in touch

Feel free to open issues, comment code lines ... it's a maintained thing
I am [llabball](https://twitter.com/llabball) in twitter.