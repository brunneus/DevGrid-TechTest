const _ = require('underscore');

const checker = (validators) => {

    return (obj) => {
        return _.reduce(validators, (errs, check) => {
            return check(obj)
                ? errs
                : _.chain(errs).push(check.message).value();
        }, []);
    };
}

const validator = (message, fun) => {
    const f = (...args) => fun.apply(fun, args);

    f['message'] = message;
    return f;
};

module.exports = {
    checker,
    validator
}