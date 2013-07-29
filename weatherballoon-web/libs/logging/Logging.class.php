<?php
require_once "log4php/Logger.php";
require_once PATH_LIB . "/database/MySQLDatabaseConnection.class.php";

//***********************************************
// Klasse: Logging
// Beschreibung: Implementiert Einstellungen fuer das
//		Logging-Framework log4php von Apache
// Autor: Patrick Vogt, am 30.07.2013
// MatrikelNr: 924789
//***********************************************
class Logging {

	/**
	 * Database object
	 * @var MySQLDatabaseConnection
	 */
	private $db;
	
	/**
	 * Initialize the selected logger and the connection to the database
	 * @param $type
	 */
	public function __construct($type) {
		$this->db = MySQLDatabaseConnection(DB_DNS, DB_USER, DB_PASSWORD);
		switch ($type) {
			case "database":
				Logger::configure($this->loggerDatabaseConfig());
				break;
			case "mail":
				Logger::configure($this->loggerMailConfig());
				break;
			case "file":
				Logger::configure($this->loggerFileConfig());
				break;
			case "output":
				Logger::configure($this->loggerOutputConfig());
				break;
			default:
		}
	}
	
	/**
	 * Returns a configurated logger
	 * @param $name
	 * @return Ambigous <Logger, multitype:>
	 */
	public function getLogger($name) {
		return Logger::getLogger($name);
	}
	
	/**
	 * Configurate the logger to log into a database
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerDatabaseConfig() {
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderPDO',
					'params' => array(
						'dsn' => DB_DNS,
						'user' => DB_USER,
						'password' => DB_PASSWORD,
						'table' => 'logging',
					),
				),
			),
			'rootLogger' => array(
				'appenders' => array('default'),
			),
		);
	}
	
	/**
	 * Configurate the logger to sends an email
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerMailConfig() {
		if ($this->db->open()) {
			$this->db->query("SELECT * FROM log_settings WHERE logger = :logger", array(":logger" => "mail"));
			$result = $this->db->getResult(PDO::FETCH_ASSOC);
			return array(
				'appenders' => array(
					'default' => array(
						'class' => 'LoggerAppenderMail',
						'layout' => array(
							'class' => $result[0]["layout"],
						),
						'params' => array(
							'to' => $result[0]["to"],
							'from' => $result[0]["from"],
							'subject' => $result[0]["subject"],
						),
					),
				),
				'rootLogger' => array(
					'appenders' => array('default'),
				),
			);
			$this->db->close();
		}
	}
	
	/**
	 * Configurate the logger to log into a file
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string  multitype:string boolean
	 */
	private function loggerFileConfig() {
		if ($this->db->open()) {
			$this->db->query("SELECT * FROM log_settings WHERE logger = :logger", array(":logger" => "file"));
			$result = $this->db->getResult(PDO::FETCH_ASSOC);
			return array(
				'appenders' => array(
					'default' => array(
						'class' => 'LoggerAppenderFile',
						'layout' => array(
							'class' => $result[0]["layout"],
						),
						'params' => array(
							'file' => $result[0]["file"],
							'append' => $result[0]["append"]
						),
					),
				),
				'rootLogger' => array(
					'appenders' => array('default'),
				),
			);
			$this->db->close();
		}
	}
	
	/**
	 * Configurate the logger to display the log messages
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerOutputConfig() {
		if ($this->db->open()) {
			$this->db->query("SELECT * FROM log_settings WHERE logger = :logger", array(":logger" => "output"));
			$result = $this->db->getResultl(PDO::FETCH_ASSOC);
			return array(
				'appenders' => array(
					'default' => array(
						'class' => 'LoggerAppenderEcho',
						'layout' => array(
							'class' => $result[0]["layout"],
						),
					),
				),
				'rootLogger' => array(
					'appenders' => array('default'),
				),
			);
			$this->db->close();
		}
	}
}
?>