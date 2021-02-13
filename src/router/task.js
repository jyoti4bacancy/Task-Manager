const express=require('express')
const router=new express.Router()
const Task=require('../models/task')
const auth=require('../middleware/auth')
//create task
router.post('/tasks',auth,async(req,res)=>
{
   const task=new Task({
       ...req.body,
       owner:req.user._id
   });
   try{
        const Task=await task.save()
        res.send(Task)
   }
   catch(error){
    res.status(400).send(error);
   }
})

//read all tasks
/*paging is done using limit and skip. sorting is done using timestamps property of mongoose. */
//get/tasks?completed=true
//get/tasks?limit=2&skip=0
//get/tasks?createdAt:desc
router.get('/tasks/',auth,async(req,res)=>
{
    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'? -1 : 1
    }
    try{
    
       //1 way to done it.  const tasks=await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match:match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
               res.send(req.user.tasks)
    }
    catch(error){
      //return server error
        res.status(500).send(error); 
    }
   
})
//read single task data

router.get('/tasks/:id',auth,async(req,res)=>
{
    try{
        const task=await  Task.findOne({_id:req.params.id,owner:req.user._id})
            if(!task){
                //bad request status
                return res.status(404).send()
            }
            res.send(task)
    }
    catch(error){
       //server error status
       res.status(500).send(error); 
    }
  })
  
  //update task using id
  router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdate=['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdate.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'invalid update !'})
    }
    try{
        
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }  
      
        updates.forEach((update)=>{
            task[update]=(req.body[update])
        })
        await task.save()
      //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
          res.send(task)
  }
    catch(error){
          res.status(400).send(error)
    }
})

//delete user

router.delete('/tasks/:id',auth,async(req,res)=>
{
    try{
        const task=await  Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
            if(!task){
                //not found
                return res.status(404).send()
            }
            res.send(task)
         }
    catch(error){
        res.status(500).send(error);
    }
})
module.exports=router;