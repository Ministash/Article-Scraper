const express = require('express');
const request = require('request');
var cheerio = require('cheerio');
var db = require("../models");

const router = express.Router();

router.get('/', function(req, res){
    
    //need to make a route that automatically finds articles on page load and then saves them to my database
    //Once saved, make a seperate route that finds the articles and displays them
    request("https://www.wired.com/most-popular/", function (err, resp, body) {
        let $ = cheerio.load(body);
        let results = [];
        

        $(".archive-item-component").each(function(i, element){

            results.title = $(this).find('.archive-item-component__title').text();
            results.desc = $(this).find('.archive-item-component__desc').text();
            results.img = $(this).find('.image-group-component').children('img').attr('src');

            resultsObj = {
                title: results.title,
                desc: results.desc,
                img: results.img,
            }

            results.push(resultsObj);

        });

        
        dbLog(results);
        console.log(results);

    }); 


    let dbLog = (results) =>{
        db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          console.log("A Article Was Stored!");
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });

    }
    
    res.render("index");


});



module.exports = router;


