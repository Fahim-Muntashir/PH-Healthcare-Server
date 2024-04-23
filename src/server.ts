import express from 'express';

const app = express();

const port = 3000;

app.listen(port, () => {
    console.log("APp is Listhening on port 3000")
})