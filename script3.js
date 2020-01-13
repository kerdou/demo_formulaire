// GENERATION DES SELECT / OPTION
// CALCUL
// VERIF
// ENVOI
// REINIT

////////////////////////////////////////   GENERATION DES SELECT / OPTION   ///////////////////////////////////////
///                                                                                                             ///
///                                                                                                             ///

// création des <OPTION> dans les <SELECT> à partir d'un array incluant des objets au chargement de la page
window.addEventListener('load', optionsCreate);

function optionsCreate() {
    var selectThemAll = document.getElementsByTagName('select');

    var optArray = [ 
        {text: 'Demi-journée', value: 8},
        {text: 'Journée', value: 15},
        {text: 'Repas', value: 7}
    ];
    
    // utilisation du contenu de optArray pour les <OPTION> et ajout de toutes les <OPTION> dans chaque <SELECT> du form
    for (var i = 0; i < selectThemAll.length; i++) {
        optArray.forEach( (arrayItem) => {
            var optiontoAdd = document.createElement('option');
            optiontoAdd.text = arrayItem.text;
            optiontoAdd.value = arrayItem.value;
            selectThemAll[i].add(optiontoAdd);
        });
    }
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////   GENERATION DES SELECT / OPTION   ///////////////////////////////////////

////////////////////////////////////////////////////   CALCUL   ///////////////////////////////////////////////////
///                                                                                                             ///
///                                                                                                             ///

// trigger au changement des valeurs des champs de la ligne 1
document.getElementById("resa1_select_Field").addEventListener("input", () => {calculParLigne(1);} );
document.getElementById("resa1_qt_Field").addEventListener("input", () => {calculParLigne(1);} );
document.getElementById("resa1_qt_Field").addEventListener('keydown', keyCheck);

// trigger au changement des valeurs des champs de la ligne 2
document.getElementById("resa2_select_Field").addEventListener("input", () => {calculParLigne(2);} );
document.getElementById("resa2_qt_Field").addEventListener("input", () => {calculParLigne(2);} );
document.getElementById("resa2_qt_Field").addEventListener('keydown', keyCheck);

// trigger au changement des valeurs des champs de la ligne 3
document.getElementById("resa3_select_Field").addEventListener("input", () => {calculParLigne(3);} );
document.getElementById("resa3_qt_Field").addEventListener("input", () => {calculParLigne(3);} );
document.getElementById("resa3_qt_Field").addEventListener('keydown', keyCheck);


// empeche d'entrer autre chose que des chiffres mais permet l'appui de quelques autres touches dans les champs de quantité
function keyCheck(e) {
    if (!(e.key >= 0 && e.key <= 9) && (e.key != "Backspace") && (e.key != "Delete") && (e.key != "ArrowLeft") && (e.key != "ArrowRight") && (e.key != "Tab")){ 
        e.preventDefault();
    } 
}

// fonction de vérification et de calcul du sous-total de la ligne modifiée
function calculParLigne(resaNumber) { 
    var qtValue = document.getElementById("resa" + resaNumber + "_qt_Field").value; // récupération de la quantité

    if (qtValue == 0) { // si la quantité est égale à 0, les champs de quantité et de sous-tot de la ligne se vident
        document.getElementById("resa" + resaNumber +"_qt_Field").value = "";
        document.getElementById("resa" + resaNumber + "_soustot_Field").value = "";
    } else { // si un chiffre a bien été entré alors le calcul du sous-total pour la ligne en cours est déclenché
        var selectValue = document.getElementById("resa" + resaNumber +"_select_Field").value; // 
        var soustotValue = qtValue * selectValue; // 
        document.getElementById("resa" + resaNumber + "_soustot_Field").value = soustotValue + "€"; // affichage du sous-total pour la ligne en cours
    }
    
    calculFinal_fct(); // lancement du calcul HT et TTC
}    

// addition des sous-totaux et calcul de la TVA
function calculFinal_fct() {
    var sousTotHT = 0; 
    for (i= 1; i <= 3; i++) { // addition des 3 sous-totaux
        var checkResa = parseInt(document.getElementById("resa" + i + "_soustot_Field").value); // récup du sous-total de la ligne en cours
        if (isNaN(checkResa)) { 
            checkResa = 0; // si le sous-total en cours n'est pas un chiffre alors lui affecter la valeur 0
        } else {
            sousTotHT += checkResa; // sinon l'ajouter au sous-total
        }        
    }

    document.getElementById("soustotalHT_Field").value = sousTotHT + "€"; // affichage du total sans la TVA

    // si le sous-total HT est égal à 0 alors les champs sous-total HT et Total TTC se vident, sinon leurs valeurs apparaissent
    if (sousTotHT == 0) {
        document.getElementById("soustotalHT_Field").value = ""; // value vide pour le sous-total HT
        document.getElementById("totalTTC_Field").value = ""; // value vide pour le total TTC
    } else {
        document.getElementById("totalTTC_Field").value = (sousTotHT * 1.2).toFixed(2).replace(".", ",") + "€"; // affichage du total avec la TVA
    }
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////////////////   CALCUL   ///////////////////////////////////////////////////

////////////////////////////////////////////////////   VERIF   ////////////////////////////////////////////////////
///                                                                                                             ///
///                                                                                                             ///

// clic sur le bouton "vérifier avant envoi"
document.getElementById("check_button").addEventListener("click", verif);

function verif(formCheck) {  
    var nom = document.getElementById("nom_Field").value; // variable de nom de famille
    var prenom = document.getElementById("prenom_Field").value; // variable de prénom  
    var tel = document.getElementById("tel_Field").value; // variable du numéro de tel 
    var email = document.getElementById("email_Field").value; // variable d'adresse e-mail
    var resa_list = ["resa1_qt_Field", "resa2_qt_Field", "resa3_qt_Field"]; // liste des champs de quantité de produits à vérifier    
    var order = parseInt(document.getElementById("totalTTC_Field").value); // variable ayant le total TTC de la commande
    var checkbox = document.getElementById("checkbox_Field").checked; // récupére l'état de la case des CGV
    var verif_message = ""; // contenu du message d'erreur

    var nomPrenomRegEx = /^([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+([-]([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$/i; //regex de noms et prénoms
    var telRegEx = /^(0|\+33|0033)[1-9]([-. ]?[0-9]{2}){4}$/; // regex des numéros de téléphone
    var mailRegEx = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,6}$/; // regex des adresses mail

    // vérif du nom
    // lancer la fonction de vérification orthographique
    // si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
    // si le test est bon le champ passe en vert
    if (nom.length < 2) {
        verif_message += "Veuillez saisir votre nom de famille" + "\n";
        document.getElementById('nom_Field').classList.remove('validBackground');
        document.getElementById('nom_Field').classList.add('errorBackground');
    } else if (nomPrenomRegEx.test(nom)) { 
        document.getElementById('nom_Field').classList.remove('errorBackground');
        document.getElementById('nom_Field').classList.add('validBackground');
    } else {
        verif_message += "Veuillez ne pas saisir de caractères spéciaux et de nombres dans votre nom de famille" + "\n";
        document.getElementById('nom_Field').classList.remove('validBackground');
        document.getElementById('nom_Field').classList.add('errorBackground');
    }

    // vérif du prenom
    // si le champ n'est pas vide, lancer la fonction de vérification orthographique
    // si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
    // si le test est bon le champ passe en vert
    if (prenom.length == 0) {
        document.getElementById('prenom_Field').classList.remove('validBackground');
        document.getElementById('prenom_Field').classList.remove('errorBackground');
    } else {
        if (nomPrenomRegEx.test(prenom)) {
            document.getElementById('prenom_Field').classList.remove('errorBackground'); 
            document.getElementById('prenom_Field').classList.add('validBackground');
        } else {
            verif_message += "Veuillez saisir votre prénom" + "\n";
            document.getElementById('prenom_Field').classList.remove('validBackground');
            document.getElementById('prenom_Field').classList.add('errorBackground');        
        }
    }

    // vérif du numéro de tel
    // si le numéro n'est pas vide, lancer a vérification du numéro
    // si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
    // si le test est bon le champ passe en vert
    if (tel.length == 0) {
        document.getElementById('tel_Field').classList.remove('validBackground');
        document.getElementById('tel_Field').classList.remove('errorBackground');
    } else {
        if (telRegEx.test(tel)) { 
            document.getElementById('tel_Field').classList.remove('errorBackground');
            document.getElementById('tel_Field').classList.add('validBackground');
        } else {
            verif_message += "Vérifiez votre numéro de téléphone" + "\n";
            document.getElementById('tel_Field').classList.remove('validBackground');
            document.getElementById('tel_Field').classList.add('errorBackground');      
        }
    }
    
    // vérif du mail
    // vérification de la syntaxe de l'adresse
    // si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
    // si le test est bon le champ passe en vert
    if (mailRegEx.test(email))  {
        document.getElementById('email_Field').classList.remove('errorBackground');
        document.getElementById('email_Field').classList.add('validBackground');
    } else {
        verif_message += "Veuillez saisir votre adresse mail sans oublier le @" + "\n";
        document.getElementById('email_Field').classList.remove('validBackground'); 
        document.getElementById('email_Field').classList.add('errorBackground');      
    }

    // vérification du montant de la commande, s'il est nul ou NaN alors un message d'erreur apparait
    if ((order == 0) || isNaN(order) ) {
        verif_message += "Vous n'avez saisi aucune commande" + "\n";
        for (var i = 0; i < resa_list.length; i++) {
            document.getElementById(resa_list[i]).classList.remove('validBackground');
            document.getElementById(resa_list[i]).classList.add('errorBackground');
        }
    } else {
        for (var ii = 0; ii < resa_list.length; ii++) {
            document.getElementById(resa_list[ii]).classList.remove('errorBackground'); 
            document.getElementById(resa_list[ii]).classList.add('validBackground');
        }
    }

    // vérification sur la checkbox de CGV, si elle n'est pas coché un message d'erreur apparait
    if (checkbox) {
        document.getElementById('checkbox_Field').classList.remove('red_border');
        document.getElementById('checkbox_Field').classList.add('green_border');

    } else {
        verif_message += "Veuillez accepter les conditions générales ";
        document.getElementById('checkbox_Field').classList.remove('green_border');
        document.getElementById('checkbox_Field').classList.add('red_border');
    }

    // si le message d'erreur n'est pas vide il apparait, sinon le form est déclaré comme OK
    if (verif_message != "") {
        formCheck = false;
        alert(verif_message);
    } else {
        formCheck = true;
    }
    return formCheck; // renvoi du résultat de formCheck pour envoi()
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////////////////   VERIF   ////////////////////////////////////////////////////

////////////////////////////////////////////////////   PRINT   ////////////////////////////////////////////////////
///                                                                                                             ///
///

document.getElementById("print_button").addEventListener("click", launchPrint);

function launchPrint(){
    var formCheck = verif(formCheck); // vérification de la conformité des champs

    if (formCheck){
        window.print();
    }    
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////////////////   PRINT   ////////////////////////////////////////////////////


////////////////////////////////////////////////////   ENVOI   ////////////////////////////////////////////////////
///                                                                                                             ///
///
                                                                                                             ///
// clic sur le bouton "envoyer ma commande" 
document.getElementById("send_button").addEventListener("click", envoi);

// fonction d'envoi de la commande par mail
function envoi() {

    var recap_order = ""; // message récaputilant chaque ligne de la commande
    var formCheck = verif(formCheck); // vérification de la conformité des champs

    // traduction des valeurs des selects en texte
    function selectTranslate(option) {
        if (option == 8) {
            option = "demi-journée(s)";
        } else if (option == 15) {
            option = "journée(s)";
        } else if (option == 7) {
            option = "repas";
        }
        return option;
    }

    // vérifier qu'une ligne de produits n'est pas vide
    // générer la ligne de texte et l'ajouter au message
    // passer à la ligne suivante
    for (i= 1; i <= 3; i++) { // addition des 3 sous-totaux
        if (document.getElementById("resa" + i + "_qt_Field").value > 0) {
            recap_order += document.getElementById("resa" + i + "_qt_Field").value + " " + selectTranslate(document.getElementById("resa" + i + "_select_Field").value) + " pour un sous-total de " + document.getElementById("resa" + i + "_soustot_Field").value + "€" + "%0A" + "" ;
        }
    }

    // si les champs sont tous conformes alors on génére le mail
    if (formCheck){
        window.open("mailto:votre.adresse@mail.com?subject=Réservation de " + document.getElementById("prenom_Field").value + "%20" + document.getElementById("nom_Field").value +
            "&body=Nom: " + " " + document.getElementById("nom_Field").value + "%0A" +
            "Prénom: " + " " + document.getElementById("prenom_Field").value + "%0A" +
            "Téléphone: " + " " + document.getElementById("tel_Field").value + "%0A" +
            "E-mail: " + " " + document.getElementById("email_Field").value + "%0A" +
            "%0A" +
            "Réservation:" + "%0A" +
            recap_order + 
            "%0A" +
            "Sous-total HT: " + document.getElementById("soustotalHT_Field").value + "%0A" +
            "Total TTC (TVA 20%): " + document.getElementById("totalTTC_Field").value
        );
        reinit(); // reset des CSS des champs et des valeurs du formulaire
    }
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////////////////   ENVOI   ////////////////////////////////////////////////////

////////////////////////////////////////////////////   REINIT   ///////////////////////////////////////////////////
///                                                                                                             ///
///                                                                                                             ///

//reset de tous les champs en cliquant sur "Réinitialiser"
document.getElementById("reinit_button").addEventListener("click", reinit);

// fonction de réinit du forumulaire
function reinit() {
    
    // suppression des classes CSS de validation dans tous les champs du tableau "fields_reset"
    var fields_reset = ["nom_Field", "prenom_Field", "tel_Field", "email_Field", "resa1_qt_Field", "resa2_qt_Field", "resa3_qt_Field", "checkbox_Field"];
    for (i = 0; i < fields_reset.length; i++) {        
        document.getElementById(fields_reset[i]).classList.remove('errorBackground'); 
        document.getElementById(fields_reset[i]).classList.remove('validBackground'); 
        document.getElementById(fields_reset[i]).classList.remove('red_border'); 
        document.getElementById(fields_reset[i]).classList.remove('green_border');          
    }

    // reset du formulaire
    document.getElementById("formulaire").reset();
}

///                                                                                                             ///
///                                                                                                             ///
////////////////////////////////////////////////////   REINIT   ///////////////////////////////////////////////////
