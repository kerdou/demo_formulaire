// GENERATION DES SELECT / OPTION
// CALCUL
// VERIF
// ENVOI
// RESET


var nbrOfResaLines = 0; // compteur du nombre d'élements dans 'resa_section'

window.addEventListener('load', formInit); // création des <OPTION> dans les <SELECT> à partir d'un array incluant des objets au chargement de la page

document.getElementById("check_button").addEventListener("click", formChecks); // clic sur "Vérifier avant envoi" pour vérifier les champs
document.getElementById("print_button").addEventListener("click", launchPrint); // clic sur "Imprimer" pour lancer la fenetre d'impression
document.getElementById("reinit_button").addEventListener("click", reinit); // clic sur "Réinitialiser" faire un reset de tous les champs
document.getElementById("send_button").addEventListener("click", envoi); // clic sur le bouton "Envoyer" pour lancer la vérification des champs et la création du mail si tout est bon

document.getElementById("tel_Field").addEventListener("keydown", telKeyCheck) // bloquant tous les caractéres sauf les chiffres et quelques touches utiles dans le champ de téléphone

// relance la vérification des champs à chaque fois que l'un d'eux perd le focus
document.getElementById("nom_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("prenom_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("tel_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("email_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("resa1_qt_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("resa2_qt_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("resa3_qt_Field").addEventListener("focusout", focusOutRecheck);
document.getElementById("checkbox_Field").addEventListener("focusout", focusOutRecheck);


/** Ajout d'éventListeners sur les lignes de reservation */
function resaLinesAddEventListener() {
    for (line = 1; line <= nbrOfResaLines; line++) {
        document.getElementById("resa" + line + "_select_Field").addEventListener("change", calculationAndDisplayProcess); // calcul des résa dés qu'il y a un changement d'option dans un SELECT
        document.getElementById("resa" + line + "_qt_Field").addEventListener("input", calculationAndDisplayProcess); // calcul des résa dés qu'il y a un appui de touche dans un champ de quantité
        document.getElementById("resa" + line + "_qt_Field").addEventListener('keydown', qtyKeyCheck); // bloquant tous les caractéres sauf les chiffres et quelques touches utiles dans les champs de quantité
    }
}


/** Se lance dés la fin du chargement de la page */
function formInit() {
    resaLinesCounter(); // Compte le nombre de lignes de résa
    selectOptionsBuilder(); // Ajout des options dans les selects des lignes de résa
    resaLinesAddEventListener(); // Ajoutes des eventListeners sur les lignes de reservation
}


/** Compte le nombre de lignes de résa */
function resaLinesCounter() {
    nbrOfResaLines = document.getElementById('resa_section').childElementCount;
}


/** Ajout des options dans les selects des lignes de résa */
function selectOptionsBuilder() {
    var selectElements = Array.from(document.getElementsByTagName('select'));

    var selectionOptionsArray = [
        {text: 'Demi-journée', value: 8},
        {text: 'Journée', value: 15},
        {text: 'Repas', value: 7}
    ];

    // utilisation du contenu de selectionOptionsArray pour les <OPTION> et ajout de toutes les <OPTION> dans chaque <SELECT> du form
    selectElements.forEach(
        function (ElementValue, ElementIndex) {
            selectionOptionsArray.forEach(
                function (optionValue) {
                    var newOption = document.createElement('option'); // Création de l'élément OPTION
                    newOption.text = optionValue.text; // ajout du texte de l'élément
                    newOption.value = optionValue.value; // ajout de la valeur de l'élément
                    selectElements[ElementIndex].add(newOption); // insertion de l'OPTION dans le SELECT
                }
            );
        }
    );
}


/** Empeche d'entrer autre chose que des chiffres mais permet l'appui de quelques autres touches dans le champ du téléphone quantité
 * @param {event} event
 */
 function telKeyCheck(event) {
    if (!(event.key >= 0 && event.key <= 9) &&
        (event.key != "+") &&
         (event.code != "NumpadAdd") &&
          (event.key != ".") &&
           (event.code != "NumpadDecimal") &&
            (event.code != "Backspace") &&
             (event.code != "Delete") &&
              (event.code != "ArrowLeft") &&
               (event.code != "ArrowRight") &&
                (event.code != "Tab")){
        event.preventDefault();
    } else if (event.code == 'Space') {
        event.preventDefault();
    }
}


/** Empeche d'entrer autre chose que des chiffres mais permet l'appui de quelques autres touches dans les champs de quantité
 * @param {event} event
 */
function qtyKeyCheck(event) {
    if (!(event.key >= 0 && event.key <= 9) &&
        (event.code != "Backspace") &&
         (event.code != "Delete") &&
          (event.code != "ArrowLeft") &&
           (event.code != "ArrowRight") &&
            (event.code != "Tab")){
        event.preventDefault();
    } else if (event.code == 'Space') {
        event.preventDefault();
    }
}


/** Lancement des calculs dés qu'une option de SELECT est changée ou qu'une quantité est changée
 * * Au change d'un SELECT ou à l'input d'une champ de quantité on récupére les infos de l'élément impacté
 * * Puis on envoie ces infos pour déclencher le calcul et l'affichage des résultats sur chaque ligne de résa
 * * Puis on prend le sous-total de chaque ligne de résa pour les combiner et les afficher avec finalCalculationAndDisplay()
 */
function calculationAndDisplayProcess() {
    let event = this;
    resaLineCalculationAndDisplay(event);
    finalCalculationAndDisplay();
}


/** Fonction de vérification et de calcul du sous-total de la ligne modifiée
 * @param {event} event
 */
function resaLineCalculationAndDisplay(event) {
    var resaNumber = event.id.slice(4, 5); // récupération du numéro de la ligne concernée à partir de son ID
    var qtValue = document.getElementById("resa" + resaNumber + "_qt_Field").value; // récupération de la quantité

    if (qtValue == 0) { // si la quantité est égale à 0, les champs de quantité et de sous-tot de la ligne se vident
        document.getElementById("resa" + resaNumber +"_qt_Field").value = "";
        document.getElementById("resa" + resaNumber + "_soustot_Field").value = "";
    } else { // si un chiffre a bien été entré alors le calcul du sous-total pour la ligne en cours est déclenché
        var selectValue = document.getElementById("resa" + resaNumber +"_select_Field").value; //
        var soustotValue = qtValue * selectValue; //
        document.getElementById("resa" + resaNumber + "_soustot_Field").value = soustotValue + "€"; // affichage du sous-total pour la ligne en cours
    }
}


/** Addition des sous-totaux et calcul de la TVA */
function finalCalculationAndDisplay() {
    var sousTotHT = 0;
    for (line = 1; line <= nbrOfResaLines; line++) { // addition des 3 sous-totaux
        var checkResa = parseInt(document.getElementById("resa" + line + "_soustot_Field").value); // récup du sous-total de la ligne en cours
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




/** Série de vérifications des champs du formulaire
 * @param {string} target True pour afficher un message indiquant les changements à faire
 * @returns {boolean} Renvoie du statut de vérification du formulaire
 */
function formChecks(target = 'all') {
    let verifMessage = ""; // contenu du message d'erreur


    // REGEX NOM ET PRENOM
    /** ^                                                                       Doit être placé au début de la phrase
     *   (                                                                )+    Doit contenir au moins 1 des éléments de la lite à suivre
     *    [a-zàáâäçèéêëìíîïñòóôöùúûü]+(                                 )*      Doit contenir au moins 1 des éléments de la liste et doit être suivi de 0 ou plusieurs éléments de la liste suivante
     *                                 ( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+        Doit être suivi d'un espace ou d'un ' puis suivi d'au moins 1 des éléments de la liste */
    let nomPrenomBeginning = "^([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+";


    /**                                                                         $   Doit être placé à la fin de la phrase
     * (                                                                      )*    Peut apparaitre 0 ou plusieurs fois
     *  [-](                                                                 )+     Doit commencer par un - et être suivi d'au moins 1 élément de la liste à suivre
     *      [a-zàáâäçèéêëìíîïñòóôöùúûü]+(                                  )*       Doit contenir au moins 1 des éléments de la liste et doit être suivi de 0 ou plusieurs éléments de la liste suivante
     *                                   ( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+          Doit être suivi d'un espace ou d'un ' puis suivi d'au moins 1 des éléments de la liste */
    let nomPrenomEnding = "([-]([a-zàáâäçèéêëìíîïñòóôöùúûü]+(( |')[a-zàáâäçèéêëìíîïñòóôöùúûü]+)*)+)*$";

    let nomPrenomConcat = nomPrenomBeginning + nomPrenomEnding; // Etape nécessaire avant de transformer la string en expression régulière.
    let nomPrenomModifier = "i"; // insensible à la casse
    let nomPrenomRegex = new RegExp(nomPrenomConcat, nomPrenomModifier); // création du regex



    // REGEX TEL
    /** ^                               Doit être placé au début du numéro de tel
     *   (0|\\+33|0033)[1-9]    Doit comment par 0 ou +33 ou 0033 et être suivi d'un chiffre allant de 1 à 9. On double les \ pour que la conversion en Regex se passe bien. */
    let telBeginning = "^(0|\\+33|0033)[1-9]";

    /** ([-. ]?[0-9]{2}){4}$
     *                      $   Doit être placé à la fin de la phrase
     *                  {4}     Doit être fait 4 fois
     *  ([-. ]?[0-9]{2})        Doit commencer par - ou . ou un espace et être suivi de 2 chiffres allant chacun de 0 à 9 */
    let telEnd = "([-. ]?[0-9]{2}){4}$";

    let telConcat = (telBeginning + telEnd); // Remplace par \ par des \\. Etape nécessaire avant de transformer la string en expression régulière.
    let telRegex = new RegExp(telConcat); // création du regex



    // REGEX MAIL
    /** ^               Doit être placé au début de l'adresse mail
     *   [a-z0-9._-]+   Doit contenir au moins 1 des caractères de la liste  */
    let mailBeginning = "^[a-z0-9._-]+";

    /** @               Doit être placé après l'arobase
     *   [a-z0-9._-]+   Doit contenir au moins 1 des caractères de la liste */
    let mailMiddle = "@[a-z0-9._-]+";

    /** \\.         $   Doit être placé entre un . et la fin de l'adresse.  On double les \ pour que la conversion en Regex se passe bien.
     *     [a-z]{2,6}   Doit contenir entre 2 et 6 lettres présents dans la liste */
    let mailEnding = "\\.[a-z]{2,6}$";

    let mailConcat = mailBeginning + mailMiddle + mailEnding;
    let mailRegex = new RegExp(mailConcat); // création du regex

    // lancement des regex et des checks suivant le cas de figure demandé
    switch (target) {
        case 'all':
            verifMessage += lastNameCheck(nomPrenomRegex);
            verifMessage += firstNameCheck(nomPrenomRegex);
            verifMessage += telCheck(telRegex);
            verifMessage += mailCheck(mailRegex);
            verifMessage += orderCheck();
            verifMessage += checkboxCheck();
            break;
        case 'nom_Field':
            verifMessage += lastNameCheck(nomPrenomRegex);
            break;
        case 'prenom_Field':
            verifMessage += firstNameCheck(nomPrenomRegex);
            break;
        case 'tel_Field':
            verifMessage += telCheck(telRegex);
            break;
        case 'email_Field':
            verifMessage += mailCheck(mailRegex);
            break;
        case 'resa1_qt_Field':
        case 'resa2_qt_Field':
        case 'resa3_qt_Field':
            verifMessage += orderCheck();
            break;
        case 'checkbox_Field':
            verifMessage += checkboxCheck();
        break;
        default:
            verifMessage += lastNameCheck(nomPrenomRegex);
            verifMessage += firstNameCheck(nomPrenomRegex);
            verifMessage += telCheck(telRegex);
            verifMessage += mailCheck(mailRegex);
            verifMessage += orderCheck();
            verifMessage += checkboxCheck();
    }



    // si le message d'erreur n'est pas vide il apparait, sinon le form est déclaré comme OK
    if (verifMessage == '') {
        formCheckStatus = true;
    } else {
        formCheckStatus = false;
        if (target == 'all') {
            alert(verifMessage); // affichage les changements à faire, ne doit pas s'appliquer pour les focusout des champs
        }
    }
    return formCheckStatus; // renvoi du résultat de formCheck pour envoi()
}


/** Vérification du nom de famille:
 * * Lancement du regex 'nomPrenomRegEx'
 * * Si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
 * * Si le test est bon le champ passe en vert
 * @param {string} nomPrenomRegEx Liste des caractères du regex
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function lastNameCheck(nomPrenomRegex) {
    let nom = document.getElementById("nom_Field").value; // variable de nom de famille
    nom = nom.trim();
    let verifMessage = '';

    if (nom.length < 2) {
        verifMessage += "Veuillez saisir votre nom de famille" + "\n";
        document.getElementById('nom_Field').classList.add('errorBackground');
    } else if (nomPrenomRegex.test(nom)) {
        document.getElementById('nom_Field').classList.remove('errorBackground');
     } else {
        verifMessage = "Veuillez ne pas saisir de caractères spéciaux et de nombres dans votre nom de famille" + "\n";
        document.getElementById('nom_Field').classList.add('errorBackground');
    }
    return verifMessage;
}


/** Vérification du prénom:
 * * Si le champ n'est pas vide, lancer la fonction de vérification orthographique
 * * Si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
 * * Si le test est bon le champ passe en vert
 * @param {string} nomPrenomRegEx Liste des caractères du regex
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function firstNameCheck(nomPrenomRegex) {
    let prenom = document.getElementById("prenom_Field").value; // variable de prénom
    prenom = prenom.trim();
    let verifMessage = '';

    if (prenom.length == 0) {
        document.getElementById('prenom_Field').classList.remove('errorBackground');
    } else {
        if (nomPrenomRegex.test(prenom)) {
            document.getElementById('prenom_Field').classList.remove('errorBackground');
        } else {
            verifMessage = "Veuillez saisir votre prénom" + "\n";
            document.getElementById('prenom_Field').classList.add('errorBackground');
        }
    }
    return verifMessage;
}


/** Vérification du numéro de téléphone:
 * * Si le numéro n'est pas vide, lancer a vérification du numéro
 * * Si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
 * * Si le test est bon le champ passe en vert
 * @param {string} telRegEx Liste des caractères du regex
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function telCheck(telRegex) {
    let tel = document.getElementById("tel_Field").value; // variable du numéro de tel
    tel = tel.trim();
    let verifMessage = '';

    if (tel.length == 0) {
        document.getElementById('tel_Field').classList.remove('errorBackground');
    } else {
        if (telRegex.test(tel)) {
            document.getElementById('tel_Field').classList.remove('errorBackground');
        } else {
            verifMessage = "Vérifiez votre numéro de téléphone" + "\n";
            document.getElementById('tel_Field').classList.add('errorBackground');
        }
    }
    return verifMessage;
}


/** Vérification du mail:
 * * Vérification de la syntaxe de l'adresse
 * * Si le test n'est pas bon, ajout du message d'erreur et le champ passe en rouge
 * * Si le test est bon le champ passe en vert
 * @param {string} mailRegEx Liste des caractères du regex
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function mailCheck(mailRegex) {
    let email = document.getElementById("email_Field").value; // variable d'adresse e-mail
    email = email.trim();
    let verifMessage = '';

    if (mailRegex.test(email))  {
        document.getElementById('email_Field').classList.remove('errorBackground');
    } else {
        verifMessage = "Veuillez saisir votre adresse mail sans oublier le @" + "\n";
        document.getElementById('email_Field').classList.add('errorBackground');
    }
    return verifMessage;
}


/** Vérification du montant de la commande:
 * * Si le montant est nul ou NaN, un message d'erreur apparait
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function orderCheck() {
    let order = parseInt(document.getElementById("totalTTC_Field").value); // variable ayant le total TTC de la commande
    let resa_list = ["resa1_qt_Field", "resa2_qt_Field", "resa3_qt_Field"]; // liste des champs de quantité de produits à vérifier
    let verifMessage = '';

    if ((order == 0) || isNaN(order) ) {
        verifMessage = "Vous n'avez saisi aucune commande" + "\n";
        for (let index = 0; index < resa_list.length; index++) {
            document.getElementById(resa_list[index]).classList.add('errorBackground');
        }
    } else {
        for (let index = 0; index < resa_list.length; index++) {
            document.getElementById(resa_list[index]).classList.remove('errorBackground');
        }
    }
    return verifMessage;
}


/** Vérification sur la checkbox des CGV:
 * * Si elle n'est pas coché un message d'erreur apparait
 * @returns {string} Renvoie un message d'erreur si nécessaire
 */
function checkboxCheck() {
    let checkbox = document.getElementById("checkbox_Field").checked; // récupére l'état de la case des CGV
    let verifMessage = '';

    if (checkbox) {
        document.getElementById('checkbox_Field').classList.remove('red_border');
    } else {
        verifMessage = "Veuillez accepter les conditions générales ";
        document.getElementById('checkbox_Field').classList.add('red_border');
    }
    return verifMessage;
}

/** Relance la vérification des champs quand l'un d'eux perd le focus et qu'il n'est pas vide */
function focusOutRecheck() {
    let event = this;

    if (event.value.length != 0) {
        let target = event.id;
        formChecks(target);
    }
}


/** Lancement de l'impression du formulaire */
function launchPrint() {
    let  formCheckReturn = formChecks(); // vérification de la conformité des champs

    if (formCheckReturn) {
        window.print();
    }
}




/** Fonction d'envoi de la commande par mail */
function envoi() {

    let headerRecap = '';
    let bodyRecap = ''; // message récapitulant chaque ligne de la commande
    let fullRecap = '';
    let formCheckReturn = formChecks(); // vérification de la conformité des champs

    // si le check du formulaire est ok on créer le contenu du mail avant de faire ouvrir le client le messagerie et submit le formulaire
    if (formCheckReturn) {
        let prenom = document.getElementById("prenom_Field").value;
        let nom = document.getElementById("nom_Field"). value;
        let tel = document.getElementById("tel_Field").value;
        let mail = document.getElementById("email_Field").value;

        let sousTot = document.getElementById("soustotalHT_Field").value;
        let totTTC = document.getElementById("totalTTC_Field").value;


        headerRecap = headerBuilder(nom, prenom);
        let recapBodyBeginning = bodyBeginningBuilder(nom, prenom, tel, mail);
        let resaLines = resaBuildUp();
        let recapBodyEnding = recapBodyEndingBuilder(sousTot, totTTC);

        bodyRecap = recapBodyBeginning + resaLines + ' ' + recapBodyEnding;
        fullRecap = headerRecap + bodyRecap;
        window.open(fullRecap); // ouverture du client de mail pour expédier le mail
        document.getElementById("formulaire").submit(); // reset du formulaire
    }
}

/** Génération du header du mailTo
 * @param {string} nom      Le nom du client
 * @param {string} prenom   Le prénom du client
 * @returns {string}    En-tête du mail
 */
function headerBuilder(nom, prenom) {
    let headerBuilder = 'mailto:address@domain.com?';

    if (prenom.length == 0) {
        headerBuilder += 'subject=Réservation de ' + nom.toUpperCase();
    } else {
        headerBuilder += 'subject=Réservation de ' + prenom + ' ' + nom.toUpperCase();
    }

    headerBuilder += '&body=';

    return headerBuilder;
}



/** Construction du début du contenu du mailTo
 * @param {string} nom      Contient le nom du client
 * @param {string} prenom   Le prénom du client
 * @param {string} tel      Son numéro de téléphone
 * @param {string} mail     Son adresse mail
 * @returns {string} String contenant le début du message
 */
function bodyBeginningBuilder(nom, prenom, tel, mail) {
    let recapBeginning = '';

    recapBeginning += 'Nom: ' + nom.toUpperCase() + '%0A';

    if (prenom.length != 0) {
        recapBeginning += 'Prénom: ' + prenom + '%0A';
    }

    if (tel.length != 0) {
        recapBeginning += 'Téléphone: ' + tel + '%0A';
    }

    recapBeginning += 'E-mail: ' + mail + '%0A %0A';
    recapBeginning += 'Réservation:' + '%0A';

    return recapBeginning;
}


/** Génération des lignes de texte pour chaque résa
 * * Vérifier que chaque ligne de résa n'est pas vide
 * * Générer la ligne de texte et l'ajouter au message
 * * Passer à la ligne suivante
 * @returns {string} Texte généré pour toutes les résa
 */
function resaBuildUp() {
    let resaLine = '';

    for (line = 1; line <= nbrOfResaLines; line++) { // addition des 3 sous-totaux
        if (document.getElementById("resa" + line + "_qt_Field").value > 0) {
            resaLine +=
                document.getElementById("resa" + line + "_qt_Field").value + " " +
                selecOptionTranslate(document.getElementById("resa" + line + "_select_Field").value) +
                " pour un sous-total de " + document.getElementById("resa" + line + "_soustot_Field").value + '%0A';
        }
    }

    return resaLine;
}



/** Construction de la fin du contenu du mailTo
 * @param {string} sousTot  Le sous-total
 * @param {string} totTTC   Le total TTC
 * @returns {string} String contenant la fin du message
 */
function recapBodyEndingBuilder(sousTot, totTTC) {
    let recapEnding = '';

    recapEnding += '%0A';
    recapEnding += 'Sous-total HT: ' + sousTot + '%0A';
    recapEnding += 'Total TTC (TVA 20%): ' + totTTC;

    return recapEnding;
}



/** Traduction des valeurs des SELECT/OPTION en texte
 * @param {number} option Value de l'option
 * @returns {string} Renvoie du texte équivalent
*/
function selecOptionTranslate(option) {
    if (option == 8) {
        option = "demi-journée(s)";
    } else if (option == 15) {
        option = "journée(s)";
    } else if (option == 7) {
        option = "repas";
    }
    return option;
}




/** Fonction de réinit du forumulaire */
function reinit() {

    // suppression des classes CSS de validation dans tous les champs du tableau "fields_reset"
    var fieldsResetList = [
        "nom_Field",
        "prenom_Field",
        "tel_Field",
        "email_Field",
        "resa1_qt_Field",
        "resa2_qt_Field",
        "resa3_qt_Field",
        "checkbox_Field"];

    for (i = 0; i < fieldsResetList.length; i++) {
        document.getElementById(fieldsResetList[i]).classList.remove('errorBackground');
        document.getElementById(fieldsResetList[i]).classList.remove('validBackground');
        document.getElementById(fieldsResetList[i]).classList.remove('red_border');
        document.getElementById(fieldsResetList[i]).classList.remove('green_border');
    }

    // reset du formulaire
    document.getElementById("formulaire").reset();
}