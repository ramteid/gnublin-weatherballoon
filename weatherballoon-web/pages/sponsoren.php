<!-- 
Datei:				sponsoren
Beschreibung:		Listet die Sponsoren auf. Um die Sponsoren zu loeschen, muss der x-Button gedrueckt werden.
					In einem Modal-Fenster wird ein Formular zur Erstellung von Sponsoren dargestellt.
					Diese Seite ist nur zu erreichen, wenn man sich auf der Seite angemeldet hat.
Autor:				Patrick Vogt, am 31.12.2013
MatrikelNr:			924789
-->
<?php
if (isset($_SESSION["user"])) {
	if (!empty($_POST) && !empty($_POST['sponsor'])) {
		include("code_behind/sponsor.php");
	}
	if (isset($_GET["action"]) == "delete") {
		if ($db->open()) {
			$bool = $db->query("DELETE FROM sponsors WHERE id = :id", array(":id" => $_GET["id"]));
			if ($bool) {
				alert("alert-success", "Erfolg!", "Der Sponsor wurde erfolgreich entfernt.");
				redirect("index.php?page=sponsoren", 3000);
			} else {
				alert("alert-error", "Fehler!", "Der Sponsor konnte nicht entfernt werden.");
				redirect("index.php?page=sponsoren", 3000);
			}
			$db->close();
		} else {
			alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
		}
	}
?>
	<div class="container">
		<a href="#modal" role="button" class="btn" data-toggle="modal"><i class="icon-plus"></i> Sponsor hinzuf&uuml;gen</a>
		
		<div id="modal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>
				<h3 id="modalLabel">Sponsor hinzuf&uuml;gen</h3>
			</div>
			<div class="modal-body">
				<form action="?page=sponsoren" method="post">
					<input type="hidden" name="sponsor" value="1">
					<label for="name">Name des Sponsors</label>
					<input type="text" id="name" name="name" placeholder="Name des Sponsors">
					<label for="thanks">Pers&ouml;nliches Dankesch&ouml;n</label>
					<textarea name="thanks" id="thanks" style="width:90%; height:100px;"></textarea>
					<label for="link">URL</label>
					<input type="text" id="link" name="link" placeholder="URL">
					<p><button class="btn btn-primary" type="submit">Speichern</button></p>
				</form>
			</div>
		</div>
		
		<table class="table table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>Pers&ouml;nliches Dankesch&ouml;n</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<?php
				if ($db->open()) {
					$db->query("SELECT * FROM sponsors", array());
					foreach ($db->getResult(PDO::FETCH_ASSOC) as $row) {
						echo "<tr>";
						echo "	<td>" . utf8_encode($row["name"]) . "</td>";
						echo "	<td>" . utf8_encode($row["thanks"]) . "</td>";
						echo "	<td><a href='" . $row["link"] . "' target='_blank'>" . $row["link"] . "</a></td>";
						echo "	<td><a class='tip' href='?page=sponsoren&action=delete&id=" . $row['id'] . "' data-toggle='tooltip' title='Sponsor entfernen'><i class='icon-remove'></i></a></td>";
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