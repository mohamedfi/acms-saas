-- MySQL dump 10.13  Distrib 5.7.39, for osx11.0 (x86_64)
--
-- Host: 127.0.0.1    Database: pmec2
-- ------------------------------------------------------
-- Server version	5.7.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('bank','cash','credit','investment','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `opening_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `current_balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_account_number_unique` (`account_number`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'Main Business Account','1234-5678-9012-3456','bank',50000.00,56520.00,'USD','Primary business checking account for daily operations',1,'2025-08-24 13:38:47','2025-08-24 14:32:04'),(2,'Petty Cash',NULL,'cash',1000.00,1000.00,'USD','Cash on hand for small expenses and emergencies',1,'2025-08-24 13:38:48','2025-08-24 13:38:48'),(3,'Business Credit Card','9876-5432-1098-7654','credit',0.00,0.00,'USD','Corporate credit card for business expenses',1,'2025-08-24 13:38:48','2025-08-24 13:38:48'),(4,'Investment Portfolio',NULL,'investment',25000.00,25000.00,'USD','Long-term investment account for business growth',1,'2025-08-24 13:38:48','2025-08-24 13:38:48'),(5,'Savings Account','1111-2222-3333-4444','bank',15000.00,15000.00,'USD','High-yield savings account for emergency funds',1,'2025-08-24 13:38:48','2025-08-24 13:38:48');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_course_finances`
--

DROP TABLE IF EXISTS `archived_course_finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `archived_course_finances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `archived_course_id` bigint(20) unsigned NOT NULL,
  `expense_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EGP',
  `description` text COLLATE utf8mb4_unicode_ci,
  `approved_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archived_course_finances_archived_course_id_foreign` (`archived_course_id`),
  CONSTRAINT `archived_course_finances_archived_course_id_foreign` FOREIGN KEY (`archived_course_id`) REFERENCES `archived_courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_course_finances`
--

LOCK TABLES `archived_course_finances` WRITE;
/*!40000 ALTER TABLE `archived_course_finances` DISABLE KEYS */;
/*!40000 ALTER TABLE `archived_course_finances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_course_participants`
--

DROP TABLE IF EXISTS `archived_course_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `archived_course_participants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `archived_course_id` bigint(20) unsigned NOT NULL,
  `participant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendance_status` enum('present','absent','late') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'present',
  `evaluation_score` decimal(5,2) DEFAULT NULL,
  `evaluation_feedback` text COLLATE utf8mb4_unicode_ci,
  `certificate_issued` tinyint(1) NOT NULL DEFAULT '0',
  `certificate_issue_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archived_course_participants_archived_course_id_foreign` (`archived_course_id`),
  CONSTRAINT `archived_course_participants_archived_course_id_foreign` FOREIGN KEY (`archived_course_id`) REFERENCES `archived_courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_course_participants`
--

LOCK TABLES `archived_course_participants` WRITE;
/*!40000 ALTER TABLE `archived_course_participants` DISABLE KEYS */;
INSERT INTO `archived_course_participants` VALUES (1,1,'Amany El Ganzoury','amany@ag-accessories.com','01002004156',NULL,'Algerian','55555','present',NULL,NULL,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(2,1,'John Smith 111144','john.smith@example.com',NULL,NULL,NULL,NULL,'present',NULL,NULL,0,NULL,'2025-08-21 14:52:30','2025-08-21 14:52:30'),(3,1,'Sarah Johnson','sarah.johnson@example.com',NULL,NULL,NULL,NULL,'present',NULL,NULL,0,NULL,'2025-08-21 14:52:30','2025-08-21 14:52:30');
/*!40000 ALTER TABLE `archived_course_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_course_section_files`
--

DROP TABLE IF EXISTS `archived_course_section_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `archived_course_section_files` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `archived_course_section_id` bigint(20) unsigned NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int(11) NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `uploaded_by` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archived_course_section_files_archived_course_section_id_foreign` (`archived_course_section_id`),
  CONSTRAINT `archived_course_section_files_archived_course_section_id_foreign` FOREIGN KEY (`archived_course_section_id`) REFERENCES `archived_course_sections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_course_section_files`
--

LOCK TABLES `archived_course_section_files` WRITE;
/*!40000 ALTER TABLE `archived_course_section_files` DISABLE KEYS */;
INSERT INTO `archived_course_section_files` VALUES (1,13,'portfolio-1.jpg','archived_course_sections/13/BT9mTMaE78bLCRABs7fhxRL7Wplg9ictIxTat9B8.jpg','image/jpeg',25343,NULL,'Admin User','2025-08-20 16:02:23','2025-08-20 16:02:23'),(3,13,'portfolio-8.jpg','archived_course_sections/13/mZwqJaxDs3msoMGW0kBgFYTtlkzd5Jnu0LpKmjd8.jpg','image/jpeg',29790,NULL,'Admin User','2025-08-20 16:19:16','2025-08-20 16:19:16'),(4,13,'portfolio-7.jpg','archived_course_sections/13/Vb2JabVBLGUBLtSzxhd8rQVzpBKoxq3GuOmr1cPJ.jpg','image/jpeg',96574,NULL,'Admin User','2025-08-20 16:19:16','2025-08-20 16:19:16'),(5,13,'portfolio-6.jpg','archived_course_sections/13/W1RElfTNkfAmtxR1k3d5o0evThfU87gkzQ0gVHhI.jpg','image/jpeg',21797,NULL,'Admin User','2025-08-20 16:19:16','2025-08-20 16:19:16'),(6,13,'portfolio-5.jpg','archived_course_sections/13/yo2u8GvxVHyTjyGkUTR41qiuABDrGz8wca8jmktT.jpg','image/jpeg',21473,NULL,'Admin User','2025-08-20 16:19:16','2025-08-20 16:19:16');
/*!40000 ALTER TABLE `archived_course_section_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_course_sections`
--

DROP TABLE IF EXISTS `archived_course_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `archived_course_sections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `archived_course_id` bigint(20) unsigned DEFAULT NULL,
  `section_name_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_name_ar` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int(11) NOT NULL,
  `is_required` tinyint(1) NOT NULL DEFAULT '1',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `completion_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `archived_course_sections_archived_course_id_foreign` (`archived_course_id`),
  CONSTRAINT `archived_course_sections_archived_course_id_foreign` FOREIGN KEY (`archived_course_id`) REFERENCES `archived_courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_course_sections`
--

LOCK TABLES `archived_course_sections` WRITE;
/*!40000 ALTER TABLE `archived_course_sections` DISABLE KEYS */;
INSERT INTO `archived_course_sections` VALUES (1,NULL,'Passports','باسبورات','File upload','Upload scanned passport copies of participants',1,1,0,NULL,NULL,NULL),(2,NULL,'Course Material','مادة علمية','File upload','PDFs, PPTs, Word documents, etc.',2,1,0,NULL,NULL,NULL),(3,NULL,'Evaluations','تقييمات','Survey/Upload','Forms or documents with participant feedback',3,1,0,NULL,NULL,NULL),(4,NULL,'Attendance','حضور','Integrated table','Integrated with attendance sheet (checkbox/QR/manual input)',4,1,0,NULL,NULL,NULL),(5,NULL,'Participants Data','بيانات المشاركين','Form/table','Name, job title, phone, email, etc.',5,1,0,NULL,NULL,NULL),(6,NULL,'Photos','صور','Gallery upload','Upload session photos with captions',6,0,0,NULL,NULL,NULL),(7,NULL,'Certificates','شهادات','Auto-generated/upload','Upload or auto-generate with template & participant names',7,1,0,NULL,NULL,NULL),(8,NULL,'Official Letters','خطابات الاسناد والموافقة','File upload','Upload ministry/entity approval letters',8,1,0,NULL,NULL,NULL),(9,NULL,'Trainer CV','السيرة الذاتية للمدرب','File upload','Upload CV or trainer profile document',9,1,0,NULL,NULL,NULL),(10,NULL,'Report','التقرير','Upload or generate','End-of-course summary report, trainer notes, etc.',10,1,0,NULL,NULL,NULL),(11,NULL,'Finance','المالية','Input/table','Trainer fees, travel, printing, per diem, etc.',11,1,0,NULL,NULL,NULL),(12,NULL,'Thank You Notes','كلمات شكر','Upload','Scanned letters from clients/trainees',12,0,0,NULL,NULL,NULL),(13,1,'Passports','باسبورات','File upload','Upload scanned passport copies of participants',1,1,1,'Completed successfully','2025-08-14 16:00:47','2025-08-15 17:07:33'),(14,1,'Course Material','مادة علمية','File upload','PDFs, PPTs, Word documents, etc.',2,1,1,'Completed successfully','2025-08-14 16:00:47','2025-08-15 17:07:33'),(15,1,'Evaluations','تقييمات','Survey/Upload','Forms or documents with participant feedback',3,1,0,'Pending completion','2025-08-14 16:00:47','2025-08-15 17:07:33'),(16,1,'Attendance','حضور','Integrated table','Integrated with attendance sheet (checkbox/QR/manual input)',4,1,1,'Completed successfully','2025-08-14 16:00:47','2025-08-15 17:07:33'),(17,1,'Participants Data','بيانات المشاركين','Form/table','Name, job title, phone, email, etc.',5,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(18,1,'Photos','صور','Gallery upload','Upload session photos with captions',6,0,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(19,1,'Certificates','شهادات','Auto-generated/upload','Upload or auto-generate with template & participant names',7,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(20,1,'Official Letters','خطابات الاسناد والموافقة','File upload','Upload ministry/entity approval letters',8,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(21,1,'Trainer CV','السيرة الذاتية للمدرب','File upload','Upload CV or trainer profile document',9,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(22,1,'Report','التقرير','Upload or generate','End-of-course summary report, trainer notes, etc.',10,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(23,1,'Finance','المالية','Input/table','Trainer fees, travel, printing, per diem, etc.',11,1,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(24,1,'Thank You Notes','كلمات شكر','Upload','Scanned letters from clients/trainees',12,0,0,NULL,'2025-08-14 16:00:47','2025-08-14 16:00:47'),(25,1,'Pre-Course Survey','استطلاع ما قبل الدورة','Survey/Upload','Survey completed by participants before the course starts',13,1,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(26,1,'Post-Course Survey','استطلاع ما بعد الدورة','Survey/Upload','Survey completed by participants after the course ends',14,1,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(27,1,'Training Materials','المواد التدريبية','File upload','All training materials, handouts, and resources used',15,1,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(28,1,'Assessment Results','نتائج التقييم','Form/table','Detailed assessment results and scores for all participants',16,1,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(29,1,'Venue Details','تفاصيل المكان','Form/table','Venue information, facilities, and setup details',17,0,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(30,1,'Equipment List','قائمة المعدات','Form/table','List of equipment and materials used during the course',18,0,0,NULL,'2025-08-15 17:07:32','2025-08-15 17:07:32'),(31,1,'Feedback Forms','نماذج التقييم','File upload','All feedback forms and participant comments',19,1,0,NULL,'2025-08-15 17:07:33','2025-08-15 17:07:33'),(32,1,'Action Items','بنود العمل','Form/table','Follow-up actions and next steps identified during the course',20,0,0,NULL,'2025-08-15 17:07:33','2025-08-15 17:07:33'),(33,2,'Passports','باسبورات','File upload','Upload scanned passport copies of participants',1,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(34,2,'Course Material','مادة علمية','File upload','PDFs, PPTs, Word documents, etc.',2,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(35,2,'Evaluations','تقييمات','Survey/Upload','Forms or documents with participant feedback',3,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(36,2,'Attendance','حضور','Integrated table','Integrated with attendance sheet (checkbox/QR/manual input)',4,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(37,2,'Participants Data','بيانات المشاركين','Form/table','Name, job title, phone, email, etc.',5,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(38,2,'Photos','صور','Gallery upload','Upload session photos with captions',6,0,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(39,2,'Certificates','شهادات','Auto-generated/upload','Upload or auto-generate with template & participant names',7,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(40,2,'Official Letters','خطابات الاسناد والموافقة','File upload','Upload ministry/entity approval letters',8,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(41,2,'Trainer CV','السيرة الذاتية للمدرب','File upload','Upload CV or trainer profile document',9,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(42,2,'Report','التقرير','Upload or generate','End-of-course summary report, trainer notes, etc.',10,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(43,2,'Finance','المالية','Input/table','Trainer fees, travel, printing, per diem, etc.',11,1,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20'),(44,2,'Thank You Notes','كلمات شكر','Upload','Scanned letters from clients/trainees',12,0,0,NULL,'2025-08-28 06:18:20','2025-08-28 06:18:20');
/*!40000 ALTER TABLE `archived_course_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `archived_courses`
--

DROP TABLE IF EXISTS `archived_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `archived_courses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `trainer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coordinator_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `duration_hours` int(11) NOT NULL,
  `delivery_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_participants` int(11) NOT NULL,
  `successful_participants` int(11) NOT NULL,
  `completion_rate` decimal(5,2) NOT NULL,
  `trainer_notes` text COLLATE utf8mb4_unicode_ci,
  `coordinator_notes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'archived',
  `archived_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `archived_courses`
--

LOCK TABLES `archived_courses` WRITE;
/*!40000 ALTER TABLE `archived_courses` DISABLE KEYS */;
INSERT INTO `archived_courses` VALUES (1,'pmo1','PMO001','test','Admin User','Admin User','2025-08-14','2025-08-14',0,'office','Cairo, Egypt',1,0,0.00,NULL,NULL,'archived','2025-08-14','2025-08-14 16:00:47','2025-08-14 16:00:47'),(2,'PMP','PMP001','Pmp Course','Unknown Trainer','Unknown Coordinator','2025-08-28','2025-08-28',0,'office','Cairo, Egypt',0,0,0.00,NULL,NULL,'archived','2025-08-28','2025-08-28 06:18:20','2025-08-28 06:18:20');
/*!40000 ALTER TABLE `archived_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_categories`
--

DROP TABLE IF EXISTS `asset_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '?',
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_categories_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_categories`
--

LOCK TABLES `asset_categories` WRITE;
/*!40000 ALTER TABLE `asset_categories` DISABLE KEYS */;
INSERT INTO `asset_categories` VALUES (1,'Media & Books','CDs, DVDs, books, training materials, and digital assets','?','blue',1,1,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(2,'Furniture & Equipment','Chairs, tables, desks, storage units, and office furniture','?','green',1,2,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(3,'Electronics & IT','Computers, laptops, monitors, projectors, and IT equipment','?','purple',1,3,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(4,'HVAC & Facilities','Air conditioners, heating systems, and facility equipment','❄️','cyan',1,4,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(5,'Transportation','Vehicles, maintenance tools, and transport equipment','?','orange',1,5,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(6,'Kitchen & Catering','Kitchen equipment, serving tools, and catering supplies','?️','red',1,6,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(7,'Training & Presentation','Training materials, presentation equipment, and learning tools','?','indigo',1,7,'2025-08-24 04:50:02','2025-08-24 04:50:02'),(8,'Office Supplies','Stationery, office supplies, and consumables','?','gray',1,8,'2025-08-24 04:50:02','2025-08-24 04:50:02');
/*!40000 ALTER TABLE `asset_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_locations`
--

DROP TABLE IF EXISTS `asset_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_locations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `building` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `asset_locations_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_locations`
--

LOCK TABLES `asset_locations` WRITE;
/*!40000 ALTER TABLE `asset_locations` DISABLE KEYS */;
INSERT INTO `asset_locations` VALUES (1,'Main Office','Primary office building and headquarters','Main Building','Ground Floor',NULL,'Office Area',1,1,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(2,'Training Center','Main training and conference facility','Training Building','1st Floor',NULL,'Conference Halls',1,2,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(3,'Computer Lab','IT training and computer laboratory','Training Building','2nd Floor',NULL,'Computer Lab',1,3,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(4,'Kitchen & Dining','Catering kitchen and dining facilities','Main Building','Ground Floor',NULL,'Kitchen Area',1,4,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(5,'Storage Room A','General storage and supplies','Main Building','Basement',NULL,'Storage',1,5,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(6,'Storage Room B','Equipment and furniture storage','Main Building','Basement',NULL,'Storage',1,6,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(7,'Maintenance Workshop','Equipment maintenance and repair area','Service Building','Ground Floor',NULL,'Workshop',1,7,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(8,'Parking Garage','Vehicle parking and storage','Parking Structure','All Levels',NULL,'Parking',1,8,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(9,'Reception Area','Main reception and waiting area','Main Building','Ground Floor',NULL,'Reception',1,9,'2025-08-24 04:50:13','2025-08-24 04:50:13'),(10,'Executive Office','Executive and management offices','Main Building','1st Floor',NULL,'Executive Suite',1,10,'2025-08-24 04:50:13','2025-08-24 04:50:13');
/*!40000 ALTER TABLE `asset_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `asset_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category_id` bigint(20) unsigned NOT NULL,
  `location_id` bigint(20) unsigned NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `condition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'good',
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `supplier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_expiry` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('available','in_use','maintenance','retired','lost') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `assigned_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `qr_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `images` json DEFAULT NULL,
  `last_maintenance` date DEFAULT NULL,
  `next_maintenance` date DEFAULT NULL,
  `maintenance_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assets_asset_code_unique` (`asset_code`),
  KEY `assets_category_id_status_index` (`category_id`,`status`),
  KEY `assets_location_id_status_index` (`location_id`,`status`),
  KEY `assets_asset_code_index` (`asset_code`),
  CONSTRAINT `assets_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `asset_categories` (`id`),
  CONSTRAINT `assets_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `asset_locations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (1,'AST20250001','Laptop',NULL,3,1,'Toshiba','T5023','454443333','good',5000.00,'2024-12-20',NULL,NULL,'in_use',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-08-24 05:38:41','2025-08-24 05:38:41');
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attachments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `attachable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attachable_id` bigint(20) unsigned NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size_kb` int(11) NOT NULL,
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `visibility` enum('private','internal','public') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'private',
  `tags` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_uploaded_by_foreign` (`uploaded_by`),
  KEY `attachments_attachable_type_attachable_id_index` (`attachable_type`,`attachable_id`),
  CONSTRAINT `attachments_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance_records` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `participant_id` bigint(20) unsigned NOT NULL,
  `status` enum('present','absent','late') COLLATE utf8mb4_unicode_ci NOT NULL,
  `occurred_at` datetime NOT NULL,
  `method` enum('qr','manual') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `geo` json DEFAULT NULL,
  `photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_records_course_instance_id_foreign` (`course_instance_id`),
  KEY `attendance_records_participant_id_foreign` (`participant_id`),
  CONSTRAINT `attendance_records_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_participant_id_foreign` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
INSERT INTO `attendance_records` VALUES (1,1,1,'present','2025-08-21 17:03:12','qr',NULL,NULL,'2025-08-21 14:03:12','2025-08-21 14:03:12'),(2,1,2,'present','2025-08-21 17:40:23','qr',NULL,NULL,'2025-08-21 14:40:23','2025-08-21 14:40:23');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `period` enum('monthly','quarterly','yearly') COLLATE utf8mb4_unicode_ci NOT NULL,
  `fiscal_year` year(4) NOT NULL,
  `period_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint(20) unsigned DEFAULT NULL,
  `budgeted_amount` decimal(15,2) NOT NULL,
  `actual_amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `variance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `variance_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `budgets_fiscal_year_period_index` (`fiscal_year`,`period`),
  KEY `budgets_category_id_fiscal_year_period_period_name_index` (`category_id`,`fiscal_year`,`period`,`period_name`),
  CONSTRAINT `budgets_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `financial_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_dietary_requirements`
--

DROP TABLE IF EXISTS `catering_dietary_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_dietary_requirements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catering_service_id` bigint(20) unsigned NOT NULL,
  `dietary_requirement_id` bigint(20) unsigned NOT NULL,
  `is_compatible` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catering_dietary_requirements_catering_service_id_foreign` (`catering_service_id`),
  KEY `catering_dietary_requirements_dietary_requirement_id_foreign` (`dietary_requirement_id`),
  CONSTRAINT `catering_dietary_requirements_catering_service_id_foreign` FOREIGN KEY (`catering_service_id`) REFERENCES `catering_services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catering_dietary_requirements_dietary_requirement_id_foreign` FOREIGN KEY (`dietary_requirement_id`) REFERENCES `dietary_requirements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_dietary_requirements`
--

LOCK TABLES `catering_dietary_requirements` WRITE;
/*!40000 ALTER TABLE `catering_dietary_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_dietary_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_order_items`
--

DROP TABLE IF EXISTS `catering_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catering_order_id` bigint(20) unsigned NOT NULL,
  `catering_service_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(8,2) NOT NULL,
  `total_price` decimal(8,2) NOT NULL,
  `special_notes` text COLLATE utf8mb4_unicode_ci,
  `dietary_modifications` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `catering_order_items_catering_order_id_foreign` (`catering_order_id`),
  KEY `catering_order_items_catering_service_id_foreign` (`catering_service_id`),
  CONSTRAINT `catering_order_items_catering_order_id_foreign` FOREIGN KEY (`catering_order_id`) REFERENCES `catering_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catering_order_items_catering_service_id_foreign` FOREIGN KEY (`catering_service_id`) REFERENCES `catering_services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_order_items`
--

LOCK TABLES `catering_order_items` WRITE;
/*!40000 ALTER TABLE `catering_order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_orders`
--

DROP TABLE IF EXISTS `catering_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_id` bigint(20) unsigned DEFAULT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `event_date` date NOT NULL,
  `event_time` time NOT NULL,
  `expected_attendees` int(11) NOT NULL,
  `confirmed_attendees` int(11) NOT NULL DEFAULT '0',
  `status` enum('pending','confirmed','in_preparation','ready','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `delivery_type` enum('pickup','delivery','on_site') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'delivery',
  `delivery_address` text COLLATE utf8mb4_unicode_ci,
  `special_instructions` text COLLATE utf8mb4_unicode_ci,
  `total_amount` decimal(10,2) NOT NULL,
  `tax_amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `final_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_date` timestamp NULL DEFAULT NULL,
  `ordered_by` bigint(20) unsigned NOT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `cancellation_reason` text COLLATE utf8mb4_unicode_ci,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `catering_orders_order_number_unique` (`order_number`),
  KEY `catering_orders_course_id_foreign` (`course_id`),
  KEY `catering_orders_ordered_by_foreign` (`ordered_by`),
  KEY `catering_orders_approved_by_foreign` (`approved_by`),
  CONSTRAINT `catering_orders_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `catering_orders_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `archived_courses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `catering_orders_ordered_by_foreign` FOREIGN KEY (`ordered_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_orders`
--

LOCK TABLES `catering_orders` WRITE;
/*!40000 ALTER TABLE `catering_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_roles`
--

DROP TABLE IF EXISTS `catering_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hierarchy_level` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `required_skills` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `catering_roles_name_unique` (`name`),
  UNIQUE KEY `catering_roles_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_roles`
--

LOCK TABLES `catering_roles` WRITE;
/*!40000 ALTER TABLE `catering_roles` DISABLE KEYS */;
INSERT INTO `catering_roles` VALUES (1,'Executive Chef','executive_chef','Head chef responsible for menu planning, kitchen management, and overall culinary direction','?‍?',1,1,'[\"Culinary Arts\", \"Kitchen Management\", \"Menu Planning\", \"Food Safety\", \"Leadership\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(2,'Sous Chef','sous_chef','Second-in-command chef who assists the executive chef and manages kitchen operations','?‍?',2,1,'[\"Culinary Arts\", \"Kitchen Operations\", \"Food Preparation\", \"Team Management\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(3,'Chef de Partie','chef_de_partie','Station chef responsible for a specific area of the kitchen','?',3,1,'[\"Culinary Arts\", \"Station Management\", \"Food Preparation\", \"Quality Control\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(4,'Prep Cook','prep_cook','Prepares ingredients and assists with basic food preparation','?',4,1,'[\"Food Preparation\", \"Knife Skills\", \"Food Safety\", \"Kitchen Hygiene\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(5,'Head Server','head_server','Lead server who coordinates service and manages the dining experience','?️',3,1,'[\"Customer Service\", \"Service Coordination\", \"Wine Knowledge\", \"Leadership\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(6,'Server','server','Provides table service and ensures guest satisfaction','?',4,1,'[\"Customer Service\", \"Food Service\", \"Communication\", \"Attention to Detail\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(7,'Kitchen Helper','kitchen_helper','Assists with basic kitchen tasks and maintains cleanliness','?',5,1,'[\"Kitchen Hygiene\", \"Basic Food Safety\", \"Teamwork\", \"Reliability\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(8,'Bartender','bartender','Prepares and serves beverages, manages bar operations','?',4,1,'[\"Mixology\", \"Customer Service\", \"Inventory Management\", \"Food Safety\"]','2025-08-22 17:02:51','2025-08-22 17:02:51'),(9,'Dishwasher','dishwasher','Maintains kitchen cleanliness and washes dishes','?',6,1,'[\"Kitchen Hygiene\", \"Equipment Operation\", \"Teamwork\", \"Reliability\"]','2025-08-22 17:02:51','2025-08-22 17:02:51');
/*!40000 ALTER TABLE `catering_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_service_dietary_requirements`
--

DROP TABLE IF EXISTS `catering_service_dietary_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_service_dietary_requirements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catering_service_id` bigint(20) unsigned NOT NULL,
  `dietary_requirement_id` bigint(20) unsigned NOT NULL,
  `is_compatible` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_service_dietary_requirements`
--

LOCK TABLES `catering_service_dietary_requirements` WRITE;
/*!40000 ALTER TABLE `catering_service_dietary_requirements` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_service_dietary_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_service_employees`
--

DROP TABLE IF EXISTS `catering_service_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_service_employees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `catering_service_id` bigint(20) unsigned NOT NULL,
  `employee_id` bigint(20) unsigned NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'chef',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `catering_emp_unique` (`catering_service_id`,`employee_id`,`role`),
  KEY `catering_service_employees_employee_id_foreign` (`employee_id`),
  CONSTRAINT `catering_service_employees_catering_service_id_foreign` FOREIGN KEY (`catering_service_id`) REFERENCES `catering_services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `catering_service_employees_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_service_employees`
--

LOCK TABLES `catering_service_employees` WRITE;
/*!40000 ALTER TABLE `catering_service_employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `catering_service_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catering_services`
--

DROP TABLE IF EXISTS `catering_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catering_services` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('breakfast','lunch','dinner','snack','beverage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_person` decimal(8,2) NOT NULL,
  `cuisine_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_vegetarian` tinyint(1) NOT NULL DEFAULT '0',
  `is_vegan` tinyint(1) NOT NULL DEFAULT '0',
  `is_halal` tinyint(1) NOT NULL DEFAULT '0',
  `is_gluten_free` tinyint(1) NOT NULL DEFAULT '0',
  `preparation_time_minutes` int(11) NOT NULL DEFAULT '30',
  `serving_temperature` int(11) DEFAULT NULL,
  `allergen_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `nutritional_info` text COLLATE utf8mb4_unicode_ci,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catering_services`
--

LOCK TABLES `catering_services` WRITE;
/*!40000 ALTER TABLE `catering_services` DISABLE KEYS */;
INSERT INTO `catering_services` VALUES (1,'Continental Breakfast MMM','Light breakfast with pastries, fruits, and coffee/tea','breakfast',12.50,'International',1,0,1,0,20,65,'Contains gluten, dairy, eggs','Croissants, muffins, fresh fruits, coffee, tea, juice','Calories: 300-400, Protein: 8g, Carbs: 45g, Fat: 15g',1,NULL,'2025-08-22 14:54:59','2025-08-23 08:26:39'),(2,'Mediterranean Lunch','Healthy Mediterranean-style lunch with grilled chicken, quinoa, and vegetables','lunch',18.75,'Mediterranean',0,0,1,1,45,70,'Contains dairy','Grilled chicken, quinoa, cherry tomatoes, cucumber, olives, feta cheese, olive oil','Calories: 450-550, Protein: 35g, Carbs: 40g, Fat: 20g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(3,'Vegan Buddha Bowl','Nutritious vegan bowl with roasted vegetables, chickpeas, and tahini dressing','lunch',16.50,'Plant-Based',1,1,1,1,40,65,'Contains sesame (tahini)','Quinoa, roasted sweet potato, chickpeas, kale, avocado, tahini dressing','Calories: 400-500, Protein: 15g, Carbs: 55g, Fat: 18g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(4,'Arabic Dinner','Traditional Arabic dinner with lamb, rice, and mezze','dinner',24.00,'Arabic',0,0,1,0,60,75,'Contains gluten, dairy','Lamb shawarma, basmati rice, hummus, tabbouleh, pita bread, yogurt sauce','Calories: 600-700, Protein: 40g, Carbs: 65g, Fat: 25g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(5,'Fresh Fruit Platter','Assorted fresh seasonal fruits with yogurt dip','snack',8.25,'International',1,0,1,1,15,5,'Contains dairy','Seasonal fruits, Greek yogurt, honey, mint','Calories: 150-200, Protein: 5g, Carbs: 30g, Fat: 2g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(6,'Artisan Coffee Service','Premium coffee and tea service with pastries','beverage',6.50,'International',1,0,1,0,10,85,'Contains gluten, dairy','Premium coffee beans, loose leaf tea, milk alternatives, sugar, pastries','Calories: 100-150, Protein: 2g, Carbs: 20g, Fat: 4g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(7,'Gluten-Free Pasta Bar','Build-your-own pasta with gluten-free options and fresh sauces','lunch',19.50,'Italian',1,0,1,1,30,70,'Contains dairy, eggs','Gluten-free pasta, tomato sauce, pesto, alfredo, vegetables, parmesan','Calories: 500-600, Protein: 20g, Carbs: 70g, Fat: 18g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59'),(8,'Middle Eastern Mezze','Assorted Middle Eastern appetizers and dips','snack',14.75,'Middle Eastern',1,1,1,0,25,65,'Contains gluten, sesame','Hummus, baba ganoush, falafel, tabbouleh, pita bread, olives','Calories: 300-400, Protein: 12g, Carbs: 45g, Fat: 15g',1,NULL,'2025-08-22 14:54:59','2025-08-22 14:54:59');
/*!40000 ALTER TABLE `catering_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certificates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `certificate_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `participant_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `completion_date` date NOT NULL,
  `issue_date` date NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `background_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orientation` enum('landscape','portrait') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'landscape',
  `custom_fields` json DEFAULT NULL,
  `customization` json DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `certificates_certificate_number_unique` (`certificate_number`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (12,'CERT2025090001','Advanced Project Management Professional (PMP)','Ahmed Hassan El-Masry','ahmed.hassan@egyptsoft.com','Global Tech Solutions','2025-08-31','2025-09-04',NULL,'certificate-backgrounds/blank-certificate_1756973216.png','landscape',NULL,NULL,'active',NULL,'2025-09-04 05:06:56','2025-09-04 05:27:38'),(13,'CERT2025090002','Advanced Project Management Professional (PMP)','Amany El Ganzoury','amany@ag-accessories.com','FinTech Jordan','2025-08-31','2025-09-04',NULL,'certificate-backgrounds/blank-certificate_1756973421.png','landscape',NULL,'{\"title\": {\"font_size\": \"2em\"}}','revoked',NULL,'2025-09-04 05:10:21','2025-09-04 08:21:24');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_contacts`
--

DROP TABLE IF EXISTS `company_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_contacts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_company_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direct_line` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_type` enum('primary','sales','support','billing','emergency','fleet_manager','maintenance','insurance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'primary',
  `specializations` json DEFAULT NULL,
  `languages_spoken` json DEFAULT NULL,
  `working_hours` json DEFAULT NULL,
  `timezone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `available_weekends` tinyint(1) NOT NULL DEFAULT '0',
  `available_holidays` tinyint(1) NOT NULL DEFAULT '0',
  `emergency_contact` tinyint(1) NOT NULL DEFAULT '0',
  `preferred_contact_methods` json DEFAULT NULL,
  `preferred_language` enum('English','Arabic','French','Spanish','Other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'English',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `office_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `priority_level` int(11) NOT NULL DEFAULT '1',
  `response_time_hours` decimal(5,2) DEFAULT NULL,
  `customer_rating` decimal(3,2) DEFAULT NULL,
  `total_interactions` int(11) NOT NULL DEFAULT '0',
  `last_contact_date` timestamp NULL DEFAULT NULL,
  `linkedin` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skype` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teams` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_contacts_rental_company_id_contact_type_index` (`rental_company_id`,`contact_type`),
  KEY `company_contacts_rental_company_id_is_active_is_primary_index` (`rental_company_id`,`is_active`,`is_primary`),
  KEY `company_contacts_emergency_contact_index` (`emergency_contact`),
  KEY `company_contacts_city_region_index` (`city`,`region`),
  CONSTRAINT `company_contacts_rental_company_id_foreign` FOREIGN KEY (`rental_company_id`) REFERENCES `rental_companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_contacts`
--

LOCK TABLES `company_contacts` WRITE;
/*!40000 ALTER TABLE `company_contacts` DISABLE KEYS */;
INSERT INTO `company_contacts` VALUES (1,1,'Ahmed Al Mansouri','General Manager',NULL,'ahmed.mansouri@emiratespremier.ae','+971-4-123-4567','+971-50-123-4567',NULL,NULL,NULL,'primary',NULL,'[\"English\", \"Arabic\"]',NULL,NULL,0,0,0,NULL,'English',NULL,NULL,NULL,NULL,1,1,1,NULL,NULL,0,NULL,NULL,NULL,NULL,'2025-08-23 06:31:36','2025-08-23 06:31:36');
/*!40000 ALTER TABLE `company_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_vehicles`
--

DROP TABLE IF EXISTS `company_vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_vehicles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_company_id` bigint(20) unsigned NOT NULL,
  `vehicle_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_plate` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seats` int(11) NOT NULL,
  `baggage_capacity` int(11) DEFAULT '2',
  `fuel_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transmission` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `engine_size` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuel_consumption` decimal(5,2) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `features` json DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `images` json DEFAULT NULL,
  `hourly_rate` decimal(8,2) DEFAULT NULL,
  `daily_rate` decimal(8,2) NOT NULL,
  `weekly_rate` decimal(8,2) DEFAULT NULL,
  `monthly_rate` decimal(8,2) DEFAULT NULL,
  `weekend_rate` decimal(8,2) DEFAULT NULL,
  `holiday_rate` decimal(8,2) DEFAULT NULL,
  `mileage_charge_per_km` decimal(8,2) DEFAULT NULL,
  `included_mileage_per_day` int(11) DEFAULT NULL,
  `driver_charge_per_hour` decimal(8,2) DEFAULT NULL,
  `fuel_charge` decimal(8,2) DEFAULT NULL,
  `cleaning_fee` decimal(8,2) DEFAULT NULL,
  `insurance_daily_rate` decimal(8,2) DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  `insurance_included` tinyint(1) NOT NULL DEFAULT '0',
  `insurance_coverage` text COLLATE utf8mb4_unicode_ci,
  `status` enum('available','rented','maintenance','out_of_service') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `requires_special_license` tinyint(1) NOT NULL DEFAULT '0',
  `minimum_age_requirement` int(11) NOT NULL DEFAULT '21',
  `minimum_driving_experience` int(11) NOT NULL DEFAULT '1',
  `current_location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pickup_locations` json DEFAULT NULL,
  `delivery_available` tinyint(1) NOT NULL DEFAULT '0',
  `delivery_charge` decimal(8,2) DEFAULT NULL,
  `delivery_radius_km` int(11) DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  `next_service_due` date DEFAULT NULL,
  `insurance_expiry` date DEFAULT NULL,
  `registration_expiry` date DEFAULT NULL,
  `maintenance_notes` text COLLATE utf8mb4_unicode_ci,
  `minimum_rental_hours` int(11) NOT NULL DEFAULT '24',
  `maximum_rental_days` int(11) DEFAULT NULL,
  `blackout_dates` json DEFAULT NULL,
  `weekend_only` tinyint(1) NOT NULL DEFAULT '0',
  `advance_booking_required` tinyint(1) NOT NULL DEFAULT '0',
  `advance_booking_hours` int(11) DEFAULT NULL,
  `average_rating` decimal(3,2) DEFAULT NULL,
  `total_bookings` int(11) NOT NULL DEFAULT '0',
  `total_reviews` int(11) NOT NULL DEFAULT '0',
  `revenue_to_date` decimal(12,2) NOT NULL DEFAULT '0.00',
  `additional_features` json DEFAULT NULL,
  `route_pricing` json DEFAULT NULL,
  `special_instructions` text COLLATE utf8mb4_unicode_ci,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `company_vehicles_rental_company_id_license_plate_unique` (`rental_company_id`,`license_plate`),
  KEY `company_vehicles_rental_company_id_status_index` (`rental_company_id`,`status`),
  KEY `company_vehicles_vehicle_type_is_active_index` (`vehicle_type`,`is_active`),
  KEY `company_vehicles_daily_rate_status_index` (`daily_rate`,`status`),
  KEY `company_vehicles_current_location_index` (`current_location`),
  CONSTRAINT `company_vehicles_rental_company_id_foreign` FOREIGN KEY (`rental_company_id`) REFERENCES `rental_companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_vehicles`
--

LOCK TABLES `company_vehicles` WRITE;
/*!40000 ALTER TABLE `company_vehicles` DISABLE KEYS */;
INSERT INTO `company_vehicles` VALUES (1,1,'Luxury','Mercedes','S-Class','2024',NULL,'Black',5,2,'Gasoline','Automatic',NULL,NULL,NULL,'[\"GPS Navigation\", \"Leather Seats\", \"Sunroof\"]',NULL,NULL,NULL,800.00,5000.00,18000.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,2000.00,0,NULL,'available',1,0,21,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,NULL,NULL,0,0,NULL,NULL,0,0,0.00,NULL,NULL,NULL,NULL,'2025-08-23 06:31:36','2025-08-23 06:31:36'),(2,1,'Sedan','Toyota','Camry','2023','EG-123-ABC','White',5,3,'Gasoline','Automatic',NULL,NULL,NULL,'[\"GPS\", \"Bluetooth\", \"Air Conditioning\"]','Comfortable sedan for city driving',NULL,25.00,180.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'available',1,0,21,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,NULL,NULL,0,0,NULL,NULL,0,0,0.00,NULL,NULL,NULL,NULL,'2025-09-02 14:39:07','2025-09-02 15:25:34'),(3,1,'SUV','Nissan','X-Trail','2023','EG-456-DEF','Black',7,5,'Gasoline','Automatic',NULL,NULL,NULL,'[\"GPS\", \"Bluetooth\", \"Air Conditioning\", \"4WD\"]','Spacious SUV perfect for family trips',NULL,35.00,250.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'available',1,0,21,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,NULL,NULL,0,0,NULL,NULL,0,0,0.00,NULL,NULL,NULL,NULL,'2025-09-02 14:39:22','2025-09-02 15:25:34'),(4,1,'Luxury','BMW','5 Series','2024','EG-789-GHI','Silver',5,4,'Gasoline','Automatic',NULL,NULL,NULL,'[\"GPS\", \"Bluetooth\", \"Air Conditioning\", \"Leather Seats\", \"Premium Sound\"]','Luxury sedan for business and special occasions',NULL,50.00,400.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'available',1,0,21,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,NULL,NULL,0,0,NULL,NULL,0,0,0.00,NULL,NULL,NULL,NULL,'2025-09-02 14:39:22','2025-09-02 15:25:34'),(5,1,'Economy','Hyundai','Accent','2023','EG-012-JKL','Blue',5,2,'Gasoline','Manual',NULL,NULL,NULL,'[\"Air Conditioning\", \"USB Charging\"]','Economical choice for budget-conscious travelers',NULL,15.00,120.00,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,'available',1,0,21,1,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,24,NULL,NULL,0,0,NULL,NULL,0,0,0.00,NULL,NULL,NULL,NULL,'2025-09-02 14:39:22','2025-09-02 15:25:34');
/*!40000 ALTER TABLE `company_vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_enrollments`
--

DROP TABLE IF EXISTS `course_enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_enrollments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `participant_id` bigint(20) unsigned NOT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `course_instance_id` bigint(20) unsigned DEFAULT NULL,
  `status` enum('enrolled','attending','completed','dropped') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enrolled',
  `enrollment_date` date NOT NULL,
  `completion_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_enrollments_participant_id_course_id_unique` (`participant_id`,`course_id`),
  KEY `course_enrollments_course_id_foreign` (`course_id`),
  KEY `course_enrollments_course_instance_id_foreign` (`course_instance_id`),
  CONSTRAINT `course_enrollments_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `course_enrollments_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE SET NULL,
  CONSTRAINT `course_enrollments_participant_id_foreign` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_enrollments`
--

LOCK TABLES `course_enrollments` WRITE;
/*!40000 ALTER TABLE `course_enrollments` DISABLE KEYS */;
INSERT INTO `course_enrollments` VALUES (1,9,2,NULL,'enrolled','2025-08-14',NULL,NULL,'2025-08-14 13:30:59','2025-08-14 13:30:59'),(2,22,2,NULL,'enrolled','2025-08-27',NULL,NULL,'2025-08-27 04:51:08','2025-08-27 04:51:08');
/*!40000 ALTER TABLE `course_enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_instances`
--

DROP TABLE IF EXISTS `course_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_instances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `venue_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `venue_address` text COLLATE utf8mb4_unicode_ci,
  `needs_visa` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('draft','scheduled','completed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `logistics_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_instances_course_id_foreign` (`course_id`),
  CONSTRAINT `course_instances_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_instances`
--

LOCK TABLES `course_instances` WRITE;
/*!40000 ALTER TABLE `course_instances` DISABLE KEYS */;
INSERT INTO `course_instances` VALUES (1,1,'2025-08-28','2025-08-30','PMEC Training Center','Dubai Business District, UAE',0,'scheduled',2500.00,'2025-08-14 11:26:37','2025-08-14 11:26:37'),(2,2,'2025-09-04','2025-09-06','Geneva Conference Center','Geneva, Switzerland',1,'scheduled',4500.00,'2025-08-14 11:26:37','2025-08-14 11:26:37');
/*!40000 ALTER TABLE `course_instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_locations`
--

DROP TABLE IF EXISTS `course_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_locations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'training_center',
  `description` text COLLATE utf8mb4_unicode_ci,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `building` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `facilities` json DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_locations_is_active_sort_order_index` (`is_active`,`sort_order`),
  KEY `course_locations_type_index` (`type`),
  KEY `course_locations_city_country_index` (`city`,`country`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_locations`
--

LOCK TABLES `course_locations` WRITE;
/*!40000 ALTER TABLE `course_locations` DISABLE KEYS */;
INSERT INTO `course_locations` VALUES (1,'Makank','training_center',NULL,'10 Obour Buildings, Nacer City','Cairo','Egypt','10','11','12',49,'[\"Projector\", \"Coffee Station\", \"Parking\", \"Whiteboard\"]','Mohamed Dawd','mohamedfi@gmail.com','12028602825',1,0,'2025-08-29 16:27:18','2025-08-29 16:28:34');
/*!40000 ALTER TABLE `course_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `location_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `delivery_type` enum('office','offsite','abroad') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'office',
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trainer_id` bigint(20) unsigned DEFAULT NULL,
  `coordinator_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_trainer_id_foreign` (`trainer_id`),
  KEY `courses_coordinator_id_foreign` (`coordinator_id`),
  KEY `courses_location_id_foreign` (`location_id`),
  CONSTRAINT `courses_location_id_foreign` FOREIGN KEY (`location_id`) REFERENCES `course_locations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,NULL,'Advanced Project Management','APM-2024-001','Comprehensive project management course covering advanced methodologies.','office','United States','DC',NULL,NULL,'2025-08-14 10:01:50','2025-08-14 11:55:58'),(2,NULL,'Leadership Excellence Program','LEP-2024-002','Executive leadership development program.','offsite','Switzerland','Geneva',NULL,NULL,'2025-08-14 10:01:50','2025-08-14 11:55:36'),(5,NULL,'Advanced Project Management Professional (PMP)','PMP-001','Comprehensive project management course covering PMBOK methodology, risk management, stakeholder engagement, and advanced project planning techniques.','office','Egypt','Cairo',2,3,'2025-08-27 02:31:15','2025-08-27 02:31:15'),(6,NULL,'Strategic Leadership & Change Management','SLCM-002','Advanced leadership course focusing on strategic thinking, organizational change management, team building, and executive decision-making skills.','offsite','Egypt','Alexandria',3,2,'2025-08-27 02:31:15','2025-08-27 02:31:15'),(7,NULL,'Digital Transformation & Innovation Management','DTIM-003','Cutting-edge course on digital transformation strategies, innovation management, emerging technologies, and organizational agility.','abroad','UAE','Dubai',2,3,'2025-08-27 02:31:15','2025-08-27 02:31:15'),(8,NULL,'PMO','PMO001','PMO WORKSHOP','office','Egypt','Cairo',NULL,NULL,'2025-08-27 04:32:25','2025-08-27 04:32:25'),(9,NULL,'PMO','PMO001','WEWE','office','Egypt','Cairo',NULL,NULL,'2025-08-27 04:32:48','2025-08-27 04:32:48'),(10,NULL,'pm','PMO001','dsdsdsd','office','Egypt','Cairo',2,3,'2025-08-27 04:34:48','2025-08-27 04:34:48'),(11,NULL,'PMO','PMO001','ewewew','office','Egypt','Cairo',2,2,'2025-08-27 04:36:53','2025-08-27 04:36:53'),(12,NULL,'PMO','PMO001','dsd','office','Egypt','Cairo',2,2,'2025-08-27 04:38:43','2025-08-27 04:38:43'),(13,NULL,'dsd','ds','ds','office','Egypt','Cairo',3,3,'2025-08-27 04:41:00','2025-08-27 04:41:00');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_meal_orders`
--

DROP TABLE IF EXISTS `daily_meal_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `daily_meal_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `meal_break_plan_id` bigint(20) unsigned NOT NULL,
  `order_date` date NOT NULL,
  `day_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `course_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number_of_attendance` int(11) NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_food_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `daily_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `special_instructions` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','confirmed','in_preparation','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `daily_meal_orders_meal_break_plan_id_order_date_index` (`meal_break_plan_id`,`order_date`),
  KEY `daily_meal_orders_location_index` (`location`),
  KEY `daily_meal_orders_course_name_index` (`course_name`),
  CONSTRAINT `daily_meal_orders_meal_break_plan_id_foreign` FOREIGN KEY (`meal_break_plan_id`) REFERENCES `meal_break_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_meal_orders`
--

LOCK TABLES `daily_meal_orders` WRITE;
/*!40000 ALTER TABLE `daily_meal_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `daily_meal_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager_id` bigint(20) unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `budget` decimal(15,2) DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departments_code_unique` (`code`),
  KEY `departments_manager_id_foreign` (`manager_id`),
  KEY `departments_is_active_sort_order_index` (`is_active`,`sort_order`),
  KEY `departments_code_index` (`code`),
  CONSTRAINT `departments_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Information Technology','IT infrastructure, software development, and technical support','IT',NULL,1,1,500000.00,'Main Building, 2nd Floor','it@pmec.com','+20-2-1234-5678','2025-08-28 06:55:29','2025-08-28 06:55:29'),(2,'Training & Development','Employee training, skill development, and learning programs','T&D',NULL,1,2,300000.00,'Training Building, 1st Floor','training@pmec.com','+20-2-1234-5679','2025-08-28 06:55:29','2025-08-28 06:55:29'),(3,'Finance & Accounting','Financial management, accounting, and budget control','FIN',NULL,1,3,200000.00,'Main Building, 1st Floor','finance@pmec.com','+20-2-1234-5680','2025-08-28 06:55:29','2025-08-28 06:55:29'),(4,'Operations','Day-to-day operations, process management, and efficiency','OPS',NULL,1,4,400000.00,'Main Building, Ground Floor','operations@pmec.com','+20-2-1234-5681','2025-08-28 06:55:29','2025-08-28 06:55:29'),(5,'Human Resources','Employee relations, recruitment, and HR policies','HR',NULL,1,5,150000.00,'Main Building, 1st Floor','hr@pmec.com','+20-2-1234-5682','2025-08-28 06:55:29','2025-08-28 06:55:29'),(6,'Marketing & Sales','Marketing strategies, sales operations, and customer relations','MKT',NULL,1,6,250000.00,'Main Building, 2nd Floor','marketing@pmec.com','+20-2-1234-5683','2025-08-28 06:55:29','2025-08-28 06:55:29'),(7,'Customer Support','Customer service, technical support, and client relations','CS',NULL,1,7,180000.00,'Main Building, Ground Floor','support@pmec.com','+20-2-1234-5684','2025-08-28 06:55:29','2025-08-28 06:55:29'),(8,'Research & Development','Innovation, product development, and research initiatives','R&D',NULL,1,8,600000.00,'Research Building, All Floors','rd@pmec.com','+20-2-1234-5685','2025-08-28 06:55:29','2025-08-28 06:55:29'),(9,'QC','QC','QC0001',NULL,1,0,NULL,NULL,NULL,NULL,'2025-08-28 14:30:25','2025-08-28 14:30:25');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dietary_requirements`
--

DROP TABLE IF EXISTS `dietary_requirements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dietary_requirements` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` enum('dietary_restriction','allergy','preference','religious') COLLATE utf8mb4_unicode_ci NOT NULL,
  `restrictions` text COLLATE utf8mb4_unicode_ci,
  `allowed_foods` text COLLATE utf8mb4_unicode_ci,
  `substitutions` text COLLATE utf8mb4_unicode_ci,
  `requires_medical_attention` tinyint(1) NOT NULL DEFAULT '0',
  `medical_notes` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dietary_requirements`
--

LOCK TABLES `dietary_requirements` WRITE;
/*!40000 ALTER TABLE `dietary_requirements` DISABLE KEYS */;
INSERT INTO `dietary_requirements` VALUES (1,'Vegetarian','No meat, fish, or poultry. Includes dairy and eggs.','preference','Meat, fish, poultry','Dairy, eggs, grains, vegetables, fruits, legumes','Plant-based proteins, tofu, tempeh, seitan',0,NULL,'?','text-green-600',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(2,'Vegan','No animal products including dairy, eggs, and honey.','preference','All animal products, dairy, eggs, honey','Plant-based foods only','Plant milk, nutritional yeast, agave nectar',0,NULL,'?','text-green-700',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(3,'Halal','Food prepared according to Islamic dietary laws.','religious','Pork, alcohol, non-halal meat','Halal-certified meat, fish, dairy, grains, vegetables','Halal-certified alternatives',0,NULL,'☪️','text-blue-600',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(4,'Gluten-Free','No wheat, barley, rye, or cross-contaminated foods.','dietary_restriction','Wheat, barley, rye, oats (unless certified gluten-free)','Rice, quinoa, corn, gluten-free grains, vegetables, fruits','Gluten-free flour, pasta, bread',1,'May be due to celiac disease or gluten sensitivity','?','text-orange-600',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(5,'Dairy-Free','No milk, cheese, yogurt, or other dairy products.','dietary_restriction','Milk, cheese, yogurt, butter, cream','Plant milk, dairy-free alternatives, vegetables, fruits, grains','Almond milk, coconut milk, cashew cheese',1,'May be due to lactose intolerance or dairy allergy','?','text-red-600',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(6,'Nut-Free','No peanuts, tree nuts, or nut products.','allergy','Peanuts, almonds, walnuts, cashews, pecans, etc.','Seeds, legumes, grains, vegetables, fruits','Sunflower seeds, pumpkin seeds, soy products',1,'Severe allergic reaction risk','⚠️','text-red-700',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(7,'Low-Sodium','Reduced salt and sodium content.','dietary_restriction','High-sodium foods, processed foods, added salt','Fresh vegetables, fruits, lean proteins, whole grains','Herbs, spices, lemon juice, vinegar for flavor',1,'Often prescribed for heart conditions or hypertension','?','text-purple-600',1,'2025-08-22 14:54:48','2025-08-22 14:54:48'),(8,'Diabetic-Friendly','Low glycemic index foods suitable for diabetics.','dietary_restriction','High-sugar foods, refined carbohydrates, sugary beverages','Complex carbohydrates, lean proteins, vegetables, low-sugar fruits','Stevia, erythritol, whole grain alternatives',1,'Requires blood sugar monitoring','?','text-blue-700',1,'2025-08-22 14:54:48','2025-08-22 14:54:48');
/*!40000 ALTER TABLE `dietary_requirements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `employees` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `department_id` bigint(20) unsigned DEFAULT NULL,
  `employee_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employees_employee_id_unique` (`employee_id`),
  UNIQUE KEY `employees_email_unique` (`email`),
  KEY `employees_role_id_foreign` (`role_id`),
  KEY `employees_user_id_foreign` (`user_id`),
  KEY `employees_department_id_foreign` (`department_id`),
  CONSTRAINT `employees_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `employees_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employees_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,NULL,'EMP001','Ahmed','Hassan','ahmed.hassan@pmec.com','+966501234567','System Administrator',19,NULL,NULL,'IT','Experienced system administrator with 8+ years in IT management.',1,'2025-08-22 04:30:40','2025-08-28 04:50:18'),(2,NULL,'EMP002','Fatima','Al-Zahra','fatima.alzahra@pmec.com','+966502345678','Course Coordinator',2,NULL,NULL,'Training','Dedicated coordinator with expertise in course logistics and participant management.',1,'2025-08-22 04:30:40','2025-08-27 02:30:09'),(3,NULL,'EMP003','Mohammed','Al-Rashid','mohammed.alrashid@pmec.com','+966503456789','Senior Trainer',3,NULL,NULL,'Training','Certified trainer with 10+ years experience in PMO and project management.',1,'2025-08-22 04:30:40','2025-08-27 02:30:09'),(4,NULL,'EMP004','Aisha','Al-Mansouri','aisha.almansouri@pmec.com','+966504567890','Finance Manager',4,NULL,NULL,'Finance','Experienced finance professional specializing in training center financial management.',1,'2025-08-22 04:30:40','2025-08-27 02:30:09'),(5,NULL,'EMP005','Omar','Al-Sabah','omar.alsabah@pmec.com','+966505678901','Support Specialist',14,NULL,NULL,'Operations','Dedicated support staff member handling administrative tasks and logistics.',1,'2025-08-22 04:30:40','2025-08-27 02:30:09'),(11,NULL,'EMPoo9','Amany','El Ganzoury','amany@ag-accessories.com','+201002004156','Manager',14,4,NULL,'HR','Amany',1,'2025-08-22 04:52:00','2025-08-24 09:50:39');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enrollments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `participant_id` bigint(20) unsigned NOT NULL,
  `status` enum('registered','confirmed','canceled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'registered',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollments_course_instance_id_participant_id_unique` (`course_instance_id`,`participant_id`),
  KEY `enrollments_participant_id_foreign` (`participant_id`),
  CONSTRAINT `enrollments_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enrollments_participant_id_foreign` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enrollments`
--

LOCK TABLES `enrollments` WRITE;
/*!40000 ALTER TABLE `enrollments` DISABLE KEYS */;
/*!40000 ALTER TABLE `enrollments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluations`
--

DROP TABLE IF EXISTS `evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `evaluations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `participant_id` bigint(20) unsigned NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `rubric` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `evaluations_course_instance_id_foreign` (`course_instance_id`),
  KEY `evaluations_participant_id_foreign` (`participant_id`),
  CONSTRAINT `evaluations_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `evaluations_participant_id_foreign` FOREIGN KEY (`participant_id`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluations`
--

LOCK TABLES `evaluations` WRITE;
/*!40000 ALTER TABLE `evaluations` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financial_categories`
--

DROP TABLE IF EXISTS `financial_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `financial_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('income','expense') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '?',
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'blue',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_categories`
--

LOCK TABLES `financial_categories` WRITE;
/*!40000 ALTER TABLE `financial_categories` DISABLE KEYS */;
INSERT INTO `financial_categories` VALUES (1,'course_fees','Course Fees','income','Revenue from training courses and workshops','?','green',1,1,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(2,'consulting','Consulting Services','income','Professional consulting and advisory services','?','blue',1,2,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(3,'catering_services','Catering Services','income','Revenue from catering and food services','?️','orange',1,3,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(4,'logistics_services','Logistics Services','income','Transportation and logistics services','?','purple',1,4,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(5,'other_income','Other Income','income','Miscellaneous income sources','?','gray',1,5,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(6,'personnel','Personnel Costs','expense','Salaries, wages, and employee benefits','?','red',1,6,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(7,'office_supplies','Office Supplies','expense','Office equipment, stationery, and supplies','?','brown',1,7,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(8,'marketing','Marketing & Advertising','expense','Marketing campaigns, advertising, and promotions','?','pink',1,8,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(9,'travel','Travel & Accommodation','expense','Business travel, hotels, and transportation','✈️','cyan',1,9,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(10,'utilities','Utilities & Rent','expense','Office rent, electricity, water, internet','?','yellow',1,10,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(11,'catering_costs','Catering Costs','expense','Food, beverages, and catering supplies','?','orange',1,11,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(12,'logistics_costs','Logistics Costs','expense','Transportation, fuel, and vehicle maintenance','⛽','purple',1,12,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(13,'training_materials','Training Materials','expense','Course materials, books, and educational resources','?','indigo',1,13,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(14,'maintenance','Maintenance & Repairs','expense','Equipment maintenance and facility repairs','?','gray',1,14,'2025-08-24 13:38:38','2025-08-24 13:38:38'),(15,'other_expenses','Other Expenses','expense','Miscellaneous business expenses','?','red',1,15,'2025-08-24 13:38:38','2025-08-24 13:38:38');
/*!40000 ALTER TABLE `financial_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flight_bookings`
--

DROP TABLE IF EXISTS `flight_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flight_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `traveler_user_id` bigint(20) unsigned DEFAULT NULL,
  `airline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `flight_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `depart_airport` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `arrive_airport` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `depart_at` datetime NOT NULL,
  `return_at` datetime DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` enum('draft','booked','confirmed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `flight_bookings_course_instance_id_foreign` (`course_instance_id`),
  KEY `flight_bookings_traveler_user_id_foreign` (`traveler_user_id`),
  CONSTRAINT `flight_bookings_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `flight_bookings_traveler_user_id_foreign` FOREIGN KEY (`traveler_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flight_bookings`
--

LOCK TABLES `flight_bookings` WRITE;
/*!40000 ALTER TABLE `flight_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `flight_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_item_locations`
--

DROP TABLE IF EXISTS `food_item_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_item_locations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `food_item_id` bigint(20) unsigned NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `delivery_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `location_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `food_item_locations_food_item_id_location_unique` (`food_item_id`,`location`),
  KEY `food_item_locations_location_index` (`location`),
  KEY `food_item_locations_is_available_index` (`is_available`),
  CONSTRAINT `food_item_locations_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_item_locations`
--

LOCK TABLES `food_item_locations` WRITE;
/*!40000 ALTER TABLE `food_item_locations` DISABLE KEYS */;
INSERT INTO `food_item_locations` VALUES (1,1,'Alexandria',220.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(2,1,'Nasr City',200.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(3,1,'BDC',180.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(4,1,'Business Square',180.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(5,1,'Dokki',200.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(6,1,'Al-Rehab',220.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(7,2,'Alexandria',180.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(8,2,'Nasr City',160.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(9,2,'BDC',150.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(10,2,'Business Square',150.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(11,2,'Dokki',160.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(12,2,'Al-Rehab',180.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(13,3,'Alexandria',150.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(14,3,'Nasr City',130.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(15,3,'BDC',120.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(16,3,'Business Square',120.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(17,3,'Dokki',130.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(18,3,'Al-Rehab',150.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(19,4,'Alexandria',200.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(20,4,'Nasr City',180.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(21,4,'BDC',170.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(22,4,'Business Square',170.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(23,4,'Dokki',180.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(24,4,'Al-Rehab',200.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(25,5,'Alexandria',190.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(26,5,'Nasr City',170.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(27,5,'BDC',160.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(28,5,'Business Square',160.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(29,5,'Dokki',170.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(30,5,'Al-Rehab',190.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(31,6,'Alexandria',210.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(32,6,'Nasr City',190.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(33,6,'BDC',180.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(34,6,'Business Square',180.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(35,6,'Dokki',190.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(36,6,'Al-Rehab',210.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(37,7,'Alexandria',80.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(38,7,'Nasr City',70.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(39,7,'BDC',65.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(40,7,'Business Square',65.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(41,7,'Dokki',70.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(42,7,'Al-Rehab',80.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(43,8,'Alexandria',120.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(44,8,'Nasr City',110.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(45,8,'BDC',100.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(46,8,'Business Square',100.00,15.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(47,8,'Dokki',110.00,20.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(48,8,'Al-Rehab',120.00,25.00,1,NULL,'2025-08-26 05:01:53','2025-08-26 05:01:53');
/*!40000 ALTER TABLE `food_item_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cuisine_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_vegetarian` tinyint(1) NOT NULL DEFAULT '0',
  `is_vegan` tinyint(1) NOT NULL DEFAULT '0',
  `is_halal` tinyint(1) NOT NULL DEFAULT '0',
  `is_gluten_free` tinyint(1) NOT NULL DEFAULT '0',
  `allergen_info` text COLLATE utf8mb4_unicode_ci,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `nutritional_info` text COLLATE utf8mb4_unicode_ci,
  `preparation_time_minutes` int(11) DEFAULT NULL,
  `serving_temperature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `food_items_category_is_available_index` (`category`,`is_available`),
  KEY `food_items_cuisine_type_index` (`cuisine_type`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_items`
--

LOCK TABLES `food_items` WRITE;
/*!40000 ALTER TABLE `food_items` DISABLE KEYS */;
INSERT INTO `food_items` VALUES (1,'Pizza Margherita','Classic Italian pizza with tomato sauce, mozzarella cheese, and fresh basil','Main Course','Italian',1,0,1,0,'Contains dairy, gluten','Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil','Calories: 285, Protein: 12g, Carbs: 33g, Fat: 11g',20,'Hot',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(2,'Chicken Burger','Grilled chicken breast burger with lettuce, tomato, and special sauce','Main Course','American',0,0,1,0,'Contains gluten, may contain dairy','Chicken breast, burger bun, lettuce, tomato, onion, special sauce','Calories: 350, Protein: 28g, Carbs: 25g, Fat: 18g',15,'Hot',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(3,'Caesar Salad','Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese','Appetizer','International',1,0,1,0,'Contains dairy, gluten, eggs','Romaine lettuce, Caesar dressing, croutons, parmesan cheese, black pepper','Calories: 185, Protein: 8g, Carbs: 12g, Fat: 14g',10,'Cold',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(4,'Beef Shawarma','Marinated beef strips wrapped in Arabic bread with tahini sauce and vegetables','Main Course','Arabic',0,0,1,0,'Contains gluten, sesame','Beef strips, Arabic bread, tahini sauce, lettuce, tomato, onion, pickles','Calories: 420, Protein: 32g, Carbs: 28g, Fat: 22g',12,'Hot',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(5,'Vegetable Pasta','Penne pasta with mixed vegetables in creamy tomato sauce','Main Course','Italian',1,0,1,0,'Contains gluten, dairy','Penne pasta, mixed vegetables, tomato sauce, cream, parmesan cheese, herbs','Calories: 320, Protein: 14g, Carbs: 45g, Fat: 12g',18,'Hot',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(6,'Chicken Rice Bowl','Steamed rice with grilled chicken, vegetables, and teriyaki sauce','Main Course','Asian',0,0,1,0,'Contains soy, may contain gluten','Steamed rice, grilled chicken, mixed vegetables, teriyaki sauce, sesame seeds','Calories: 380, Protein: 26g, Carbs: 42g, Fat: 16g',16,'Hot',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(7,'Fruit Smoothie','Fresh mixed fruit smoothie with yogurt and honey','Beverage','International',1,0,1,1,'Contains dairy','Mixed fruits, yogurt, honey, ice','Calories: 120, Protein: 4g, Carbs: 22g, Fat: 2g',5,'Cold',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53'),(8,'Chocolate Cake','Rich chocolate cake with chocolate frosting and chocolate chips','Dessert','International',1,0,1,0,'Contains dairy, eggs, gluten','Flour, cocoa powder, sugar, eggs, milk, butter, chocolate chips, vanilla','Calories: 280, Protein: 6g, Carbs: 38g, Fat: 14g',0,'Room Temperature',NULL,1,'2025-08-26 05:01:53','2025-08-26 05:01:53');
/*!40000 ALTER TABLE `food_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hall_bookings`
--

DROP TABLE IF EXISTS `hall_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hall_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `training_hall_id` bigint(20) unsigned NOT NULL,
  `training_program_id` bigint(20) unsigned NOT NULL,
  `trainer_id` bigint(20) unsigned DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `session_dates` json NOT NULL,
  `max_participants` int(11) NOT NULL DEFAULT '30',
  `current_participants` int(11) NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'scheduled',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `price_per_participant` decimal(10,2) DEFAULT NULL,
  `booking_reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT '0',
  `recurring_pattern` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hall_bookings_booking_reference_unique` (`booking_reference`),
  KEY `hall_bookings_trainer_id_foreign` (`trainer_id`),
  KEY `hall_bookings_training_hall_id_start_date_index` (`training_hall_id`,`start_date`),
  KEY `hall_bookings_training_program_id_start_date_index` (`training_program_id`,`start_date`),
  KEY `hall_bookings_start_date_end_date_index` (`start_date`,`end_date`),
  KEY `hall_bookings_status_index` (`status`),
  CONSTRAINT `hall_bookings_trainer_id_foreign` FOREIGN KEY (`trainer_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `hall_bookings_training_hall_id_foreign` FOREIGN KEY (`training_hall_id`) REFERENCES `training_halls` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hall_bookings_training_program_id_foreign` FOREIGN KEY (`training_program_id`) REFERENCES `training_programs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hall_bookings`
--

LOCK TABLES `hall_bookings` WRITE;
/*!40000 ALTER TABLE `hall_bookings` DISABLE KEYS */;
INSERT INTO `hall_bookings` VALUES (14,1,5,1,'2024-08-16','2024-08-16','14:00:00','17:00:00','[\"2024-08-16\"]',30,25,'scheduled','Healthcare training session - 2024-08-16',150.00,'HB-HC-20240816',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(15,1,5,1,'2024-08-24','2024-08-24','17:00:00','20:00:00','[\"2024-08-24\"]',30,25,'scheduled','Healthcare training session - 2024-08-24',150.00,'HB-HC-20240824',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(16,1,5,1,'2024-08-30','2024-08-30','14:00:00','17:00:00','[\"2024-08-30\"]',30,25,'scheduled','Healthcare training session - 2024-08-30',150.00,'HB-HC-20240830',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(17,1,5,1,'2024-09-06','2024-09-06','14:00:00','17:00:00','[\"2024-09-06\"]',30,25,'scheduled','Healthcare training session - 2024-09-06',150.00,'HB-HC-20240906',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(18,1,5,1,'2024-09-13','2024-09-13','14:00:00','17:00:00','[\"2024-09-13\"]',30,25,'scheduled','Healthcare training session - 2024-09-13',150.00,'HB-HC-20240913',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(19,1,5,1,'2024-09-20','2024-09-20','14:00:00','17:00:00','[\"2024-09-20\"]',30,25,'scheduled','Healthcare training session - 2024-09-20',150.00,'HB-HC-20240920',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(20,1,5,1,'2024-09-27','2024-09-27','14:00:00','17:00:00','[\"2024-09-27\"]',30,25,'scheduled','Healthcare training session - 2024-09-27',150.00,'HB-HC-20240927',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(21,1,6,3,'2024-08-23','2024-08-23','14:00:00','17:00:00','[\"2024-08-23\"]',25,20,'scheduled','Gas Turbines training session - 2024-08-23',200.00,'HB-GT-20240823',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(22,1,6,3,'2024-08-30','2024-08-30','11:00:00','14:00:00','[\"2024-08-30\"]',25,20,'scheduled','Gas Turbines training session - 2024-08-30',200.00,'HB-GT-20240830',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(23,1,6,3,'2024-09-06','2024-09-06','11:00:00','14:00:00','[\"2024-09-06\"]',25,20,'scheduled','Gas Turbines training session - 2024-09-06',200.00,'HB-GT-20240906',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(24,1,6,3,'2024-09-13','2024-09-13','11:00:00','14:00:00','[\"2024-09-13\"]',25,20,'scheduled','Gas Turbines training session - 2024-09-13',200.00,'HB-GT-20240913',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(25,1,6,3,'2024-09-20','2024-09-20','11:00:00','14:00:00','[\"2024-09-20\"]',25,20,'scheduled','Gas Turbines training session - 2024-09-20',200.00,'HB-GT-20240920',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(26,1,7,4,'2024-08-17','2024-08-17','17:00:00','20:00:00','[\"2024-08-17\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-08-17',180.00,'HB-EM-20240817',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(27,1,7,4,'2024-08-18','2024-08-18','17:00:00','20:00:00','[\"2024-08-18\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-08-18',180.00,'HB-EM-20240818',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(28,1,7,4,'2024-08-25','2024-08-25','17:00:00','20:00:00','[\"2024-08-25\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-08-25',180.00,'HB-EM-20240825',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(29,1,7,4,'2024-08-27','2024-08-27','17:00:00','20:00:00','[\"2024-08-27\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-08-27',180.00,'HB-EM-20240827',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(30,1,7,4,'2024-09-01','2024-09-01','17:00:00','20:00:00','[\"2024-09-01\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-01',180.00,'HB-EM-20240901',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(31,1,7,4,'2024-09-03','2024-09-03','17:00:00','20:00:00','[\"2024-09-03\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-03',180.00,'HB-EM-20240903',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(32,1,7,4,'2024-09-08','2024-09-08','17:00:00','20:00:00','[\"2024-09-08\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-08',180.00,'HB-EM-20240908',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(33,1,7,4,'2024-09-10','2024-09-10','17:00:00','20:00:00','[\"2024-09-10\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-10',180.00,'HB-EM-20240910',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(34,1,7,4,'2024-09-15','2024-09-15','17:00:00','20:00:00','[\"2024-09-15\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-15',180.00,'HB-EM-20240915',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(35,1,7,4,'2024-09-17','2024-09-17','17:00:00','20:00:00','[\"2024-09-17\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-17',180.00,'HB-EM-20240917',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(36,1,7,4,'2024-09-22','2024-09-22','17:00:00','20:00:00','[\"2024-09-22\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-22',180.00,'HB-EM-20240922',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(37,1,7,4,'2024-09-24','2024-09-24','17:00:00','20:00:00','[\"2024-09-24\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-24',180.00,'HB-EM-20240924',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(38,1,7,4,'2024-09-29','2024-09-29','17:00:00','20:00:00','[\"2024-09-29\"]',35,30,'scheduled','Electronic Maintenance training session - 2024-09-29',180.00,'HB-EM-20240929',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(39,2,8,2,'2024-08-17','2024-08-17','15:00:00','19:00:00','[\"2024-08-17\"]',40,35,'scheduled','Resource Management training session - 2024-08-17',175.00,'HB-RM-20240817',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(40,2,8,2,'2024-08-18','2024-08-18','15:00:00','19:00:00','[\"2024-08-18\"]',40,35,'scheduled','Resource Management training session - 2024-08-18',175.00,'HB-RM-20240818',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(41,2,8,2,'2024-08-24','2024-08-24','15:00:00','19:00:00','[\"2024-08-24\"]',40,35,'scheduled','Resource Management training session - 2024-08-24',175.00,'HB-RM-20240824',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(42,2,8,2,'2024-08-25','2024-08-25','15:00:00','19:00:00','[\"2024-08-25\"]',40,35,'scheduled','Resource Management training session - 2024-08-25',175.00,'HB-RM-20240825',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(43,2,8,2,'2024-08-31','2024-08-31','15:00:00','19:00:00','[\"2024-08-31\"]',40,35,'scheduled','Resource Management training session - 2024-08-31',175.00,'HB-RM-20240831',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(44,2,8,2,'2024-09-01','2024-09-01','15:00:00','19:00:00','[\"2024-09-01\"]',40,35,'scheduled','Resource Management training session - 2024-09-01',175.00,'HB-RM-20240901',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(45,2,8,2,'2024-09-07','2024-09-07','15:00:00','19:00:00','[\"2024-09-07\"]',40,35,'scheduled','Resource Management training session - 2024-09-07',175.00,'HB-RM-20240907',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20'),(46,2,8,2,'2024-09-08','2024-09-08','15:00:00','19:00:00','[\"2024-09-08\"]',40,35,'scheduled','Resource Management training session - 2024-09-08',175.00,'HB-RM-20240908',0,NULL,'2025-08-29 04:40:20','2025-08-29 04:40:20');
/*!40000 ALTER TABLE `hall_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotel_bookings`
--

DROP TABLE IF EXISTS `hotel_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotel_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `guest_user_id` bigint(20) unsigned DEFAULT NULL,
  `hotel_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `checkin` date NOT NULL,
  `checkout` date NOT NULL,
  `nightly_rate` decimal(8,2) NOT NULL,
  `taxes` decimal(8,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` enum('draft','booked','confirmed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `hotel_bookings_course_instance_id_foreign` (`course_instance_id`),
  KEY `hotel_bookings_guest_user_id_foreign` (`guest_user_id`),
  CONSTRAINT `hotel_bookings_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `hotel_bookings_guest_user_id_foreign` FOREIGN KEY (`guest_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotel_bookings`
--

LOCK TABLES `hotel_bookings` WRITE;
/*!40000 ALTER TABLE `hotel_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `hotel_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `individual_food_orders`
--

DROP TABLE IF EXISTS `individual_food_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `individual_food_orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `daily_meal_order_id` bigint(20) unsigned NOT NULL,
  `food_item_id` bigint(20) unsigned NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `special_instructions` text COLLATE utf8mb4_unicode_ci,
  `status` enum('ordered','confirmed','in_preparation','ready','delivered') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ordered',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `individual_food_orders_food_item_id_foreign` (`food_item_id`),
  KEY `individual_food_orders_daily_meal_order_id_food_item_id_index` (`daily_meal_order_id`,`food_item_id`),
  KEY `individual_food_orders_status_index` (`status`),
  CONSTRAINT `individual_food_orders_daily_meal_order_id_foreign` FOREIGN KEY (`daily_meal_order_id`) REFERENCES `daily_meal_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `individual_food_orders_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `individual_food_orders`
--

LOCK TABLES `individual_food_orders` WRITE;
/*!40000 ALTER TABLE `individual_food_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `individual_food_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materials` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) unsigned DEFAULT NULL,
  `course_instance_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visibility` enum('admin','staff','participants') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'participants',
  `uploaded_by` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `materials_course_id_foreign` (`course_id`),
  KEY `materials_course_instance_id_foreign` (`course_instance_id`),
  KEY `materials_uploaded_by_foreign` (`uploaded_by`),
  CONSTRAINT `materials_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materials_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `materials_uploaded_by_foreign` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_break_plan_items`
--

DROP TABLE IF EXISTS `meal_break_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_break_plan_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `meal_break_plan_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `delivery_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `supplier` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `day` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meal_break_plan_items_meal_break_plan_id_foreign` (`meal_break_plan_id`),
  KEY `meal_break_plan_items_course_id_foreign` (`course_id`),
  CONSTRAINT `meal_break_plan_items_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meal_break_plan_items_meal_break_plan_id_foreign` FOREIGN KEY (`meal_break_plan_id`) REFERENCES `meal_break_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_break_plan_items`
--

LOCK TABLES `meal_break_plan_items` WRITE;
/*!40000 ALTER TABLE `meal_break_plan_items` DISABLE KEYS */;
INSERT INTO `meal_break_plan_items` VALUES (1,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Monday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(2,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Monday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(4,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Tuesday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(5,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Tuesday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(7,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Wednesday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(8,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Wednesday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(10,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Thursday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(11,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Thursday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(13,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Friday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(14,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Friday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(16,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Saturday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(17,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Saturday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(19,6,'Basic Training Course',25.00,15.00,'مكانك إسكندرية','إدارة الموارد',1,15,'Café Alexandria','Sunday',390.00,'2025-08-27 17:08:30','2025-08-27 17:08:30'),(20,6,'Team Building',40.00,0.00,'BDC','إدارة المشروعات',2,25,'Business Square Café','Sunday',1000.00,'2025-08-27 17:08:30','2025-08-27 17:08:30');
/*!40000 ALTER TABLE `meal_break_plan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_break_plans`
--

DROP TABLE IF EXISTS `meal_break_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_break_plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int(11) NOT NULL,
  `total_delivery_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `total_food_cost` decimal(10,2) NOT NULL DEFAULT '0.00',
  `grand_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` enum('draft','active','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_by` bigint(20) unsigned NOT NULL,
  `approved_by` bigint(20) unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `employee_id` bigint(20) unsigned DEFAULT NULL,
  `department_id` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meal_break_plans_created_by_foreign` (`created_by`),
  KEY `meal_break_plans_approved_by_foreign` (`approved_by`),
  KEY `meal_break_plans_start_date_end_date_index` (`start_date`,`end_date`),
  KEY `meal_break_plans_status_index` (`status`),
  KEY `meal_break_plans_employee_id_index` (`employee_id`),
  KEY `meal_break_plans_department_id_index` (`department_id`),
  CONSTRAINT `meal_break_plans_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`),
  CONSTRAINT `meal_break_plans_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `meal_break_plans_department_id_foreign` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `meal_break_plans_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_break_plans`
--

LOCK TABLES `meal_break_plans` WRITE;
/*!40000 ALTER TABLE `meal_break_plans` DISABLE KEYS */;
INSERT INTO `meal_break_plans` VALUES (1,'August 2025 Training Week','Meal break plan for intensive training week','2025-08-15','2025-08-19',5,150.00,750.00,900.00,'draft',1,NULL,NULL,'Sample meal break plan for testing','2025-08-26 07:42:11','2025-08-26 07:42:11',NULL,NULL),(2,'September 2025 Workshop Series','Monthly workshop meal planning','2025-09-01','2025-09-30',30,600.00,3000.00,3600.00,'active',1,NULL,NULL,'Monthly workshop series meal planning','2025-08-26 07:42:11','2025-08-26 07:42:11',NULL,NULL),(3,'August 2025 Training Week','Meal break plan for intensive training week','2025-08-15','2025-08-19',5,0.00,0.00,0.00,'draft',1,NULL,NULL,'Sample meal break plan for testing','2025-08-26 07:59:05','2025-08-27 15:59:49',NULL,NULL),(4,'September 2025 Workshop Series','Monthly workshop meal planning','2025-09-01','2025-09-30',30,600.00,3000.00,3600.00,'active',1,NULL,NULL,'Monthly workshop series meal planning','2025-08-26 07:59:05','2025-08-26 07:59:05',NULL,NULL),(5,'AUGUST 2925',NULL,'2025-12-05','2025-12-10',6,0.00,0.00,0.00,'draft',5,NULL,NULL,NULL,'2025-08-27 16:47:10','2025-08-27 16:48:45',NULL,NULL),(6,'Weekly Training Program - August 2025','Complete 7-day meal plan with breakfast, lunch, and dinner for intensive training week','2025-08-18','2025-08-24',7,0.00,0.00,0.00,'draft',1,NULL,NULL,'Comprehensive weekly meal plan with 3 meals per day. Includes dietary considerations and cost optimization.','2025-08-27 17:08:30','2025-08-27 17:08:51',NULL,NULL),(7,'September 2025 Workshop Series','Monthly workshop meal planning with focus on healthy options','2025-09-01','2025-09-07',7,0.00,0.00,0.00,'active',1,NULL,NULL,'Weekly workshop series with balanced meal options and dietary accommodations.','2025-08-27 17:08:30','2025-08-27 17:09:09',NULL,NULL),(8,'October 2025 Executive Training','Premium meal service for executive leadership program','2025-10-06','2025-10-12',7,0.00,0.00,0.00,'draft',1,NULL,NULL,'Executive-level meal planning with premium catering and special dietary requirements.','2025-08-27 17:08:30','2025-08-27 17:10:17',NULL,NULL);
/*!40000 ALTER TABLE `meal_break_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_plan_items`
--

DROP TABLE IF EXISTS `meal_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_plan_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `meal_plan_id` bigint(20) unsigned NOT NULL,
  `catering_service_id` bigint(20) unsigned NOT NULL,
  `meal_type` enum('breakfast','lunch','dinner','snack','beverage') COLLATE utf8mb4_unicode_ci NOT NULL,
  `day_number` int(11) NOT NULL DEFAULT '1',
  `quantity` int(11) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `meal_plan_items_meal_plan_id_foreign` (`meal_plan_id`),
  KEY `meal_plan_items_catering_service_id_foreign` (`catering_service_id`),
  CONSTRAINT `meal_plan_items_catering_service_id_foreign` FOREIGN KEY (`catering_service_id`) REFERENCES `catering_services` (`id`) ON DELETE CASCADE,
  CONSTRAINT `meal_plan_items_meal_plan_id_foreign` FOREIGN KEY (`meal_plan_id`) REFERENCES `meal_plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plan_items`
--

LOCK TABLES `meal_plan_items` WRITE;
/*!40000 ALTER TABLE `meal_plan_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_plan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal_plans`
--

DROP TABLE IF EXISTS `meal_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `meal_plans` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration` enum('daily','weekly','monthly') COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_value` int(11) NOT NULL DEFAULT '1',
  `total_price` decimal(10,2) NOT NULL,
  `price_per_day` decimal(8,2) DEFAULT NULL,
  `includes_breakfast` tinyint(1) NOT NULL DEFAULT '0',
  `includes_lunch` tinyint(1) NOT NULL DEFAULT '0',
  `includes_dinner` tinyint(1) NOT NULL DEFAULT '0',
  `includes_snacks` tinyint(1) NOT NULL DEFAULT '0',
  `includes_beverages` tinyint(1) NOT NULL DEFAULT '0',
  `special_notes` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal_plans`
--

LOCK TABLES `meal_plans` WRITE;
/*!40000 ALTER TABLE `meal_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `meal_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_templates`
--

DROP TABLE IF EXISTS `message_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_templates` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `channel` enum('email','sms','whatsapp','all') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'all',
  `category` enum('course','task','announcement','reminder','welcome','confirmation') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'announcement',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `variables` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) unsigned NOT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `message_templates_created_by_foreign` (`created_by`),
  KEY `message_templates_updated_by_foreign` (`updated_by`),
  CONSTRAINT `message_templates_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `message_templates_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_templates`
--

LOCK TABLES `message_templates` WRITE;
/*!40000 ALTER TABLE `message_templates` DISABLE KEYS */;
INSERT INTO `message_templates` VALUES (1,'all','welcome','Course Welcome','Welcome message for new course participants','Welcome to {{course_name}} - PMEC Academy','Dear {{participant_name}},\n\nWelcome to {{course_name}}! We\'re excited to have you join us.\n\nCourse Details:\n? Course: {{course_name}}\n? Start Date: {{course_start}}\n? End Date: {{course_end}}\n? Location: {{location}}\n\nPlease arrive 15 minutes before the start time. If you have any questions, don\'t hesitate to contact us.\n\nBest regards,\nPMEC Academy Team','[\"participant_name\", \"course_name\", \"course_start\", \"course_end\", \"location\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(2,'all','reminder','Course Reminder','Reminder for upcoming course sessions','Reminder: {{course_name}} starts tomorrow','Hi {{participant_name}},\n\nThis is a friendly reminder that {{course_name}} starts tomorrow at {{start_time}}.\n\nPlease ensure you:\n✅ Have all required materials\n✅ Arrive 15 minutes early\n✅ Bring your ID for registration\n\nLocation: {{location}}\n\nWe look forward to seeing you!\n\nBest regards,\nPMEC Academy Team','[\"participant_name\", \"course_name\", \"start_time\", \"location\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(3,'all','task','Task Assignment','Notification for new task assignments','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','[\"employee_name\", \"task_title\", \"task_description\", \"due_date\", \"priority\", \"manager_name\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(4,'all','confirmation','Course Completion','Congratulations message for course completion','Congratulations! You have completed {{course_name}}','Dear {{participant_name}},\n\n? Congratulations on successfully completing {{course_name}}!\n\nYour dedication and hard work have paid off. You should receive your certificate within the next 5-7 business days.\n\nWe hope you found the course valuable and look forward to seeing you in future programs.\n\nBest regards,\nPMEC Academy Team','[\"participant_name\", \"course_name\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(5,'all','announcement','General Announcement','General announcements and updates','{{announcement_title}}','Dear Team,\n\n{{announcement_content}}\n\nIf you have any questions, please don\'t hesitate to reach out.\n\nBest regards,\n{{sender_name}}','[\"announcement_title\", \"announcement_content\", \"sender_name\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(6,'all','reminder','Attendance Reminder','Reminder for course attendance','Attendance Reminder: {{course_name}}','Hi {{participant_name}},\n\nThis is a reminder that {{course_name}} is scheduled for {{session_date}} at {{session_time}}.\n\nPlease confirm your attendance by replying to this message or scanning the QR code at the venue.\n\nLocation: {{location}}\n\nWe look forward to seeing you!\n\nBest regards,\nPMEC Academy Team','[\"participant_name\", \"course_name\", \"session_date\", \"session_time\", \"location\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1),(7,'all','announcement','Emergency Notification','Emergency notifications and urgent updates','URGENT: {{emergency_title}}','? EMERGENCY NOTIFICATION ?\n\n{{emergency_content}}\n\nPlease take immediate action as required.\n\nFor more information, contact: {{contact_info}}\n\nBest regards,\nEmergency Response Team','[\"emergency_title\", \"emergency_content\", \"contact_info\"]',1,'2025-08-22 05:45:16','2025-08-22 05:45:16',1,1);
/*!40000 ALTER TABLE `message_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `recipient_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `channel` enum('email','sms','whatsapp','in_app') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'email',
  `status` enum('pending','sent','delivered','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `template_id` bigint(20) unsigned DEFAULT NULL,
  `sender_id` bigint(20) unsigned NOT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `sent_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  `failure_reason` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `cost` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `priority` enum('low','normal','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `category` enum('course','task','announcement','reminder','welcome','confirmation') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'announcement',
  `related_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_template_id_foreign` (`template_id`),
  KEY `messages_sender_id_foreign` (`sender_id`),
  KEY `messages_recipient_type_recipient_value_index` (`recipient_type`,`recipient_value`),
  KEY `messages_channel_status_index` (`channel`,`status`),
  KEY `messages_category_status_index` (`category`,`status`),
  KEY `messages_scheduled_at_status_index` (`scheduled_at`,`status`),
  KEY `messages_related_type_related_id_index` (`related_type`,`related_id`),
  CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `message_templates` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'phone','+971-50-123-4567','John Smith 111144','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(2,'phone','+971-55-987-6543','Sarah Johnson','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(3,'phone','01002004156','Amany El Ganzoury','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(4,'phone','01002004156','Amany El Ganzoury','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(5,'phone','2028602825','Mohamed Dawd','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(6,'phone','01002004156','Amany El Ganzoury','New Task Assigned: {{task_title}}','Hello {{employee_name}},\n\nYou have been assigned a new task:\n\n? Task: {{task_title}}\n? Description: {{task_description}}\n⏰ Due Date: {{due_date}}\n? Priority: {{priority}}\n\nPlease review the task details and update the status accordingly.\n\nBest regards,\n{{manager_name}}','whatsapp','failed',3,2,NULL,NULL,NULL,'2025-08-22 06:12:49','WhatsApp Business API not configured',NULL,0.0000,'normal','task',NULL,NULL,'2025-08-22 06:12:49','2025-08-22 06:12:49'),(7,'phone','+201000102882','Mohamed','Welcome to {{course_name}} - PMEC Academy','Dear {{participant_name}},\n\nWelcome to {{course_name}}! We\'re excited to have you join us.\n\nCourse Details:\n? Course: {{course_name}}\n? Start Date: {{course_start}}\n? End Date: {{course_end}}\n? Location: {{location}}\n\nPlease arrive 15 minutes before the start time. If you have any questions, don\'t hesitate to contact us.\n\nBest regards,\nPMEC Academy Team','whatsapp','sent',1,2,NULL,'2025-08-22 06:19:39',NULL,NULL,NULL,'{\"note\": \"WhatsApp API not configured - message simulated\", \"simulated\": true}',0.0000,'normal','welcome',NULL,NULL,'2025-08-22 06:19:39','2025-08-22 06:19:39'),(8,'email','mohamedfi@gmail.com','Mohamed Dawd','Welcome to {{course_name}} - PMEC Academy','Dear {{participant_name}},\n\nWelcome to {{course_name}}! We\'re excited to have you join us.\n\nCourse Details:\n? Course: {{course_name}}\n? Start Date: {{course_start}}\n? End Date: {{course_end}}\n? Location: {{location}}\n\nPlease arrive 15 minutes before the start time. If you have any questions, don\'t hesitate to contact us.\n\nBest regards,\nPMEC Academy Team','email','failed',1,1,NULL,NULL,NULL,'2025-09-01 06:54:18','View [emails.generic] not found.',NULL,0.0000,'normal','welcome',NULL,NULL,'2025-09-01 06:54:18','2025-09-01 06:54:18'),(9,'email','mohamedfi@gmail.com','mohamed dawdc','Welcome to {{course_name}} - PMEC Academy','Dear {{participant_name}},\n\nWelcome to {{course_name}}! We\'re excited to have you join us.\n\nCourse Details:\n? Course: {{course_name}}\n? Start Date: {{course_start}}\n? End Date: {{course_end}}\n? Location: {{location}}\n\nPlease arrive 15 minutes before the start time. If you have any questions, don\'t hesitate to contact us.\n\nBest regards,\nPMEC Academy Team','email','sent',1,1,NULL,'2025-09-01 09:03:31',NULL,NULL,NULL,NULL,0.0000,'normal','welcome',NULL,NULL,'2025-09-01 09:03:28','2025-09-01 09:03:31'),(10,'phone','+1234567890','Test User','Test Message','This is a test message from ACMS SaaS!','sms','failed',NULL,1,NULL,NULL,NULL,'2025-09-01 09:16:27','[HTTP 401] Unable to create record: Authentication Error - invalid username',NULL,0.0000,'normal','announcement',NULL,NULL,'2025-09-01 09:16:26','2025-09-01 09:16:27'),(11,'phone','+1234567890','Test User','Test WhatsApp','This is a test WhatsApp message from ACMS SaaS!','whatsapp','failed',NULL,1,NULL,NULL,NULL,'2025-09-01 09:16:27','WhatsApp API error: {\"error\":{\"message\":\"Invalid OAuth access token - Cannot parse access token\",\"type\":\"OAuthException\",\"code\":190,\"fbtrace_id\":\"AhuI5p_t6u4uwB01unr9nDU\"}}',NULL,0.0000,'normal','announcement',NULL,NULL,'2025-09-01 09:16:27','2025-09-01 09:16:27');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_09_112952_create_personal_access_tokens_table',1),(5,'2025_08_09_113111_create_courses_table',1),(6,'2025_08_09_113111_create_roles_table',1),(7,'2025_08_09_113112_create_course_instances_table',1),(8,'2025_08_09_113113_create_participants_table',1),(9,'2025_08_09_113114_create_enrollments_table',1),(10,'2025_08_09_113115_add_role_to_users_table',1),(11,'2025_08_09_113121_create_attendance_records_table',1),(12,'2025_08_09_113121_create_evaluations_table',1),(13,'2025_08_09_113121_create_materials_table',1),(14,'2025_08_09_113121_create_tasks_table',1),(15,'2025_08_09_113122_create_message_templates_table',1),(16,'2025_08_09_113122_create_outbound_messages_table',1),(17,'2025_08_09_113132_create_flight_bookings_table',1),(18,'2025_08_09_113132_create_hotel_bookings_table',1),(19,'2025_08_09_113132_create_transport_bookings_table',1),(20,'2025_08_09_113133_create_attachments_table',1),(21,'2025_08_09_113133_create_per_diems_table',1),(22,'2025_08_09_113133_create_visa_applications_table',1),(23,'2025_08_12_142615_update_messages_table_for_enhanced_messaging',1),(24,'2025_08_14_153250_add_profile_image_and_visa_status_to_participants_table',2),(25,'2025_08_14_154127_add_passport_id_document_to_participants_table',3),(26,'2025_08_14_155152_add_thumbnail_to_participants_table',4),(28,'2025_08_14_160932_create_course_enrollments_table',5),(29,'2025_08_14_161758_add_qr_code_field_to_participants_table',6),(31,'2025_08_14_175841_create_archived_courses_table',7),(34,'2025_08_14_190543_create_trainers_table',8),(35,'2025_08_22_072222_update_roles_table_add_new_fields',9),(36,'2025_08_22_072354_create_employees_table',10),(37,'2025_08_22_072229_update_tasks_table_add_new_fields',10),(38,'2025_08_22_083656_create_messages_table',11),(39,'2025_08_22_083938_update_message_templates_table_structure',12),(46,'2025_08_22_173658_create_catering_services_table',13),(47,'2025_08_22_173707_create_meal_plans_table',13),(48,'2025_08_22_173717_create_dietary_requirements_table',13),(49,'2025_08_22_173725_create_catering_orders_table',13),(50,'2025_08_22_174017_create_catering_order_items_table',13),(51,'2025_08_22_174025_create_meal_plan_items_table',13),(53,'2025_08_22_174823_create_catering_dietary_requirements_table',14),(54,'2025_08_22_192805_create_catering_service_employees_table',15),(55,'2025_08_22_195215_create_catering_roles_table',16),(56,'2025_08_23_081346_create_transportation_vehicles_table',17),(57,'2025_08_23_081459_create_transportation_bookings_table',17),(58,'2025_08_23_082111_create_transportation_maintenance_table',17),(59,'2025_08_23_091228_create_rental_companies_table',18),(60,'2025_08_23_091248_create_company_vehicles_table',18),(61,'2025_08_23_091258_create_company_contacts_table',18),(62,'2025_08_24_071654_create_asset_categories_table',19),(63,'2025_08_24_071712_create_assets_table',20),(64,'2025_08_24_071719_create_asset_locations_table',20),(65,'2025_08_24_074207_add_foreign_keys_to_assets_table',21),(66,'2025_08_24_095556_add_is_active_to_users_table',22),(67,'2025_08_24_143916_add_employee_id_to_users_table',23),(68,'2025_08_24_153542_create_accounts_table',24),(69,'2025_08_24_153555_create_financial_categories_table',24),(70,'2025_08_24_153600_create_transactions_table',24),(71,'2025_08_24_153700_create_budgets_table',25),(72,'2025_08_26_073453_create_meal_break_plans_table',26),(73,'2025_08_26_073505_create_food_items_table',26),(74,'2025_08_26_073513_create_daily_meal_orders_table',26),(75,'2025_08_26_073520_create_individual_food_orders_table',26),(76,'2025_08_26_074329_create_food_item_locations_table',26),(77,'2024_01_01_000000_create_meal_break_plan_items_table',27),(78,'2024_01_01_000000_create_departments_table',28),(79,'2025_08_28_000000_create_course_locations_table',29),(80,'2025_08_28_000000_enhance_roles_table',30),(81,'2025_08_28_000001_add_department_id_to_employees_table',30),(82,'2025_08_28_000002_add_location_id_to_courses_table',31),(83,'2025_08_28_094551_add_employee_and_department_to_meal_break_plans_table',32),(84,'2025_08_28_184635_create_training_halls_table',33),(85,'2025_08_28_184643_create_training_programs_table',33),(86,'2025_08_28_184650_create_hall_bookings_table',33),(88,'2025_08_28_200000_add_employee_and_course_assignments_to_training_halls_table',34),(89,'2025_09_02_081459_create_rental_car_prices_table',35),(90,'2025_09_02_171306_create_countries_table',36),(91,'2025_09_02_182400_add_missing_columns_to_company_vehicles_table',36),(92,'2025_09_03_101553_create_potential_clients_table',37),(93,'2025_09_03_154543_create_certificates_table',38),(94,'2025_09_03_164907_add_orientation_to_certificates_table',39),(95,'2025_09_03_194714_add_customization_to_certificates_table',40);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outbound_messages`
--

DROP TABLE IF EXISTS `outbound_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outbound_messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned DEFAULT NULL,
  `to_user_id` bigint(20) unsigned DEFAULT NULL,
  `to_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` enum('whatsapp','email','sms','chat') COLLATE utf8mb4_unicode_ci NOT NULL,
  `template_id` bigint(20) unsigned DEFAULT NULL,
  `payload` json NOT NULL,
  `status` enum('queued','sent','failed','delivered','read') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'queued',
  `provider_message_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `outbound_messages_course_instance_id_foreign` (`course_instance_id`),
  KEY `outbound_messages_to_user_id_foreign` (`to_user_id`),
  KEY `outbound_messages_template_id_foreign` (`template_id`),
  CONSTRAINT `outbound_messages_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `outbound_messages_template_id_foreign` FOREIGN KEY (`template_id`) REFERENCES `message_templates` (`id`),
  CONSTRAINT `outbound_messages_to_user_id_foreign` FOREIGN KEY (`to_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outbound_messages`
--

LOCK TABLES `outbound_messages` WRITE;
/*!40000 ALTER TABLE `outbound_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `outbound_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participants`
--

DROP TABLE IF EXISTS `participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `participants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passport_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passport_id_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visa_status` enum('required','pending','approved','rejected','not_required') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'required',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participants`
--

LOCK TABLES `participants` WRITE;
/*!40000 ALTER TABLE `participants` DISABLE KEYS */;
INSERT INTO `participants` VALUES (1,'John Smith 111144','john.smith@example.com','+971-50-123-4567','ABC Corporation','3232323','Egyptian',NULL,NULL,NULL,'PMEC-63762A33',NULL,'required','2025-08-14 10:02:03','2025-08-14 13:34:07'),(2,'Sarah Johnson','sarah.johnson@example.com','+971-55-987-6543','XYZ Company',NULL,'British',NULL,NULL,NULL,'PMEC-E9025AA5',NULL,'required','2025-08-14 10:02:03','2025-08-14 13:34:19'),(7,'Amany El Ganzoury','amany@ag-accessories.com','01002004156',NULL,'11111','Egyptian',NULL,'participants/t62Z3V7hIavoiBtYAxWQAV9HCSRSqHZBkgyO01lp.jpg','participants/t62Z3V7hIavoiBtYAxWQAV9HCSRSqHZBkgyO01lp.jpg','PMEC-B027CC35','participants/documents/wJKFOtV0rkMVmgXoDeJixAklm7zr5CFKtnyW1FSK.jpg','not_required','2025-08-14 13:22:39','2025-08-14 13:22:39'),(8,'Amany El Ganzoury','amany@ag-accessories.com','01002004156',NULL,'11111','Eritrean',NULL,'participants/tI3v5oZoLzSjnHO2n5oS2VOnROYOo1JzKVukjgas.jpg','participants/tI3v5oZoLzSjnHO2n5oS2VOnROYOo1JzKVukjgas.jpg','PMEC-A6EED154','participants/documents/UM0pnFQ9sUjeyPxnEfsDQZ06ZGyfc1eyXPmSS8Wz.jpg','required','2025-08-14 13:23:43','2025-08-14 13:23:43'),(9,'Mohamed Dawd','mohamed@strategygate.org','2028602825',NULL,'1111111114444','Egyptian',NULL,'participants/o7HFf3gUTXrwdTm8TfAGEyO92HsNSGITo2D2bwJp.jpg','participants/o7HFf3gUTXrwdTm8TfAGEyO92HsNSGITo2D2bwJp.jpg','PMEC-860B5CC2','participants/documents/eNQW9fqRiw2tRa2n5Leqi7eU1QCmhOnhQ0DNXMDo.jpg','not_required','2025-08-14 13:30:59','2025-08-14 13:30:59'),(10,'Amany El Ganzoury','amany@ag-accessories.com','01002004156',NULL,'55555','Algerian',NULL,'participants/88YeVRdOTouyYukRChG4qRG1mtQB6BV9Ur2Uin7e.jpg','participants/88YeVRdOTouyYukRChG4qRG1mtQB6BV9Ur2Uin7e.jpg','PMEC-73C2F341','participants/documents/lInXEhsTdHOqZBQVLT2aEagobcJKdkqkBjT7Qreu.jpg','required','2025-08-14 14:49:36','2025-08-14 14:49:36'),(11,'Ahmed Hassan El-Masry','ahmed.hassan@egyptsoft.com','+20 10 1234 5678','Egypt Soft Solutions','A12345678','Egyptian','Senior Project Manager with 8 years experience in IT projects',NULL,NULL,'PMEC-E4D3774E',NULL,'not_required','2025-08-27 02:31:15','2025-08-27 02:31:15'),(12,'Sarah Johnson','sarah.johnson@globaltech.com','+1 555 123 4567','Global Tech Solutions','US98765432','American','Director of Operations, interested in digital transformation',NULL,NULL,'PMEC-E3574BBA',NULL,'required','2025-08-27 02:31:15','2025-08-27 02:31:15'),(13,'Mohammed Al-Rashid','m.alrashid@saudiconsulting.com','+966 50 987 6543','Saudi Consulting Group','SA45678901','Saudi','Strategic Planning Manager, focus on leadership development',NULL,NULL,'PMEC-1C0984A2',NULL,'required','2025-08-27 02:31:15','2025-08-27 02:31:15'),(14,'Fatima Zahra Benali','f.benali@moroccotech.ma','+212 6 123 45678','Morocco Tech Innovations','MA78901234','Moroccan','Innovation Manager, expertise in emerging technologies',NULL,NULL,'PMEC-A251D986',NULL,'required','2025-08-27 02:31:15','2025-08-27 02:31:15'),(15,'Omar Khalil','omar.khalil@qatarventures.qa','+974 3 456 7890','Qatar Ventures','QA56789012','Qatari','Business Development Director, strategic leadership focus',NULL,NULL,'PMEC-20D57122',NULL,'required','2025-08-27 02:31:15','2025-08-27 02:31:15'),(16,'Dr. Mariam El-Sayed','mariam.elsayed@techcorp.com','+20 10 1234 5678','TechCorp Egypt','EG123456789','Egyptian','Expert in AI and machine learning. Senior Software Engineer in Engineering department.',NULL,NULL,'PMEC-5D0EF574',NULL,'not_required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(17,'Eng. Khalid Al-Rashid','khalid.alrashid@innovate.ae','+971 50 9876 5432','Innovate Solutions UAE','AE987654321','Emirati','Specializes in digital transformation projects. Project Manager in Project Management department.',NULL,NULL,'PMEC-ADA53027',NULL,'required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(18,'Ms. Leila Ben Ali','leila.benali@medtech.tn','+216 71 234 567','MedTech Tunisia','TN456789123','Tunisian','Expert in healthcare technology implementation. Healthcare Consultant in Healthcare Solutions department.',NULL,NULL,'PMEC-DC3525D9',NULL,'required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(19,'Prof. Ahmed Mansour','ahmed.mansour@university.edu.sa','+966 50 123 4567','King Fahd University','SA789123456','Saudi','Research focus on cybersecurity and blockchain. Professor of Computer Science in Computer Science department.',NULL,NULL,'PMEC-EEE2793F',NULL,'required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(20,'Eng. Fatima Zahra','fatima.zahra@smartcity.ma','+212 6 12 34 56 78','Smart City Morocco','MA321654987','Moroccan','Specializes in IoT and smart infrastructure. Smart City Architect in Urban Planning department.',NULL,NULL,'PMEC-CF16B39C',NULL,'required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(21,'Dr. Omar Hassan','omar.hassan@fintech.jo','+962 79 876 5432','FinTech Jordan','JO654321987','Jordanian','Expert in blockchain and digital banking. Financial Technology Director in Technology department.',NULL,NULL,'PMEC-FAE0670A',NULL,'required','2025-08-27 04:45:47','2025-08-27 04:45:47'),(22,'Amany El Ganzoury','amany@ag-accessories.com','01002004156',NULL,'4444','Egyptian',NULL,'participants/4UBFP4FkVFbmRo1AOGtKcgq4ZXwFx9S3FXsZ1y07.jpg','participants/4UBFP4FkVFbmRo1AOGtKcgq4ZXwFx9S3FXsZ1y07.jpg','PMEC-421469B9','participants/documents/3Codxd6tzIi57z0royfwqDGVsvLGsl9P1m6TfyhZ.jpg','not_required','2025-08-27 04:51:08','2025-08-27 04:51:08');
/*!40000 ALTER TABLE `participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `per_diems`
--

DROP TABLE IF EXISTS `per_diems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `per_diems` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `rate_per_day` decimal(8,2) NOT NULL,
  `days` int(11) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `per_diems_course_instance_id_foreign` (`course_instance_id`),
  KEY `per_diems_user_id_foreign` (`user_id`),
  CONSTRAINT `per_diems_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `per_diems_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `per_diems`
--

LOCK TABLES `per_diems` WRITE;
/*!40000 ALTER TABLE `per_diems` DISABLE KEYS */;
/*!40000 ALTER TABLE `per_diems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `potential_clients`
--

DROP TABLE IF EXISTS `potential_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `potential_clients` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','contacted','qualified','proposal_sent','negotiating','closed_won','closed_lost') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `source` enum('website','referral','social_media','cold_call','email_campaign','event','other') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'website',
  `estimated_value` decimal(10,2) DEFAULT NULL,
  `last_contact_date` date DEFAULT NULL,
  `next_follow_up` date DEFAULT NULL,
  `assigned_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `potential_clients`
--

LOCK TABLES `potential_clients` WRITE;
/*!40000 ALTER TABLE `potential_clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `potential_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_car_prices`
--

DROP TABLE IF EXISTS `rental_car_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rental_car_prices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `rental_company_id` bigint(20) unsigned NOT NULL,
  `vehicle_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int(11) NOT NULL,
  `from_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `to_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `route_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AED',
  `price_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'per_trip',
  `description` text COLLATE utf8mb4_unicode_ci,
  `additional_charges` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `valid_from_time` time DEFAULT NULL,
  `valid_to_time` time DEFAULT NULL,
  `valid_days` json DEFAULT NULL,
  `season_start_date` date DEFAULT NULL,
  `season_end_date` date DEFAULT NULL,
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_by` bigint(20) unsigned DEFAULT NULL,
  `updated_by` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pricing_rule` (`rental_company_id`,`vehicle_type`,`capacity`,`price_type`),
  KEY `rental_car_prices_created_by_foreign` (`created_by`),
  KEY `rental_car_prices_updated_by_foreign` (`updated_by`),
  KEY `rental_car_prices_rental_company_id_vehicle_type_capacity_index` (`rental_company_id`,`vehicle_type`,`capacity`),
  KEY `rental_car_prices_from_location_to_location_index` (`from_location`,`to_location`),
  KEY `rental_car_prices_is_active_is_available_index` (`is_active`,`is_available`),
  KEY `rental_car_prices_price_type_index` (`price_type`),
  CONSTRAINT `rental_car_prices_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `rental_car_prices_rental_company_id_foreign` FOREIGN KEY (`rental_company_id`) REFERENCES `rental_companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rental_car_prices_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_car_prices`
--

LOCK TABLES `rental_car_prices` WRITE;
/*!40000 ALTER TABLE `rental_car_prices` DISABLE KEYS */;
/*!40000 ALTER TABLE `rental_car_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_companies`
--

DROP TABLE IF EXISTS `rental_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rental_companies` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_hours` json DEFAULT NULL,
  `primary_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primary_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registration_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tax_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_expiry` date DEFAULT NULL,
  `services_offered` json DEFAULT NULL,
  `coverage_areas` json DEFAULT NULL,
  `minimum_rental_hours` decimal(8,2) NOT NULL DEFAULT '24.00',
  `offers_insurance` tinyint(1) NOT NULL DEFAULT '1',
  `offers_delivery` tinyint(1) NOT NULL DEFAULT '0',
  `delivery_fee` decimal(8,2) DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  `payment_methods` json DEFAULT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'AED',
  `cancellation_fee` decimal(8,2) DEFAULT NULL,
  `cancellation_hours` int(11) DEFAULT NULL,
  `terms_and_conditions` text COLLATE utf8mb4_unicode_ci,
  `cancellation_policy` text COLLATE utf8mb4_unicode_ci,
  `damage_policy` text COLLATE utf8mb4_unicode_ci,
  `rating` decimal(3,2) DEFAULT NULL,
  `total_reviews` int(11) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `additional_info` json DEFAULT NULL,
  `internal_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `rental_companies_slug_unique` (`slug`),
  KEY `rental_companies_is_active_is_verified_index` (`is_active`,`is_verified`),
  KEY `rental_companies_city_state_index` (`city`,`state`),
  KEY `rental_companies_rating_index` (`rating`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_companies`
--

LOCK TABLES `rental_companies` WRITE;
/*!40000 ALTER TABLE `rental_companies` DISABLE KEYS */;
INSERT INTO `rental_companies` VALUES (1,'Emirates Premier Rentals222','emirates-premier-rentals222','Premium vehicle rental service in Dubai with luxury and economy options.',NULL,'{\"friday\": \"08:00-20:00\", \"monday\": \"08:00-20:00\", \"sunday\": \"09:00-18:00\", \"tuesday\": \"08:00-20:00\", \"saturday\": \"09:00-18:00\", \"thursday\": \"08:00-20:00\", \"wednesday\": \"08:00-20:00\"}','info@emiratespremier.ae','+971-4-123-4567','https://emiratespremier.ae','Sheikh Zayed Road, Financial District','Dubai','Dubai',NULL,'UAE',NULL,NULL,NULL,NULL,'[\"car_rental\", \"luxury_rental\", \"chauffeur_service\"]','[\"Dubai\", \"Abu Dhabi\", \"Sharjah\"]',24.00,1,1,50.00,1000.00,'[\"cash\", \"card\", \"bank_transfer\"]','AED',NULL,NULL,NULL,NULL,NULL,4.80,245,1,1,1,NULL,NULL,'2025-08-23 06:31:36','2025-08-23 07:03:17'),(2,'test','test',NULL,NULL,'{\"friday\": \"08:00-18:00\", \"monday\": \"08:00-18:00\", \"sunday\": \"09:00-17:00\", \"tuesday\": \"08:00-18:00\", \"saturday\": \"09:00-17:00\", \"thursday\": \"08:00-18:00\", \"wednesday\": \"08:00-18:00\"}','mohamedfi@gmail.com','0100010000',NULL,NULL,NULL,NULL,NULL,'UAE',NULL,NULL,NULL,NULL,'[\"bus_rental\", \"luxury_rental\", \"chauffeur_service\"]','[]',24.00,0,0,NULL,NULL,'[]','AED',NULL,NULL,NULL,NULL,NULL,NULL,0,1,1,1,NULL,NULL,'2025-09-02 06:21:31','2025-09-02 14:17:55'),(3,'Cairo Car Rentals','cairo-car-rentals','Premier car rental service in Cairo, Egypt.',NULL,NULL,'info@cairorentals.com','+20 2 1234 5678',NULL,NULL,'Cairo',NULL,NULL,'Egypt',NULL,NULL,NULL,NULL,'[\"car_rental\"]','[\"Cairo\", \"Giza\"]',24.00,1,1,50.00,500.00,'[\"cash\", \"credit_card\"]','EGP',100.00,24,NULL,NULL,NULL,4.80,156,1,1,1,NULL,NULL,'2025-09-02 15:33:13','2025-09-02 15:33:13'),(4,'Nile Valley Rentals','nile-valley-rentals','Your trusted partner for car rentals in Egypt. Specializing in comfortable vehicles for business and leisure travel throughout the Nile Valley.',NULL,NULL,'bookings@nilevalleyrentals.com','+20 2 2345 6789',NULL,NULL,'Cairo',NULL,NULL,'Egypt',NULL,NULL,NULL,NULL,'[\"car_rental\", \"luxury_rental\"]','[\"Cairo\", \"Luxor\", \"Aswan\"]',12.00,1,1,75.00,750.00,'[\"credit_card\", \"bank_transfer\"]','EGP',150.00,12,NULL,NULL,NULL,4.60,89,1,1,0,NULL,NULL,'2025-09-02 15:33:31','2025-09-02 15:33:31'),(5,'Red Sea Auto Rentals','red-sea-auto-rentals','Leading car rental service on the Red Sea coast. Perfect for beach getaways and coastal adventures in Sharm El Sheikh and Hurghada.',NULL,NULL,'contact@redseaautorentals.com','+20 69 3456 7890',NULL,NULL,'Sharm El Sheikh',NULL,NULL,'Egypt',NULL,NULL,NULL,NULL,'[\"car_rental\", \"suv_rental\"]','[\"Sharm El Sheikh\", \"Hurghada\", \"Dahab\"]',6.00,1,1,100.00,1000.00,'[\"cash\", \"credit_card\"]','EGP',200.00,6,NULL,NULL,NULL,4.90,234,1,1,1,NULL,NULL,'2025-09-02 15:33:31','2025-09-02 15:33:31'),(6,'Alexandria Fleet Services','alexandria-fleet-services','Professional car rental and fleet management services in Alexandria. Serving the Mediterranean coast with reliable vehicles.',NULL,NULL,'info@alexfleet.com','+20 3 4567 8901',NULL,NULL,'Alexandria',NULL,NULL,'Egypt',NULL,NULL,NULL,NULL,'[\"car_rental\", \"bus_rental\"]','[\"Alexandria\", \"Marsa Matrouh\"]',24.00,1,0,0.00,600.00,'[\"cash\", \"credit_card\", \"bank_transfer\"]','EGP',120.00,48,NULL,NULL,NULL,4.40,67,1,1,0,NULL,NULL,'2025-09-02 15:33:31','2025-09-02 15:33:31');
/*!40000 ALTER TABLE `rental_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `permissions` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `access_level` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin9090','Administrator','Full system access and control','[\"all\"]',0,0,NULL,NULL,1,'2025-08-14 09:10:46','2025-08-28 05:24:41'),(2,'coordinator','Course Coordinator','Manages course operations and logistics','[\"courses\", \"participants\", \"tasks\"]',1,0,NULL,NULL,1,'2025-08-14 09:10:46','2025-08-27 02:30:09'),(3,'trainer','Course Trainer','Delivers training and manages course content','[\"courses\", \"materials\", \"evaluations\"]',1,0,NULL,NULL,1,'2025-08-14 09:10:46','2025-08-27 02:30:09'),(4,'finance','Finance Manager','Handles financial operations and reporting','[\"finance\", \"reports\"]',1,0,NULL,NULL,1,'2025-08-14 09:10:46','2025-08-27 02:30:09'),(14,'support','Support Staff','Provides administrative and logistical support','[\"tasks\", \"support\"]',1,0,NULL,NULL,1,'2025-08-22 04:30:40','2025-08-27 02:30:09'),(15,'manager','Department Manager','Manages department operations and team leadership','[\"employees\", \"tasks\", \"reports\", \"departments\"]',1,0,NULL,NULL,1,'2025-08-22 05:08:24','2025-08-27 02:30:09'),(16,'analyst','Data Analyst','Analyzes data and generates reports','[\"reports\", \"analytics\", \"data\"]',1,0,NULL,NULL,1,'2025-08-22 05:08:24','2025-08-27 02:30:09'),(17,'assistant','Executive Assistant','Provides high-level administrative support','[\"tasks\", \"scheduling\", \"communications\"]',1,0,NULL,NULL,1,'2025-08-22 05:08:24','2025-08-27 02:30:09'),(18,'Catering','catring','Catering','[\"logistics\"]',1,0,NULL,NULL,1,'2025-08-22 05:15:51','2025-08-22 05:15:51'),(19,'Meals','Adminnnn','fdfdf','[\"employees.view\", \"employees.create\", \"employees.edit\", \"employees.delete\", \"employees.manage\"]',1,0,NULL,NULL,1,'2025-08-28 04:50:18','2025-08-28 05:01:21');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('bZEe2ndcCPp9cy70l7Ge589lHpl9jbx5GgIqwkSR',1,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiQWRxaFJOWXNWY0JSaUdqcmtBUFNtMHJJMHdQMXdNWUMwZlh3YVE2RyI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjM0OiJodHRwOi8vMTI3LjAuMC4xOjgwMDEvY2VydGlmaWNhdGVzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9',1756985736);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `assigned_to` bigint(20) unsigned NOT NULL,
  `assigned_by` bigint(20) unsigned DEFAULT NULL,
  `due_date` datetime NOT NULL,
  `completed_date` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `course_id` bigint(20) unsigned DEFAULT NULL,
  `task_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `assigned_user_id` bigint(20) unsigned DEFAULT NULL,
  `assigned_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` enum('low','normal','high') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `status` enum('pending','in_progress','done','blocked') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_course_instance_id_foreign` (`course_instance_id`),
  KEY `tasks_assigned_user_id_foreign` (`assigned_user_id`),
  KEY `tasks_course_id_foreign` (`course_id`),
  CONSTRAINT `tasks_assigned_user_id_foreign` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `tasks_course_id_foreign` FOREIGN KEY (`course_id`) REFERENCES `archived_courses` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tasks_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,NULL,'Prepare Course Materials','Prepare presentation slides and handouts for Advanced Project Management course',0,NULL,'2025-08-21 14:25:04',NULL,NULL,NULL,'general',1,NULL,'high','pending','2025-08-14 11:25:04','2025-08-14 11:25:04'),(2,NULL,'Prepare Course Materials','Prepare presentation slides and handouts for Advanced Project Management course',0,NULL,'2025-08-21 14:25:28',NULL,NULL,NULL,'general',1,NULL,'high','pending','2025-08-14 11:25:28','2025-08-14 11:25:28'),(3,NULL,'Review Participant Applications','Review and approve applications for Leadership Excellence Program',0,NULL,'2025-08-17 14:25:28',NULL,NULL,NULL,'general',1,NULL,'normal','in_progress','2025-08-14 11:25:28','2025-08-14 11:25:28'),(4,NULL,'Schedule Training Sessions','Coordinate with trainers and book training rooms',0,NULL,'2025-08-19 14:25:28',NULL,NULL,NULL,'general',1,NULL,'high','pending','2025-08-14 11:25:28','2025-08-14 11:25:28'),(5,NULL,'Prepare PMO1 Course Materials','Review and update all training materials for the upcoming PMO1 course',3,2,'2025-08-29 07:32:06',NULL,NULL,1,'course-related',NULL,NULL,'high','in_progress','2025-08-22 04:32:06','2025-08-22 04:32:06'),(6,NULL,'Update Participant Database','Clean and update the participant database with latest information',5,2,'2025-08-25 07:32:06',NULL,NULL,NULL,'administrative',NULL,NULL,'normal','pending','2025-08-22 04:32:06','2025-08-22 04:32:06'),(7,NULL,'Review Course Evaluations','Analyze feedback from recent PMO1 course participants',3,2,'2025-08-27 07:32:06',NULL,NULL,1,'course-related',NULL,NULL,'normal','pending','2025-08-22 04:32:06','2025-08-22 04:32:06'),(8,NULL,'Prepare Financial Report','Generate monthly financial report for training operations',5,2,'2025-08-24 07:32:06',NULL,NULL,NULL,'financial',NULL,NULL,'high','pending','2025-08-22 04:32:06','2025-08-22 04:32:06'),(9,NULL,'Prepare PMO1 Course Materials','Review and update all training materials for the upcoming PMO1 course',3,2,'2025-08-29 07:32:27',NULL,NULL,1,'course-related',NULL,NULL,'high','in_progress','2025-08-22 04:32:27','2025-08-22 04:32:27'),(10,NULL,'Update Participant Database','Clean and update the participant database with latest information',5,2,'2025-08-25 07:32:27',NULL,NULL,NULL,'administrative',NULL,NULL,'normal','pending','2025-08-22 04:32:27','2025-08-22 04:32:27'),(11,NULL,'Review Course Evaluations','Analyze feedback from recent PMO1 course participants',3,2,'2025-08-27 07:32:27',NULL,NULL,1,'course-related',NULL,NULL,'normal','pending','2025-08-22 04:32:27','2025-08-22 04:32:27'),(12,NULL,'Prepare Financial Report','Generate monthly financial report for training operations',5,2,'2025-08-24 07:32:27',NULL,NULL,NULL,'financial',NULL,NULL,'high','pending','2025-08-22 04:32:27','2025-08-22 04:32:27'),(13,NULL,'catering','Catering',5,NULL,'2025-08-29 00:00:00',NULL,NULL,NULL,'general',NULL,NULL,'normal','pending','2025-08-22 05:19:39','2025-08-22 05:19:39'),(14,NULL,'yyy','yyy',3,NULL,'2025-08-29 00:00:00',NULL,NULL,NULL,'general',NULL,NULL,'high','pending','2025-08-22 05:28:17','2025-08-22 05:28:17'),(15,NULL,'Prepare PMO1 Course Materials','Review and update all training materials for the upcoming PMO1 course',3,2,'2025-09-03 05:29:16',NULL,NULL,1,'course-related',NULL,NULL,'high','in_progress','2025-08-27 02:29:16','2025-08-27 02:29:16'),(16,NULL,'Update Participant Database','Clean and update the participant database with latest information',5,2,'2025-08-30 05:29:16',NULL,NULL,NULL,'administrative',NULL,NULL,'normal','pending','2025-08-27 02:29:16','2025-08-27 02:29:16'),(17,NULL,'Review Course Evaluations','Analyze feedback from recent PMO1 course participants',3,2,'2025-09-01 05:29:16',NULL,NULL,1,'course-related',NULL,NULL,'normal','pending','2025-08-27 02:29:16','2025-08-27 02:29:16'),(18,NULL,'Prepare Financial Report','Generate monthly financial report for training operations',5,2,'2025-08-29 05:29:16',NULL,NULL,NULL,'financial',NULL,NULL,'high','pending','2025-08-27 02:29:16','2025-08-27 02:29:16'),(19,NULL,'Prepare PMO1 Course Materials','Review and update all training materials for the upcoming PMO1 course',3,2,'2025-09-03 05:30:09',NULL,NULL,1,'course-related',NULL,NULL,'high','in_progress','2025-08-27 02:30:09','2025-08-27 02:30:09'),(20,NULL,'Update Participant Database','Clean and update the participant database with latest information',5,2,'2025-08-30 05:30:09',NULL,NULL,NULL,'administrative',NULL,NULL,'normal','pending','2025-08-27 02:30:09','2025-08-27 02:30:09'),(21,NULL,'Review Course Evaluations','Analyze feedback from recent PMO1 course participants',3,2,'2025-09-01 05:30:09',NULL,NULL,1,'course-related',NULL,NULL,'normal','pending','2025-08-27 02:30:09','2025-08-27 02:30:09'),(22,NULL,'Prepare Financial Report','Generate monthly financial report for training operations',5,2,'2025-08-29 05:30:09',NULL,NULL,NULL,'financial',NULL,NULL,'high','pending','2025-08-27 02:30:09','2025-08-27 02:30:09');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trainers`
--

DROP TABLE IF EXISTS `trainers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `trainers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `expertise_areas` text COLLATE utf8mb4_unicode_ci,
  `qualifications` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years_experience` int(11) NOT NULL DEFAULT '0',
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cv_document` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','on_leave') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `currency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EGP',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trainers_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trainers`
--

LOCK TABLES `trainers` WRITE;
/*!40000 ALTER TABLE `trainers` DISABLE KEYS */;
INSERT INTO `trainers` VALUES (2,'Eng. Sarah Mahmoud','sarah.mahmoud@pmec.com','+20 100 234 5678','Technical Training Specialist','Certified technical trainer with expertise in modern software development and IT management.','Software Development, IT Management, Digital Transformation, Agile','MSc in Computer Science, Certified Scrum Master, AWS Certified',12,NULL,NULL,'active',450.00,'EGP','Expert in modern software development methodologies.','2025-08-14 16:20:41','2025-08-14 17:01:24'),(3,'Prof. Omar Ali','omar.ali@pmec.com','+20 100 345 6789','Academic Training Director','Professor with extensive experience in curriculum development and educational leadership.','Curriculum Development, Educational Leadership, Research Methods, Assessment','PhD in Education, Professor of Educational Leadership, Certified Curriculum Developer',20,NULL,NULL,'active',600.00,'EGP','Specializes in academic and research training programs.','2025-08-14 16:20:41','2025-08-14 16:20:41'),(4,'Ms. Fatima Khalil','fatima.khalil@pmec.com','+20 100 456 7890','Soft Skills Trainer','Certified communication and soft skills trainer with international experience.','Communication Skills, Presentation Skills, Customer Service, Team Building','MA in Communication, Certified Professional Speaker, NLP Practitioner',10,NULL,NULL,'active',400.00,'EGP','Expert in interpersonal and communication skills development.','2025-08-14 16:20:41','2025-08-14 16:20:41'),(5,'Dr. Ahmed Hassan','ahmed.hassan@pmec.com','+20 100 123 4567','Senior Training Consultant','Expert in leadership development and organizational management with over 15 years of experience.','Leadership, Management, Strategic Planning, Team Building','PhD in Business Administration, MBA, Certified Professional Trainer',15,NULL,NULL,'active',500.00,'EGP','Specializes in executive training programs.','2025-08-27 02:29:16','2025-08-27 02:29:16');
/*!40000 ALTER TABLE `trainers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_halls`
--

DROP TABLE IF EXISTS `training_halls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `training_halls` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT '30',
  `facilities` json DEFAULT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_employee_id` bigint(20) unsigned DEFAULT NULL,
  `assigned_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignment_date` date DEFAULT NULL,
  `assignment_notes` text COLLATE utf8mb4_unicode_ci,
  `specialized_courses` json DEFAULT NULL,
  `is_general_purpose` tinyint(1) NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `training_halls_code_unique` (`code`),
  KEY `training_halls_assigned_employee_id_foreign` (`assigned_employee_id`),
  CONSTRAINT `training_halls_assigned_employee_id_foreign` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_halls`
--

LOCK TABLES `training_halls` WRITE;
/*!40000 ALTER TABLE `training_halls` DISABLE KEYS */;
INSERT INTO `training_halls` VALUES (1,'مكانك اسكندرية','ALEX','Modern training facility in Alexandria with state-of-the-art equipment and multiple training rooms','Alexandria, Egypt','الإسكندرية',50,'[\"Computer Lab\", \"Projector & Screen\", \"Whiteboards\", \"Air Conditioning\", \"WiFi\", \"Coffee Station\", \"Parking\"]','Ahmed Hassan','+20-3-1234-5678','alexandria@yourplace.com',NULL,NULL,NULL,NULL,NULL,1,1,1,'2025-08-28 15:52:33','2025-08-29 04:35:20'),(2,'مكانك مدينة نصر','NASR','Professional training center in Nasr City specializing in management and business courses','Nasr City, Cairo, Egypt','القاهرة',40,'[\"Conference Room\", \"Presentation Equipment\", \"Flip Charts\", \"Air Conditioning\", \"WiFi\", \"Refreshments\", \"Secure Parking\"]','Fatima Ali','+20-2-9876-5432','nasrcity@yourplace.com',NULL,NULL,NULL,NULL,NULL,1,1,2,'2025-08-28 15:52:33','2025-08-29 04:35:20');
/*!40000 ALTER TABLE `training_halls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_programs`
--

DROP TABLE IF EXISTS `training_programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `training_programs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `duration_hours` int(11) NOT NULL DEFAULT '3',
  `total_sessions` int(11) NOT NULL DEFAULT '1',
  `price_per_session` decimal(10,2) DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prerequisites` json DEFAULT NULL,
  `learning_objectives` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `training_programs_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_programs`
--

LOCK TABLES `training_programs` WRITE;
/*!40000 ALTER TABLE `training_programs` DISABLE KEYS */;
INSERT INTO `training_programs` VALUES (5,'الرعاية الصحية','HC001','Comprehensive healthcare training program covering medical procedures, patient care, and healthcare management',120,8,150.00,'Healthcare','Intermediate','[\"Basic medical knowledge\", \"Healthcare certification\"]','[\"Patient care procedures\", \"Medical equipment operation\", \"Safety protocols\"]',1,1,'2025-08-29 04:33:13','2025-08-29 04:33:13'),(6,'توربينات الغاز','GT002','Advanced training in gas turbine operation, maintenance, and engineering principles',80,5,200.00,'Engineering','Advanced','[\"Engineering background\", \"Mechanical knowledge\"]','[\"Turbine operation\", \"Maintenance procedures\", \"Safety protocols\"]',1,2,'2025-08-29 04:33:13','2025-08-29 04:33:13'),(7,'الصيانة الاليكترونية','EM003','Electronic equipment maintenance, troubleshooting, and repair techniques',100,12,180.00,'Electronics','Intermediate','[\"Basic electronics\", \"Technical skills\"]','[\"Circuit troubleshooting\", \"Component replacement\", \"Testing procedures\"]',1,3,'2025-08-29 04:33:13','2025-08-29 04:33:13'),(8,'إدارة الموارد','RM004','Strategic resource planning, allocation, and optimization for organizations',60,6,175.00,'Management','Beginner','[\"Basic management concepts\"]','[\"Resource planning\", \"Optimization techniques\", \"Cost management\"]',1,4,'2025-08-29 04:33:13','2025-08-29 04:33:13');
/*!40000 ALTER TABLE `training_programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('income','expense','transfer') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `transaction_date` date NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `account_id` bigint(20) unsigned DEFAULT NULL,
  `category_id` bigint(20) unsigned DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `related_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_id` bigint(20) unsigned DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_account_id_foreign` (`account_id`),
  KEY `transactions_category_id_foreign` (`category_id`),
  CONSTRAINT `transactions_account_id_foreign` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `transactions_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `financial_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'INV-2024-001','income',5000.00,'USD','2025-08-19','Advanced Project Management Course - Dubai Batch 2024','Full payment received for 20 participants',1,1,1,'course',1,'completed','\"{\\\"participants\\\":20,\\\"course_duration\\\":\\\"3 days\\\",\\\"location\\\":\\\"Dubai\\\",\\\"course_type\\\":\\\"Project Management\\\"}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(2,'INV-2024-002','income',3500.00,'USD','2025-08-21','Corporate Training Consultation - ABC Company','Strategic planning consultation for training department',1,2,1,'consulting',1,'completed','\"{\\\"client\\\":\\\"ABC Company\\\",\\\"consultation_hours\\\":14,\\\"service_type\\\":\\\"Training Strategy\\\"}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(3,'EXP-2024-001','expense',2000.00,'USD','2025-08-20','Trainer salary for Project Management Course','Payment for certified PMP trainer',1,6,1,'course',1,'completed','\"{\\\"trainer_name\\\":\\\"Dr. Sarah Johnson\\\",\\\"certification\\\":\\\"PMP\\\",\\\"course_id\\\":1,\\\"payment_type\\\":\\\"salary\\\"}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(4,'EXP-2024-002','expense',450.00,'USD','2025-08-18','Course materials and workbooks for PM Course','50 workbooks, project templates, and case studies',1,13,1,'course',1,'completed','\"{\\\"materials_count\\\":50,\\\"item_types\\\":[\\\"workbooks\\\",\\\"templates\\\",\\\"case_studies\\\"],\\\"supplier\\\":\\\"Training Materials Plus\\\",\\\"course_id\\\":1}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(5,'EXP-2024-003','expense',800.00,'USD','2025-08-17','Trainer travel to Dubai for PM Course','Flight tickets and 2 nights hotel accommodation',1,9,1,'course',1,'completed','\"{\\\"traveler\\\":\\\"Dr. Sarah Johnson\\\",\\\"destination\\\":\\\"Dubai\\\",\\\"duration\\\":\\\"2 nights\\\",\\\"transportation\\\":\\\"Flight\\\",\\\"course_id\\\":1}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(6,'EXP-2024-004','expense',1200.00,'USD','2025-08-16','Training venue rental - Dubai Business Center','Conference room for 3 days, includes AV equipment',1,10,1,'course',1,'completed','\"{\\\"venue\\\":\\\"Dubai Business Center\\\",\\\"room_type\\\":\\\"Conference Room\\\",\\\"duration\\\":\\\"3 days\\\",\\\"includes\\\":[\\\"AV equipment\\\",\\\"WiFi\\\",\\\"Coffee service\\\"],\\\"course_id\\\":1}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(7,'EXP-2024-005','expense',300.00,'USD','2025-08-19','Lunch and coffee breaks for PM Course participants','Daily catering for 20 participants, 3 days',1,11,1,'course',1,'completed','\"{\\\"participants\\\":20,\\\"duration\\\":\\\"3 days\\\",\\\"meals\\\":[\\\"lunch\\\",\\\"coffee_breaks\\\"],\\\"supplier\\\":\\\"Dubai Catering Services\\\",\\\"course_id\\\":1}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(8,'INV-2024-003','income',3200.00,'USD','2025-08-14','Leadership Skills Workshop - Riyadh','Payment for 15 participants in leadership workshop',1,1,1,'course',2,'completed','\"{\\\"participants\\\":15,\\\"course_duration\\\":\\\"2 days\\\",\\\"location\\\":\\\"Riyadh\\\",\\\"course_type\\\":\\\"Leadership Skills\\\"}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(9,'EXP-2024-006','expense',250.00,'USD','2025-08-12','Digital marketing for Dubai PM Course','Social media ads and email campaigns',1,8,1,'course',1,'completed','\"{\\\"marketing_type\\\":\\\"Digital\\\",\\\"channels\\\":[\\\"social_media\\\",\\\"email\\\"],\\\"target_audience\\\":\\\"Project Managers\\\",\\\"course_id\\\":1}\"','2025-08-24 14:32:04','2025-08-24 14:32:04'),(10,'EXP-2024-007','expense',180.00,'USD','2025-08-09','Projector maintenance for training room','Regular maintenance and bulb replacement',1,14,1,'equipment',1,'completed','\"{\\\"equipment\\\":\\\"Projector\\\",\\\"maintenance_type\\\":\\\"Regular\\\",\\\"service_provider\\\":\\\"Tech Support Plus\\\",\\\"location\\\":\\\"Training Room\\\"}\"','2025-08-24 14:32:04','2025-08-24 14:32:04');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_bookings`
--

DROP TABLE IF EXISTS `transport_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transport_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `type` enum('taxi','shuttle','rental','rail','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pickup_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dropoff_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost` decimal(8,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `status` enum('draft','booked','confirmed','canceled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transport_bookings_course_instance_id_foreign` (`course_instance_id`),
  CONSTRAINT `transport_bookings_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_bookings`
--

LOCK TABLES `transport_bookings` WRITE;
/*!40000 ALTER TABLE `transport_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportation_bookings`
--

DROP TABLE IF EXISTS `transportation_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transportation_bookings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `booking_reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_id_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pickup_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dropoff_location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pickup_datetime` datetime NOT NULL,
  `dropoff_datetime` datetime NOT NULL,
  `duration_hours` int(11) NOT NULL,
  `duration_days` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `booking_status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `special_requests` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `driver_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `driver_license` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fuel_charge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `insurance_charge` decimal(10,2) NOT NULL DEFAULT '0.00',
  `additional_charges` decimal(10,2) NOT NULL DEFAULT '0.00',
  `damage_report` text COLLATE utf8mb4_unicode_ci,
  `damage_charges` decimal(10,2) NOT NULL DEFAULT '0.00',
  `actual_pickup_datetime` datetime DEFAULT NULL,
  `actual_dropoff_datetime` datetime DEFAULT NULL,
  `actual_mileage` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transportation_bookings_booking_reference_unique` (`booking_reference`),
  KEY `transportation_bookings_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `transportation_bookings_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `transportation_vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportation_bookings`
--

LOCK TABLES `transportation_bookings` WRITE;
/*!40000 ALTER TABLE `transportation_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `transportation_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportation_maintenance`
--

DROP TABLE IF EXISTS `transportation_maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transportation_maintenance` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) unsigned NOT NULL,
  `maintenance_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `maintenance_date` date NOT NULL,
  `next_maintenance_date` date DEFAULT NULL,
  `cost` decimal(10,2) NOT NULL,
  `mechanic_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mechanic_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `garage_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `garage_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `work_performed` text COLLATE utf8mb4_unicode_ci,
  `parts_replaced` text COLLATE utf8mb4_unicode_ci,
  `mileage_at_service` int(11) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'completed',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `invoice_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warranty_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transportation_maintenance_vehicle_id_foreign` (`vehicle_id`),
  CONSTRAINT `transportation_maintenance_vehicle_id_foreign` FOREIGN KEY (`vehicle_id`) REFERENCES `transportation_vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportation_maintenance`
--

LOCK TABLES `transportation_maintenance` WRITE;
/*!40000 ALTER TABLE `transportation_maintenance` DISABLE KEYS */;
/*!40000 ALTER TABLE `transportation_maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportation_vehicles`
--

DROP TABLE IF EXISTS `transportation_vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transportation_vehicles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_plate` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seats` int(11) NOT NULL,
  `fuel_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transmission` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `daily_rate` decimal(10,2) NOT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `weekly_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_maintenance` date DEFAULT NULL,
  `next_maintenance` date DEFAULT NULL,
  `mileage` int(11) NOT NULL DEFAULT '0',
  `maintenance_notes` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transportation_vehicles_license_plate_unique` (`license_plate`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportation_vehicles`
--

LOCK TABLES `transportation_vehicles` WRITE;
/*!40000 ALTER TABLE `transportation_vehicles` DISABLE KEYS */;
INSERT INTO `transportation_vehicles` VALUES (1,'Sedan','BYD','F3','2025','212112','red',4,'Gasoline','Automatic','[\"GPS Navigation\",\"Sunroof\"]',NULL,1000.00,50.00,NULL,NULL,'available','Nacer City',NULL,NULL,NULL,0,NULL,1,'2025-09-02 06:48:39','2025-09-02 06:48:39');
/*!40000 ALTER TABLE `transportation_vehicles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role_id` bigint(20) unsigned NOT NULL,
  `employee_id` bigint(20) unsigned DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_employee_id_foreign` (`employee_id`),
  CONSTRAINT `users_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin User','admin@pmec.com','2025-08-14 09:10:46','$2y$12$9WEY9mePZynphlCXX3a/Q.ayhOXGLbH/urs/JtLxnrz5S6yw/.oKm','w4e7wqLmoD','2025-08-14 09:10:46','2025-08-14 09:10:46',1,NULL,1,NULL),(2,'Admin User','admin@pmec.test',NULL,'$2y$12$v9GFukPDlo0yrAwmgMJ4bOzFmib4WNv2yaGXyqRr5tAWfpve/icsO',NULL,'2025-08-14 09:12:47','2025-08-26 14:41:14',1,NULL,1,NULL),(4,'Amany','am@pmec.test',NULL,'$2y$12$fCd7Qvtf4cWAEF8pSl/r0.oRPz/5vaVx90l6aRUUGYWqnAnXyT8C6',NULL,'2025-08-24 09:27:53','2025-08-24 11:58:08',1,11,1,NULL),(5,'Test Admin','admin@test.com',NULL,'$2y$12$N7G7j1NDRDW1QgFHvg51.umxm92JpSKlqf4Iouefk3YEWm/8pnxjK',NULL,'2025-08-27 14:27:54','2025-08-27 14:27:54',1,NULL,1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visa_applications`
--

DROP TABLE IF EXISTS `visa_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visa_applications` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `course_instance_id` bigint(20) unsigned NOT NULL,
  `traveler_user_id` bigint(20) unsigned DEFAULT NULL,
  `destination_country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `application_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitted_at` datetime DEFAULT NULL,
  `status` enum('draft','submitted','approved','denied') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `fee` decimal(8,2) NOT NULL DEFAULT '0.00',
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visa_applications_course_instance_id_foreign` (`course_instance_id`),
  KEY `visa_applications_traveler_user_id_foreign` (`traveler_user_id`),
  CONSTRAINT `visa_applications_course_instance_id_foreign` FOREIGN KEY (`course_instance_id`) REFERENCES `course_instances` (`id`) ON DELETE CASCADE,
  CONSTRAINT `visa_applications_traveler_user_id_foreign` FOREIGN KEY (`traveler_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visa_applications`
--

LOCK TABLES `visa_applications` WRITE;
/*!40000 ALTER TABLE `visa_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `visa_applications` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-04 14:53:07
