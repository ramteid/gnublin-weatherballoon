-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 30. Jul 2013 um 20:19
-- Server Version: 5.5.31
-- PHP-Version: 5.4.4-14+deb7u2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `map`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `logging`
--

DROP TABLE IF EXISTS `logging`;
CREATE TABLE IF NOT EXISTS `logging` (
  `timestamp` datetime DEFAULT NULL,
  `logger` varchar(256) DEFAULT NULL,
  `level` varchar(32) DEFAULT NULL,
  `message` varchar(4000) DEFAULT NULL,
  `thread` int(11) DEFAULT NULL,
  `file` varchar(255) DEFAULT NULL,
  `line` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Daten für Tabelle `logging`
--

INSERT INTO `logging` (`timestamp`, `logger`, `level`, `message`, `thread`, `file`, `line`) VALUES
('2013-07-30 18:20:32', 'main', 'INFO', 'pv@email-address.de logged in.', 13068, '/var/www/index.php', '24'),
('2013-07-30 18:26:57', 'main', 'INFO', 'ds@email-address.de logged in.', 13068, '/var/www/index.php', '24'),
('2013-07-30 18:40:14', 'main', 'INFO', 'ds@email-address.de logged in.', 13065, '/var/www/index.php', '24'),
('2013-07-30 18:40:27', 'main', 'INFO', 'ds@email-address.de logged in.', 13071, '/var/www/index.php', '24'),
('2013-07-30 19:21:27', 'main', 'INFO', 'ds@email-address.de logged in.', 13094, '/var/www/index.php', '24'),
('2013-07-30 19:21:34', 'main', 'INFO', 'ds@email-address.de logged in.', 12781, '/var/www/index.php', '24'),
('2013-07-30 20:18:08', 'main', 'INFO', 'pv@email-address.de logged in.', 13195, '/var/www/index.php', '32'),
('2013-07-30 20:18:12', 'main', 'INFO', 'pv@email-address.de logged in.', 13195, '/var/www/index.php', '32');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `records`
--

DROP TABLE IF EXISTS `records`;
CREATE TABLE IF NOT EXISTS `records` (
  `id` int(32) NOT NULL AUTO_INCREMENT,
  `datetime` datetime NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `height` float NOT NULL,
  `temperature` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `records`
--

INSERT INTO `records` (`id`, `datetime`, `longitude`, `latitude`, `height`, `temperature`) VALUES
(1, '2013-08-02 07:59:59', 11.9245, 46.3568, 176, 10.05),
(2, '2013-08-02 08:59:59', 15.9245, 47.3568, 276, 20.05),
(3, '2013-08-02 11:59:59', 12.9245, 50.3568, 376, 30.05);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `sponsors`
--

DROP TABLE IF EXISTS `sponsors`;
CREATE TABLE IF NOT EXISTS `sponsors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `thanks` varchar(4000) NOT NULL,
  `link` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

--
-- Daten für Tabelle `sponsors`
--

INSERT INTO `sponsors` (`id`, `name`, `thanks`, `link`) VALUES
(9, 'Schweihofer Gartentechnik', 'Vielen Dank f&uuml;r die Helium-Flasche.', 'http://www.schweihofer-gartentechnik.de'),
(10, 'Embedded Projects', 'Vielen Dank f&uuml;r die technische Unterst&uuml;tzung und die &Uuml;bernahme der Kosten f&uuml;r den Wetterballon und den Fallschirm.', 'http://gnublin.embedded-projects.net'),
(11, 'Joma', 'Vielen Dank f&uuml;r das Neopor.', 'http://www.joma.de'),
(12, 'Fendt Caravan GmbH', 'Vielen Dank f&uuml;r den Klebstoff, mit dem wir die Transportbox gebaut haben.', 'http://www.fendt-caravan.com'),
(15, 'Prof. Dr. Hubert H&ouml;gl', 'Vielen Dank an Herrn H&ouml;gl f&uuml;r die Betreuung w&auml;hrend unserer Projektarbeit.', '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `surname`) VALUES
(1, 'pv@email-address.de', 'effaa50d1f666482d29f7e342790086b', 'A', 'AA'),
(2, 'ds@email-address.de', '74faae67252bb78ac06736463e5d4d64', 'B', 'BB'),
(3, 'am@email-address.de', 'd450c5dbcc10db0749277efc32f15f9f', 'C', 'CC');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
