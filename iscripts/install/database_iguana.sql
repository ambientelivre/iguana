-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.1.63-0ubuntu0.11.10.1


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema iguana
--

CREATE DATABASE IF NOT EXISTS iguana;
USE iguana;

--
-- Definition of table `iguana`.`iguana_config`
--

DROP TABLE IF EXISTS `iguana`.`iguana_config`;
CREATE TABLE  `iguana`.`iguana_config` (
  `language` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`iguana_translate`
--

DROP TABLE IF EXISTS `iguana`.`iguana_translate`;
CREATE TABLE  `iguana`.`iguana_translate` (
  `language` varchar(10) NOT NULL,
  `text` varchar(100) NOT NULL,
  `translate` varchar(100) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`joomla_dimen_clients`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_clients`;
CREATE TABLE  `iguana`.`joomla_dimen_clients` (
  `pk_id_clients` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`pk_id_clients`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 
-- Definition of table `iguana`.`joomla_dimen_banners`
-- 

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_banners`;
CREATE TABLE  `iguana`.`joomla_dimen_banners` (
  `pk_id_banners` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`pk_id_banners`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`joomla_dimen_article`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_article`;
CREATE TABLE  `iguana`.`joomla_dimen_article` (
  `pk_id_article` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `friendly_url` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_id_article`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `iguana`.`joomla_dimen_publication status`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_publication status`;
CREATE TABLE  `iguana`.`joomla_dimen_publication status` (
  `pk_id_publication_status` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`pk_id_publication_status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`joomla_dimen_section`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_section`;
CREATE TABLE  `iguana`.`joomla_dimen_section` (
  `pk_id_section` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `id_section` int(11) NOT NULL,
  `id_category` int(11) NOT NULL,
  PRIMARY KEY (`pk_id_section`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Definition of table `iguana`.`joomla_dimen_time`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_time`;
CREATE TABLE  `iguana`.`joomla_dimen_time` (
  `pk_time` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `quarter` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `date` date NOT NULL,
  `descmonth` varchar(3) NOT NULL,
  `week` int(11) NOT NULL,
  `descweek` varchar(30) NOT NULL,
  PRIMARY KEY (`pk_time`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`joomla_dimen_user`
--

DROP TABLE IF EXISTS `iguana`.`joomla_dimen_user`;
CREATE TABLE  `iguana`.`joomla_dimen_user` (
  `pk_id_user` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `login` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`pk_id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `iguana`.`joomla_dimen_user`
--

--
-- Definition of table `iguana`.`joomla_fact_article`
--

DROP TABLE IF EXISTS `iguana`.`joomla_fact_article`;
CREATE TABLE  `iguana`.`joomla_fact_article` (
  `sk_user` int(11) NOT NULL,
  `sk_section` int(11) NOT NULL,
  `sk_article` int(11) NOT NULL,
  `sk_time` int(11) NOT NULL,
  `sk_publication_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_account`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_account`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_account` (
  `pk_id_accounts` varchar(36) NOT NULL,
  `name` varchar(150) NOT NULL,
  `account_type` varchar(50) DEFAULT NULL,
  `employees` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`pk_id_accounts`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Dimension of Account';


--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_opportunity_type`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_opportunity_type`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_opportunity_type` (
  `pk_id_opportunity_type` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_sales_stage`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_sales_stage`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_sales_stage` (
  `pk_sales_stage` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`pk_sales_stage`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Sales Stage';


--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_status`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_status`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_status` (
  `pk_status` varchar(36) NOT NULL,
  `description` varchar(36) NOT NULL,
  PRIMARY KEY (`pk_status`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Dimension Status Calls';



--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_time`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_time`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_time` (
  `pk_time` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `quarter` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `date` date NOT NULL,
  `descmonth` varchar(3) NOT NULL,
  `week` int(11) NOT NULL,
  `descweek` varchar(30) NOT NULL,
  PRIMARY KEY (`pk_time`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;


--
-- Definition of table `iguana`.`sugarcrm_ce_dimen_user`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_dimen_user`;
CREATE TABLE  `iguana`.`sugarcrm_ce_dimen_user` (
  `pk_id_user` varchar(36) NOT NULL,
  `user_name` varchar(60) NOT NULL,
  `first_name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Users Sugar';


--
-- Definition of table `iguana`.`sugarcrm_ce_fact_calls`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_fact_calls`;
CREATE TABLE  `iguana`.`sugarcrm_ce_fact_calls` (
  `sk_date_start` int(11) NOT NULL,
  `sk_assigned_user_id` varchar(36) NOT NULL,
  `sk_status` varchar(36) NOT NULL,
  `sk_account_id` varchar(36) NOT NULL,
  `duration_hours` int(2) NOT NULL,
  `duration_minutes` int(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Table Fact SugarCRM Calls';

--
-- Definition of table `iguana`.`sugarcrm_ce_fact_opportunities`
--

DROP TABLE IF EXISTS `iguana`.`sugarcrm_ce_fact_opportunities`;
CREATE TABLE  `iguana`.`sugarcrm_ce_fact_opportunities` (
  `sk_opportunity_type` varchar(255) NOT NULL DEFAULT '',
  `sk_lead_source` varchar(50) NOT NULL DEFAULT '',
  `sk_sales_stage` varchar(255) NOT NULL DEFAULT '',
  `sk_assigned_user_id` varchar(36) NOT NULL,
  `sk_date_closed` int(11) NOT NULL,
  `sk_date_modified` int(11) NOT NULL,
  `sk_account_id` varchar(36) NOT NULL,
  `amount` double NOT NULL,
  `probability` double NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COMMENT='Table Fact Sugar Opportunities';

--
-- Dumping data for table `iguana`.`sugarcrm_ce_fact_opportunities`
--


/* Atualizações de Versao */

ALTER TABLE `iguana`.`sugarcrm_ce_dimen_account` ADD COLUMN `business` VARCHAR(50) NULL  AFTER `employees` ;






/*!40000 ALTER TABLE `sugarcrm_ce_fact_opportunities` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
