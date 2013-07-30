<?php 
include("gallery/tools.php");

if (!empty($_POST['senden']) && !empty($_FILES))
	include("gallery/processImage.php");
?>

<form name="bildupload" method="post" action="index.php?page=galleryUpload" enctype="multipart/form-data">
	Bis zu 10 Bilder gleichzeitig hochladen: <br>
	<br>
	<br>
	<input type="file" name="toProcess[]"></input><br>
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



