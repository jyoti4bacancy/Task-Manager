const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task = require('./task')
const userSchema=new mongoose.Schema({ 
    name:{type:String,
    required:true,
    trim:true,
    lowercase:true
   },
password:{
    type:String,
    required:true,
   
    trim:true,
    minlength:7,
    validate(value){
      if(value.toLowerCase().includes('password')){
          throw new Error('Password contains password.')
      }
   }
  },
  age:{
          type:Number,
          default:0,
          //custom validation added using inbuilt validate() which contain only one param. 
          validate(value){
              if(value<0){
                  throw new Error('only positive age allowed.')
              }
          }
      },
          email:{
          type:String,
          trim:true, unique:true,
          lowercase:true,
          validate(value){
              if(!validator.isEmail(value)){
                  throw new Error('email is not valid.! ')
              }
          }
        },
        tokens:[{
            token:{
                type:String,required:true
            }
        }],
        avatar:{
            type:Buffer
        }
},{timestamps:true})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//hiding private data this is apply to all methods by default
userSchema.methods.toJSON=function(){

    const userObj=this.toObject()
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    return userObj
}

//generate tokens
userSchema.methods.generateAuthToken= async function(){
    const user=this;
    const token= await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save();
    return token
}
//check login 
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch= await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    
    return user
}
//save password in hash form
userSchema.pre('save',async function(next){
     const user=this
     if(user.isModified('password')){
         user.password=await bcryptjs.hash(user.password,8);
     }
    next()
})
userSchema.pre('remove',async function(next){
 const user=this
await Task.deleteMany({owner:user_id})
 next()
})
const User=mongoose.model('User',userSchema)
module.exports=User;