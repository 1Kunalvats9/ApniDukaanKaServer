import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.post('/get-user', async (req,res)=>{
    try{
        const { email } = req.body; 
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ error: 'user not found' });
        }
        return res.status(200).json({ success: true, data: user });

    }catch(err){
        console.error("❌ Error in getting the user:", err);
        res.status(500).json({ success: false, message: err.message });
    }
})

export default router;