var http = require('http');
var fs = require('fs');
var frontend = require('./frontend.js');
var frontendInst = new frontend();
var api = require('./api.js');
var apiInst = new api();
function handleRequest(request, response){
	fs.appendFile("/tmp/accessLog", JSON.stringify(request.headers) + '\n\n\n', function(err) {
	
	}); 
	console.log(request.url);
	var staticFolder = '/static';
	if (request.url.slice(0, staticFolder.length) == staticFolder) {
		var contentType = frontendInst.getContentType(request.url);
		var contentBody = frontendInst.getContentBody(request.url, contentType);
		response.writeHeader(200, {"Content-Type": contentType});  
		response.write(contentBody);  
		response.end(); 
	} else {
		if (request.url == '/favicon.ico') {
			response.write('');  
			response.end(); 						
		} else if (request.headers.accept.indexOf('application/json') != -1) {
			if (request.url.indexOf('/api') == 0) {
				var action = request.url.split('/').pop();
				response.writeHeader(200, {"Content-Type": "application/json"});
				switch (action) {
					case 'getData':
						var data = apiInst.getData();
						response.write(JSON.stringify(data));  
						response.end(); 
					break;
					case 'getUser':
						var payload = '';
						request.addListener('data', function(chunk){
							payload += chunk;
						});
	
						request.addListener('error', function(error){
							next(err);
						});

						request.addListener('end', function(chunk){
							if (chunk) {
								payload += chunk;
							}
							payloadObj = JSON.parse(payload);
							var data = apiInst.getUser(payloadObj.id);
							response.write(JSON.stringify(data));  
							response.end(); 
						});
					break;
					case 'updateUser':
						var payload = '';
						request.addListener('data', function(chunk){
							payload += chunk;
						});
	
						request.addListener('error', function(error){
							next(err);
						});

						request.addListener('end', function(chunk){
							if (chunk) {
								payload += chunk;
							}
							payloadObj = JSON.parse(payload);
							var data = apiInst.updateUser(payloadObj);
							response.write(JSON.stringify(data));  
							response.end(); 
						});					
					break;
					case 'addUser':
						var payload = '';
						request.addListener('data', function(chunk){
							payload += chunk;
						});
	
						request.addListener('error', function(error){
							next(err);
						});

						request.addListener('end', function(chunk){
							if (chunk) {
								payload += chunk;
							}
							payloadObj = JSON.parse(payload);
							var data = apiInst.addUser(payloadObj);
							response.write(JSON.stringify(data));  
							response.end(); 
						});					
					break;

					case 'deleteUser':
						var payload = '';
						request.addListener('data', function(chunk){
							payload += chunk;
						});
	
						request.addListener('error', function(error){
							next(err);
						});

						request.addListener('end', function(chunk){
							if (chunk) {
								payload += chunk;
							}
							payloadObj = JSON.parse(payload);
							var data = apiInst.deleteUser(payloadObj);
							response.write(JSON.stringify(data));  
							response.end(); 
						});					
					break;
					default:
						var data = {'Error' : 'No action defined'};
						response.write(JSON.stringify(data));  
						response.end(); 
				}										
			} else {
				response.writeHeader(200, {"Content-Type": "application/json"});
				var data = {'error' : 'error'};
				response.write(JSON.stringify(data));  
				response.end(); 									
			}
		} else {
			var layout = frontendInst.getLayout();
			var template = 'main';
			var content = frontendInst.getContentFromTemplate(template);
			var html = frontendInst.injectContentToLayout(layout, content);
			response.writeHeader(200, {"Content-Type": "text/html"});  
			response.write(html);  
			response.end(); 						
		}
	}

}

var server = http.createServer(handleRequest);

server.listen(8080, function() {
    console.log("Server listening...");
});
