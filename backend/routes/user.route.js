const express = require("express");
const { UserModel } = require("../model/user.model");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {BlacklistModel} = require("../model/blacklist.model");

const userRoute = express.Router();

userRoute.post("/users/register", async (req, res, next)=>{
    try {
        const {email, pass} = req.body;
        const userChecker = await UserModel.find({email});
        if(userChecker.length>0){
            return res.status(400).send("registration failed: user alredy exist");
        }
        if(passwordChecker(pass)){
            const hashPass = bcrypt.hashSync(pass, 5);
            const postUser = new UserModel({...req.body, pass:hashPass});
            await postUser.save();
            return res.status(200).send( {"msg":"The new user has been registered", "registeredUser":{...res.body, pass:hashPass}});
        }else{
            return res.status(400).send( {"error":"password must contain atleast one uppercase alpahbet, atleast one number,atleast one special character and its length should be greater than 8 characters long"});
        }
    } catch (error) {
        return res.status(400).send({"error":error});
    }
} )


function passwordChecker(pass){
    if(pass.length<8){
        return false;
    }

    const aplhabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const number = "1234567890";
    const special = "!@#$%^&*()_+,./{}[]\|;:";
    const flag1=false;
    const flag2=false;
    const flag3=false;

    for(let i=0;i<pass.length;i++){
        if(aplhabet.includes(pass[i])){
            flag1=true
        }
        if(number.includes(pass[i])){
            flag2=true
        }
        if(special.includes(pass[i])){
            flag3=true
        }
    }

    return flag1 && flag2 && flag3 ;

}


userRoute.post(" /users/login", async (req,res,next)=>{
    try {
        const {email, pass} = req.body;
        const checkUser = await UserModel.findOne({email});
        if(checkUser){
            bcrypt.compare(pass, checkUser.pass, (err, result)=>{
                if(result){
                    try {
                        const token = jwt.sign({id:checkUser._id}, "nem111c3",{expiresIn:420000} )

                        return res.status(200).send({"msg":"Login successful!", "token":token})
                    } catch (error) {
                        return res.status(400).send({"error":error})
                    }
                }else{
                    return res.status(400).send({"error":"Invalid Password"})
                }
            })
        }else{
            return res.status(400).send({"error":"Innvalid UserId "})
        }
    } catch (error) {
        return res.status(400).send({"error":error})
    }
})


userRoute.get("/users/logout", async (req,res,next)=>{
    try {
        const token = req.headers?.authorization?.split(" ")[1];
        if(token){
            const blacklist = new BlacklistModel({token});
            await blacklist.save();
            return res.status(200).send({"msg":"User has been logged out"});
        }
    } catch (error) {
        return res.status(400).send({"error":error})
    }
})


module.exports = {userRoute}