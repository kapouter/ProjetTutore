$(function() {
	init0();	
});

function init0(){
	begin = setInterval(chgt, 100);
}

function chgt(){
	if (Niveau.getChargementDonnees() == 0){
		init();
		clearInterval(begin);
	}
}

function init(){
	
	// STRUCTURE
	// contenus initiaux de l'écran d'accueil
	$('#titreAccueil').html("conflit GAI MTL / JAMBI MTL - Level/Niveau 1");
	$('#texte').html("Le but de ces exercices est de développer la capacité d'orientation des élèves par rapport aux cap magnétiques dans \
	les différentes zones de conflit du secteur. Chaque exercice présente une série de conflits sur une même zone mais avec des positions \
	respectives des avions différentes. <br\> \
	Le but est de respecter le minimum de 5Nm latéral et de ne pas s'approcher des limites secteurs à moins de 3Nm.");
	$('#image').html("<img src='images/jeu.png'>");
	$('#boutonJeu').html("<input type=\"submit\" value=\"Commencer le jeu !\">");
	$('footer').html("Copyright INSA Toulouse 2015 - Version 1");
	
	// contenu initial de l'écran de jeu
	$('#animation').html("<canvas id=\"dessin\" width=\"1500\" height=\"1000\">Texte pour les navigateurs qui ne supportent pas canvas</canvas>");
	$('#boutonQuitter').html("<input type=\"submit\" value=\"Quitter\">");
	monCanvas = document.getElementById('dessin');
	if (monCanvas.getContext){
		ctx = monCanvas.getContext('2d');
	} else {
		alert('canvas non supporté par ce navigateur');
	}	

	// contenu initial de l'écran de bilan
	$('#boutonRejouer').html("<input type=\"submit\" value=\"Rejouer\">");
	$('#boutonAccueil').html("<input type=\"submit\" value=\"Accueil\">");
		
	// DONNEES
	// liste des avions
	// construire la liste a partir du xml
	listeNiveaux  = Niveau.getListeNiveaux();
	
	// VARIABLES
	tempsJeu = 0;
	tempsNiveau = 0;
	niveauCourant = 0;
	ecranCourant = null;
	tempsLimite = 60;
	tempsNiveauLimite = 20;

	// GESTIONNAIRES
	// gestionnaire du bouton #boutonJeu
	$('#boutonJeu').click(function() {
		afficheJeu();
	});
	// interactivité sur le canvas
	monCanvas.addEventListener("click", clicCanvas, false);	
	// gestionnaire du bouton #boutonJeu
	$('#boutonQuitter').click(function() {
		reinitialisation();
		afficheAccueil();
	});
	// gestionnaires
	$('#boutonRejouer').click(function() {
		reinitialisation();
		afficheJeu();
	});
	$('#boutonAccueil').click(function() {
		reinitialisation();
		afficheAccueil();
	});		
	
	// REGLES
	inter = setInterval(regles, 100);	
	
	// LANCEMENT
	afficheAccueil();
	
}

function afficheAccueil(){
	ecranCourant = "accueil";
	// affichage de l'écran et masquage des autres écrans
	$('#accueil').show();
	$('#jeu').hide();
	$('#bilan').hide();	
}
function afficheJeu(){
	ecranCourant = "jeu";
	// affichage de l'écran et masquage des autres écrans
	$('#accueil').hide();
	$('#jeu').show();
	$('#bilan').hide();
	// affichage de la consigne du premier niveau de l'animation
	afficheConsigne(niveauCourant);
}
function afficheConsigne(ni){
	var cons = "";
	$('#consigne').html(cons);
}
function regles(){
	if (ecranCourant == "jeu"){
		$('#temps').html(tempsJeu/10);
		animer();
	}	
}
function animer() {
	if((tempsJeu/10 > tempsLimite) || (niveauCourant > Niveau.getNombreNiveaux()-1)){
		afficheBilan();
	}
	else if (tempsNiveau/10 > tempsNiveauLimite){
		niveauCourant++;
		tempsNiveau = 0;
	}
	else {
		tempsJeu++;
		tempsNiveau++;
		// effaçage
		ctx.clearRect(0,0, monCanvas.width,monCanvas.height);
		for (var a=0; a < listeNiveaux[niveauCourant].getListOfAvions().length; a++){
			dessineAvion(listeNiveaux[niveauCourant].getListOfAvions()[a]);
		}			
	}			
}
function dessineAvion(a){
	// paramètres de l'avion
	var v = a.getV();
	var R = 5;
	var x = a.getX() + v*1;
	var y = a.getY() + v*1;
	if (tempsNiveau == 2) {
		a.setX1(x);
		a.setY1(y);
	}
	else if (tempsNiveau > 2) {
		a.setX2(a.getX1());
		a.setY2(a.getY1());
		a.setX1(x);
		a.setY1(y);
	}
	a.setX(x);
	a.setY(y);
	
	// sauvegarde de l'état du contexte
	ctx.save();
	// dessin
	// ici : divisé par 100 pour y voir...
	ctx.translate(x/100,y/100);
   	ctx.beginPath();
   	ctx.arc(0, 0, R, 0, 2 * Math.PI, false);
   	ctx.fillStyle = "#046380";
   	ctx.fill();
   	ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
  	ctx.stroke();
  	// retour à l'état précédent du contexte
	ctx.restore()
}
function afficheBilan(){
	ecranCourant = "bilan";
	// affichage de l'écran et masquage des autres écrans
	$('#accueil').hide();
	$('#jeu').hide();
	$('#bilan').show();
	$('#recap').html("Votre score est de ");		
}
function clicCanvas(e){
	// position de la souris / document
	var xSourisDocument = e.pageX 
    var ySourisDocument = e.pageY;
	// position du canvas / document
	var xCanvas = monCanvas.offsetLeft;
	var yCanvas = monCanvas.offsetTop;
	// position du clic / canvas
	xSourisCanvas = xSourisDocument - xCanvas;
	ySourisCanvas = ySourisDocument - yCanvas;
	// test si une balle est cliquée
	for (var c=0; c<listeNiveaux[niveauCourant].getListOfAvions().length; c++){
		var R = 5;
		if(Math.abs(listeNiveaux[niveauCourant].getListOfAvions()[c].xIni-xSourisCanvas) < R
			&& Math.abs(listeNiveaux[niveauCourant].getListOfAvions()[c].yIni-ySourisCanvas) < R){
		}
	}
}
function reinitialisation(){
	niveauCourant = 0;
	tempsJeu = 0;
	for (lv = 0; lv < Niveau.getNombreNiveaux(); lv++) {
		for (idA = 0; idA < listeNiveaux[lv].getListOfAvions().length; idA++){
			listeNiveaux[lv].getListOfAvions()[idA].setX(listeNiveaux[lv].getListOfAvions()[idA].getXInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setY(listeNiveaux[lv].getListOfAvions()[idA].getYInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setV(listeNiveaux[lv].getListOfAvions()[idA].getVInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setZ(listeNiveaux[lv].getListOfAvions()[idA].getZInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setH(listeNiveaux[lv].getListOfAvions()[idA].getHInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setX1(listeNiveaux[lv].getListOfAvions()[idA].getXInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setY1(listeNiveaux[lv].getListOfAvions()[idA].getYInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setX2(listeNiveaux[lv].getListOfAvions()[idA].getXInitial());
			listeNiveaux[lv].getListOfAvions()[idA].setY2(listeNiveaux[lv].getListOfAvions()[idA].getYInitial());
		}
	}
}

