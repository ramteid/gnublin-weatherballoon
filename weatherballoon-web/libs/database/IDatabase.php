<?php
/**
 * @author Patrick Vogt
 * @since 2013-04-01
 * @version 1.0
 */
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
	 * 
	 * @param PDO $constant
	 */
	public function getResult($constant);
	
	/**
	 * 
	 * @param multitype $params
	 */
	public function bind($params);
	
	/**
	 * Execute the query.
	 * @param string $stmt
	 * @param multitype $params
	 */
	public function query($stmt, $params);
}
?>