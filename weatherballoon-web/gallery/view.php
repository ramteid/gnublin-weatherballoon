<?php
//*****************************************************************
// Script: view.php
// Scriptbeschreibung: Stellt die Bilder im Bildverzeichnis dar
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

include("gallery/tools.php"); 

$files = filesInDir("gallery/pics");
if (empty($files))
	echo "Es sind momentan keine Bilder vorhanden";
else
{
	echo '<ul class="thumbnails">';
	
	foreach ($files as $file)
	{
		// echo '<div style="float:left; margin:10px; width: 150px; height: 113px; background-color: white; border: 1px solid black; overflow:hidden;">
					// <div style="width: 150px; height: 113px; display: table-cell; vertical-align:middle; text-align:center;">
						// <a rel="shadowbox;title=" href="gallery/pics/'.$file.'">
							// <img src="gallery/pics/thumbs/'.$file.'">
						// </a>
					// </div>
				// </div>
				// ';
		echo '<li class="span2">
				<a href="gallery/pics/'.$file.'" rel="shadowbox" class="thumbnail">
					<img src="gallery/pics/thumbs/'.$file.'">
				</a>
			  </li>';
	}
	
	echo '</ul>';
}

	
	
?>