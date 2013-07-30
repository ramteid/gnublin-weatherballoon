<?php
//*****************************************************************
// Script: view.php
// Scriptbeschreibung: Stellt die Bilder im Bildverzeichnis dar
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Hilfsfunktionen
include("gallery/tools.php"); 

// Hole alle Bilder aus dem Verzeichnis
$files = filesInDir("gallery/pics");

// Prüfe ob Bilder vorhanden sind, gebe ggf. Meldung aus
if (empty($files))
	alert("alert-info", "Bilder!", "Es sind momentan keine Bilder vorhanden");

// Ansonsten zeige alle Bilder an
else
{
	// Beginn der Auflistung
	echo '<ul class="thumbnails">';
	
	// Iteriere über Bilder und erzeuge HTML-Code für die Darstellung mit Shadowbox
	foreach ($files as $file)
	{
		echo '<li class="span2">
				<a href="gallery/pics/'.$file.'" rel="shadowbox" class="thumbnail">
					<img src="gallery/pics/thumbs/'.$file.'">
				</a>
			  </li>';
	}
	
	// Ende der Auflistung
	echo '</ul>';
}

	
?>