//Cors : cross origin resource sharing  (third party middleware)

const whitelist=require('./whitelist');


const corsOptions=
{
    origin:(origin,callback)=>{
        if(whitelist.indexOf(origin)!==-1||origin==undefined)
        {
            callback(null,true);
        }
        else
        {
            callback(new Error('Forbbiden by cors'));
        }
    },
    optionSuccessStatus:200
}

module.exports=corsOptions;