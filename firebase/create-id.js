var firebase = require('firebase');

/**
 * creates an object with a predetermined key
 *
 * @param endpoint {string}
 * @param id {string|int}
 * @param values {Object}
 */
module.exports = function(endpoint, id, values) {
    return firebase.database.ref(endpoint + "/" + id).set(values);
};
