const { mongoose } = require('./database/database');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('dist'));

if (process.env.NODE_ENV === "production") {
  console.log('production');
} else {
  console.log('development');
}

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
