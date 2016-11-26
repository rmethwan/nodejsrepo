var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bp.json());
var db;

MongoClient.connect('mongodb://admin:admin@ds111178.mlab.com:11178/rakdb', (error,database) => {
		if(error) return console.log(error)
			db=database;
})


app.use(express.static('public'));

var mytasks = [];
var taskid = 1;

app.get('/getmytask',function (req,res){
	res.json(mytasks);
});

app.get('/getmytask/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	
	var matchedToDo=_.findWhere(mytasks,{id:todoId});	
	
	if(matchedToDo){
		res.json(matchedToDo);
	}else{
		res.status(404).send();
	}
});

app.delete('/deletedata/:id',function(req,res){
	var todoId = parseInt(req.params.id,10);
	
	var matchedToDo=_.findWhere(mytasks,{id:todoId});	
	
	if(!matchedToDo){
		res.status(404).json({"error":"ID not found"});
	}else{
		mytasks=_.without(mytasks,matchedToDo);
		res.json(matchedToDo);
	}
	
});

app.delete('/deletedata', (req,res) => {
	db.collection('userdb').findOneAndDelete({description:req.body.description}, (error,
	result) => {
		if(error) return res.send(500, error);
		res.send('record deleted');
	})
});


app.put('/updatedata',(req,res) => {
	db.collection('userdb').findOneAndUpdate({description:req.body.description},{
		$set:{
			description:req.body.description,
			completed:req.body.completed
		}
	}, {
		sort:{_id:-1},
		upset:true
	}, (error, result) => {
		if(error) return res.send(error);
		res.send(result);
	})
	
});

app.put('/updatedata',(req,res) => {
	db.collection('userdb').save(req.body, (error,result) => {
		if(error) return console.log(error)
			console.log('saved to database');
	})	
	res.json(req.body);
	
});


app.listen(3000,function(){	
	console.log('app is running on port 3000');	
});