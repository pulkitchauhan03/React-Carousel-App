const express = require('express')
const data = require('./data')
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    console.log("accessed");
    res.status(200).json(data);
})

const port = 8000;
app.listen(port, () => {
    console.log(`App running`);
})