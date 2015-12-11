var fs = require('fs');
var api = function (){
	var self = this;
	self.getData = function (){
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		return obj;
	}
	self.getUser = function(userId) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id == userId) {
				return obj[i];
			}
		}
		return {'error' : ''}
	}
	self.updateUser = function(userData) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id == userData.id) {
				obj[i] = userData;
			}
		}
		
		fs.writeFile('./data/db.json', JSON.stringify(obj), function(err) {
			if(err) {
				return console.log(err);
			}
		});
		
		return {'error' : ''}
	}
	self.deleteUser = function(userData) {
		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		var newObj = [];
		for (var i = 0; i < obj.length; i++) {
			if (obj[i].id != userData.id) {
				newObj.push(obj[i]);
			}
		}
		
		fs.writeFile('./data/db.json', JSON.stringify(newObj), function(err) {
			if(err) {
				return console.log(err);
			}
		});
		
		return {'error' : ''}
	}
	self.addUser = function(userData) {
		var jsonIdData = fs.readFileSync('./data/id.json', 'utf8');
		var idObj = JSON.parse(jsonIdData);
		var maxId = idObj.id;
		maxId++;
		idObj.id = maxId;
		fs.writeFile('./data/id.json', JSON.stringify(idObj), function(err) {});
		userData.id = maxId;

		var jsonData = fs.readFileSync('./data/db.json', 'utf8');
		var obj = JSON.parse(jsonData);
		obj.push(userData);
		
		fs.writeFile('./data/db.json', JSON.stringify(obj), function(err) {
			if(err) {
				return console.log(err);
			}
		});

		return {'error' : ''}
	}

};
module.exports = api;
