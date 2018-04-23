const
    scoreBoard = require('./scoreboard')(),
    gistService = require('../src/gist-service')(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    { scoreValidator, gistValidator } = require('./schema-validators'),
    { validator, checker } = require('./utils/functional-utils'),
    express = require('express');

const PORT = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Middlewares

app.use('/api', (req, res, next) => {
    const contentTypeHeader = req.headers['content-type'];

    if (!contentTypeHeader || contentTypeHeader != 'application/json') {
        res.status(415);
        res.send({ message: "This api supports only JSON." });

        return;
    }

    next();
})

app.use('/api/scoreboard/score', (req, res, next) => {

    const scoreValidation = scoreValidator(req.body);

    if (scoreValidation.hasErrors) {
        res.status(400);
        res.send({ message: scoreValidation.errors });
        return;
    }

    next();
})

app.use('/api/gists', (req, res, next) => {

    if (req.method === "GET") {
        return next();
    }

    const gistValidation = gistValidator(req.body);

    if (gistValidation.hasErrors) {
        res.status(400);
        res.send({ message: gistValidation.errors });
        return;
    }

    next();
})

///////////

//Routes

app.post('/api/scoreboard/score', (req, res) => {
    const { player, problemNumber, penaltyTime, problemStatus } = req.body;

    if (scoreBoard.problemAlreadySolved(player, problemNumber)) {
        res.status(200);
        res.send({ message: `Problem ${problemNumber} already solved by player ${player}` });
        return;
    }

    const score = {
        player,
        problemNumber,
        penaltyTime,
        problemStatus
    }

    scoreBoard.addScore(score);

    res.status(201);
    res.send({ message: "Score created." });
})

app.get('/api/scoreboard/rank', (req, res) => {
    const rank = scoreBoard
        .getRank()
        .map(pr => _.omit(pr, 'trackingOfSolvedProblems'));

    res.status(200);
    res.send(rank);
})

app.post('/api/gists', (req, res) => {
    gistService.createNewGist(req.body)
        .then(response => {
            res.status(201);
            res.send(response);
        })
        .catch(err => {
            res.status(400);
            res.send({ message: err });
        })
})

app.get('/api/gists/:id/comments', (req, res) => {
    gistService.getGistComments(req.params.id)
        .then(result => {
            res.status(201);
            res.send(result);
        })
        .catch(err => {
            res.status(500);
            res.send(err);
        })
})

///////////

app.listen(PORT, () => {
    console.log(`API is running on port ${PORT}`);
})