var PersonViewPage = require('../views/pages/person-view');

module.exports = function (id) {
	this.trigger('page', new PersonViewPage({
      id: id
  }));
}