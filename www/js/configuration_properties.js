//Default values for geolocation
//var lt = "0";
//var ln = "0";
//var posOptions = {timeout: 10000, enableHighAccuracy: false};

//API Keys Oatuh
api_key       = "2WU178P2EDWTHO0ZB64WXQMFC";
api_secret    = "Vb4cBwd010xKSrfo31tavgZRmoAnYFucTjeFKWKl3nk";

//Url Prod
//var url_backend_oauth = "https://api.stormpath.com";


//DEV Ionic only url Desa
//var url_backend = "/backend_desa";
var url_backend_oauth = "/backend_prod";



//DEV Ionic only url Test
//var url_backend = "/backend_test";

//DEV Ionic only url Prod
//var url_backend = "/backend_prod";


////URL SERVICES
var REGISTER                = "/v1/applications/4EYncfTJgPkfPquDYKbBM/accounts";
var AUTH                    = "/v1/applications/4EYncfTJgPkfPquDYKbBM/loginAttempts";
var AUTH_DATA               = "/v1/accounts/";
var AUTH_DATA_CUSTOMDATA    = "/customData";
var IMAGENOTFOUND           = "'img/imagenotfound.gif'";
//var SING_UP               = "/mobile/signup/";
//var LOGIN                   = "/mobile/login.json";
// var REGISTER             = "/mobile/register/";
// var FORGOT               = "/mobile/forgot/";
// var FOOD                 = "/mobile/food/";
// var FOOD_ALL             = "/mobile/food_all/";
// var PATIENTS                = "/mobile/patients.json";
// var HOSPITALS               = "/mobile/clinics.json";
// var FLOORS                  = "/mobile/floors" ;
// var MENUS                   = "/mobile/menus" ;
// var INTAKES                 = "/mobile/intakes.json";
// var DIARY                   = "/mobile/diary";
// var QUESTIONS               = "/mobile/questions.json";
// var FORGOT                  = "/mobile/forgot.json";
// var NEW_PASSWORD            = "/mobile/new_password.json";

var PRECIOS_CLAROS = "https://3619otk88c.execute-api.us-east-1.amazonaws.com/prod/productos?string=' + marca_ + '&array_sucursales=10-1-5,10-3-678,11-3-1090,12-1-125,10-3-658,10-3-595,10-3-726,23-1-6225,10-3-553,10-3-626,12-1-83,10-3-727,12-1-35,10-3-326,10-3-688,10-3-733,10-3-398,12-1-90,10-3-722,10-3-643,23-1-6276,23-1-6219,23-1-6287,10-3-314,10-2-515,11-3-1047,23-1-6228,10-3-649,10-3-673,10-3-625&offset=0&limit=50&sort=-cant_sucursales_disponible";
var API_KEY = "apiKey=CgwK5eyYYM1j5IYMs7tvmP6hPy990Cq3";
var MLAB_SRV = "https://api.mlab.com/api/1/";
var MONGODB_DB = "databases/heroku_jkpwwrbz/";
var PRODUCTS_URL = "collections/products_wh";
var WHEREHOUSES_URL = "collections/warehouses";
var PROFILEUSERS_URL = "/collections/profileusers";



//Mensajes.
var msgLoginErr1        = 'Verify your registration.';
var msgLoginErr2        = 'Confirm your registration with the email that was sent to you.';

var MSG_NEWWHEREHAUSE_SUCCESS = 'El almacen fue creada con exito.';
var MSG_WAREHOUSE_DISCARD = 'El almacen fue eliminado con exito.';

//Colores
//Azul 
PENDIENTE           = "#1fd3f0";
//Verde
COMPRADO            = "#66cb99"; 
//Rojo
DESCARTADO          = "#d30929";