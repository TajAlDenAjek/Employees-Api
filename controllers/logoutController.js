const User=require('../model/User');



const handleLogout=async(req,res)=>
{
    //On Clinet also delete the access token 

    const cookies=req.cookies;
    if(!cookies?.jwt)
        return res.sendStatus(204); // No content to send back
    const refreshToken=cookies.jwt;

    // is the refresh token in the Data base 
    const foundUser=await User.findOne({refreshToken}).exec();

    if(!foundUser)
    {
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
        return res.sendStatus(204); //successful but no content
    }
    // Delte the refresh token in the data base 
    foundUser.refreshToken='';
    const result=await foundUser.save();
    console.log(result);
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});
    res.sendStatus(204);

}

module.exports={handleLogout};