import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt'

const client = new MongoClient(process.env.MONGO_URI as string)
const db = client.db('dinos-store')
const users= db.collection('users') 


const app = express();


app.use(express.json());
app.use(cors());


//listening on port 3000

app.listen(process.env.PORT, () => {
    console.log('Api is running');
})
//create a get endpoint

app.get ('/', async (req, res ) => {
    const allUsers = await users.find().toArray()
    res.send(allUsers);
    
})
 // create endpoint to add Users

 app.post ('/', async (req, res )=> {
const userEmail = req.body.email
const userPassword = req.body.password

const hashPass = await bcrypt.hash(userPassword, 10)
const userAdded = await users.insertOne ({email: userEmail, password: hashPass})
res.status(201).send(userAdded)


   
 })

 // create delete endpoint by email with params

    app.delete ('/:_id' , async (req, res) => {
      const cleanId = new ObjectId(req.params._id)
      
      
      console.log (req.params)


        const userDeleted = await users.findOneAndDelete({_id:cleanId})
        res.send(userDeleted)
         })


         //create a patch endpoint by email with params

         app.patch ('/:_id', async (req, res) => {
            const cleanId = new ObjectId(req.params._id)
            
            const itemUpdated = await users.findOneAndUpdate({_id:cleanId},{$set:req.body})
            res.send(itemUpdated)

         })
         //8. login endpoint

         app.post('/login', async (req, res) => {
            const foundUser = await users.findOne({email: req.body.email})
            const userPassword = req.body.password
            
            const passInDb = foundUser?.password
          const result = await bcrypt.compare(userPassword, passInDb)
         })