const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'uyszdugziupi27$&%zdfkusonx&cvhkdgoig*sihsvcn&%shdfkhsdghdfgmbjxcfmbw34863';

const studentSchema = new mongoose.Schema({
    username : {type : String , required : true , unique : true},
    password : {type : String , required : true },
    email : {type : String , required : true },
    select :{type : String , required : true},
    tokens : [{
        token : {
            type:String,
            required:true
        }
     }]   
},
{
    collection:'student'
})

studentSchema.methods.generateToken = async function(){
    try{
        const token = jwt.sign({
            id : this._id,
            username:this.username,
            email : this.email,
            select : this.select
        },
        JWT_SECRET
        );
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token;
        // console.log(token);
    }catch(error){
        console.log(error);
        // res.send('error',error);
    }
}

studentSchema.pre("save", async function(next){
    if(this.isModified("password")){
        console.log(this.password);
        this.password = await bcrypt.hash(this.password,10);
        console.log(this.password);
    }
    next();
})
const model = mongoose.model('studentSchema',studentSchema)

module.exports = model