angular.module('starter.services', [])

.factory('SrvCall', function($http, $ionicLoading, $ionicPopup, $rootScope) {
    var srv_response = {
    async: function(urlsrv, method_, params_) {
        
       // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
                      method: method_,
                      url: urlsrv,
                      params: params_,
                      headers: {'Accept': 'application/json'}
                    }).success(function(response){
                        //console.log(response.surveys);
                       return response.data;
                    }).error(function(data, status){
                        return status + ': ' + data;
                    });
    // Return the promise to the controller
      return promise;
    }
  };
  return srv_response;
})
