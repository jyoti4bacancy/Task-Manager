const express=require('express')
const sharp=require('sharp')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const {sendCancelationEmail,sendWelcomeEmail}=require('../emails/accounts')
//create user sign in
router.post('/users',async(req,res)=>
{  const user=new User(req.body);
   try{
     const result=   await user.save()
     sendWelcomeEmail(user.email,user.name)
     const token=await user.generateAuthToken()
     res.send({result,token})     
  
   }
   catch(e){
    res.status(400).send();
   }
   
})
router.delete('/users/me',auth,async(req,res)=>
{
    try{
        // const user=await  User.findByIdAndDelete(req.params.id)
        //     if(!user){
        //         //not found
        //         return res.status(404).send()
        //     }
             await  req.user.remove()
       sendCancelationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }
    catch(error){
        res.status(500).send();
    }
})
//login for user
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email, req.body.password)
        const token=await user.generateAuthToken()
       res.send({user,token})     
    }
    catch(e){
            res.status(400).send(e);
    }
    
})
//logout user
router.post('/users/logout',auth,async(req,res)=>{
    try{
          req.user.tokens=req.user.tokens.filter((tok)=>{
              return tok.token!==req.token
          })
          await req.user.save()
          res.send()
    }
    catch(e){
            res.status(500).send(e);
    }
    
})
//logout user
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
          req.user.tokens=[]
          await req.user.save()
          res.send()
    }
    catch(e){
            res.status(500).send(e);
    }
    
})
  // get profile after login
  router.get('/users/me',auth,async(req,res)=>
  {
     res.send(req.user)
    })

//read user whole documents
// router.get('/users',async(req,res)=>
// {
//     try{

//         const users= await  User.find({})
//          res.send(users)
//     }
//     catch(error){
//         res.status(500).send(error);
//     }
  
//   })

// router.get('/users/:id',async(req,res)=>
// {
//     try{
//         const user=await  User.findById(req.params.id)
//             if(!user){
//                 //not found
//                 return res.status(404).send()
//             }
//             res.send(user)
//          }
//     catch(error){
//         res.status(500).send(e);
//     }
// })

  //updating user using id
  router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdate=['name','age','email','password']
    const isValidOperation=updates.every((update)=>allowedUpdate.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'invalid update !'})
    }
    try{

            //const user=await User.findById(req.params.id)
            updates.forEach((update)=>req.user[update]=req.body[update] )
             await req.user.save()
  
    // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //       if(!user){
    //           return res.status(404).send()
    //       }  
          res.send(req.user)
  }
    catch(error){
          res.status(400).send(error)
    }
})

//delete user



const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('please upload image in png,jpg format.'))
        }
        callback(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})
module.exports=router;