<?php
if ($db->open()) {
	$params = array(":name" => $_POST["name"], ":thanks" => $_POST["thanks"], ":link" => $_POST["link"]);
	$bool = $db->query("INSERT INTO sponsors (name, thanks, link) VALUES (:name, :thanks, :link)", $params);
	$db->close();
	
	if ($bool) {
		alert("alert-success", "Erfolg!", "Der Sponsor wurde erfolgreich angelegt.");
	} else {
		alert("alert-error", "Fehler!", "Der Sponsor konnte nicht angelegt werden.");
	}
} else {
	alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
}
?>