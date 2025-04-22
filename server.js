const express=require('express');
const ejs= require('ejs');
const mongoose= require('mongoose');
const Event=require('./models/event');
require('dotenv').config();

//database setup
mongoose
    .connect(process.env.dburl)
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
/*app.get('/',(req,res)=>{
    res.send('Hello, World');
});*/
app.listen(3000,()=>{
    console.log('App started on 3000');
});
app.set('view engine','ejs');

//Handling form data
app.post('/submit-event',(req,res)=>{
    const event= new Event(req.body);
    event.save()
        .then((result)=>{
            res.redirect('/');
        })
        .catch((err)=>{
            console.log(err);
        });
});


/*app.get('/', (req, res) => {
    Event.find()
      .then((result) => {
        res.render('index', { title: 'All event', events: result })
      })
      .catch((err) => {
        console.error(err); 
    })
  })*/
  app.get('/create-event', (req, res) => {
    res.render('form'); // Render the form.ejs file
});