module.exports = function authenticate(req, res, next) {
    console.log('Authentication...');
    next();
}
