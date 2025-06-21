
import { Request, Response } from "express"
import { PrismaClient } from "../generated/prisma"
import { user } from "../generated/prisma"
import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken";

const client = new PrismaClient()
// const JWT_SECRET = process.env.JWT_SECRET || "secret";


const usersCtrl = {

    getUserById: async (req: Request, res: Response) => {
        const { id } = req.params

        if (!id) {
            return res.status(404).json({ msg: "User  not found: No ID provided" });
        } else {
            const User = await client.user.findUnique({
                where: { id }
            })
            if (User) {
                return res.status(200).send({ msg: User })
            } else {
                return res.status(404).json({ msg: "user not found" })
            }
        }
    },

    getAllUsers: async (req: Request, res: Response) => {

        try {
            const Users = await client.user.findMany();
            console.log(req.ip);
            return res.status(200).send({ Users });

        } catch (error) {
            return res.status(404).json({ msg: "404: Not Found}" })
        }

    },

    createUser: async (req: Request, res: Response) => {
        const { nom, email, motDePasse }: user = req.body

        if (!nom || !email || !motDePasse) {
            return res.status(400).json({ msg: "Veillez remplir tous les champs" })
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ //verification regex
            if (!emailRegex.test(email)) {
                return res.status(400).json({ msg: "Adresse e-mail invalide" });
            }
            try{
                const motDePasseCrypte = await bcrypt.hash(motDePasse, 10)//hashage du mot de passe
                const User = await client.user.create({
                data: {
                    nom,
                    email,
                    motDePasse: motDePasseCrypte
                }
            })

            return res.status(201).send({
                msg: `User ${User.nom} created successfuly`,

            })
            }catch(error){
                console.error("Erreur lors de la creation: ", error);
                return res.status(500).send({msg: " server error"})
            }
        }
    },
    // connectUser: async (req: Request, res: Response)=>{
    //     const { email, motDePasse } = req.body;

    // if (!email || !motDePasse) {
    //   return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
    // }

    // try {
    //   const user = await client.user.findUnique({ where: { email } });
    //   if (!user) {
    //     return res.status(404).json({ msg: "User not found" });
    //   }

    //   const isGoodPassword = await bcrypt.compare(motDePasse, user.motDePasse);
    //   if (!isGoodPassword) {
    //     return res.status(401).json({ msg: "Mot de passe incorrect" });
    //   }

    //   //  Génération du token JWT
    //   const token = jwt.sign(
    //     { id: user.id, email: user.email },
    //     JWT_SECRET,
    //     { expiresIn: "1d" }
    //   );

    //   return res.status(200).json({ msg: "Connection successful", token });
    // } catch (error) {
    //   console.error("Erreur lors de la connexion :", error);
    //   return res.status(500).json({ msg: "Error server" });
    // }

    // },


    updateUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { nom, email, motDePasse }: user = req.body;

        if (!id) {
            return res.status(400).json({ msg: "No ID provided" });
        }

        const findUser = await client.user.findUnique({ where: { id } });

        if (!findUser) {
            return res.status(401).json({ msg: "User not found: Invalid ID" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Adresse e-mail invalide" });
        }

        try {
            const motDePasseCrypte = await bcrypt.hash(motDePasse, 10)
            const updatedUser = await client.user.update({
                where: { id },
                data: {
                    nom,
                    email,
                    motDePasse: motDePasseCrypte
                },
            });

            return res.status(200).json({
                msg: "User updated successfully",
                newUser: updatedUser,
            });

        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            return res.status(500).json({ msg: "Server error" });
        }
    },

    deleteUser: async (req:Request, res:Response)=>{
        const {id} = req.params

        if (!id) {
            return res.status(400).json({ msg: "No ID provided" });
        }

        const findUser = await client.user.findUnique({ where: { id } });

        if (!findUser) {
            return res.status(401).json({ msg: "User not found: Invalid ID" });
        }
        try{
            await client.user.delete({
                where: {id}
            })
            return res.status(200).json({msg:"User deleted successfuly"})
        }catch (error) {
            console.error("Erreur lors de la suppression :", error);
            return res.status(500).json({ msg: "Server error" });
        }

    }

}



export default usersCtrl