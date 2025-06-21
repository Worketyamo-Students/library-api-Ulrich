import express  from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import usersRoute from "./routes/users.routes";
configDotenv()

const app = express();
app.use(bodyParser.json());


const port= process.env.PORT;


app.use('/users', usersRoute)

app.listen(port, ()=>{
    console.log(`le serveur s'execute à l'adresse: http://localhost:${port}/`);
    
})