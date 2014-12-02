var PersonEditPage = require('../views/pages/person-edit');

module.exports = function (id) {
	this.trigger('page', new PersonEditPage({
    id: id
  }));
}