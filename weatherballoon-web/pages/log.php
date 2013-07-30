<!-- 
Datei:				log.php
Beschreibung:		Stellt Log-Eintrag dar und ermoeglicht das Loeschen von diesen.
Autor:				Patrick Vogt, am 30.07.2013
MatrikelNr:			924789
-->
<?php
if (isset($_SESSION["user"])) {
	if (isset($_GET["action"]) && $_GET["action"] == "delete") {
		if ($db->open()) {
			$params = array(":timestamp" => $_GET["time"], ":level" => $_GET["level"]);
			$bool = $db->query("DELETE FROM logging WHERE timestamp = :timestamp AND level = :level", $params);
			$db->close();
			if ($bool) {
				alert("alert-success", "Erfolg!", "Der Log-Eintrag wurde erfolgreich entfernt.");
				redirect("?page=log", 3000);
			} else {
				alert("alert-error", "Fehler!", "Der Log-Eintrag konnte nicht entfernt werden.");
				redirect("?page=log", 3000);
			}
		}
	}
?>
<div class="container">
	<table class="table table-striped">
		<thead>
			<tr>
				<th>Timestamp</th>
				<th>Logger</th>
				<th>Level</th>
				<th>Nachricht</th>
				<th>Thread</th>
				<th>Datei</th>
				<th>Zeile</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
		<?php 
		if ($db->open()) {
			$db->query("SELECT * FROM logging", array());
			foreach ($db->getResult() as $row) {
				echo "<tr>";
				echo "	<td>" . $row["timestamp"] . "</td>";
				echo "	<td>" . $row["logger"] . "</td>";
				echo "	<td>" . $row["level"] . "</td>";
				echo "	<td>" . $row["message"] . "</td>";
				echo "	<td>" . $row["thread"] . "</td>";
				echo "	<td>" . $row["file"] . "</td>";
				echo "	<td>" . $row["line"] . "</td>";
				echo "	<td><a class='tip' href='?page=log&action=delete&time=" . $row["timestamp"] . "&level=" . $row["level"] . "' data-toggle='tooltip' title='Log-Eintrag entfernen'><i class='icon-remove'></i></a></td>";
				echo "</tr>";
			}
			$db->close();
		} else {
			alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
		}
		?>
		</tbody>
	</table>
</div>
<?php
}
?>