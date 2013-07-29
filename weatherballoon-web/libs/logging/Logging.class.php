<?php
require_once "log4php/Logger.php";

//***********************************************
// Klasse: Logging
// Beschreibung: Implementiert Einstellungen fuer das
//		Logging-Framework log4php von Apache
// Autor: Patrick Vogt, am 30.07.2013
// MatrikelNr: 924789
//***********************************************
class Logging {
	
	/**
	 * Initialize the selected logger
	 * @param $type
	 */
	public function __construct($type) {
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
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderMail',
					'layout' => array(
						'class' => 'LoggerLayoutSimple',
					),
					'params' => array(
						'to' => LOG_EMAIL,
						'from' => 'logs@weatherballoon-web.de',
						'subject' => 'Log message from weatherballoon-web',
					),
				),
			),
			'rootLogger' => array(
				'appenders' => array('default'),
			),
		);
	}
	
	/**
	 * Configurate the logger to log into a file
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string  multitype:string boolean
	 */
	private function loggerFileConfig() {
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderFile',
					'layout' => array(
						'class' => 'LoggerLayoutSimple',
					),
					'params' => array(
						'file' => 'file.log',
						'append' => false
					),
				),
			),
			'rootLogger' => array(
				'appenders' => array('default'),
			),
		);
	}
	
	/**
	 * Configurate the logger to display the log messages
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerOutputConfig() {
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderEcho',
					'layout' => array(
						'class' => 'LoggerLayoutSimple',
					),
					'params' => array(
							'htmlLineBreaks' => 'true',
					),
				),
			),
			'rootLogger' => array(
				'appenders' => array('default'),
			),
		);
	}
}
?>