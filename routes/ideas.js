const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//Add idea form
router.get('/add',ensureAuthenticated, (req,res)=>{
    res.render('ideas/add');
});

//process form

router.post('/',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text : 'Please add Title'})
    }
    if(!req.body.details){
        errors.push({text : 'Please add some details'})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors : errors,
            title : req.body.title,
            details : req.body.details
        })
    }else{
        const newUser = {
            title : req.body.title,
            details : req.body.details,
            user : req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea =>{
                req.flash('success_msg','Video Idea Added');
                res.redirect('/ideas');
            })

    }
});

router.get('/',ensureAuthenticated, (req,res)=>{
    Idea.find({user:req.user.id})
        .sort({data : 'desc'})
        .then(ideas =>{
            res.render('ideas/index',{
                ideas : ideas
            });
        })
})

router.get('/edit/:id', ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea =>{
        if(idea.user != req.user.id){
            req.flash('error_msg','Not Authorised');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit',{
                idea : idea
            });
        }

    })
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id : req.params.id
    }).then(idea =>{
        // new Values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea =>{
                req.flash('success_msg','Video Idea Updated');
                res.redirect('/ideas');
            })
    })
});

router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.deleteOne({
        _id : req.params.id
    }).then(()=>{
        req.flash('success_msg','Video Idea removed');
        res.redirect('/ideas');
    })
});


module.exports = router;