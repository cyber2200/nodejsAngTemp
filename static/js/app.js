var crudApp = angular.module('crudApp', [
	'ngRoute',
	'ngResource',
	'ngToast',
	'crudControllers',
	'dataServices',
	'crudDirectives',
	'ngAnimate',
]);

crudApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/show', {
		templateUrl: '/static/partials/show.html',
		controller: 'ShowCtrl'
	}).
	when('/add', {
		templateUrl: '/static/partials/add.html',
		controller: 'AddCtrl'
	}).
	when('/edit/:id', {
		templateUrl: '/static/partials/edit.html',
		controller: 'EditCtrl'	
	}).
	otherwise({
		redirectTo: '/show'
	});
}]);

crudApp.config(['ngToastProvider', function(ngToastProvider) {
	ngToastProvider.configure({
		animation: 'slide',
		verticalPosition: 'top',
		horizontalPosition: 'center',
	});
}]);