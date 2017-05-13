var Bleacon = require('bleacon');
var request = require('request');

var building = process.argv[2];
var room = process.argv[3];

//library seems to require lower case
var uuid = "8BCBF308AD76491DBAAFC4FD5913D51B".toLowerCase();

var beacons = [];

//Bleacon.startScanning() will scan for any beacon

Bleacon.startScanning(uuid); // scan for a specific id

//Bleacon.startScanning(uuid,major) // scan for uuid + major

//Bleacon.startScanning(uuid,major,minor) // scan for uuid + major + minor

Bleacon.on('discover',function(bleacon){
	if(beacons.map(function(e){return e.uuid;}).indexOf(bleacon.uuid==-1)){
		beacons.push(JSON.parse(JSON.stringify(bleacon)));
		console.log(bleacon);
        var deviceID = bleacon.major + "" + bleacon.minor;
        //say that the new beacon is in this room
        request.post(
            'http://wearables.alexwacker.com/devices/'+ deviceID +'/updatelocation',
            { json: { roomid: room, buildingid: building } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
	}

	var which = beacons.map(function(e){return e.uuid;}).indexOf(bleacon.uuid);

	console.log(which);
	console.log(beacons);

	if(beacons[which].accuracy != bleacon.accuracy){
		console.log("Bleacon moved");
		console.log(bleacon);
		beacons[which]=JSON.parse(JSON.stringify(bleacon));
		console.log(bleacon.accuracy * 3.28084) // meters to feet
		console.log(bleacon.proximity);//unknown, immediate, near, or far
	}
});

