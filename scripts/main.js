var React = require( 'react' );
var ReactDom = require( 'react-dom' );

ReactDOM.render(
	<h1>Hello, world!</h1>,
    document.getElementById('example')
);

window.onload = function () { console.log( "Render window" ); };
