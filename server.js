const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const cors = require('cors');

const swaggerAutogen = require('swagger-autogen')();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 5000;
const app = express();

app
.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
.use(cors())
.use(express.json())
.use(bodyParser.json())
.use(express.urlencoded({ extended: true}))
.use('/', require('./routes'));


// const db = requre('./models');
//   db.mongoose
//   .connect(db.url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

