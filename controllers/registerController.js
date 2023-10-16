 const User=require('../model/User');
 const bcrypt=require('bcrypt');


 const handleNewUser=async (req,res) =>
 {
    const {user,pwd}=req.body;
    if(!user||!pwd)
    {
        return res.status(400).json({'message':'User name and password are required'});
    }
    // check for duplicate user names in the db
    const duplicate=await User.findOne({username:user}).exec();
    if(duplicate)
        return res.sendStatus(409);//conflict
    try
    {
        // encrypting password 
        const hashPwd=await bcrypt.hash(pwd,10);
        //Create and Store the new user in the file json
        const result= await User.create(
        {
            "username":user,
            "password":hashPwd
        });

        /* 
            like oop it's easy see :->
            const newUser=new User({});
            newUser.username="name"
            ...
            ...
            const result=await newUser.save();
        */

        console.log(result);
        res.status(201).json({'success':`New user ${user} created`});

    }catch(e){
        res.status(500).json({'message':e.message})
    }
    // console.log(userDB.users);
 }
 module.exports={handleNewUser};