import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";
import { book } from "../generated/prisma";

const client = new PrismaClient()

const booksCtrl = {

    getAllBooks: async (req: Request, res: Response) => {

        try {
            const books = await client.book.findMany()
            console.log(req.url);

            return res.status(200).send({ books })
        } catch (error) {
            return res.status(404).json({ msg: "404: Not Found}" })
        }

    },

    getBookById: async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            if (!id) {
                return res.status(400).json({ msg: "No ID provided" });
            }
            const Book = await client.book.findUnique({
                where: { id }
            })
            if (!Book) {
                return res.status(404).json({ msg: "book not found" })
            }
            return res.status(200).send({ Book })
        } catch (error) {
            console.error("Erreur rencontrée", error);
            return res.status(500).send({ msg: " server error" })
        }
    },

    addBook: async (req: Request, res: Response) => {
        const { titre, auteur, description, anneePub, ISBN }: book = req.body
        if (!titre || !auteur || !description || !anneePub || !ISBN) {
            return res.status(400).json({ msg: "Veillez remplir tous les champs" })
        }
        try {
            const book = await client.book.create({
                data: {
                    titre,
                    auteur,
                    description,
                    anneePub,
                    ISBN
                }
            })
            return res.status(200).send({
                msg: `the book ${book.titre} added successfuly`,

            })
        } catch (error) {
            console.error("Erreur lors de la creation: ", error);
            return res.status(500).send({ msg: " server error" })
        }
    },

    updateBook: async (req: Request, res: Response) => {
        const { id } = req.params
        const { titre, auteur, description, anneePub, ISBN }: book = req.body
        try {
            if (!id) {
                return res.status(400).json({ msg: "No ID provided" });
            }

            const findbook = await client.book.findUnique({ where: { id } });

            if (!findbook) {
                return res.status(401).json({ msg: "Book not found: Invalid ID" });
            }
            if (!titre || !auteur || !description || !anneePub || !ISBN) {
                return res.status(400).json({ msg: "Veillez remplir tous les champs" })
            }
            const updateBook = await client.book.update({
                where: { id },
                data: {
                    titre,
                    auteur,
                    description,
                    anneePub,
                    ISBN
                }
            })
            return res.status(200).send({
                msg: "Book updated successfuly",
                newBook: updateBook
            })
        } catch (error) {
            console.error("Erreur lors de la mise à jour: ", error);
            return res.status(500).send({ msg: " server error" })
        }

    },

    deleteBook: async (req: Request, res: Response) => {

        const { id } = req.params
        try {
            if (!id) {
                return res.status(400).json({ msg: "No ID provided" });
            }
            const Book = await client.book.findUnique({
                where: { id }
            })
            if (!Book) {
                return res.status(404).json({ msg: "book not found" })
            }
            await client.user.delete({
                where: { id }
            })
            return res.status(200).json({ msg: "Book deleted successfuly" })
        } catch (error) {
            console.error("Erreur lors de la suppression: ", error);
            return res.status(500).send({ msg: " server error" })
        }

    }
}

export default booksCtrl