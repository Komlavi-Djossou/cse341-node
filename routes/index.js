const routes = require('express').Router();

routes.get('/', (req, res) => {
    res.send('Pauline Apeti');
});

module.exports = routes;