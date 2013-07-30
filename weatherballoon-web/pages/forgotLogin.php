<!-- 
Datei:				forgotLogin
Beschreibung:		Stellt zwei Formulare zur Verfuegung, um sich Benutzername
					und Passwort per Email senden zu lassen
Autor:				Patrick Vogt, am 31.07.2013
MatrikelNr:			924789
-->
<?php 
if (isset($_GET["forgot"])) {
	include "code_behind/forgotLogin.php";
}
?>
<div class="container">
	<div class="hero-unit">
		<h1>Daten vergessen?</h1>
		<p>Kein Problem! F&uuml;llen Sie einfach das entsprechende Formular aus und den Rest erledigen wir f&uuml;r Sie.</p>
	</div>
	<div class="row">
		<div class="span6">
			<h2>Benutzername vergessen?</h2>
			<form action="?page=forgotLogin&forgot=username" method="post">
				<label for="password">Passwort</label>
				<input type="password" id="password" name="password" placeholder="Password">
				<p><button type="submit" class="btn">Benutzername herausfinden</button></p>
			</form>
		</div>
		<div class="span6">
			<h2>Passwort vergessen?</h2>
			<form action="?page=forgotLogin&forgot=password" method="post">
				<label for="username">Benutzername</label>
				<div class="input-prepend">
					<span class="add-on">@</span>
					<input type="text" id="username" name="username" placeholder="Benutzername">
				</div>
				<p><button type="submit" class="btn">Passwort herausfinden</button></p>
			</form>
		</div>
	</div>
</div>