/* -------------------------------------------------------------------------- */
/*                            Sommaire de script.js                           */
/* -------------------------------------------------------------------------- */


// Initialisation - Lignes 11 à 20
// Fonction "Météo du jour" - Lignes 30 à 134
// Fonction "Météo sur 7 jours - Lignes 144 à 234 
// Fonction "Météo sur 3 jours" - Lignes 244 à 313
// Fonction "imageMeteo" pour afficher la météo des 3 et 7 jours - Lignes 324 à 338 
// Fonction "findDate" - Lignes 345 à 369 
// Fonction "DarkMode" - Lignes 377 à 384


/* -------------------------------------------------------------------------- */
/* --------------- Constantes pour indiquer la KEY de mon API --------------- */


const APIKEYowm = "87bccd574235b295d63151006a4ea6be"
const APIKEYoc = "5310f9e996fe4bf681d335f73f082c3c"

/* ------------ Variables pour indiquer l'url des API's utilisées ----------- */

let URLowm = "https://api.openweathermap.org/data/2.5/onecall"
let URLoc = "https://api.opencagedata.com/geocode/v1/json"


/* -------------------------------------------------------------------------- */
/*                             Météo d'aujourd'hui                            */
/* -------------------------------------------------------------------------- */


function findTodayWeather(event){
    // Empêche la page de se rafraîchir
    event.preventDefault();

    // Récupère la valeur de l'input
    let myCity = document.getElementById("city").value;

    //Vide l'input
    document.getElementById("city").value = ""

    // SI il y a un texte dans l'input
    if (myCity) {
        
        // Appel de l'API
        $.get(URLoc, {"q": myCity, "key": APIKEYoc}, function(data) {

            // On a récupéré des données via l'api, du coup on vérifie si elles existent :
            // data["result"] récupère les données des villes qui correspondent au texte
            // Si data["result"][0] est vide alors il n'y a pas de résultat et donc la ville n'existe pas
            // Dans le if on vérifie que ça existe
            if(data && data["results"] &&  data["results"][0]) {

                // On affiche la ville dans l'html et on vide l'input
                document.getElementById("thecity").innerHTML = myCity; //Affiche le nom de la ville dans l'HTML
                document.getElementById("thecity").classList.remove('hide'); //Affiche la ville pour contrer le "else"

                document.getElementById("city").value = "" //Vide l'input

                document.getElementById("meteo-gallery-7days").classList.add('hide'); //Mets la gallery de 7jrs dans le block caché
                document.getElementById("meteo-gallery-3days").classList.add('hide'); // Mets la gallery de 3jrs dans le block caché
                document.getElementById("meteo-today").classList.remove('hide');  // Si oui on retire la class "hide" de la balise "météo today" au cas ou il a été caché juste avant

                document.getElementById("try-again").classList.add('hide'); // Mets la phrase try again dans le block caché

                /* --------------------- Connexion avec la deuxième API --------------------- */
                // on a récupéré la longitute et latitude via le premier appel, le deuxième appel va nous permettre de récupérer la météo
                $.get(URLowm, {
                    "lat": data["results"][0]["geometry"]["lat"],
                    "lon": data["results"][0]["geometry"]["lng"],
                    "appid": APIKEYowm
                }, function(data) {

                    console.log("Retour de l'api", data);

                    // variable qui récupère le DT (date du jour en milliseconds)        
                    let currentDay = data["current"]["dt"];

                    // appel la fonction qui permet de transformer les milliseconds en date du jour
                    let dailyDay = findDate(currentDay);
                    // et injecte le jour dans l'HTML
                    document.getElementById("day").innerHTML = dailyDay;


                    /* -------------------------------------------------------------------------- */
                    /*     Affichage icônes météo en fonction de la météo indiquée dans l'API     */
                    /* -------------------------------------------------------------------------- */


                    // variable qui récupère les données de l'API + injection dans l'HTML avec les images correspondantes
                    let meteo = data["current"]["weather"][0]["main"];
            
                    console.log('Méteo', meteo);

                    if ((meteo == "Clouds") || (meteo == "Fog") || (meteo == "Haze") || (meteo == "Mist")){
                        // Récupérer la balise image avec un id
                        document.getElementById('image-meteo').src = 'icone/cloudy.png'
                        document.getElementById('main-color').classList.add("background-clouds");
                        // Si cloud, les autres classes doivent se supprimer 
                        document.getElementById('main-color').classList.remove("background-rain", "background-extreme", "background-snow", "background-sun");
                    } else if ((meteo == "Rain") || (meteo == "Drizzle")){
                        document.getElementById('image-meteo').src = 'icone/rain.png'
                        document.getElementById('main-color').classList.add("background-rain");
                        document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-snow", "background-sun");

                    } else if ((meteo == "Extreme") || (meteo == "Thunderstorm") || (meteo == "Squall") || (meteo == "Tornado")) {
                        document.getElementById('image-meteo').src = 'icone/clouds.png'
                        document.getElementById('main-color').classList.add("background-extreme");
                        document.getElementById('main-color').classList.remove("background-clouds", "background-rain", "background-snow", "background-sun");

                    } else if (meteo == "Snow"){
                        document.getElementById('image-meteo').src = 'icone/snow.png'
                        document.getElementById('main-color').classList.add("background-snow");
                        document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-rain", "background-sun");

                    } else if (meteo == "Clear"){
                        document.getElementById('image-meteo').src = 'icone/sun.png'
                        document.getElementById('main-color').classList.add("background-sun");
                        document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-snow", "background-rain");

                    } else {
                        document.getElementById("lameteo").innerHTML = "Désolée, nous ne trouvons pas l'image corespondant à la météo, mais voici un petit indice : " + meteo;
                    }
                    
                })
            } else {
                // Si on a pas de donnée dans l'api ni de ville qui existe, on cache tout
                document.getElementById("thecity").classList.add('hide');

                document.getElementById("meteo-gallery-7days").classList.add('hide');
                document.getElementById("meteo-today").classList.add('hide');
                document.getElementById("meteo-gallery-3days").classList.add('hide');

                document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-snow", "background-sun", "background-rain");

                document.getElementById("try-again").classList.remove('hide');
                document.getElementById("try-again").innerHTML = "Visiblement, cette ville n'existe pas, essaye encore! :)";
                
                // document.getElementById("thecity").classList.add('hide');

            }
        })
    }
}


/* -------------------------------------------------------------------------- */
/*                              Météo sur 7 jours                             */
/* -------------------------------------------------------------------------- */


function find7DaysWeather(event) {
    event.preventDefault();

    let myCity = document.getElementById("city").value;

    if (myCity) {

        $.get(URLoc, {"q": myCity, "key": APIKEYoc}, function(data){

            if(data && data["results"] &&  data["results"][0]) {


                document.getElementById("thecity").innerHTML = myCity; 
                document.getElementById("thecity").classList.remove('hide');

                document.getElementById("city").value = "" 

                document.getElementById("meteo-gallery-7days").classList.remove('hide');
                document.getElementById("meteo-gallery-3days").classList.add('hide');
                document.getElementById("meteo-today").classList.add('hide');

                document.getElementById("try-again").classList.add('hide');


                let lat = data["results"][0]["geometry"]["lat"];
                let lng = data["results"][0]["geometry"]["lng"];

                /* --------------------- Connexion avec la deuxième API --------------------- */

                $.get(URLowm, {"lat": lat, "lon": lng, "appid": APIKEYowm}, function(data) {

                    // J-J
                    var dateDt0 = findDate(data['daily'][0]['dt']);
                    var meteoDt0 = data['daily'][0]['weather'][0]['main'];

                    document.getElementById('lameteo0').innerHTML = dateDt0;
                    document.getElementById('image-meteo0').src = imageMeteo(meteoDt0);

                    // J-J+1
                    var dateDt1 = findDate(data['daily'][1]['dt']);
                    var meteoDt1 = data['daily'][1]['weather'][0]['main'];

                    document.getElementById('lameteo1').innerHTML = dateDt1;
                    document.getElementById('image-meteo1').src = imageMeteo(meteoDt1);

                    // J-J+2
                    var dateDt2 = findDate(data['daily'][2]['dt']);
                    var meteoDt2 = data['daily'][2]['weather'][0]['main'];

                    document.getElementById('lameteo2').innerHTML = dateDt2;
                    document.getElementById('image-meteo2').src = imageMeteo(meteoDt2);

                    // J-J+3
                    var dateDt3 = findDate(data['daily'][3]['dt']);
                    var meteoDt3 = data['daily'][3]['weather'][0]['main'];

                    document.getElementById('lameteo3').innerHTML = dateDt3;
                    document.getElementById('image-meteo3').src = imageMeteo(meteoDt3);

                    // J-J+4
                    var dateDt4 = findDate(data['daily'][4]['dt']);
                    var meteoDt4 = data['daily'][4]['weather'][0]['main'];

                    document.getElementById('lameteo4').innerHTML = dateDt4;
                    document.getElementById('image-meteo4').src = imageMeteo(meteoDt4);

                    // J-J+5
                    var dateDt5 = findDate(data['daily'][5]['dt']);
                    var meteoDt5 = data['daily'][5]['weather'][0]['main'];

                    document.getElementById('lameteo5').innerHTML = dateDt5;
                    document.getElementById('image-meteo5').src = imageMeteo(meteoDt5);

                    // J-J+6
                    var dateDt6 = findDate(data['daily'][6]['dt']);
                    var meteoDt6 = data['daily'][6]['weather'][0]['main'];

                    document.getElementById('lameteo6').innerHTML = dateDt6;
                    document.getElementById('image-meteo6').src = imageMeteo(meteoDt6);
                })
            } else {
                document.getElementById("thecity").classList.add('hide');

                document.getElementById("meteo-gallery-7days").classList.add('hide');
                document.getElementById("meteo-today").classList.add('hide');
                document.getElementById("meteo-gallery-3days").classList.add('hide');

                document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-snow", "background-sun", "background-rain");
                
                document.getElementById("try-again").classList.remove('hide');
                document.getElementById("try-again").innerHTML = "Visiblement, cette ville n'existe pas, essaye encore! :)";

                // document.getElementById("thecity").classList.add('hide');


            }
        })
    }
}


/* -------------------------------------------------------------------------- */
/*                              Météo sur 3 jours                             */
/* -------------------------------------------------------------------------- */


function find3DaysWeather(event) {
    // Ne raffraichi pas la page
    event.preventDefault();

    // Récupère la valeur de l'input
    let myCity = document.getElementById("city").value;

    // Si il y a un texte dans l'input
    if (myCity) {

        $.get(URLoc, {"q": myCity, "key": APIKEYoc}, function(data){
            // console.log('data', data);

            if(data && data["results"] &&  data["results"][0]) {

                // On affiche la ville dans l'html et on vide l'input
                document.getElementById("thecity").innerHTML = myCity; 
                document.getElementById("thecity").classList.remove('hide');

                document.getElementById("city").value = "" 

                document.getElementById("meteo-gallery-7days").classList.add('hide');
                document.getElementById("meteo-gallery-3days").classList.remove('hide');
                document.getElementById("meteo-today").classList.add('hide');

                document.getElementById("try-again").classList.add('hide');


                let lat = data["results"][0]["geometry"]["lat"];
                let lng = data["results"][0]["geometry"]["lng"];
                // console.log('lat, lng', lat, lng); // Affiche la lat/lng de la ville indiquée dans l'Input


                $.get(URLowm, {"lat": lat, "lon": lng, "appid": APIKEYowm}, function(data){

                // J-J
                    var dateDt0 = findDate(data['daily'][0]['dt']);
                    var meteoDt0 = data['daily'][0]['weather'][0]['main'];

                    document.getElementById('meteo0D3').innerHTML = dateDt0;
                    document.getElementById('image-meteo0D3').src = imageMeteo(meteoDt0);

                    // J-J+1
                    var dateDt1 = findDate(data['daily'][1]['dt']);
                    var meteoDt1 = data['daily'][1]['weather'][0]['main'];

                    document.getElementById('meteo1D3').innerHTML = dateDt1;
                    document.getElementById('image-meteo1D3').src = imageMeteo(meteoDt1);

                    // J-J+2
                    var dateDt2 = findDate(data['daily'][2]['dt']);
                    var meteoDt2 = data['daily'][2]['weather'][0]['main'];

                    document.getElementById('meteo2D3').innerHTML = dateDt2;
                    document.getElementById('image-meteo2D3').src = imageMeteo(meteoDt2);

                })

            } else {
                document.getElementById("thecity").classList.add('hide');

                document.getElementById("meteo-gallery-7days").classList.add('hide');
                document.getElementById("meteo-today").classList.add('hide');
                document.getElementById("meteo-gallery-3days").classList.add('hide');

                document.getElementById('main-color').classList.remove("background-clouds", "background-extreme", "background-snow", "background-sun", "background-rain");

                document.getElementById("try-again").classList.remove('hide');
                document.getElementById("try-again").innerHTML = "Visiblement, cette ville n'existe pas, essaye encore! :)";
                
                // document.getElementById("thecity").classList.add('hide');


            }
        })
    }
}


/* -------------------------------------------------------------------------- */
/*       Fonction pour afficher les images de la météo sur 3 et 7 jours       */
/* -------------------------------------------------------------------------- */


function imageMeteo(weather) {
    if (weather == "Clouds") {
        return 'icone/cloudy.png';
    } else if (weather == "Rain") { 
        return 'icone/rain.png';
    } else if (weather == "Extreme") {
        return 'icone/clouds.png';
    } else if (weather == "Clear") {
        return 'icone/sun.png';
    } else if (weather == "Snow") {
        return 'icone/snow.png'
    } else {
        return false;
    }
}


/* -------------------------------------------------------------------------- */
/*   Création de la fonction qui transforme la date + créa boucle des jours   */
/* -------------------------------------------------------------------------- */


function findDate(dailyDate) {
    // transform dt en format de date
    const initialDate = new Date(dailyDate * 1000);
    const formatedDate = initialDate.getUTCDay();
    // console.log('getDay', formatedDate);

    if (formatedDate == 0){
        return 'Dimanche';
    } else if (formatedDate == 1) {
        return 'Lundi';
    } else if (formatedDate == 2) {
        return 'Mardi';
    } else if (formatedDate == 3) {
        return 'Mercredi';
    } else if (formatedDate == 4) {
        return 'Jeudi';
    } else if (formatedDate == 5) {
        return 'Vendredi';
    } else if (formatedDate == 6) {
        return 'Samedi';
    } else {
        return "La date n'est pas au bon format !";
    }

}


/* -------------------------------------------------------------------------- */
/*                          Fonction pour le darkMode                         */
/* -------------------------------------------------------------------------- */

function darkMode() {
    const body = document.getElementById('body');
    if (body.classList.contains('nuit')) {
        body.classList.remove('nuit');
    } else {
        body.classList.add('nuit');
    }
}
