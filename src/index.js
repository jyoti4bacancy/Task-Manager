const express=require('express')
require('./db/mongoose');
const userRouter=require('./router/user')
const taskRouter=require('./router/task')
const jwt=require('jsonwebtoken');
const User = require('./models/user');
const app=express();
const port=process.env.PORT
app.use(express.json())
//middleware that run after new req arrives
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     next()
// })
app.use(userRouter);
app.use(taskRouter);
// const multer=require('multer')
// const upload=multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000
//     },
//     fileFilter(req,file,callback){
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return callback(new Error('please upload doc file.'))
//         }
//         callback(undefined,true)
//     }
// })
// app.post('/upload',upload.single('uploads'),(req,res)=>{
//     res.send()
// })


//any req. is not executed.to stop go on route handler
//when we not provide next() route handler is not run & system hang on there. 
// app.use((req,res,next)=>{
//     res.status(503).send('site is down.chexk back soon.')
    
// })
// without middleware: new req->   run route handler 
// with middleware: new req-> do something(like function)  ->  run route handler 
  
app.listen(port,()=>{
    console.log("server started at port "+port);
})


//-----------Json Web Server Example-----------------
// const myfun=async ()=>{
//     const token=jwt.sign({_id:"abc123"},'thisisexample',{expiresIn:'7 days'})
//     console.log(token)
//     const data=jwt.verify(token,'thisisexample')
//     console.log(data)
// }
// myfun()



// const main=async()=>{
//     const user=await User.findById('5ff028b716c80c2e205b1305')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()