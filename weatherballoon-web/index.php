<?php
include "globals.inc.php";
require_once PATH_LIB . "/database/MySQLDatabaseConnection.class.php";
require_once PATH_LIB . "/logging/Logging.class.php";

$db = new MySQLDatabaseConnection(DB_DNS, DB_USER, DB_PASSWORD);
$log = new Logging("database");
$logger = $log->getLogger("main");
try {
	session_start();
} catch (ErrorException $e) {
	$logger->warn($e->getMassage());
}
include PATH_TEMPLATE . "/head.inc.php";
if (isset($_POST["login"])) {
	echo "<div id='content'>";
	if ($db->open()) {
		$params = array(":email" => $_POST["username"], ":password" => md5($_POST["password"]));
		$db->query("SELECT * FROM user WHERE email LIKE :email AND password LIKE :password", $params);
		$result = $db->getResult();
		if (count($result) > 0) {
			if ($_POST["username"] == $result[0]["email"] && md5($_POST["password"]) == $result[0]["password"]) {
				$_SESSION["user"] = $_POST["username"];
				$logger->info($_POST["username"] . " logged in.");
			} else {
				alert("alert-error", "Login fehlgeschlagen!", "Der Benutzername oder das Passwort ist falsch.");
			}
		} else {
			alert("alert-error", "Login fehlgeschlagen!", "Der Benutzername oder das Passwort ist falsch.");
		}
	} else {
		alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
	}
} else {
	echo "<div id='content'>";
}
if (isset($_GET["msg"])) {
	if ($_GET["msg"] == "logout") {
		alert("alert-success", "Erfolg!", "Sie wurden erfolgreich abgemeldet.");
	}
}
if (isset($_GET["page"]) && !empty($_GET["page"])) {
	if (in_array($_GET["page"], whiteList())) {
		include "pages/" . basename($_GET["page"]) . ".php";
	} else {
		alert("alert-info", "Info", "Diese Seite existiert nicht.");
	}
} else {
	include "pages/map.php";
}
echo "</div>";
include PATH_TEMPLATE . "/foot.inc.html";
?>