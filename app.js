const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
	const fname = req.body.fname;
	const lname = req.body.lname; 
	const email = req.body.email;

	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields:{
					FNAME: fname,
					LNAME: lname
				}
			}
		]
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us13.api.mailchimp.com/3.0/lists/a2ca8c8fe3";
	
	const options= {
		method:"POST",
		auth: "gaurav:d15c400471b2a8419c0f8da3abccbc32-us13"
	}

	const  request = https.request(url,options ,function(response){

		if(response.statusCode === 200){
			res.sendFile(__dirname +"/success.html");
		}else{
			res.sendFile(__dirname + "/failure.html")
		}
		response.on("data", function(data){
			console.log(JSON.parse(data));
		})
	})

	request.write(jsonData);
	request.end();

});

app.post("/failure", function(req,res){
	res.redirect("/");
})

app.listen(3000,function(){
	console.log("server is running at 3000");
});

// list id = a2ca8c8fe3.
// api key = d15c400471b2a8419c0f8da3abccbc32-us13