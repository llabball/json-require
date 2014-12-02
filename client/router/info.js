var InfoPage = require('../views/pages/info');

module.exports = function () {
	this.trigger('page', new InfoPage({
    model: me
  }));
}