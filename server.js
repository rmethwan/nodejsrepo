var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app = express();
app.use(bp.json());

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


app.post('/postmytask',function(req,res){
	var data = req.body;
	data.id=taskid++;
	mytasks.push(data);
	res.json(data);	
	
});


app.listen(3000,function(){	
	console.log('app is running on port 3000');	
});