<?php
//*****************************************************************
// Script: uploadImage.php
// Scriptbeschreibung: Prüft ob das Formular abgeschickt wurde und 
//					   ruft Verarbeitungs-Routine auf.
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Hilfsfunktionen
include("gallery/tools.php");

// Prüfe ob Formular abgesendet wurde und rufe ggf. Verarbeitungs-Routine auf.
if (!empty($_POST['senden']) && !empty($_FILES))
{
	include("gallery/processImage.php");
}

?>





