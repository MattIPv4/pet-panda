module.exports.cleanFloat = (inputVal, defaultVal) => {
    const parsedVal = parseFloat(inputVal);
    return isNaN(parsedVal) ? defaultVal : parsedVal;
};

module.exports.cleanInt = (inputVal, defaultVal) => {
    const parsedVal = parseInt(inputVal, 10);
    return isNaN(parsedVal) ? defaultVal : parsedVal;
};

module.exports.randomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min;

module.exports.promiseDelay = delay => new Promise((resolve) => setTimeout(resolve, delay));

module.exports.immediateDOM = (callback) => new Promise((resolve) => {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            callback();
            resolve();
        });
    });
});
