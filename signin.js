(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'angular'
        ], factory);
    } else {
        factory();
    }
}(function () {
    'use strict';

    angular.module('squeezeday.signin', [])
		
		.factory('UserService', ['$http', function($http) {
			var user = null;
			return {
					isLoggedIn: function() { 
						return user != undefined && user != null; 
					},
					getUser: function() { 
						return user;
					},
					login: function(username, password, next) {
						var data = {username: username, password: password};
						$http({url: '/api/login', method: 'POST', data: data})
							.success(function(ret){ 
									user = ret; next(ret);
							})
							.error(function(ret){ next(null,ret); });
					},
					logout: function(next) {
						$http({url: '/api/logout', method: 'GET'})
							.success(function(ret){ user = null; next(); })
							.error(function(ret){next(ret);});
					},
					status: function() {
						$http({url: '/api/status', method: 'GET'})
							.success(function(ret){user = ret;})
							.error(function(ret) { user = null; });
					}
			};
		}])

		.controller('SignInController', [
			'$scope', 'UserService',
			function ($scope, UserService) {
				$scope.message = null;
				$scope.signin = function() {
					UserService.login($scope.username, $scope.password, function(ret,err) {
						$scope.message = err;
						if (!err) {
							$('#sign-in').modal('hide');
						}
					});
				};
				$scope.isClean = function() {
					return $scope.username == null || $scope.password == null;
				};
		}])
		
		.controller('UserStatusController', [
			'$scope', 'UserService',
			function ($scope, UserService) {
				$scope.user = null;
				$scope.isLoggedIn = false;
				$scope.$watch(UserService.isLoggedIn, function(isLoggedIn) {
					$scope.isLoggedIn = isLoggedIn;
					$scope.user = UserService.getUser();
				});
				$scope.logout = function() {
					UserService.logout(function(err) {
					});
				};
				UserService.status();
		}])
	}
));