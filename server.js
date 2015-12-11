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
	if (request.url.slice(0, staticFolder.length) == staticFolder) { // Handling Static content
		var contentType = frontendInst.getContentType(request.url);
		var contentBody = frontendInst.getContentBody(request.url, contentType);
		response.writeHeader(200, {"Content-Type": contentType});  
		response.write(contentBody);  
		response.end(); 
	} else {
		if (request.url == '/favicon.ico') { // Favicon workaround, @ToDo
			response.write('');  
			response.end(); 						
		} else if (request.headers.accept.indexOf('application/json') != -1) { // Handling API calls
			if (request.url.indexOf('/api') == 0) {
				var action = request.url.split('/').pop();
				response.writeHeader(200, {"Content-Type": "application/json"});
				var payload = '';
				request.addListener('data', function(chunk){
					payload += chunk;
				});
				/*
				request.addListener('error', function(error){
					next(err);
				});
				*/
				request.addListener('end', function(chunk){
					if (chunk) {
						payload += chunk;
					}

					switch (action) { // Routing...
						case 'getUser':
							var payloadObj = JSON.parse(payload);
							var data = apiInst.getUser(payloadObj.id);
						break;
						case 'updateUser':
							var payloadObj = JSON.parse(payload);
							var data = apiInst.updateUser(payloadObj);
						break;
						case 'addUser':
							var payloadObj = JSON.parse(payload);
							var data = apiInst.addUser(payloadObj);
						break;
						case 'deleteUser':
							var payloadObj = JSON.parse(payload);
							var data = apiInst.deleteUser(payloadObj);
						break;
						case 'getData':
							var data = apiInst.getData();
						break;
						default:
							var data = {'Error' : 'No action defined'};
					}
					response.write(JSON.stringify(data));  
					response.end(); 
				});
			} else {
				response.writeHeader(200, {"Content-Type": "application/json"});
				var data = {'error' : 'error'};
				response.write(JSON.stringify(data));  
				response.end(); 									
			}
		} else { // Handling the standard pages using layout and templates
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
