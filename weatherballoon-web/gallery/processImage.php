<?php

include("gallery/tools.php");

@mkdir("gallery/pics/thumbs", 0777, true);
@chmod("gallery/pics/thumbs", 0777);

// Finde heraus, wieviele Bilder hochgeladen wurden
$count = 0;
foreach ($_FILES['toProcess']['name'] as $name)
	if (!empty($name))
		$count++;
echo $count;
for ($i = 0; $i < $count; $i++) 
{
	$newName = $_FILES['toProcess']['name'][$i];
	
	if (empty($newName))
		continue;
	
	$endung = substr(strtolower($newName),-4);
	
	if ($endung != ".jpg" && $endung != ".jpeg" && $endung != ".png" && $endung != ".gif") {
		echo "<br>Datei ". $newName ." ist keine g&uuml;ltige Bilddatei und wurde nicht hochgeladen.<br>";
		continue;
	}
	
	if(!move_uploaded_file($_FILES['toProcess']['tmp_name'][$i], "gallery/pics/tmp_".$newName)) {
		echo "<br>Konnte Datei ". $newName ." nicht verschieben.<br>";
		continue;
	}

	list($width,$height) = getimagesize("gallery/pics/tmp_".$newName);
	
	if ($width * $height > 850 * 850)
		img_resizer("gallery/pics/tmp_".$newName, "gallery/pics/".$newName, 90, 850, 850);
	else
		copy("gallery/pics/tmp_".$newName, "gallery/pics/".$newName);
		
	if ($width * $height > 150 * 113)
		img_resizer("gallery/pics/tmp_".$newName, "gallery/pics/thumbs/".$newName, 75, 150, 113);
	else
		copy("gallery/pics/tmp_".$newName, "gallery/pics/thumbs/".$newName);
		
	unlink( "gallery/pics/tmp_".$newName );
	
}


echo "<br> Hochladen beendet.";





?>