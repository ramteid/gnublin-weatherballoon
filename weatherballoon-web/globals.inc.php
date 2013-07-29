<?php
// Global application settings
date_default_timezone_set("Europe/Berlin");
defined("LOG_EMAIL") || define("LOG_EMAIL", "patrick.vogt@hs-augsburg.de");
defined("DEVELOPMENT_ENVIRONMENT") || define("DEVELOPMENT_ENVIRONMENT", "development");

defined("DB_DNS") || define("DB_DNS", "mysql:host=localhost;dbname=gnublin");
defined("DB_USER") || define("DB_USER", "gnublin");
defined("DB_PASSWORD") || define("DB_PASSWORD", "gnublin_lpc3131!");

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
?>
