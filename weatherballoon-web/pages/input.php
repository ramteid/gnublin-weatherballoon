<?php
if (isset($_SESSION["user"])) {

	// Pruefe ob POST-Daten vorliegen
	if (!empty($_POST) && !empty($_POST['gpsdata']))
	{
		include("code_behind/input.php");
	}
?>
	<div class="container">
		<p>
			Bitte geben Sie hier zeilenweise das Datum, die GPS-Koordinaten, die H&ouml;he und die Temperatur durch Leerzeichen getrennt ein. Die Angabe der Einheiten ist nicht erforderlich. Die bestehende Route wird dabei &uuml;berschrieben.
		</p>
		<p>
			Datum L&auml;ngengrad Breitengrad H&ouml;he Temperatur <br>
			2013-08-02_08:59:59 10.92446 48.35678 476.0 10.05
		</p>
		<div class="row">
			<div class="span12">
				<form action="index.php?page=input" method="post">
					<textarea name="gpsdata" style="width:90%; height:300px;"><?php if (!empty($_POST['gpsdata'])) echo $_POST['gpsdata']; ?></textarea>
					<br>
					<button class="btn" type="submit" style="bottom: 0px;">Speichern</button>
				</form>
			</div>
		</div>
	</div>
<?php 
}
?>