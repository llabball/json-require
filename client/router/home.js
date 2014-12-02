var HomePage = require('../views/pages/home');

module.exports = function () {
	this.trigger('page', new HomePage({
    model: me
  }));
}