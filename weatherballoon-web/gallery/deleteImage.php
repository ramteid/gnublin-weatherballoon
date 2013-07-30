<?php
//*****************************************************************
// Script: deleteImage.php
// Scriptbeschreibung: Stellt alle Bilder mit einer Lösch-Auswahl dar
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Hilfsfunktionen
include("gallery/tools.php");

// Prüft ob Löschungs-Formular abgeschickt wurde
if (isset($_POST['images'])) 
{
	// Für die Meldungen am Schluss
	$success = "";
	$error = "";
	
	// Für jedes zu löschende Bild ...
	foreach ($_POST['images'] as $image) 
	{
		// Lösche jedes Bild samt Thumbnail und prüfe auf Erfolg der Aktion
		if (unlink("gallery/pics/".$image) && 
			unlink("gallery/pics/thumbs/".$image))
				$message .= "Bild $image wurde erfolgreich gel&ouml;scht.";		// Weitere Erfolgsmeldung
		else
				$error .= "<br>Bild $image konnte nicht gel&ouml;scht werden.";	// Weitere Fehlermeldung
	}
	
	// Gebe Erfolgs- und Fehlermeldungen aus
	if ($success != "")
		alert("alert-success", "Erfolg!", $success);
	if ($error != "")
		alert("alert-error", "Fehler!", $error);
}

// Unabhängig davon, ob das Löschungs-Formular abgeschickt wurde, stelle löschbare Bilder dar
// Gebe Kopfzeile des Formulars aus
echo '<form name="deleteimage" method="post" action="index.php?page=galleryDelete">';

// Hole alle Bilder aus dem Verzeichnis
$files = filesInDir('gallery/pics');

// Iteriere über alle Bilder und stelle diese mit entsprechendem HTML-Code dar
foreach ($files as $file) 
{
	echo '	<div class="div0">
				<a href="gallery/pics/'.$file.'" rel="shadowbox;title='.$file.'"><img src="gallery/pics/thumbs/'.$file.'"></a>
				<input type="checkbox" name="images[]" value="'.$file.'" />
			</div>';
}

// Gebe Fußzeile des Formulars und den Senden-Button aus
echo '<div style="clear:left;"></div><br>
		<input class="btn" type="submit" name="senden" value="Markierte Bilder l&ouml;schen" onClick="return confirm(\'Diese(s) Bild(er) wirklich l&ouml;schen?\');">
		</form>';



?>