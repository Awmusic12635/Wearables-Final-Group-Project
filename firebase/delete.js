var firebase = require('firebase');

/**
 * deletes the object by setting it to null
 *
 * @param endpoint string
 * @param id string
 * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
 */
module.exports = function(endpoint, id) {
    return firebase.database().ref(endpoint + "/" + id).set(null);
};
