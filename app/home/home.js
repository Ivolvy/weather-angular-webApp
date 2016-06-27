'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])

    .service('cityWeatherService', function($http,$q) {
        function setWeatherFunctions(openWeatherData) {
            this.data = openWeatherData;

            this.getTemp = function() {
                return this.data && this.data.main ? this.data.main.temp : null;
            };
            this.getWindSpeed = function() {
                return this.data && this.data.wind ? this.data.wind.speed : null;
            };
            this.getWeatherDescription = function() {
                return this.data && this.data.weather ? this.data.weather[0].description : null;
            };
            this.getMinTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_min : null;
            };
            this.getMaxTemp = function() {
                return this.data && this.data.main ? this.data.main.temp_max : null;
            };

            this.getIconCode = function() {
                return this.data && this.data.weather && this.data.weather[0] ? this.data.weather[0]['icon'] : null;
            };
            this.getIcon = function() {
                return 'http://openweathermap.org/img/w/' + this.getIconCode() + '.png';
            }
        }

        this.asyncGreet = function(city) {
            var deferred = $q.defer();
            var uri = 'http://api.openweathermap.org/data/2.5/weather' + "?q=" + city + "&units=metric&APPID=20a04174cafbc0d0b153d0edf7631f5c&callback=JSON_CALLBACK";
            $http.jsonp(uri).
                success(function(response, status) {
                    deferred.resolve(new setWeatherFunctions(response));
                }).error(function (error, status) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }
    })
    .directive('cityWeather', ['cityWeatherService', function(cityWeatherService) {
        return {
            scope: {
                cityWeather: '&'
            },
            restrict: 'A',
            template: '<h1>{{city}} <img ng-src="{{weather.getIcon()}}" /></h1>' +
            '<h3>{{weather.getTemp()}}&deg;C</h3>' +
            '<h3>{{weather.getWeatherDescription()}}</h3>' +
            '<h4>Min: {{weather.getMinTemp()}}&deg;C, Max: {{weather.getMaxTemp()}}&deg;C </h4>' +
            '<h4>Wind speed: {{weather.getWindSpeed()}}</h4>',
            link: function (scope, element, attrs) {
                scope.$watch('cityWeather', function() {
                    scope.city = scope.$eval(scope.cityWeather);
                    cityWeatherService.asyncGreet(scope.city).then(function(data) { //get all data for a city
                        console.log(data);
                        scope.weather = data;
                    }, function() {scope.weather = null});
                });
            }
        };

    }])

    .controller('HomeCtrl', function($scope) {
    });