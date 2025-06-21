import { Router } from "express";
import usersCtrl from "../controllers/usersCtrl";

const usersRoute = Router()

usersRoute.get('/get', usersCtrl.getAllUsers)
usersRoute.get('/get/:id', usersCtrl.getUserById)
usersRoute.post('/create', usersCtrl.createUser)
usersRoute.put('/update/:id', usersCtrl.updateUser)
usersRoute.delete('/delete/:id', usersCtrl.deleteUser)


export default usersRoute

