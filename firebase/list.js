var firebase = require('firebase');

/**
 * gets a list of objects from database
 *
 * @param endpoint {string}
 * @returns {!firebase.Promise.<*>|firebase.Thenable<any>|firebase.Promise<any>}
 */
module.exports = function(endpoint) {
    return firebase.database().ref(endpoint).once('value').then(function (snapshot) {
        return snapshot.val();
    });
};
