const express = require('express');
const request = require('request');
var cheerio = require('cheerio');
var db = require("../models");

const router = express.Router();

router.get('/', function (req, res) {

    //need to make a route that automatically finds articles on page load and then saves them to my database
    //Once saved, make a seperate route that finds the articles and displays them
    request("https://www.wired.com/most-popular/", function (err, resp, body) {
        let $ = cheerio.load(body);
        let results = [];


        $(".archive-item-component").each(function (i, element) {

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


        dbNullCheck(results);
        // console.log(results);

    });

    let dbNullCheck = (results) => {
        db.Article.find({})
            .then(function (dbArticle) {
                if (dbArticle.length === 0) {
                    console.log("There is nothing in there, hold my beer! I'm going in!");
                    sendingResultsInformation(results);
                } else {
                    console.log("There is something in there! I need to check on it!");
                    databaseChecker(dbArticle, results);
                }
            })
            .catch(function (err) {
                console.log("SHIT DIDN'T WORK");
                res.json(err);
            });
    }


    let sendingResultsInformation = (results) => {

        db.Article.create(results)
            .then(function (dbArticle) {
                // View the added result in the console
                // console.log(dbArticle);
                console.log("A Article Was Stored!");
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                return res.json(err);
            });
    }

    let databaseChecker = (dbArticle, results) => {

        let newResultsArray = [];


        for (let i = 0; i < results.length; i++) {
            // console.log(dbArticle[i].title + "THIS IS THE ITERATION OF EVERYTHING IN DBARTICLE");


            for (let j = 0; j < dbArticle.length; j++) {
                // console.log(results[j].title + "THIS IS THE ITERATION OF EVERYTHING IN RESULTS");


                if (dbArticle[j].title === results[i].title) {
                    console.log("That is already in the database!");
                    console.log(results[i].title);


                } else {
                    console.log("nothing");
                    console.log(results[i].title);
                }



            }

        }


        // if (dbArticle[i].title === results[j].title) {
        //     console.log("That is already in the database!");
        // } else {
        //     newResultsArray.push(results[j]);

        //     sendingResultsInformation(newResultsArray);


        // }

    }

    // console.log(newResultsArray + "This is the new results array");









    res.render("index");
});


router.get('/scraper/data', function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});



module.exports = router;


