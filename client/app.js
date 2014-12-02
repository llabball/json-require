/*global app, me, $*/
var ddoc = couchapp.ddoc;

var _ = require('underscore');
var logger = require('andlog');
var config = require('clientconfig');

var Router = require('ampersand-router');
var tracking = require('./helpers/metrics');
var MainView = require('./views/main');
var Me = require('./models/me');
var People = require('./models/persons');
var domReady = require('domready');


module.exports = {
    // this is the the whole app initter
    blastoff: function () {
        var self = window.app = this;

        // create our global 'me' object and an empty collection for our people models.
        window.me = new Me();
        this.people = new People();

        // init our URL handlers and the history tracker
        var router_config = ddoc.client.router
        // require all functions of the routes from the ddoc (JSON)
        for (var prop in router_config) {
            if (!router_config.hasOwnProperty(prop)) continue;
            if (typeof router_config[prop] === 'string') {
                router_config[prop] = require('./router/' + prop);
            }
        }
        var r = Router.extend(router_config);
        this.router = new r();


        // wait for document ready to render our main view
        // this ensures the document has a body, etc.
        domReady(function () {
            // init our main view
            var mainView = self.view = new MainView({
                model: me,
                el: document.body
            });

            // ...and render it
            mainView.render();

            // listen for new pages from the router
            self.router.on('newPage', mainView.setPage, mainView);

            // we have what we need, we can now start our router and show the appropriate page
            self.router.history.start({
                pushState: true,
                root: window.couchapp.ddoc.package.browser.urlRoot
            });
        });
    },

    // This is how you navigate around the app.
    // this gets called by a global click handler that handles
    // all the <a> tags in the app.
    // it expects a url without a leading slash.
    // for example: "costello/settings".
    navigate: function (page) {
        var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        this.router.history.navigate(url, {trigger: true});
    }
};

// run it
module.exports.blastoff();
