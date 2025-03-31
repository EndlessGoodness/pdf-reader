const express=require('express');
const ejs= require('ejs');
const mongoose= require('mongoose');
const Event=require('./models/event');

//database setup
const dburl='mongodb+srv://faultyline007:V15h3NzORihOFCvc@cluster0.xlcuelf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose
    .connect(dburl)
    .then((result)=>{
        console.log('Connected to MongoDB');
        app.listen(5000,()=>{
            console.log('Server started on 5000');
        });
    })
    .catch((err)=>{
        console.log('Could not connect to MongoDB');
    });

const app= express();
app.get('/',(req,res)=>{
    res.send('Hello, World');
});
app.listen(3000,()=>{
    console.log('Server started on 3000');
});
app.set('view engine','ejs');