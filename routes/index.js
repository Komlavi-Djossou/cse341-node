const express = require('express');
const router = express.Router();

router.use('/contacts', require('./contacts'))

module.exports = router;


// const routes = require('express').Router();
// const contact = require('./contacts');

// routes.use(('/', require('./swagger')));
// routes.use(('contacts', contact));
// routes.use(
//     '/',
//  (docData = (req,res) => {
//     let docData = {
//         documentationURL : 'mongodb://localhost:27017', 
//     };
//     res.send(docData);
//  })
// );

//  module.exports = routes;
