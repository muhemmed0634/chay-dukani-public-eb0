// Vercel Serverless Entrypoint
// Bu fayl Vercel-in root entrypoint tələbini təmin edir və API-yə yönləndirir.
const apiOrdersHandler = require('./api/orders.js');

module.exports = (req, res) => {
    return apiOrdersHandler(req, res);
};
