import express  from "express";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import usersRoute from "./routes/users.routes";
import booksRoute from "./routes/books.routes";
import loansRoute from "./routes/loans.routes";
configDotenv()

const app = express();
app.use(bodyParser.json());


const port= process.env.PORT;


app.use('/users', usersRoute)
app.use('/books', booksRoute)
app.use('loans', loansRoute)


app.listen(port, ()=>{
    console.log(`le serveur s'execute à l'adresse: http://localhost:${port}/`);
    
})