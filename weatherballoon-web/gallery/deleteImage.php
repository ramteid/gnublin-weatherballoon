<?php
//*****************************************************************
// Script: deleteImage.php
// Scriptbeschreibung: Stellt alle Bilder dar für eine Lösch-Auswahl 
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

include("gallery/tools.php");

if (isset($_POST['images'])) {
	foreach ($_POST['images'] as $image) 
	{
		if (unlink("gallery/pics/".$image) && 
			unlink("gallery/pics/thumbs/".$image))
				echo "<br>Bild $image wurde erfolgreich gel&ouml;scht.";
		else
				echo "<br>Bild $image konnte nicht gel&ouml;scht werden.";
	}
}

echo '<form name="deleteimage" method="post" action="index.php?page=galleryDelete">';
$files = filesInDir('gallery/pics');
foreach ($files as $file) 
{
	echo '	<div style="float:left; margin:10px 10px 60px 10px;">
			<a href="gallery/pics/'.$file.'" rel="shadowbox;title='.$file.'"><img src="gallery/pics/thumbs/'.$file.'"></a>
			<input type="checkbox" name="images[]" value="'.$file.'" />
			</div>';
}
echo '<div style="clear:left;"></div><br><input class="btn" type="submit" name="senden" value="Markierte Bilder l&ouml;schen" onClick="return confirm(\'Diese(s) Bild(er) wirklich l&ouml;schen?\');"></form>';








?>