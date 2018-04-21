const expect = require("chai").expect;
const { scoreValidator, gistValidator } = require('../src/schema-validators');

describe('SchemaValidator', () => {
    describe('scoreValidator', () => {
        it('WhenValidateSomeInvalidScoreShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({});

            const [firstError, secondError, thirdError, fourthError, fifthError, sixthError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Player should be a number");
            expect(secondError).to.be.equal("Player number should be between 1 and 100");
            expect(thirdError).to.be.equal("Problem number should be a number");
            expect(fourthError).to.be.equal("Problem number should be between 1 and 9");
            expect(fifthError).to.be.equal("Penalty time should be a number");
            expect(sixthError).to.be.equal("Invalid problem status, should be C I R U or E");
        })

        it('WhenValidateSomeInvalidGistShouldReturnValidationWithErros', () => {
            const validation = gistValidator({});

            const [firstError, secondError, thirdError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Public should be a bool");
            expect(secondError).to.be.equal("File name should be a valid name");
            expect(thirdError).to.be.equal("File content should be a valid content");
        })

        it('WhenValidateSomeValidScoreWithInvalidProblemStatusShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({ player: 1, problemNumber: 1, penaltyTime: 10, problemStatus: "H" });

            const [firstError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Invalid problem status, should be C I R U or E");
        })

        it('WhenPlayerNumberIsBellowOneShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({ player: 0, problemNumber: 1, penaltyTime: 10, problemStatus: "C" });

            const [firstError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Player number should be between 1 and 100");
        })

        it('WhenPlayerNumberIAboveOneHundredShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({ player: 101, problemNumber: 1, penaltyTime: 10, problemStatus: "C" });

            const [firstError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Player number should be between 1 and 100");
        })

        it('WhenProblemNumberIsBellowOneShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({ player: 1, problemNumber: 0, penaltyTime: 10, problemStatus: "C" });

            const [firstError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Problem number should be between 1 and 9");
        })

        it('WhenPlayerNumberIAboveNineShouldReturnValidationWithErros', () => {
            const validation = scoreValidator({ player: 1, problemNumber: 10, penaltyTime: 10, problemStatus: "C" });

            const [firstError] = validation.errors.split(';');

            expect(validation.hasErrors).to.be.equal(true);
            expect(firstError).to.be.equal("Problem number should be between 1 and 9");
        })
    })

    describe('gistValidator', () => {

        it('WhenValidateSomeValidScoreShouldReturnValidValidation', () => {
            const validation = scoreValidator({ player: 1, problemNumber: 1, penaltyTime: 10, problemStatus: "C" });

            expect(validation.hasErrors).to.be.equal(false);
            expect(validation.errors.length).to.be.equal(0);
        })

        it('WhenValidateSomeGistShouldReturnCorrectValidation', () => {
            const validation = gistValidator({ public: true, fileName: 'some name', fileContent: 'some content' });

            expect(validation.hasErrors).to.be.equal(false);
            expect(validation.errors.length).to.be.equal(0);
        })
    })
});