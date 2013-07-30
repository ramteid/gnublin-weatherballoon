<div class="container">
<?php 
//*****************************************************************
// Script: galleryUpload.php
// Scriptbeschreibung: Stellt das Upload-Formular für Bilder dar
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Inkludiere das Upload-Script, welches prüft ob Formular schon abgeschickt wurde
include("gallery/uploadImage.php");
?>

<form name="bildupload" method="post" action="index.php?page=galleryUpload" enctype="multipart/form-data">
	Bis zu 10 Bilder gleichzeitig hochladen: <br>
	<br>
	<br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<input type="file" name="toProcess[]"><br>
	<br>
	<input class="btn" type="submit" name="senden" value="Hochladen">
  </form>
</div>