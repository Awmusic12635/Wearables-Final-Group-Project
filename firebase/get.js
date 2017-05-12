var firebase = require('firebase');

/**
 * gets an object from the database
 *
 * @param endpoint
 * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>}
 */
module.exports = function(endpoint, id) {
    return firebase.database().ref(endpoint + "/" + id).once('value').then(function (snapshot) {
        return snapshot.val();
    });
};
