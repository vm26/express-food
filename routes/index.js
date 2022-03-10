var express = require('express');
var router = express.Router();
var {mongodb,dbUrl,MongoClient} =require('../dbConfig');

/*get all foods*/
router.get('/',async(req, res)=> {
  const client=await MongoClient.connect(dbUrl);
 try {
   const db= await client.db('b28we');
   let food=await db.collection('food').find().toArray();
   res.send({
     statusCode:200,
     data:food,
     message:"Foods fetched successfully"
   })
   
 } catch (error) {
  res.send({
    statusCode:500,   
    message:"Internal server error"
  })
   
 }
 finally{
   client.close();
 }

});

//sort by price
router.get('/sort/:order',async(req, res)=> {
  let order=req.params.order;
  const client=await MongoClient.connect(dbUrl);
 try {
   const db= await client.db('b28we');
   let food=await db.collection('food').find().sort({price:order}).toArray();
   res.send({
     statusCode:200,
     data:food,
     message:"Foods fetched successfully"
   })
   
 } catch (error) {
  res.send({
    statusCode:500,   
    message:"Internal server error"
  })
   
 }
 finally{
   client.close();
 }

});

/*get foods by type */
//filter food by category
//filter food by sub-category
//filter food by both category & sub-category
router.get('/type',async(req, res)=> {  
  const client=await MongoClient.connect(dbUrl);
 try {
   const db=await client.db('b28we');
   let food;
   if(req.body.category && !req.body.sub_cat)
   {
   food=await db.collection('food').find({category:req.body.category}).toArray();
   }
   else if(!req.body.category && req.body.sub_cat)
   {
    food=await db.collection('food').find({sub_cat:req.body.sub_cat}).toArray();
   }
   else if(req.body.category && req.body.sub_cat){
    food=await db.collection('food').find({$and:[{sub_cat:req.body.sub_cat},{category:req.body.category}]}).toArray();
   }  
   res.send({
     statusCode:200,
     data:food,
     message:"Filtered successfully"
   })
   
 } catch (error) {
   console.log(error);
  res.send({
    statusCode:500,   
    message:"Internal server error",
    
  })
}
 
});

/*create food*/
router.post('/',async(req, res)=> {
  const client=await MongoClient.connect(dbUrl);
 try {
   const db= await client.db('b28we');
   let food=await db.collection('food').insertOne(req.body);
   res.send({
     statusCode:200,
     data:food,
     message:"Food added successfully"
   })
   
 } catch (error) {
  res.send({
    statusCode:500,   
    message:"Internal server error"
  })
   
 }
 finally{
   client.close();
 }
});

/*update food*/
router.put('/:id',async(req, res)=> {
  const id=req.params.id;
  const client=await MongoClient.connect(dbUrl);
 try {
   const db= await client.db('b28we');
   let food=await db.collection('food').findOneAndReplace({_id:mongodb.ObjectId(id)},req.body);
   res.send({
     statusCode:200,
     data:food,
     message:"Changes saved successfully"
   })
   
 } catch (error) {
   console.log(error);
  res.send({
    statusCode:500,   
    message:"Internal server error",
    
  })
   
 }
 finally{
   client.close();
 }
}); 

/*delete food*/
router.delete('/:id',async(req, res)=> {
  const id=req.params.id;
  const client=await MongoClient.connect(dbUrl);
 try {
   const db=await client.db('b28we');
   let food=await db.collection('food').findOneAndDelete({_id:mongodb.ObjectId(id)});
   res.send({
     statusCode:200,
     data:food,
     message:"Food deleted successfully"
   })
   
 } catch (error) {
   console.log(error);
  res.send({
    statusCode:500,   
    message:"Internal server error",
    
  })
}
 
});


module.exports = router;
