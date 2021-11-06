const express = require("express");
const router = express.Router();
const {validPassword, validEmail, validPhone} = require("../configs/validator.js");
const {hashPassword, comparePassword} = require("../configs/validLogin");

const User = require("../models/user.js");
const user1 = new User({
    "password": "54654654Loc@",
    "username": "locdeptrai",
    "email": "loc@gmail.com",
    "phone": "0969422317",
    "address": "Binh Duong",
    "emoji": "/abc/hihi.jpg"
});

router.post('/join', (req, res) => {
    function genUserID() {
        const nums1 = Math.floor(1000 + Math.random() * 9000);
        const nums2 = Math.floor(10 + Math.random() * 90);
        return `User${nums1}${nums2}`;
    }
    
    const createUser = new User({
        idUser: genUserID().toString(),
        password: hashPassword(req.body.password),
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        emoji: req.body.emoji
    });
    
    if(!validEmail(req.body.email))
        res.send({code: 0, notify:"Your email is invalid!"});
    else if(!validPassword(req.body.password))
        res.send({code: 0, notify:"Your password is invalid!"});
    else if(!validPhone(req.body.phone))
        res.send({code: 0, notify:"Your number phone is invalid!"});
    else{
        User.countDocuments({email: req.body.email}, function(err, count){
            if(err){
                res.send({code: 0, err});
            }else{
                if(count != 0){
                    res.send({code: 0, notify:"This email has already exist!"});
                }
                else{
                    createUser.save((err, result) => {
                        if(err) res.send({err});
                        else{
                            res.status(200).send({code: 1, data: result});
                            console.log(`Saved at ${Date.now()}`);
                        }
                    });
                }
            }
        });
        
    }
})

router.post('/login', async (req, res) => {
    const password = req.body.password;
    if(!validEmail(req.body.email))
        res.send({code: 0, notify:"Your email is invalid!"});
    else if(!validPassword(password))
        res.send({code: 0, notify:"Your password is invalid!"});
    else{
        const user = await User.findOne({email: req.body.email}).exec();
        if(user == null || user.delete == true){
            res.send({code: 0, notify: "User not found!"})
        }else{
            if(comparePassword(password, user.password) === false){
                res.send({code: 0, notify:"Password or Email is incorrect!"});
            }else{
                res.status(200).send({code: 1, notify:"Login successfully!", data: user});
            }
        }
    }
});

router.get('/', async (req, res) => {
    const listUser = await User.find({delete: false});
    res.send({data: listUser});
});

router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({idUser: id}).exec();

    if(user == null){
        res.send({code: 0, notify:"Cannot found user!"});
    }else{
        res.status(200).send({data: user});
    }
});

router.patch('/update/:id', (req, res) => {
    const id = req.params.id;
    const {username, phone, address} = req.body;

    if(!validPhone(phone)){
        res.send({code: 0, notify:"Your number phone is invalid!"});
    }else{
        User.findOneAndUpdate({idUser: id}, {$set: {username: username, phone: phone, address: address}}, {new: true}, (err, user) => {
            if(err){
                res.send({code: 0, notify: err});
            }
            res.send({code: 1, notify: "Update successfully!", data: user})
        });
    }
});

router.patch('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({idUser: id}).exec();

    if(user == null || user.delete == true){
        res.send({code: 0, notify:"Cannot found user!"});
    }else{
        User.findOneAndUpdate({idUser: id}, {$set: {delete: true}}, (err) => {
            if(err){
                res.send({code: 0, notify: err});
            }
            res.send({code: 1, notify:"Delete user successfully!"})
        });
    }
    
});

module.exports = router;