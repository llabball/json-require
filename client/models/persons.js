var Collection = require('ampersand-rest-collection');
var Person = require('./person');

module.exports = Collection.extend({
		mainIndex: '_id',
    model: Person,
    url: window.couchapp.ddoc.package.browser.urlRoot + '/api/people',
    ajaxConfig: function () {
        return {
            headers: {'Accept': 'application/json'}
        };
    },
    parse: function (res, options) {
      var list = res.rows,
          people = [];

     	for (var i = 0, person; person = list[i++];) {
     		people.push(person.value);
      }

      return people;
    }
});
