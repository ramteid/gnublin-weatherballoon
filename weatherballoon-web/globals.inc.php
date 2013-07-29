<?php
// Global application settings
date_default_timezone_set("Europe/Berlin");
defined("EMAIL") || define("EMAIL", "patrick.vogt@hs-augsburg.de");
defined("DEVELOPMENT_ENVIRONMENT") || define("DEVELOPMENT_ENVIRONMENT", "development");

defined("DB_DNS") || define("DB_DNS", "mysql:host=localhost;dbname=weatherballoon");
defined("DB_USER") || define("DB_USER", "gnublin");
defined("DB_PASSWORD") || define("DB_PASSWORD", "gnublin_lpc3131!");

// Global constants
defined("PATH_LIB") || define("PATH_LIB", realpath(dirname(__FILE__) . "/libs/"));
defined("PATH_CLASSES") || define("PATH_CLASSES", realpath(dirname(__FILE__) . "/classes/"));
?>
