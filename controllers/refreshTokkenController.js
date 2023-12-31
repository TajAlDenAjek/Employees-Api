const User=require('../model/User');
const jwt=require('jsonwebtoken');




const handleRefreshToken=async(req,res)=>
{
    // console.log("hi");
    const cookies=req.cookies;
    if(!cookies?.jwt)
        return res.sendStatus(401);
    const refreshToken=cookies.jwt;
    const foundUser=await User.findOne({refreshToken}).exec();

    // console.log(usersDB.users);
    // console.log(foundUser)
    if(!foundUser)
        return res.sendStatus(403); //Forbideen
    // evaluate Jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (e,decoded)=>
        {
            if(e||foundUser.username!==decoded.username)
                return res.sendStatus(403);
            const roles=Object.values(foundUser.roles);
            const accessToken=jwt.sign(
                {
                    "UserInfo":
                    {
                        "username":decoded.username,
                        "roles":roles
                    },
                    "username":decoded.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'30s'}
            )
            res.json({accessToken});

        }
    )
  
}

module.exports={handleRefreshToken};