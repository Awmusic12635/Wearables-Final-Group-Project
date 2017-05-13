var firebase = require('firebase');

/**
 * creates an object with an auto-generated key
 *
 * @param endpoint {string}
 * @param values {Object}
 */
module.exports = function(endpoint, values) {
    var ref = firebase.database().ref(endpoint).push(); //auto-generates key

    return ref.set(values);
};
