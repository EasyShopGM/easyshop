angular.module('starter.services', [])

.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
})

.factory('SrvCall', function($http, $ionicLoading, $ionicPopup, $rootScope) {

    var srv_response = {
    async: function(urlsrv, method_, params_) {

       // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
                      method: method_,
                      url: urlsrv,
                      data: params_,
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

.factory('SrvCallOauth', function($http, $ionicLoading, $ionicPopup, $rootScope, Base64) {
    var base64_secret = 'Basic ' + Base64.encode(api_key + ':' + api_secret);

    var srv_response = {
    async: function(urlsrv, method_, params_) {
        
       // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
                      method: method_,
                      url: urlsrv,
                      data: params_,
                      headers: {'Content-Type' : 'application/json', 'Authorization' : base64_secret}
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



.factory('SrvCallPreciosClaros', function($http, $ionicLoading, $ionicPopup, $rootScope) {

    var srv_response = {
    async: function(urlsrv, method_, params_) {

       // $http returns a promise, which has a then function, which also returns a promise
      var promise = $http({
                      method: method_,
                      url: urlsrv,
                      data: params_,
                      headers: {
                            'Accept' : 'application/json, text/plain, */*',
                            /*'Accept-Encoding' : 'gzip, deflate, sdch, br',*/
                            'Accept-Language' : 'es-ES,es;q=0.8',
                            /*'Connection' : 'keep-alive',*/
                            /*'Host' : '3619otk88c.execute-api.us-east-1.amazonaws.com',*/
                            /*'Origin' :'https://www.preciosclaros.gob.ar',*/
                            /*'Referer': 'https://www.preciosclaros.gob.ar/',*/
                            'x-api-key': 'zIgFou7Gta7g87VFGL9dZ4BEEs19gNYS1SOQZt96'
                      }
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
