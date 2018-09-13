const express = require('express');
const request = require('request');
var cheerio = require('cheerio');
const router = express.Router();
var db = require("./models");

router.get('/', function(req, res){

    //need to make a route that automatically finds articles on page load and then saves them to my database
    //Once saved, make a seperate route that finds the articles and displays them
    request("https://www.wired.com/most-popular/", function (err, resp, body) {
        let $ = cheerio.load(body);
        
        var results = [];

        $(".archive-item-component").each(function(i, element){

            results.title = $(this).find('.archive-item-component__title').text();
            results.desc = $(this).find('.archive-item-component__desc').text();
            results.img = $(this).find('.image-group-component').children('img').attr('src');

            resultsObj = {
                title: results.title,
                desc: results.desc,
                img: results.img,
                last: "THIS IS THE LAST ITEM IN THE OBJECT"
            }

            results.push(resultsObj);

        });

        console.log(results);

    }); 
    





    res.render("index" );
});



module.exports = router;

