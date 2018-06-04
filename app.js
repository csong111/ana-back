const fs = require("fs");
const express = require("express");
const wordListPath = require("word-list");
const bodyParser = require("body-parser");
const wordList = fs.readFileSync(wordListPath, "utf8").split("\n");
const app = express();
app.use(bodyParser.raw({ type: "*/*" }));

app.get("/ping", (req, res) => res.send("pong"));

app.get("/find", (req, res) => {
  let parsedBody = JSON.parse(req.body.toString());
  let query = parsedBody.word.toLowerCase();
  let split = query.split("");
  let splitArr = split.filter(el => el !== " ");
  let splitQuery = splitArr.sort();

  let anagramList = wordList.filter(word => {
    let splitWord = word.split("").sort();
    if (splitQuery.length === splitWord.length) {
      for (let i = 0; i < splitQuery.length; i++) {
        if (splitQuery[i] !== splitWord[i]) {
          return false;
        }
      }
    if (splitQuery !== splitWord) return true;
    } else {
      return false;
    }
  });
  res.send(anagramList);
});

app.get("/compare", (req, res) => {
  let parsedBody = JSON.parse(req.body.toString());
  let term1 = parsedBody.word1;
  let term2 = parsedBody.word2;

  let split1 = term1.split("");
  let splitArr1 = split1.filter(el => el !== " ");
  let splitTerm1 = splitArr1.sort();

  let split2 = term2.split("");
  let splitArr2 = split2.filter(el => el !== " ");
  let splitTerm2 = splitArr2.sort();

  if (splitTerm1.length !== splitTerm2.length) {
    res.send(false);
  } else
    for (i = 0; i < splitTerm1.length; i++) {
      if (splitTerm1[i] !== splitTerm2[i]) {
        res.send(false);
      }
    }
  res.send(true);
});

//The following is an endpoint to return the 3 longest anagrams in the dictionary:
//curl -X GET -H "Content-Type: application/json" http://localhost:3001/find-longest

app.get("/find-longest", (req, res) => {
  let sortedAnagrams = wordList.sort((anagram1, anagram2) => {
    return anagram2.length - anagram1.length;
  });
  res.send([sortedAnagrams[0], sortedAnagrams[1], sortedAnagrams[2]]);
});

app.post("/search", (req, res) => {
  let parsedBody = JSON.parse(req.body.toString());
  let query = parsedBody.word.toLowerCase();
  let split = query.split("");
  let splitArr = split.filter(el => el !== " ");
  let splitQuery = splitArr.sort();

  let anagramList = wordList.filter(word => {
    let splitWord = word.split("").sort();
    if (splitQuery.length === splitWord.length) {
      for (let i = 0; i < splitQuery.length; i++) {
        if (splitQuery[i] !== splitWord[i]) {
          return false;
        }
      }
      if (query !== word) return true;
    } else {
      return false;
    }
  });
  res.send(anagramList);
});

module.exports = app.listen(3001);

/**
 * @api {get} /find Find Anagrams
 * @apiName FindAnagrams
 * @apiDescription This endpoint will find all anagrams in the english dictionary based on the string sent
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} word
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"word": "test"}' http://localhost:3001/find
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   [
 *      "word1",
 *      "word2",
 *      "word3"
 *   ]
 */
/**
 * @api {get} /compare Compare Anagrams
 * @apiName CompareAnagrams
 * @apiDescription This endpoint will receive two words, and compare them to see if they are anagrams
 * @apiGroup Anagram
 *
 * @apiParam (query) {String} word1
 * @apiParam (query) {String} word2
 *
 * @apiExample {curl} Example usage:
 *     curl -X GET -H "Content-Type: application/json" -d '{"word1": "test", "word2: "tset"}' http://localhost:3001/compare
 *
 * @apiSuccessExample {json} Success-Response:
 *   HTTP/1.1 200 OK
 *   false
 */