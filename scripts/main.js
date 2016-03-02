function start() {
    const socket = require( './socket_plugin' );
    socket.run( "gulpease", [ "/home/amantova/Projects/documentation/RR/PianoDiProgetto" ], function ( num ) {
	document.getElementById( "example" ).innerHTML = num;
    });
}
