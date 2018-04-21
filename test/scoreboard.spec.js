const expect = require("chai").expect;


describe('Scoreboard', () => {
    describe('addScore', () => {
        it('WhenPlayersHaveSameNumberOfProblemsResolvedRankShouldBeOrderedByPenaltyTime', () => {
            const scoreBoard = require('../src/scoreboard')();
            const playerScore = {
                player: 1,
                problemNumber: 1,
                penaltyTime: 10,
                problemStatus: "C"
            };

            const playerScore2 = {
                player: 2,
                problemNumber: 1,
                penaltyTime: 5,
                problemStatus: "C"
            }

            scoreBoard.addScore(playerScore);
            scoreBoard.addScore(playerScore2);

            const [first, second] = scoreBoard.getRank();

            expect(first.player).to.be.equals(2);
            expect(first.problemsSolved).to.be.equals(1);
            expect(first.penaltyTime).to.be.equals(5);

            expect(second.player).to.be.equals(1);
            expect(second.problemsSolved).to.be.equals(1);
            expect(second.penaltyTime).to.be.equals(10);
        })

        it('WhenPlayersHaveSameNumberOfProblemsResolvedRankShouldBeOrderedByPenaltyTimeCase2', () => {
            const scoreBoard = require('../src/scoreboard')();
            const playerScore = {
                player: 1,
                problemNumber: 1,
                penaltyTime: 10,
                problemStatus: "C"
            };

            const playerScore2 = {
                player: 2,
                problemNumber: 1,
                penaltyTime: 20,
                problemStatus: "C"
            }

            const playerScore3 = {
                player: 1,
                problemNumber: 2,
                penaltyTime: 20,
                problemStatus: "I"
            }

            scoreBoard.addScore(playerScore);
            scoreBoard.addScore(playerScore2);
            scoreBoard.addScore(playerScore3);

            const [first, second] = scoreBoard.getRank();

            expect(first.player).to.be.equals(2);
            expect(second.player).to.be.equals(1);
        })

        it('WhenPlayersHaveDifferentNumberOfProblemsResolvedShouldRankBeOrderedByProblemsSolved', () => {
            const scoreBoard = require('../src/scoreboard')();

            const playerScore = {
                player: 1,
                problemNumber: 2,
                penaltyTime: 10,
                problemStatus: "I"
            };

            const playerScore2 = {
                player: 3,
                problemNumber: 1,
                penaltyTime: 11,
                problemStatus: "C"
            }

            const playerScore3 = {
                player: 1,
                problemNumber: 2,
                penaltyTime: 19,
                problemStatus: "R"
            }

            const playerScore4 = {
                player: 1,
                problemNumber: 2,
                penaltyTime: 21,
                problemStatus: "C"
            }

            const playerScore5 = {
                player: 1,
                problemNumber: 1,
                penaltyTime: 25,
                problemStatus: "C"
            }

            scoreBoard.addScore(playerScore);
            scoreBoard.addScore(playerScore2);
            scoreBoard.addScore(playerScore3);
            scoreBoard.addScore(playerScore4);
            scoreBoard.addScore(playerScore5);

            const [first, second] = scoreBoard.getRank();

            expect(first.player).to.be.equals(1);
            expect(first.problemsSolved).to.be.equals(2);
            expect(first.penaltyTime).to.be.equal(66);

            expect(second.player).to.be.equals(3);
            expect(second.problemsSolved).to.be.equals(1);
            expect(second.penaltyTime).to.be.equal(11);
        })
    })
});