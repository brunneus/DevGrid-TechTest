const _ = require('underscore');

const ScoreBoard = () => {
    const rank = [];

    const penaltyTimes = {
        "I": 20,
        "R": 0,
        "U": 0,
        "E": 0,
    }

    const addScore = ({ player, problemNumber, penaltyTime, problemStatus }) => {
        const problemSolved = problemStatus === "C";

        const penalty = problemSolved
            ? penaltyTime
            : penaltyTimes[problemStatus];

        const playerAlreadyOnRank = rank.some(pr => pr.player === player);

        if (!playerAlreadyOnRank) {
            rank.push({
                player,
                problemsSolved: 0,
                penaltyTime: 0,
            });
        }

        const playerRank = findPlayerRank(player);

        playerRank.problemsSolved = problemSolved
            ? playerRank.problemsSolved + 1
            : playerRank.problemsSolved;

        playerRank.penaltyTime += penalty;

        problemSolved
            ? movePlayerUpIfRankIsBetterThanPlayerAbove(player)
            : movePlayerDownIfRankIsWorseThanPlayerBellow(player);
    }

    const movePlayerUpIfRankIsBetterThanPlayerAbove = player => {
        const playerPosition = findPlayerPosition(player);
        const isAtFirstPlace = playerPosition === 0;

        if (isAtFirstPlace) {
            return;
        };

        const playerRank = findPlayerRank(player);
        const playerAbovePosition = playerPosition - 1;
        const playerAbove = rank[playerAbovePosition];

        const playerHasMoreProblemsSolvedThanNext =
            playerRank.problemsSolved > playerAbove.problemsSolved;

        const playerHasSameProblemsSolvedButLessPenaltyThanNext =
            playerRank.problemsSolved === playerAbove.problemsSolved &&
            playerRank.penaltyTime < playerAbove.penaltyTime;

        const playerHasBetterRankThanPlayerAbove =
            playerHasMoreProblemsSolvedThanNext || playerHasSameProblemsSolvedButLessPenaltyThanNext;

        if (playerHasBetterRankThanPlayerAbove) {
            movePlayerUpOnRank(player);
        }
    }

    const movePlayerDownIfRankIsWorseThanPlayerBellow = player => {
        const playerPosition = findPlayerPosition(player);
        const isAtLastPosition = playerPosition === rank.length - 1;

        if (isAtLastPosition) {
            return;
        }

        const playerRank = findPlayerRank(player);
        const playerBellowPosition = playerPosition + 1;
        const playerBellowRank = rank[playerBellowPosition];

        if (playerRank.penaltyTime > playerBellowRank.penaltyTime) {
            movePlayerUpOnRank(playerBellowRank.player);
        }
    }

    const movePlayerUpOnRank = player => {
        const position = findPlayerPosition(player);
        const playerRank = findPlayerRank(player);
        const upPosition = position - 1;

        rank.splice(position, 1);
        rank.splice(upPosition, 0, playerRank);
    }

    const findPlayerPosition = player => rank.findIndex(pr => pr.player == player);

    const findPlayerRank = player => rank.find(pr => pr.player === player);
    
    const getRank = () => rank.filter(pr => pr.problemsSolved);

    return {
        addScore,
        getRank
    }
}

module.exports = ScoreBoard;