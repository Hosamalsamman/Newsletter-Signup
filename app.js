const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const { response } = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000.");
});

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;00

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/e49a6989dd";
    const options = {
        method: "POST",
        auth: "Hossam:cdee1dd72addc8d21edb0cb0012ceff9-us21"
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);

    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});


/*
mailchimp Key
cdee1dd72addc8d21edb0cb0012ceff9-us21
Audience ID.
e49a6989dd
*/