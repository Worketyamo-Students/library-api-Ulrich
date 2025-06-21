import { Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"
import { loan } from "../generated/prisma"

const client = new PrismaClient()

const loanCtrl = {
    createLoan: async (req: Request, res: Response) => {
        const { bookID, userID }: loan = req.body
        try {
            const findBook = await client.book.findUnique({
                where: { id: bookID }
            })
            const findUser = await client.user.findUnique({
                where: { id: userID }
            })
            if (!findUser || !findBook) {
                return res.status(400).json({
                    msg: "check your userID and bookID"
                })
            }
            if (findBook.etat === "disponible") {
                const loan = await client.loan.create({
                    data: {
                        bookID,
                        userID,
                        dateLoan: new Date()
                    }
                })
                await client.book.update({
                    where: { id: bookID },
                    data: {
                        etat: "emprunté"
                    }
                })
                //il manque l'envoie de la notification
                return res.status(201).json({
                    msg: "book loaned successfuly",
                    loaned: loan
                })
            }
            return res.status(401).json({
                msg: "This book are already loaned"
            })
        } catch (error) {
            console.error("Erreur lors de la creation: ", error);
            return res.status(500).send({ msg: " server error" })
        }


    },
    updateLoan: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            if (!id) {
                return res.status(400).json({ msg: "No ID provided" });
            }
            const findLoan = await client.loan.findUnique({
                where: { id }
            })
            if (!findLoan) {
                return res.status(404).json({ msg: "Loan not found" })
            }
            await client.book.update({
                where: { id: findLoan.bookID },
                data: {
                    etat: "disponible"
                }
            })
            const newLoan = await client.loan.update({
                where: { id },
                data: {
                    dateBack: new Date()
                }
            })
            //Il manque les notifications
            return res.status(200).send({
                msg: "book returned successfuly",
                return: newLoan
            })
        } catch (error) {
            console.error("Erreur lors du retour du livre: ", error);
            return res.status(500).send({ msg: " server error" })
        }

    },

    getUserLoans: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params

            const loanList = await client.loan.findMany({
                where: { userID: userID },
                include: { book: true }
            })
            if (loanList.length === 0) {
                res.status(404).json({ msg: "This user has never borrowed a book" });
                return;
            }
            return res.status(200).json({ msg: "log found:", historiaue: loanList });
        } catch (error) {
            console.error("Erreur lors de la creation: ", error);
            return res.status(500).send({ msg: " server error" })
        }

    }
}

export default loanCtrl