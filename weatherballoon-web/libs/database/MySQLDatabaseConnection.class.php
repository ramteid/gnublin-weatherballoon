<?php
require_once "IDatabase.php";
require_once PATH_LIB . "/logging/Logging.class.php";

/**
 * @author Patrick Vogt
 * @since 2013-02-17
 * @version 1.0
 */
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
	public function getResult($constant) {
		if ($this->exec && !is_null($this->stmt)) {
			return $this->stmt->fetchAll($constant);
		} else {
			$this->logger->error("Access on stmt=null: Unable to fetch the results.");
			return false;
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::bind()
	 */
	public function bind($params) {
		try {
			if (!is_null($this->stmt)) {
				foreach ($params as $parameter => $variable) {
					$this->stmt->bindParam($parameter, $variable);
				}
			} else {
				throw new PDOException("Access on stmt=null: Unable to bind parameters.");
			}
		} catch (PDOException $e) {
			$this->logger->error($e->getMessage());
		}
	}
	
	/**
	 * (non-PHPdoc)
	 * @see IDatabase::query()
	 */
	public function query($stmt, $params) {
		try {
			$this->identifier->beginTransaction();
			$this->activeTransaction = true;
			$this->stmt = $this->identifier->prepare($stmt);
			if (is_array($params) && count($params) != 0) {
				$this->bind($params);
			}
			$this->exec = $this->stmt->execute();
			$this->identifier->commit();
			$this->activeTransaction = false;
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
		}
	}
}
?>