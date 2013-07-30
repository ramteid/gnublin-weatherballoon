<?php
require_once PATH_LIB . "/htmlMimeMail5/htmlMimeMail5.php";

$mail = new htmlMimeMail5();
$mail->setFrom("weatherballoon-web");

if ($_GET["forgot"] == "username") {
	if ($db->open()) {
		$params = array(":password" => md5($_POST["password"]));
		$db->query("SELECT email, name, surname FROM user WHERE password = :password", $params);
		$result = $db->getResult();
		$db->close();
		
		$msg = "<body>";
		$msg .= "<h3>Hallo " . $result[0]["surname"] . " " . $result[0]["name"] . ",</h3>";
		$msg .= "<p>Ihr Benutzername lautet <pre>" . $result[0]["email"] . "</pre></p>";
		$msg .= "</body>";
		
		$mail->setSubject("Ihr vergessener Benutzername");
		$mail->setHTML($msg);
		if ($mail->send(array($result[0]["email"]))) {
			alert("alert-success", "Erfolg!", "Ihr Benutzername wurde an die hinterlegte Email-Adresse versandt.");
		} else {
			alert("alert-error", "Fehler!", "Ihr Benutzername konnte nicht versandt werden.");
		}
	} else {
		alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
	}
} else if ($_GET["forgot"] == "password") {
	if ($db->open()) {
		
		$alphabet = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
		$pass = array();
		$alphaLength = strlen($alphabet) - 1;
		for ($i = 0; $i < 8; $i++) {
			$n = rand(0, $alphaLength);
			$pass[] = $alphabet[$n];
		}
		$newPassword = implode($pass);
		
		$params = array(":username" => $_POST["username"]);
		$db->query("SELECT * FROM user WHERE email = :username", $params);
		$result = $db->getResult();
		$db->query("UPDATE user SET password = :password", array(":password" => md5($newPassword)));
		$db->close();
		
		$msg = "<body>";
		$msg .= "<h3>Hallo " . $result[0]["surname"] . " " . $result[0]["name"] . ",</h3>";
		$msg .= "<p>Es wurde f&uuml;r Sie ein neues Kennwort generiert: <pre>" . $newPassword . "</pre></p>";
		$msg .= "</body>";
		
		$mail->setSubject("Ihr vergessenes Passwort");
		$mail->setHTML($msg);
		if ($mail->send(array($result[0]["email"]))) {
			alert("alert-success", "Erfolg!", "Ihr neues Kennwort wurde an die hinterlegte Email-Adresse versandt.");
		} else {
			alert("alert-error", "Fehler!", "Ihr neues Kennwort konnte nicht versandt werden.");
		}
	} else {
		alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
	}
}
?>