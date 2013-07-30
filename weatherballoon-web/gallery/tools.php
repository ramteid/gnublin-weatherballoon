<?php
//*****************************************************************
// Script: tools.php
// Scriptbeschreibung: Enthält Hilfsfunktionen für die Bildergalerie
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 


//*****************************************************************
// Funktion: filesInDir()
// Parameter dir: zu listendes Verzeichnis
// Rueckgabewert: Array mit Dateien des Verzeichnisses
// Funktionsbeschreibung: Listet alle Dateien in einem Verzeichnis
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 
function filesInDir($dir)
{
	// Hole alle Dateien aus Verzeichnis
	$files = array();
	$dirs = scandir($dir);
	
	// Iteriere über diese Dateien und prüfe ob sie valide sind
	foreach($dirs as $file)
	{
			if (($file == '.')||($file == '..'))
			{
			}
			elseif (is_file($dir.'/'.$file))
			{
				$files[] = $file;
			}
	}
	return $files;
}

//*****************************************************************
// Funktion: clearPictureDir()
// Funktionsbeschreibung: Leert den Bilder-Ordner "pics"
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 
function clearPictureDir() 
{
	// Setze den beinhaltenden Pfad
	$path = "gallery/pics";
	
	// Hole ein handle für den Ordner
	$handle = @opendir($path);
	
	// Iteriere über die Inhalte des Ordners
	while ($file = @readdir ($handle)) 
	{
		// Ignoriere . und ..
		if($file != "." && $file != "..") 
		{
			// Bearbeite nur Dateien, keine Unterverzeichnisse
			if(!is_dir($path . "/" . $file))
			{
				// Lösche die jeweilige Datei
				$compl = $path . "/" . $file;
				unlink($compl);
			}
		}
	}
	// Gebe das handle für den Ordner wieder frei
	@closedir($handle);
}


//*****************************************************************
// Funktion: filesInDir()
// Parameter src: Ursprungsbild
// Parameter destination: Zielbild
// Parameter quality: JPEG-Qualität
// Parameter w: Breite
// Parameter h: Höhe
// Rueckgabewert: Wahrheitswert Erfolg
// Funktionsbeschreibung: Verkleinert ein Bild auf die gewünschte Größe, 
//							berücksichtigt Seitenverhältnis, kopiert Bild
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 
function img_resizer($src,$destination,$quality,$w,$h) 
{
	// Unterscheide Bildtyp
    $e=strtolower(substr($src,strrpos($src,".")+1,3));
    if (($e == "jpg") || ($e == "peg")) 
	{
        $OldImage=imagecreatefromjpeg($src) or $r=0;
    }
	elseif ($e == "gif") 
	{
        $OldImage=imagecreatefromgif($src) or $r=0;
    }
	elseif ($e == "bmp") 
	{
        $OldImage=imagecreatefromwbmp($src) or $r=0;
    }
	elseif ($e == "png") 
	{
        $OldImage=imagecreatefrompng($src) or $r=0;
    }
	else
	{
        echo("Keine g&uuml;ltige Bilddatei! (".$e.") -- ".$src);
		return false;
    }

	list($width,$height)=getimagesize($src);
	// check if ratios match
	$_ratio=array($width / $height, $w / $h);
	
	if ($_ratio[0] > 0)		// Querformat
	{
		$h = $height / ($width / $w);
	}
	else if ($_ratio[0] < 0)	// Hochformat
	{
		$w = $width / ($height / $h);
	}
	
	// Schneide Bild zu
	if ($_ratio[0] != $_ratio[1]  &&  $w*$h > $width * $height)  // Bild nicht vergrößern
	{
		// Finde die richtige Skalierung
		$_scale=min((float)($width / $w),(float)($height / $h));

		// Koordinaten für das Zuschneiden
		$cropX=(float)($width-($_scale*$w));
		$cropY=(float)($height-($_scale*$h));   
	   
		// zugeschnittene Bildgröße
		$cropW=(float)($width-$cropX);
		$cropH=(float)($height-$cropY);
	   
		$crop=ImageCreateTrueColor($cropW,$cropH);
		// schneide den Mittelteil des Bildes zu, um Proportionen zu erhalten
		ImageCopy(
			$crop,
			$OldImage,
			0,
			0,
			(int)($cropX/2),
			(int)($cropY/2),
			$cropW,
			$cropH
		);
	}
   
	// Thumbnail
	$NewThumb=ImageCreateTrueColor($w,$h);
	if (isset($crop)) { // wurde zugeschnitten
		ImageCopyResampled(
			$NewThumb,
			$crop,
			0,
			0,
			0,
			0,
			$w,
			$h,
			$cropW,
			$cropH
		);
		ImageDestroy($crop);
	}
	else  // Verhältnis Übereinstimmung, normale Größe
	{
		ImageCopyResampled(
			$NewThumb,
			$OldImage,
			0,
			0,
			0,
			0,
			$w,
			$h,
			$width,
			$height
		);
	}
	
	// Prüfe ob Ziel-Verzeichnis existiert
    if (strpos($destination,"/") !== false) 
	{
        $p=substr($destination,0,strrpos($destination,"/"));
        if (!is_dir($p)) 
		{
            mkdir($p,777,true);
        }
    }
	
	// Erstelle neue Bilddatei, lösche alte Datei
	ImageJpeg($NewThumb,$destination,$quality);
	ImageDestroy($NewThumb);
	ImageDestroy($OldImage);
	
	return true;
}


?>