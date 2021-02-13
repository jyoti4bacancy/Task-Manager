const mongoose=require('mongoose')
const validator=require('validator')


mongoose.connect('mongodb://127.0.0.1:27017/Task-Manager-api',
{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true,
useFindAndModify:false})
// __v indicates version of docement when data save it.
//create model using validators and sanitizers
// const User=mongoose.model('User',{
//     name:{type:String,
//           required:true,
//           trim:true,
//           lowercase:true
//          },
//     password:{
//           type:String,
//           required:true,
//           trim:true,
//           minlength:7,
//           validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password contains password.')
//             }
//          }
//         },
//         age:{
//                 type:Number,
//                 default:0,
//                 //custom validation added using inbuilt validate() which contain only one param. 
//                 validate(value){
//                     if(value<0){
//                         throw new Error('only positive age allowed.')
//                     }
//                 }
//             },
//                 email:{
//                 type:String,
//                 trim:true,
//                 lowercase:true,
//                 validate(value){
//                     if(!validator.isEmail(value)){
//                         throw new Error('email is not valid.! ')
//                     }
//                 }
//               }
//     })
// //create instance using model
// const me=new User({
//     name:"   Pooja",
//     password:"  1234js46",
//     email : "SharmaJyoti@gmail.com",
//     age:20
// })

// //save instance in db
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })


//Task model
//create instance using model
// const task=new Task({
//     description:"cooking",
 

// })

// //save instance in db
// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log(error)
// })
