<?php
// Global application settings
date_default_timezone_set("Europe/Berlin");
defined("LOG_EMAIL") || define("LOG_EMAIL", "patrick.vogt@hs-augsburg.de");
defined("DEVELOPMENT_ENVIRONMENT") || define("DEVELOPMENT_ENVIRONMENT", "development");

defined("DB_DNS") || define("DB_DNS", "mysql:host=localhost;dbname=map");
defined("DB_USER") || define("DB_USER", "gnublin");
defined("DB_PASSWORD") || define("DB_PASSWORD", "lpc3131!");

// Global constants
defined("PATH_LIB") || define("PATH_LIB", realpath(dirname(__FILE__) . "/libs/"));
defined("PATH_CLASSES") || define("PATH_CLASSES", realpath(dirname(__FILE__) . "/classes/"));
defined("PATH_TEMPLATE") || define("PATH_TEMPLATE", realpath(dirname(__FILE__) . "/template/"));

function alert($type, $headline, $message) {
	echo "<div class='alert " . $type . "'>";
	echo "	<button type='button' class='close' data-dismiss='alert'>&times</button>";
	echo "	<h4>" . $headline . "</h4>";
	echo 	$message;
	echo "</div>";
}

function whiteList() {
	$pages = array(
			"map",
			"danke",
			"gallery",
			"galleryUpload",
			"galleryDelete",
			"project",
			"input",
			"forgotLogin",
			"sponsoren",
	);
	return $pages;
}

function redirect($url, $time) {
	echo "<script type='text/javascript'>";
	echo "	window.setTimeout('weiterleiten()', " . $time . ");";
	echo "	function weiterleiten() {";
	echo "		self.location.href='" . $url . "';";
	echo "	}";
	echo "</script>";
}
?>
