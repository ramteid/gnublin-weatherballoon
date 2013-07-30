<?php
//*****************************************************************
// Script: processImage.php
// Scriptbeschreibung: Wird aufgerufen, wenn das Bild-Upload-Script abgeschickt wurde,
//					   verarbeitet die Hochgeladenen Bilder.
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Hilfsfunktionen
include("gallery/tools.php");

// Setze die Zugriffsrechte für die Bild-Verzeichnisse
@chmod("gallery/pics", 0777);
@chmod("gallery/pics/thumbs", 0777);

// Finde heraus, wieviele Bilder hochgeladen wurden
$count = 0;
foreach ($_FILES['toProcess']['name'] as $name)
	if (!empty($name))
		$count++;

// Es soll nachvollzogen werden können, wie viele Bilder erfolgreich hochgeladen werden konnten
$succeeded = 0;
		
// Iteriere über alle hochgeladenen Bilddateien
for ($i = 0; $i < $count; $i++) 
{
	// Lege Namen fest
	$newName = $_FILES['toProcess']['name'][$i];
	
	// Prüfe ob die letzte Aktion erfolgreich war
	if (empty($newName))
		continue;
	
	// Hole Dateiendung
	$endung = substr(strtolower($newName),-4);
	
	// Überprüfe Dateiendung
	if ($endung != ".jpg" && $endung != ".jpeg" && $endung != ".png" && $endung != ".gif") 
	{
		alert("alert-error", "Fehler!", "Datei ". $newName ." ist keine g&uuml;ltige Bilddatei und wurde nicht hochgeladen.");
		continue;
	}
	
	// Verschiebe Bilddatei vom temporären Ort in den Zielordner und gebe Fehler aus wenn dies fehl schlug
	// Vor der Bildgrößenanpassung wird ein temporärer Dateiname vergeben
	if(!move_uploaded_file($_FILES['toProcess']['tmp_name'][$i], "gallery/pics/tmp_".$newName)) 
	{
		alert("alert-error", "Fehler!", "Konnte Datei ". $newName ." nicht verschieben.");
		continue;
	}

	// Hole die Bild-Abmessungen
	list($width,$height) = getimagesize("gallery/pics/tmp_".$newName);
	
	// Prüfe und passe die Bildgröße des großen Bilds ggf. an, 
	// passe den Dateinamen dabei an
	if ($width * $height > 850 * 850)
		img_resizer("gallery/pics/tmp_".$newName, "gallery/pics/".$newName, 90, 850, 850);
	else
		copy("gallery/pics/tmp_".$newName, "gallery/pics/".$newName);
		
	// Prüfe und passe die Bildgröße des Thumbnails ggf. an, 
	// passe den Dateinamen dabei an
	if ($width * $height > 150 * 113)
		img_resizer("gallery/pics/tmp_".$newName, "gallery/pics/thumbs/".$newName, 75, 150, 113);
	else
		copy("gallery/pics/tmp_".$newName, "gallery/pics/thumbs/".$newName);
		
	// Entferne die temporäre Datei
	unlink( "gallery/pics/tmp_".$newName );
	
	// Erhöhe den Erfolgs-Zähler
	$succeeded++;
}

// Gebe aus, wie viele Bilder tatsächlich erfolgreich hochgeladen wurden
alert("alert-info", "Hochladen beendet!", "Es wurden $succeeded von $count Bild(ern) hochgeladen.");


?>