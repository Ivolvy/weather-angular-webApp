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
    .directive('cityWeather', function(cityWeatherService, $compile) {
        return {
            restrict: 'AEC',
            link: function ($scope, element, attrs) {
                $scope.addCity = function() {
                    if($scope.newCity != ""){
                        $scope.city = $scope.newCity.replace(/ /g,""); //we delete all the whitespaces

                        cityWeatherService.asyncGreet($scope.city).then(function(data) { //get all data for a city
                            angular.element(document.getElementById('container')).append($compile("" +
                                '<div id="'+$scope.city+'" class="city-name" ng-model="'+$scope.city+'">' +
                                '<h1 class="title"></h1>' +
                                '<h3 class="tempW" ng-model="tempW">&deg;C</h3>' +
                                '<h3 class="wDescription"></h3>' +
                                '<h4 class="minAndMax"></h4>' +
                                '<h4 class="windSpeed"></h4>' +
                                '</div>')($scope));

                            angular.element(document.getElementById($scope.city).getElementsByClassName('title')).html($scope.city +'<img src="'+data.getIcon()+'"/>');
                            angular.element(document.getElementById($scope.city).getElementsByClassName('tempW')).html(data.getTemp()+'&deg;C');
                            angular.element(document.getElementById($scope.city).getElementsByClassName('wDescription')).html(data.getWeatherDescription());
                            angular.element(document.getElementById($scope.city).getElementsByClassName('minAndMax')).html('Min: '+data.getMinTemp()+'&deg;C, Max: '+data.getMaxTemp()+'&deg;C ');
                            angular.element(document.getElementById($scope.city).getElementsByClassName('windSpeed')).html('Wind speed: '+data.getWindSpeed());

                        }, function() {alert('please insert a correct city')});
                    }
                };
            }
        };

    })

    .controller('HomeCtrl', function($scope, cityWeatherService) {
    });
