var firebase = require('firebase');

/**
 * update a single value with the id
 *
 * @param endpoint {string}
 * @param id {string|int}
 * @param values {Object}
 * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
 */
module.exports = function(endpoint, id, values) {
    return firebase.database().ref(endpoint + "/" + id).set(values);
};
