import { Router } from "express";
import loanCtrl from "../controllers/loanCtrl";

const loansRoute = Router()

loansRoute.post('/', loanCtrl.createLoan)
loansRoute.put("/:id/return", loanCtrl.updateLoan)
loansRoute.get('/user/:userID', loanCtrl.getUserLoans)



export default loansRoute