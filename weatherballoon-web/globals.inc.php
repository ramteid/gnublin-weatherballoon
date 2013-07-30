<?php
//*****************************************************************************
// Datei: 			globals.inc.php
// Beschreibung: 	Definiert globale Konstanten und enthaelt einige Funktionen
// Autor: 			Patrick Vogt, am 30.07.2013
// MatrikelNr: 		924789
//*****************************************************************************

// Global application settings
date_default_timezone_set("Europe/Berlin");
defined("LOG_EMAIL") || define("LOG_EMAIL", "patrick.vogt@hs-augsburg.de");
defined("DEVELOPMENT_ENVIRONMENT") || define("DEVELOPMENT_ENVIRONMENT", "development");

defined("DB_DNS") || define("DB_DNS", "mysql:host=localhost;dbname=map");
defined("DB_USER") || define("DB_USER", "gnublin");
defined("DB_PASSWORD") || define("DB_PASSWORD", "lpc3131!");

// Global constants
defined("PATH_LIB") || define("PATH_LIB", realpath(dirname(__FILE__) . "/libs/"));
defined("PATH_CLASSES") || define("PATH_CLASSES", realpath(dirname(__FILE__) . "/classes/"));
defined("PATH_TEMPLATE") || define("PATH_TEMPLATE", realpath(dirname(__FILE__) . "/template/"));

//********************************************************************
// Funktion: 		alert()
// Parameter:		type		Typ der Nachricht z. B.: alert-error
// Parameter:		headline	Ueberschrift
// Parameter:		message		Nachricht
// Beschreibung: 	Stellt eine farbige Box mit Informationen dar
// Autor: 			Patrick Vogt, am 30.07.2013
// MatrikelNr: 		924789
//********************************************************************
function alert($type, $headline, $message) {
	echo "<div class='alert " . $type . "'>";
	echo "	<button type='button' class='close' data-dismiss='alert'>&times</button>";
	echo "	<h4>" . $headline . "</h4>";
	echo 	$message;
	echo "</div>";
}

//********************************************************************
// Funktion: 		whiteList()
// Beschreibung: 	Enthaelt alle erlaubten Seitennamen
// Autor: 			Patrick Vogt, am 30.07.2013
// MatrikelNr: 		924789
//********************************************************************
function whiteList() {
	$pages = array(
			"map",
			"danke",
			"gallery",
			"galleryUpload",
			"galleryDelete",
			"project",
			"input",
			"forgotLogin",
			"sponsoren",
			"log"
	);
	return $pages;
}

//********************************************************************
// Funktion: 		redirect()
// Parameter:		url		Die URL, an die weitergeleitet werden soll
// Parameter:		time	Verzoegerung der Weiterleitung
// Beschreibung: 	Leitet verzoegert an eine URL weiter
// Autor: 			Patrick Vogt, am 30.07.2013
// MatrikelNr: 		924789
//********************************************************************
function redirect($url, $time) {
	echo "<script type='text/javascript'>";
	echo "	window.setTimeout('weiterleiten()', " . $time . ");";
	echo "	function weiterleiten() {";
	echo "		self.location.href='" . $url . "';";
	echo "	}";
	echo "</script>";
}
?>
