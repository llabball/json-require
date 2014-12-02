var CollectionDemo = require('../views/pages/collection-demo');

module.exports = function () {
  this.trigger('page', new CollectionDemo({
    model: me,
    collection: app.people
  }));
}