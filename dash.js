var app = require("express")();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

app.use(bodyParser.json())
app.post('/',function(req,res){
    var rpm=req.body.rpm;
    console.log("RPM: " + rpm);
    var rpm=req.body.rpm;
    console.log("SPEED: " + rpm);
});

http.listen(3000, function(){
    console.log('Server listening on: http://localhost:%s', port)
});