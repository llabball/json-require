var PageView = require('./base');


module.exports = PageView.extend({
    pageTitle: 'more info',
    template: this.client.views.templates.pages.info
});
