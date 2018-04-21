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
        const playerAlreadyOnRank = rank.some(pr => pr.player === player);

        if (!playerAlreadyOnRank) {
            rank.push({
                player,
                problemsSolved: 0,
                trackingOfSolvedProblems: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                penaltyTime: 0,
            });
        }

        const playerRank = findPlayerRank(player);

        if (problemAlreadySolved(player, problemNumber)) {
            return;
        }

        const problemSolved = problemStatus === "C";
        const penalty = problemSolved
            ? penaltyTime
            : penaltyTimes[problemStatus];

        playerRank.penaltyTime += penalty;

        playerRank.trackingOfSolvedProblems[problemNumber - 1] = problemSolved
            ? 1
            : 0;

        playerRank.problemsSolved = problemSolved
            ? playerRank.problemsSolved + 1
            : playerRank.problemsSolved;

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
        const rankPlayerAbove = rank[playerAbovePosition];

        const playerHasMoreProblemsSolvedThanPlayerAbove =
            playerRank.problemsSolved > rankPlayerAbove.problemsSolved;

        const playerHasSameProblemsSolvedButLessPenaltyThanPlayerAbove =
            playerRank.problemsSolved === rankPlayerAbove.problemsSolved &&
            playerRank.penaltyTime < rankPlayerAbove.penaltyTime;

        const playersIsTiedWithAbovePlayerButTeamNumberIsLess =
            playerRank.problemsSolved === rankPlayerAbove.problemsSolved &&
            playerRank.penaltyTime === rankPlayerAbove.penaltyTime &&
            playerRank.player < rankPlayerAbove.player;

        const playerHasBetterRankThanPlayerAbove =
            playerHasMoreProblemsSolvedThanPlayerAbove ||
            playerHasSameProblemsSolvedButLessPenaltyThanPlayerAbove ||
            playersIsTiedWithAbovePlayerButTeamNumberIsLess;

        if (playerHasBetterRankThanPlayerAbove) {
            movePlayerUpOnRank(player);
            movePlayerUpIfRankIsBetterThanPlayerAbove(player);
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
            movePlayerDownIfRankIsWorseThanPlayerBellow(player);
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

    const problemAlreadySolved = (player, problem) => {
        const playerRank = findPlayerRank(player);

        return playerRank
            ? playerRank.trackingOfSolvedProblems[problem - 1]
            : false;
    };

    return {
        addScore,
        getRank,
        problemAlreadySolved
    }
}

module.exports = ScoreBoard;