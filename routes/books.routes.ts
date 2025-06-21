import { Router } from "express";
import booksCtrl from "../controllers/booksCtrl";

const booksRoute = Router()

booksRoute.get('/', booksCtrl.getAllBooks)
booksRoute.get('/:id', booksCtrl.getBookById)
booksRoute.post('/', booksCtrl.addBook)
booksRoute.put('/:id', booksCtrl.updateBook)
booksRoute.delete('/:id', booksCtrl.deleteBook)

export default booksRoute