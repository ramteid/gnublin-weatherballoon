<!-- 
Datei:				head.inc.php
Beschreibung:		Kopf der Webseite mit Menue
Autor:				Patrick Vogt, am 30.07.2013
MatrikelNr:			924789
-->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Gnublin Wetterballon</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		
		<!-- CSS -->
		<link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
		<link href="css/bootstrap.min.css" rel="stylesheet" media="screen" type="text/css" />
		<link href="css/layout.css" rel="stylesheet" media="screen" type="text/css" />
		<link rel="stylesheet" type="text/css" href="gallery/shadowbox-3.0.3/shadowbox.css">
	
		<!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
	    <!--[if lt IE 9]>
	    	<script src="js/html5shiv.js"></script>
	    <![endif]-->
		
		<!-- Javascript -->
		<script src="http://code.jquery.com/jquery.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="gallery/shadowbox-3.0.3/shadowbox.js"></script>
		<script type="text/javascript">
		Shadowbox.init();
		$(document).ready(function() {
			$('.tip').tooltip();
		});
		</script>
	</head>
	<body lang="de">
		<div class="container-narrow">
			<div class="navbar navbar-fixed-top">
				<div class="navbar-inner">
					<div class="container">
						<a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</a>
						
						<a class="brand">Gnublin Wetterballon</a>
						
						<div class="nav-collapse">
							<ul class="nav pull-right">
								<li><a href="index.php">Flugverlauf</a></li>
								<li><a href="?page=project">Projekt</a></li>
								<li><a href="?page=gallery">Bilder</a></li>
								<li><a href="?page=danke">Danke</a></li>
								<li><a href="https://github.com/ramteid/gnublin-weatherballoon/" target="_blank">Git</a></li>
								<?php if (!isset($_SESSION["user"])) { ?>
								<li class="dropdown">
									<a class="dropdown-toggle" href="#" data-toggle="dropdown">Login <strong class="caret"></strong></a>
									<div class="dropdown-menu" style="padding: 15px; padding-bottom: 0px;">
										<form id="login-form" action="index.php" method="post">
											<input type="hidden" name="login" value="login">
											<input class="text" type="text" name="username" placeholder="Benutzername">
											<input class="text" type="password" name="password" placeholder="Passwort">
											<input class="submit" type="submit" class="btn btn-primary" value="Anmelden">
										</form>
										<p><a href="?page=forgotLogin">Anmelde-Daten vergessen?</a></p>
									</div>
								</li>
								<?php } else { ?>
								<li class="dropdown">
									<a class="dropdown-toggle" href="#" data-toggle="dropdown">
										Verwaltung <strong class="caret"></strong>
									</a>
									<ul class="dropdown-menu" style="padding: 15px; padding-bottom: 5px;">
										<li><a href="?page=input">Flugdaten eintragen</a></li>
										<li class="dropdown-submenu pull-left">
											<a tabindex="-1" href="#">Bilder</a>
											<ul class="dropdown-menu">
												<li><a tabindex="-1" href="?page=galleryUpload">Bilder hochladen</a></li>
												<li><a tabindex="-1" href="?page=galleryDelete">Bilder l&ouml;schen</a></li>
											</ul>
										</li>
										<li><a href="?page=sponsoren">Sponsorenverwaltung</a></li>
										<li><a href="?page=log">Log-Eintr&auml;ge</a></li>
										<li class="divider"></li>
										<li><a href="code_behind/logout.php">Abmelden</a></li>
									</ul>
								</li>
								<?php } ?>
							</ul>
						</div>
					</div>
				</div>
			</div>