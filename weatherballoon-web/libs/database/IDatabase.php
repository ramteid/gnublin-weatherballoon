<?php
//***********************************************
// Interface: IDatabase
// Beschreibung: Definiert Methoden fuer die
//		Datenbankanbindung
// Autor: Patrick Vogt, am 30.07.2013
// MatrikelNr: 924789
//***********************************************
interface IDatabase {

	/**
	 * Open the database connection.
	 */
	public function open();
	
	/**
	 * Close the database connection.
	 */
	public function close();
	
	/**
	 * Returns the number of affected rows.
	 */
	public function getNumRows();
	
	/**
	 * Returns the result of a query
	 * @param PDO $constant
	 */
	public function getResult($constant);
	
	/**
	 * Execute the query.
	 * @param string $stmt
	 * @param multitype $params
	 */
	public function query($stmt, $params);
}
?>