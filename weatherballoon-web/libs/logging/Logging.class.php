<?php
require_once ("log4php/Logger.php");

/**
 * @author Patrick Vogt
 * @since 2013-04-01
 * @version 1.0
 */
class Logging {

	/**
	 * 
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
	 * 
	 * @param $name
	 * @return Ambigous <Logger, multitype:>
	 */
	public function getLogger($name) {
		return Logger::getLogger($name);
	}
	
	/**
	 * 
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerDatabaseConfig() {
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderPDO',
					'params' => array(
						'dsn' => 'mysql:host=localhost;dbname=dvd',
						'user' => '',
						'password' => '',
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
	 * 
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
						'to' => 'patrick.vogt@hs-augsburg.de',
						'from' => 'logger@webprogrammierung.hs-augsburg.de',
						'subject' => 'DVD-Verwaltung - Log messages',
					),
				),
			),
			'rootLogger' => array(
				'appenders' => array('default'),
			),
		);
	}
	
	/**
	 * 
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
	 * 
	 * @return multitype:multitype:multitype:string   multitype:multitype:string multitype:string
	 */
	private function loggerOutputConfig() {
		return array(
			'appenders' => array(
				'default' => array(
					'class' => 'LoggerAppenderEcho',
					'layout' => array(
						'class' => 'LoggerLayoutHTML',
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