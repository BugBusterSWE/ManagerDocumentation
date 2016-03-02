const fs = require( 'fs' );
const spawnSync = require( 'child_process' ).spawnSync;

/**
   Get the number of letters inside the text

   @param text : string - Text where count the number of letters
   @return {number} - Number of letters
*/
function letters( text ) {
    return text.match( /\w/g ).length;
}

/**
   Get the number of sentences inside the text 
   
   @param text : string - Text where count the number of sentences
   @return {number} - Number of sentences
*/
function sentences( text ) {
    var allCarriageReturn = text;

    // For each end lines or sentences add a point and carrige return.
    // Example:
    //   My mother going at home. He will go back friday. =>
    //   My mother going at home.
    //   He will go back friday.
    allCarriageReturn = allCarriageReturn.replace( /(\n|\. )/g, ".\n" );

    //Therefor the number of sentences is a number of the point preceded by
    //another symbol. The separator line will ignored because it haven't
    //nothing before. I believe that one sentence with less than three words is
    //absurde.
    return allCarriageReturn.match( /\w{3,}\s{0,}.$/gm ).length;
}

/**
   Get the number of words inside the text

   @param text : string - Text where count the number of words
   @return {number} - Number of words
*/
function words( text ) {
    return text.match( /\w+/g ).length;
}

exports.main = function ( path ) {
    console.log( "Run gulpease script in " + path + " ..." );
    // The path MUST have above struct:
    // res/section/all_file.tex
    path = `${path}res/sections/`; // Attach the location when all sections are store

    var files = fs.readdirSync( path ); // Get all files 
    var dcDetex = "";

    console.log( "Detected this files:" );

    // Apply detex every files and append content at dcDetex
    files.forEach( ( val, index, array ) => {
	console.log( val );
	
	var outSpawn = spawnSync( 'detex', [ path+val ] );
	dcDetex += `${outSpawn.stdout}\n`;
    });

    // Remove all matched form dcDetex
    var filter =
	"enumerate|" +
	"itemize|" +
	"center|" +
	"figure|" +
	"longtable|" +
	"description|" +
	"tabular|" +
	"table|" +
	"math|" +
	"name|" +
	"p.*cm|" + // measure
	"\s1.8\s|" +
	"\s2.*c.*0\.9\s|" +
	"\[.*\]|" + 
	"(l\s?)*(l\s?c)(c\s?)*\s{0,}|" + // latex format table
	".*\.png$|" +
	"\t";

    // Convert filter string in a regex exp with global visibility
    var e = new RegExp( filter, "gm" );
    // Clean text catch
    var cleanText = dcDetex.replace( e, "" );

    console.log( `\nSentences: ${sentences( cleanText )}` );
    console.log( `Letters: ${letters( cleanText )}` );
    console.log( `Words: ${words( cleanText )}` );

    var seToLe =  300 * sentences( cleanText ) - 10 * letters( cleanText );
    return 89 + ( seToLe ) / words( cleanText );
} 
