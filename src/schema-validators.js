const _ = require('underscore');
const { validator, checker } = require('./utils/functional-utils');

const scoreValidator = score => {
    const playerNumberValidator = validator('Player should be a number', ({ player }) => _.isNumber(player));
    const problemNumberValidator = validator('Problem number should be a number', ({ problemNumber }) => _.isNumber(problemNumber));
    const penaltyTimeNumberValidator = validator('Penalty time should be a number', ({ penaltyTime }) => _.isNumber(penaltyTime));
    const problemStatusValidator = validator('Invalid problem status, should be C I R U or E', ({ problemStatus }) => ["C", "I", "R", "U", "E"].some(s => s === problemStatus));

    const scoreValidators = [
        playerNumberValidator,
        problemNumberValidator,
        penaltyTimeNumberValidator,
        problemStatusValidator
    ];

    return createValidationResult(score, scoreValidators);
}

const gistValidator = gist => {
    const publicValidator = validator('Public should be a bool', ({ public }) => _.isBoolean(public));
    const fileNameValidator = validator('File name should be a valid name', ({ fileName }) => fileName);
    const fileContentValidator = validator('File content should be a valid content', ({ fileContent }) => fileContent);

    const gitsValidators = [
        publicValidator,
        fileNameValidator,
        fileContentValidator
    ]

    return createValidationResult(gist, gitsValidators);
}

const createValidationResult = (objectToValidate, validators) => {
    const validator = checker(_.toArray(validators));

    const formatErrors = erros => erros.join(';');
    const validationResult = _.compose(formatErrors, validator)(objectToValidate);

    return {
        hasErrors: validationResult.length > 0,
        errors: validationResult
    }
}

module.exports = {
    scoreValidator,
    gistValidator
}
