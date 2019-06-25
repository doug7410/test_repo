# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: medaffectaurora-cluster.cluster-cpnqs7kp9sk2.us-east-1.rds.amazonaws.com (MySQL 5.6.10)
# Database: drugpricing
# Generation Time: 2019-06-17 18:45:18 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table blink_pricing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `blink_pricing`;

CREATE TABLE `blink_pricing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `website` varchar(100) DEFAULT NULL,
  `POTENTIS_GSN` varchar(50) DEFAULT NULL,
  `GSN` varchar(50) DEFAULT NULL,
  `GCN` varchar(50) DEFAULT NULL,
  `GCN2` varchar(50) DEFAULT NULL,
  `DrugName` varchar(200) DEFAULT NULL,
  `DrugBrandGenericFlag` varchar(10) DEFAULT NULL,
  `pharmacy` varchar(200) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `hash` varchar(180) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `blink_name` varchar(200) DEFAULT NULL,
  `blink_qty` int(200) DEFAULT NULL,
  `blink_form` varchar(50) DEFAULT NULL,
  `blink_dosage` varchar(200) DEFAULT NULL,
  `blink_gb` varchar(180) DEFAULT NULL,
  `potentis_qty` float DEFAULT NULL,
  `potentis_form` varchar(10) DEFAULT NULL,
  `potentis_dosage` varchar(10) DEFAULT NULL,
  `DrugNDC` varchar(50) DEFAULT NULL,
  `NDC` varchar(50) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
