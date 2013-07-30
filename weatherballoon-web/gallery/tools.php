<?php
//*****************************************************************
// Script: tools.php
// Scriptbeschreibung: Enthält Hilfsfunktionen für die Bildergalerie
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 


function _ckdir($fn) 
{
    if (strpos($fn,"/") !== false) 
	{
        $p=substr($fn,0,strrpos($fn,"/"));
        if (!is_dir($p)) 
		{
            mkdir($p,777,true);
        }
    }
}

function img_resizer($src,$destination,$quality,$w,$h) 
{
    /* v2.5 with auto crop */

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
	
	
	if ($_ratio[0] > 0)		// landscape format
	{
		$h = $height / ($width / $w);
	}
	else if ($_ratio[0] < 0)	// portrait format
	{
		$w = $width / ($height / $h);
	}
	
	// crop image
	if ($_ratio[0] != $_ratio[1]  &&  $w*$h > $width * $height)        // never enlarge picture
	{
		// find the right scale to use
		$_scale=min((float)($width / $w),(float)($height / $h));

		// coords to crop
		$cropX=(float)($width-($_scale*$w));
		$cropY=(float)($height-($_scale*$h));   
	   
		// cropped image size
		$cropW=(float)($width-$cropX);
		$cropH=(float)($height-$cropY);
	   
		$crop=ImageCreateTrueColor($cropW,$cropH);
		// crop the middle part of the image to fit proportions
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
   
	// do the thumbnail
	$NewThumb=ImageCreateTrueColor($w,$h);
	if (isset($crop)) { // been cropped
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
	else  // ratio match, regular resize
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
	_ckdir($destination);
	ImageJpeg($NewThumb,$destination,$quality);
	ImageDestroy($NewThumb);
	ImageDestroy($OldImage);
	
	return true;
}

function replaceChars($string) 
{
	$ersetzen = array(
						'ä' => 'ae',
						'ö' => 'oe',
						'ü' => 'ue',
						'Ä' => 'Ae',
						'Ö' => 'Oe',
						'Ü' => 'Ue',
						'ß' => 'ss',
						' ' => '_',
						'\\' => '-',
						'/' => '-',
				);
	return strtr($string, $ersetzen);
}


function filesInDir($dir)
{
	$files = array();
	$dirs = scandir($dir);
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


// Leert den Bilder-Ordner "pics"
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

function str_split_php4_utf8($str) 
{
    // place each character of the string into and array
    $split=1;
    $array = array();
    for ( $i=0; $i < strlen( $str ); )
	{
        $value = ord($str[$i]);
        if($value > 127)
		{
            if($value >= 192 && $value <= 223)
                $split=2;
            elseif($value >= 224 && $value <= 239)
                $split=3;
            elseif($value >= 240 && $value <= 247)
                $split=4;
        }
		else
		{
            $split=1;
        }
            $key = NULL;
        for ( $j = 0; $j < $split; $j++, $i++ ) 
		{
            $key .= $str[$i];
        }
        array_push( $array, $key );
    }
    return $array;
} 
?>