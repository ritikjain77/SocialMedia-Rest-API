const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register
router.post("/register",async(req,res)=>{
    
    try {
        //hashing the password
        // const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // creating new user
        const newUser = await new User({
            username : req.body.username,
            email: req.body.email,
            password:hashedPassword,
        });
         //generating jwt
         const token = await newUser.generateAuthToken();


        // save to database
        const user = await newUser.save();
        console.log("hey");
        res.status(200).send(user);
    } catch (err) {
        console.log(err);
    }
})

// login
router.post("/login",async(req,res) =>{
    try{
        const user = await User.findOne({ email: req.body.email});
        !user && res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("wrong password");

        res.status(200).json(user)
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;