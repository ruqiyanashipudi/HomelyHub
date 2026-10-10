//user Schema
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto"
import { type } from "node:os";
import { kMaxLength } from "node:buffer";
import { timeStamp } from "node:console";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: [true,"please enter your name"],
            // '          john             '=> 'john'
            trim: true,
            MaxLength:[50, "your name cannot be longer than 50 characters"]
        },
        email:{
            type: String,
            required:[true,"please enter email ID"],
            unique: true,
            lowercase:true,
            trim:true,
            validate:[validator.isEmail,"please enter valide email address"]
        },
        password:{
            type: String,
            required: [true, "please enter password"],
            minlength:[6,"your password must be longer than 6 characters"],
            select:false
        },
        passwordConfirm :{
            type: String,
            required: [true, "please confirm your password"],
            validate:{
                validator:function(el){
                    return el === this.password
                },
                message:"Passwords are not the same !"
            }

        },
        phoneNumber:{
            type:String,
            required: true,
            unique: true,
            trim: true
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        avatar:{
            url:{type:String},
            public_id:{type:String}
        },
        passwordChangedAt:{
            type:Date
        },
        passwordResetToken:{
            type:String,
            select:false,
            index:true
        },
        passwordResetExpires:{
            type:String,
            select:false,
        },

    },
    {timestamps:true}
)

userSchema.set("toJSON",{
    transform:function(doc,ret){
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;
        return ret;
    }
})

userSchema.pre("save",async function(){
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined;
    
})


userSchema.methods.correctPassword = async function(canditatePassword, userPassword){
    return await bcrypt.compare(canditatePassword,userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime()/1000, 
            10
        );
    return JWTTimestamp < changedTimeStamp
    }
    return false;
}

userSchema.method.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() =10 *60 *1000;
    return resetToken;
}


const User = mongoose.model("User", userSchema);
export{User};