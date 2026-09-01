import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { auth } from "../../utils/decodedToken.js";



const router = Router()



router.post("/register", userControllers.createUser)
router.get("/", userControllers.getAllUsers)
router.get("/affiliate", userControllers.getAllAffiliedUser)
router.get("/staffs", userControllers.getAllStaffs)
router.get("/me", auth,userControllers.getMe)
router.get("/:id", userControllers.getSingleUser)
router.delete("/:id", userControllers.deleteSingleUser)
router.patch("/:id", userControllers.updateSingleUser)

// /api/v1/user/:id
export const UserRoutes = router