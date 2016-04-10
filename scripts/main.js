// La path deve essere assoluta!
function gulpease( doc ) {
    const socket = require( './socket_plugin' );
    socket.run( 
        "git@github.com:BugBusterSWE/ManagerDocumentation.git::gulpease", 
        [ doc ], 
        function ( num ) {
	       document.getElementById( doc ).innerHTML = num;
    });
}

function addDocument() {
    var input_path = document.getElementById( "input_document" );
    var path = input_path.value;
    
    if ( path !== "" ) {
       input_path.value = "";
    
        var documents = document.getElementById( "documentSet" );

        var doc = document.createElement( "li" );
        doc.innerHTML = 
            `<button type='button' onclick='gulpease( "${path}" )'>
            Calculate</button> ${path} <strong id=${path}>0</strong>`;

        documents.appendChild( doc ); 
    }
}
