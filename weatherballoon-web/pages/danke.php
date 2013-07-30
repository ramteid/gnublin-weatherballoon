<div class="container">
	<div class="hero-unit">
		<h1>Danke!</h1>
		<p>Wir m&ouml;chten uns bei allen die uns bei diesem Projekt unterst&uuml;tzt haben herzlichst bedanken!</p>
	</div>
	<table class="table table-striped">
		<thead>
			<tr>
				<th>Name</th>
				<th>Pers&ouml;nliches Dankesch&ouml;n</th>
			</tr>
		</thead>
		<tbody>
			<?php
			if ($db->open()) {
				$db->query("SELECT * FROM sponsors", array());
				foreach ($db->getResult(PDO::FETCH_ASSOC) as $row) {
					echo "<tr>";
					echo "	<td>" . $row["name"] . "</td>";
					echo "	<td>" . $row["thanks"] . "</td>";
					echo "	<td><a href='" . $row["link"] . "' target='_blank'>" . $row["link"] . "</a></td>";
					echo "</tr>";
				}
				$db->close();
			} else {
				alert("alert-error", "Fehler!", "Die Datenbank konnte nicht ge&ouml;ffnet werden.");
			}
			?>
		</tbody>
	</table>
	<p>Nat&uuml;rlich gilt unser herzlichster Dank auch allen unerw&auml;hnten Helferinnen und Helfern.</p>
</div>