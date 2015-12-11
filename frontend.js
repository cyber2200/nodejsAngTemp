var fs = require('fs');
var frontend = function (){
	var self = this;
	self.getLayout = function (){
		var layoutHtml = fs.readFileSync('./templates/layout.html', 'utf8');
		return layoutHtml;
	}
	self.injectContentToLayout = function(layout, content) {
		return layout.replace('###CONTENT_PLACEHOLDER###', content);
	}
	self.getStaticFile = function(staticPath) {
		try {
			var content = fs.readFileSync('./static' + staticPath, 'utf8');
			return content;
		} catch (e) {
			return '';
		}
	}
	self.getContentType = function(staticPath) {
		var contentMap = [
			{'ext' : 'png', 'type' : 'image/png'},
			{'ext' : 'js' , 'type' : 'text/javascript'},
			{'ext' : 'css' , 'type' : 'text/css'},
		];
		var ext = staticPath.split('.').pop().toLowerCase();
		var contentType = 'text/html';
		for (var i = 0; i < contentMap.length; i++) {
			if (ext == contentMap[i].ext) {
				contentType = contentMap[i].type;
				break;
			}
		}
		return contentType;
	}
	self.getContentBody = function(staticPath, contentType) {
		try {
			var content = fs.readFileSync('.' + staticPath);	
			content.toString('ascii', 0, content.length)
			return content;
		} catch (e) {
			return '';
		}
	}
	self.getContentFromTemplate = function(template) {
		try {
			var content = fs.readFileSync('./templates/' + template + '.html', 'utf8');
			return content;
		} catch (e) {
			return '';
		}
	}
};
module.exports = frontend;