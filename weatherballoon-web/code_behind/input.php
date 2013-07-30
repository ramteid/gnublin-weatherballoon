<?php
// Prüfe ob POST-Daten vorliegen
if (empty($_POST) || empty($_POST['gpsdata']))
{
	return;
}

// Hole Inhalt des Textfelds
$textfield = $_POST['gpsdata'];

// Teile Inhalt in Zeilen auf
$lines = explode("\n", $textfield);

// Zeilen-Zähler definieren,
// definiere Standard-Rückmeldungstext,
// definiere Fehler-Variable für Erkennung von Fehlerfällen
$count = 0;
$statusText = "";
$error = false;

// Definiere Arrays, in die die Datensätze geschrieben werden
$longitudes = array();
$latitude = array();
$heights = array();
$temperatures = array();

// Teile jede Zeile anhand von Leerzeichen auf und prüfe Werte
foreach ($lines as &$line)
{
	$values = explode(" ", trim($line));
	
	// Jede Zeile muss 5 Werte besitzen, sonst gebe Fehler aus
	if (count($values) != 5)
	{
		$statusText .= "Zeile $count hat nicht genau 5 Werte, sondern " . count($values) . "! <br>";
		$error = true;
		$count++;
		continue;
	}
	
	// Interpretiere Werte
	$datetime = $values[0];
	$longitude = $values[1];
	$latitude = $values[2];
	$height = $values[3];
	$temperature = $values[4];
	
	// Regex-Muster für Datum-String, z.B. "2013-08-02_12:59:59"
	$regexDateTime = '^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})^';
	
	// Regex-Muster für Float-String, z.B. 123.456
	$regexFloat = "/^[0-9]*\.[0-9]+$/";
	
	// Prüfe auf Datentyp float
	if (!( preg_match($regexFloat, $longitude) &&
		   preg_match($regexFloat, $latitude) &&
		   preg_match($regexFloat, $height) &&
		   preg_match($regexFloat, $temperature) &&
		   preg_match($regexDateTime, $datetime) ))
	{
		$statusText .= "Zeile $count hat einen ungültigen Wert! <br>";
		$error = true;
		$count++;
		continue;
	}
	
	// Wenn Datensatz korrekt, schreibe Datensatz in Arrays
	$datetimes[$count] = $datetime;
	$longitudes[$count] = $longitude;
	$latitudes[$count] = $latitude;
	$heights[$count] = $height;
	$temperatures[$count] = str_replace("_", " ", $temperature);
	
	// Zeilen-Zähler erhöhen
	$count++;
}

// Wenn bein Check ein Fehler auftrat, gebe Fehlermeldungen aus und beende
if ($error)
{
	$type = "alert-error";
	$headline = "Fehler!";
	$message = $statusText;
	alert($type, $headline, $message);
	return;
}

// Ansonsten schreibe Arrays in Datenbank

// Erzeuge neues Datenbank-Objekt
$conn = new MySQLDatabaseConnection(DB_DNS, DB_USER, DB_PASSWORD);

// Öffne eine Verbindung zur Datenbank
// Wenn Verbindung nicht möglich ist, gebe Fehlermeldung aus
if (!$conn->open())
{
	$type = "alert-error";
	$headline = "Fehler!";
	$message = "Konnte die Datenbankverbindung nicht öffnen";
	alert($type, $headline, $message);
	return;
}

// Leere vorher Tabelle 
$conn->query( "TRUNCATE TABLE records;" );
	
// Definiere Datenbankanfrage
$query = "INSERT INTO records (datetime, longitude, latitude, height, temperature) VALUES (:datetime, :longitude, :latitude, :height, :temperature);";

// Iteriere über alle eingegebenen Datensätze
for ($i = 0; $i < $count; $i++)
{
	// Definiere Parameter-Array, wird automatisch in den VALUES(...)-Teil der Anfrage eingefügt
	$params = array(':datetime' => $datetimes[$i],
					':longitude' => $longitudes[$i],
					':latitude' => $latitudes[$i],
					':height' => $heights[$i],
					':temperature' => $temperatures[$i] );
	
	// Führe Anfrage aus
	try
	{
		$conn->query($query, $params);
	} 
	catch (Exception $e) 
	{
		// Bei einem Datenbank-Fehler gebe Fehlermeldung für diesen Datensatz aus, mache aber weiter.
		$error = true;
		$statusText .= "Zeile $i konnte nicht gespeichert werden! <br>";
	}
}

// Wenn bein Check ein Fehler auftrat, gebe Fehlermeldungen aus und beende
if ($error)
{
	$type = "alert-error";
	$headline = "Fehler!";
	$message = $statusText;
	alert($type, $headline, $message);
	return;
}
// Ansonsten gebe Erfolgsmeldung aus
else
{
	$type = "alert-success";
	$headline = "Erfolg!";
	$message = "Die Datens&auml;tze wurden erfolgreich gespeichert!";
	alert($type, $headline, $message);
	return;
}
?>




