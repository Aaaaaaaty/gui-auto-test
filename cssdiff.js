
var fs = require( 'fs' );
var phantomcss = require( phantomcss );
var server = require('webserver').create();

var html = fs.read( fs.absolute( fs.workingDirectory + '/diffcss.html' ));

server.listen(8080,function(req,res){
	res.statusCode = 200;
	res.headers = {
		'Cache': 'no-cache',
		'Content-Type': 'text/html;charset=utf-8'
	};
	res.write(html);
	res.close();
});

casper.start( './diffcss.html' )
    .then(function(){
        // Take a screenshot of the UI component
        phantomcss.screenshot('#myModal', 'a screenshot of my dialog');
    });
