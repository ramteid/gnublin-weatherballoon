<?php
//*****************************************************************
// Script: GpxGenerator.class.php
// Scriptbeschreibung: Dient zur Konvertierung von GPX-Datensätzen	
//						aus der Datenbank zu einer .gpx-Datei
// Autor: Dietmar Sach, am 30.07.2013
// MatrikelNr: 924738
//***************************************************************** 

// Inkludiere globale Variablen und Funktionen
require_once("globals.inc.php");

class GpxGenerator
{
	private $recordsDB;		// Enthält ein zweidimensionales Array mit Datensätzen
	private $gpxData;		// Enthält erzeugten Inhalt einer GPX-Datei in XML-Syntax
	
	// Holt die Datensätze bzgl. Zeit, Koordinaten, Temperatur, Höhe aus der Datenbank
	public function readRecordsFromDatabase()
	{
		// Definiere Abfrage, die alle Datensätze zum Flugverlauf holt
		$query = "SELECT * FROM records;";
		
		// Erzeuge neues Datenbankklassen-Objekt
		$conn = new MySQLDatabaseConnection(DB_DNS, DB_USER, DB_PASSWORD);
		
		// Öffne die Verbindung zur Datenbank
		$conn->open();
		
		// Führe Anfrage aus
		$conn->query($query, array());
		
		// Speichere Rückgabe in Array.
		$result = $conn->getResult();
		
		// Schließe die Verbindung zur Datenbank
		$conn->close();
		
		// Schreibe das Array in eine Klassenvariable
		$this->recordsDB = $result;
	}
	
	// Definiert die einzelnen Wegpunkte im GPX-XML-Format
	public function convertRecordsToGpx()
	{
		// Prüfe ob das Array mit den Datenbank-Datensätzen leer ist
		if (empty($this->recordsDB))
			return;
			
		// Erzeuge für jeden Datensatz einen Wegpunkt
		$points = array();
		$count = 0;
		foreach ($this->recordsDB as $record)
		{
			// Lese die einzelnen Attribute
			$longitude = $record['longitude'];
			$latitude = $record['latitude'];
			$height = $record['height'];
			$temperature = $record['temperature'];
			$datetime = $record['datetime'];
			
			// Wandle das Format des Zeitstempels um
			$datetime_exploded = explode(" ", $datetime);
			$date = explode("-", $datetime_exploded[0]);
			$time = explode(":", $datetime_exploded[1]);
			$year = $date[0];
			$month = $date[1];
			$day = $date[2];
			$hour = $time[0];
			$min = $time[1];
			$sec = $time[2];
			
			// Füge die Variablen in das Format der GPX-Zeilen ein
			$trkpt1 = "   <trkpt lat=\"$latitude\" lon=\"$longitude\">\n";
			$ele 	= "    <ele>$height</ele>\n";
			$time 	= "    <time>$year-$month-$day"."T$hour:$min:$sec.000Z</time>\n";
			$temp	= "    <temperature>$temperature</temperature>\n";
			$trkpt2 = "   </trkpt>\n";
			
			// Schreibe alles in ein Array
			$points[$count] = array('trkpt1' => $trkpt1, 'ele' => $ele, 'time' => $time, 'temp' => $temp, 'trkpt2' => $trkpt2);
			
			// Erhöhe Zähler
			$count++;
		}
		
		// Schreibe alle GPX-Zeilen	in eine Klassenvariable
		$this->gpxData = $points;
	}
	
	// Erzeugt eine vollständige GPX-XML-Datei
	public function writeToFile()
	{
		// Prüfe ob die GPX-Daten in der Klassenvariable vorliegen
		if (empty($this->gpxData))
			return;
	
		// Definiere das Roh-Gerüst der XML-Datei
		$head1 = '<?xml version="1.0" encoding="utf-8"?>' . "\n";
		$head2 = '<gpx version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">' . "\n";
		$head3 = ' <metadata>' . "\n";
		$head4 = '  <time>2013-07-25T10:54:47.000Z</time>' . "\n";
		$head5 = ' </metadata>' . "\n";
		$head6 = ' <trk>' . "\n";
		$head7 = '  <trkseg>' . "\n";
		$foot1 = '  </trkseg>' . "\n";
		$foot2 = ' </trk>' . "\n";
		$foot3 = '</gpx>' . "\n";
		
		// Füge alle Strings zusammen
		$xml = "";
		$xml .= $head1;
		$xml .= $head2;
		$xml .= $head3;
		$xml .= $head4;
		$xml .= $head5;
		$xml .= $head6;
		$xml .= $head7;
		
		// Iteriere über die GPX-Wegpunkte
		foreach ($this->gpxData as $gpx)
		{
			$xml .= $gpx['trkpt1'];
			$xml .= $gpx['ele'];
			$xml .= $gpx['time'];
			$xml .= $gpx['temp'];
			$xml .= $gpx['trkpt2'];
		}
		
		// Füge die letzten Strings darunter zusammen
		$xml .= $foot1;
		$xml .= $foot2;
		$xml .= $foot3;
	
		// Schreibe den String in eine Datei
		$fp = fopen("map/positions.gpx", "w");
		fputs($fp, $xml);
		fclose($fp);
	}

}

?>