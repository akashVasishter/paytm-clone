const express = require("express");
const { User } = require("../db");
const router = express.Router();
const authenticationMiddleware = require("../middleware");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const zod = require("zod");

//signup route 
const signupBody = zod.object({

    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()

})
router.post("/signup", async(req,res) => {

    const {success} = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Incorrect input"
        })
    }
    const existingUser = await User.findOne({

        username: req.body.username
    })
    if(existingUser){
          return res.status(411).json({
          message: "Email already taken"
        })
    }

    const user = User.create({

        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName

    })

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        
        message: "User created successfully",
        token: token
    })

});


//update user info in db

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional()
})

router.put('/',authenticationMiddleware, async(req,res) => {

    const {success} = updateBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Incorrect input"
        })
    }

    const updateFields = await User.updateOne({id: req.userId}, req.body)
    res.json({
        message: "User details updated successfully"
    })
})

//To get bulk user details

router.get("/bulk", async(req, res) => {

    const filter = req.query.filter || "";

    const users = await User.find({

        $or: [{
            firstName: {"$regex": filter, "$options": "i"}
        }, {
            lastName: {"$regex": filter, "$options": "i"}
        }]
    })

    res.json({
        users: users.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
        }))
    })
})


module.exports = router;