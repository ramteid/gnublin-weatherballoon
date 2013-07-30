<?php
require_once "IDatabase.php";
require_once PATH_LIB . "/logging/Logging.class.php";

//***********************************************
// Klasse: MySQLDatabaseConnection
// Beschreibung: Implementiert die Methoden des Interface IDatabase
//		fuer die Datenbankanbindung
// Autor: Patrick Vogt, am 30.07.2013
// MatrikelNr: 924789
//***********************************************
class MySQLDatabaseConnection implements IDatabase {
	
	private $dns;
	private $username;
	private $password;
	private $identifier;
	private $stmt;
	private $activeTransaction;
	private $exec;
	private $logger;
	
	public function __construct($dns, $username, $password) {
		$this->dns = $dns;
		$this->username = $username;
		$this->password = $password;
		$this->identifier = null;
		$this->stmt = null;
		$this->activeTransaction = false;
		$this->exec = false;
		$log = new Logging("mail");
		$this->logger = $log->getLogger("main");
	}
	
	public function __destruct() {
		$this->close();
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::open()
	 */
	public function open() {
		try {
			$this->identifier = new PDO($this->dns, $this->username, $this->password);
			return true;
		} catch (PDOException $e) {
			$this->logger->fatal($e->getMessage());
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::close()
	 */
	public function close() {
		if (!is_null($this->identifier)) {
			$this->identifier = null;
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::getNumRows()
	 */
	public function getNumRows() {
		if ($this->exec && !is_null($this->stmt)) {
			return $this->stmt->rowCount();
		} else {
			$this->logger->error("Access on stmt=null: Unable to count affected rows.");
			return false;
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::getResult()
	 */
	public function getResult($constant = PDO::FETCH_ASSOC) {
		if ($this->exec && !is_null($this->stmt)) {
			return $this->stmt->fetchAll($constant);
		} else {
			$this->logger->error("Access on stmt=null: Unable to fetch the results.");
			return false;
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::query()
	 */
	public function query($stmt, $params = array()) {
		try {
			$this->identifier->beginTransaction();
			$this->activeTransaction = true;
			$this->stmt = $this->identifier->prepare($stmt);
			$this->exec = $this->stmt->execute($params);
			$this->identifier->commit();
			$this->activeTransaction = false;
			return $this->exec;
		} catch (PDOException $e) {
			try {
				if ($this->activeTransaction) {
					$this->identifier->rollBack();
				}
			} catch (PDOException $ex) {
				$this->stmt = null;
				$this->exec = false;
				$this->activeTransaction = false;
				$this->logger->fatal($ex->getMessage());
			}
			return false;
		}
	}
}
?>