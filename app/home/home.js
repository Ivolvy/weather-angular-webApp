'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .directive('cityWeather', function(cityWeatherService, $compile) {
        return {
            restrict: 'AEC',
            controller: function(){
                this.loadTemplate = function($scope, city){
                    angular.element(document.getElementById('widget-container')).append($compile("" +
                        '<div id="'+city+'" class="city-name" ng-model="'+city+'">' +
                        '<h1 class="title">'+$scope.weather[city].city+'<i class="weather-icon wi wi-owm-'+$scope.weather[city].weatherId+'"></i></h1>' +
                        '<h3 class="tempW">'+$scope.weather[city].temp+'&deg;C</h3>' +
                        '<h3 class="wDescription">'+$scope.weather[city].weatherDescription+'</h3>' +
                        '<h4 class="minAndMax">Min: '+$scope.weather[city].minTemp+'&deg;C, Max: '+$scope.weather[city].maxTemp+'&deg;C</h4>' +
                        '<h4 class="windSpeed">Wind speed: '+$scope.weather[city].windSpeed+'</h4>' +
                        '</div>')($scope));
                };

            },
            link: function ($scope, element, attrs, cityWeatherController) {

                //we retrieve all the city selected if they exists
                if(Object.keys($scope.weather).length > 0){
                    $('.help-text').hide();
                    for(var city in $scope.weather){
                        //If we have already all the data
                        if($scope.weather[city].dataFilled == true){
                            cityWeatherController.loadTemplate($scope, city);
                        }
                    }
                }
                else{
                    $('.help-text').show();
                }
            }
        };

    })

    .controller('HomeCtrl', function($scope) {
    });
