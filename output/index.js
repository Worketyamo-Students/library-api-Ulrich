import express from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
configDotenv();
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;
app.listen(port, (err) => {
    if (err)
        throw err;
    console.log(`le serveur s'execute à l'adresse: http://localhost:${port}/`);
});
