import { Router } from "express";
import usersCtrl from "../controllers/usersCtrl";

const usersRoute = Router()

usersRoute.get('/get', usersCtrl.getAllUsers)
usersRoute.get('/:id', usersCtrl.getUserById)
usersRoute.post('/signup', usersCtrl.createUser)
// usersRoute.post('/login', ()=>{})
// usersRoute.post('/logout', ()=>{})
usersRoute.put('/:id', usersCtrl.updateUser)
usersRoute.delete('/:id', usersCtrl.deleteUser)


export default usersRoute

