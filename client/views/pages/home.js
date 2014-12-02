var PageView = require('./base');


module.exports = PageView.extend({
    pageTitle: 'home',
    template: this.client.views.templates.pages.home
});
