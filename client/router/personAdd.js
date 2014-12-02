var PersonAddPage = require('../views/pages/person-add');

module.exports = function () {
	this.trigger('page', new PersonAddPage());
}