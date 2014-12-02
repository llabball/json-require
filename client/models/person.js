var AmpersandModel = require('ampersand-model');

module.exports = AmpersandModel.extend({
    idAttribute: '_id',
    urlRoot: window.couchapp.ddoc.package.browser.urlRoot + '/person',
    ajaxConfig: function () {
        return {
            headers: {'If-Match': this._rev}
        };
    },
    props: {
        _id: 'any',
        _rev: 'any',
        firstName: ['string', true, ''],
        lastName: ['string', true, ''],
        coolnessFactor: ['number', true, 5],
        type: ['string', true, 'person']
    },
    session: {
        selected: ['boolean', true, false]
    },
    derived: {
        fullName: {
            deps: ['firstName', 'lastName'],
            fn: function () {
                return this.firstName + ' ' + this.lastName;
            }
        },
        avatar: {
            deps: ['firstName', 'lastName'],
            fn: function () {
                return 'http://robohash.org/' + encodeURIComponent(this.fullName) + '?size=80x80';
            }
        },
        editUrl: {
            deps: ['_id'],
            fn: function () {
                return '/person/' + this._id + '/edit';
            }
        },
        viewUrl: {
            deps: ['_id'],
            fn: function () {
                return '/person/' + this._id;
            }
        }
    }
});
