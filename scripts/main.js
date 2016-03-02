function start() {
    const socket = require( './socket_plugin' );
    socket.run( "git@github.com:BugBusterSWE/ManagerDocumentation.git::gulpease", [ "/home/amantova/Projects/documentation/RR/PianoDiProgetto/" ], function ( num ) {
	document.getElementById( "example" ).innerHTML = num;
    });
}
