-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: e_commerce_shoes
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (1,'LMao','haha','48946'),(5,'Ba Ria','53 Tran Quang Dieu','13554'),(6,'Ba Ria','53 Tran Quang Dieu','13554');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `total_item` int DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FKl70asp4l4w0jmbm1tqyofho4o` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (7,0,0,1),(8,0,0,2);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `cart_item_id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `order_item_id` bigint DEFAULT NULL,
  `product_item_id` bigint DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `UK_ea012d3uskfsh9jy1jynlv56r` (`order_item_id`),
  KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  KEY `FKj46f52s31n4pbpgucd6x2ci46` (`product_item_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `FKj46f52s31n4pbpgucd6x2ci46` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`product_item_id`),
  CONSTRAINT `FKjf5jd3pbctwr3xerd2hlsa6m1` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (14,20000,0,8,NULL,72,0),(15,5000,0,8,NULL,73,0),(16,30000,0,8,NULL,74,0);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `parent_category_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `FKs2ride9gvilxy2tcuv7witnxc` (`parent_category_id`),
  CONSTRAINT `FKs2ride9gvilxy2tcuv7witnxc` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,NULL,'Nam'),(2,NULL,'Nu'),(3,1,'Nam1'),(4,1,'Nam2'),(5,2,'Nu1'),(6,3,'Nam1_1'),(7,4,'Nam2_1'),(8,3,'Nam1_2'),(9,5,'Nu1_1'),(10,8,'Nam1_2_1'),(11,8,'Nam1_2_2'),(12,5,'Nu1_2');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_promotion`
--

DROP TABLE IF EXISTS `category_promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_promotion` (
  `category_id` bigint NOT NULL,
  `promotion_id` bigint NOT NULL,
  KEY `FKifq0vw6tqt1urble6pp6jsnbt` (`promotion_id`),
  KEY `FK87cxk17uorcmb982dwfx6ofee` (`category_id`),
  CONSTRAINT `FK87cxk17uorcmb982dwfx6ofee` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `FKifq0vw6tqt1urble6pp6jsnbt` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_promotion`
--

LOCK TABLES `category_promotion` WRITE;
/*!40000 ALTER TABLE `category_promotion` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `estimated_shipping_time` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  `total_item` int DEFAULT NULL,
  `total_payment` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  `delivery_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf5464gxwc32ongdvka2rtvw96` (`address_id`),
  KEY `FKtkrur7wg4d8ax0pwgo0vmy20c` (`delivery_id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKf5464gxwc32ongdvka2rtvw96` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FKtkrur7wg4d8ax0pwgo0vmy20c` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`),
  CONSTRAINT `orders_chk_1` CHECK ((`status` between 0 and 6))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_type_enum` tinyint DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `cvv` varchar(255) DEFAULT NULL,
  `address_banking` varchar(255) DEFAULT NULL,
  `card_number` varchar(255) DEFAULT NULL,
  `date_expire` varchar(255) DEFAULT NULL,
  `name_holder` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoq4hku62glsu292jk2x5dl4f8` (`order_id`),
  KEY `FK9qgi86n91j5kxnymanelaa1ag` (`user_id`),
  CONSTRAINT `FK9qgi86n91j5kxnymanelaa1ag` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKoq4hku62glsu292jk2x5dl4f8` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `payment_method_chk_1` CHECK ((`payment_type_enum` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,0,NULL,2,'322','4556461','0445123384648','03/28','VU NGUYEN TRUNG KHANG','704894');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'giay the thao dark','giay the thao dark','lmao',6,'2023-11-30 04:46:46.000000','2023-11-30 04:46:48.000000',_binary ''),(2,'giay the thao','giay the thao cho nam','dark',10,'2023-11-30 04:46:51.000000','2023-11-30 04:46:55.000000',_binary ''),(3,'giay lmao','dep','burh',11,'2023-11-30 04:46:55.000000','2023-11-30 04:46:57.000000',_binary ''),(10,'lmao','test lai update','https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',11,'2023-11-30 04:47:00.000000','2023-12-01 22:20:15.702000',_binary ''),(11,'giay nay dat lam','giay the thao','https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,'2023-11-30 04:46:59.000000','2023-11-30 04:47:01.000000',_binary ''),(15,'giay ben nu','giay nu','https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,'2023-12-01 04:19:15.710000','2023-12-01 04:19:15.710000',_binary ''),(19,'giay ben nu nha','giay nu siu vip','https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',7,'2023-12-01 04:36:59.896000','2023-12-01 04:36:59.896000',_binary ''),(20,'giay ben nu nha','giay nu siu vip','https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',7,'2023-12-01 04:37:49.388000','2023-12-01 04:37:49.388000',_binary '');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_configuration`
--

DROP TABLE IF EXISTS `product_configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_configuration` (
  `product_configuration_id` bigint NOT NULL AUTO_INCREMENT,
  `product_item_id` bigint DEFAULT NULL,
  `variation_option_id` bigint DEFAULT NULL,
  PRIMARY KEY (`product_configuration_id`),
  KEY `FKd9wo8k6srbadxvi3l87wfqnfx` (`product_item_id`),
  KEY `FKm5sgep9e3ot2covfpw9l3ml7s` (`variation_option_id`),
  CONSTRAINT `FKd9wo8k6srbadxvi3l87wfqnfx` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`product_item_id`),
  CONSTRAINT `FKm5sgep9e3ot2covfpw9l3ml7s` FOREIGN KEY (`variation_option_id`) REFERENCES `variation_option` (`variation_option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=529 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_configuration`
--

LOCK TABLES `product_configuration` WRITE;
/*!40000 ALTER TABLE `product_configuration` DISABLE KEYS */;
INSERT INTO `product_configuration` VALUES (1,1,1),(3,1,4),(4,2,1),(5,2,5),(172,74,2),(173,74,5),(174,75,37),(175,75,6),(176,76,38),(177,76,4),(399,77,1),(400,77,4),(401,78,36),(402,78,5),(403,79,2),(404,79,4),(405,80,37),(406,80,6),(407,81,38),(408,81,4),(470,73,220),(471,73,221),(478,87,1),(479,87,193),(480,88,36),(481,88,194),(482,89,2),(483,89,193),(484,90,37),(485,90,86),(486,91,38),(487,91,193),(504,95,208),(505,95,209),(506,96,210),(507,96,211),(508,97,212),(509,97,213),(510,98,214),(511,98,215),(512,99,216),(513,99,217),(514,100,208),(515,100,209),(516,101,210),(517,101,211),(518,102,212),(519,102,209),(520,103,214),(521,103,215),(522,104,216),(523,104,209),(525,72,218),(526,72,219);
/*!40000 ALTER TABLE `product_configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_item`
--

DROP TABLE IF EXISTS `product_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_item` (
  `product_item_id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `quantity_in_stock` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_item_id`),
  KEY `FKa9mjpi98ark8eovbtnnreygbb` (`product_id`),
  CONSTRAINT `FKa9mjpi98ark8eovbtnnreygbb` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_item`
--

LOCK TABLES `product_item` WRITE;
/*!40000 ALTER TABLE `product_item` DISABLE KEYS */;
INSERT INTO `product_item` VALUES (1,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',1,2,_binary '','2023-11-30 04:39:46.000000','2023-11-30 04:39:50.000000',NULL),(2,40000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',1,2,_binary '','2023-11-30 04:39:49.000000','2023-11-30 04:39:51.000000',NULL),(72,20000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701444015/Product/fyaw74fqqtwiy01rjqms.jpg',18,10,_binary '','2023-11-30 04:39:53.000000','2023-12-01 22:20:15.578000','test lai update Color ezgsrgre'),(73,5000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',18,10,_binary '','2023-11-30 04:39:54.000000','2023-12-01 22:20:15.661000','test lai update Color oiajwdoiajwdo'),(74,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,10,_binary '','2023-11-30 04:39:57.000000','2023-11-30 04:40:00.000000',NULL),(75,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,10,_binary '','2023-11-30 04:39:58.000000','2023-11-30 04:40:00.000000',NULL),(76,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,10,_binary '','2023-11-30 04:40:02.000000','2023-11-30 04:40:01.000000',NULL),(77,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,11,_binary '','2023-11-30 04:40:10.000000','2023-11-30 04:40:03.000000',NULL),(78,45000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',11,11,_binary '\0','2023-11-30 04:40:17.000000','2023-11-30 04:40:11.000000',NULL),(79,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,11,_binary '\0','2023-11-30 04:40:28.000000','2023-11-30 04:40:13.000000',NULL),(80,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,11,_binary '\0','2023-11-30 04:40:27.000000','2023-11-30 04:40:29.000000',NULL),(81,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,11,_binary '\0','2023-11-30 04:40:31.000000','2023-11-30 04:40:30.000000',NULL),(87,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,15,_binary '','2023-12-01 04:19:15.468000','2023-12-01 04:19:15.468000','giay nu  Color Red'),(88,45000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',11,15,_binary '','2023-12-01 04:19:15.566000','2023-12-01 04:19:15.566000','giay nu  Color Blue'),(89,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,15,_binary '','2023-12-01 04:19:15.621000','2023-12-01 04:19:15.621000','giay nu  Color Red'),(90,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,15,_binary '','2023-12-01 04:19:15.666000','2023-12-01 04:19:15.666000','giay nu  Color Black'),(91,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,15,_binary '','2023-12-01 04:19:15.696000','2023-12-01 04:19:15.696000','giay nu  Color Red'),(95,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,19,_binary '','2023-12-01 04:36:59.631000','2023-12-01 04:36:59.631000','giay nu siu vip  Color Red'),(96,45000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',11,19,_binary '','2023-12-01 04:36:59.731000','2023-12-01 04:36:59.731000','giay nu siu vip  Color Blue'),(97,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,19,_binary '','2023-12-01 04:36:59.782000','2023-12-01 04:36:59.782000','giay nu siu vip  Color Red'),(98,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,19,_binary '','2023-12-01 04:36:59.831000','2023-12-01 04:36:59.831000','giay nu siu vip  Color Black'),(99,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,19,_binary '','2023-12-01 04:36:59.877000','2023-12-01 04:36:59.877000','giay nu siu vip  Color Red'),(100,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,20,_binary '','2023-12-01 04:37:49.283000','2023-12-01 04:37:49.283000','giay nu siu vip  Color Red'),(101,45000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',11,20,_binary '','2023-12-01 04:37:49.317000','2023-12-01 04:37:49.317000','giay nu siu vip  Color Blue'),(102,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,20,_binary '','2023-12-01 04:37:49.339000','2023-12-01 04:37:49.339000','giay nu siu vip  Color Red'),(103,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,20,_binary '','2023-12-01 04:37:49.360000','2023-12-01 04:37:49.360000','giay nu siu vip  Color Black'),(104,30000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701198998/Product/rricardo_jw6e0b.webp',10,20,_binary '','2023-12-01 04:37:49.380000','2023-12-01 04:37:49.380000','giay nu siu vip  Color Red');
/*!40000 ALTER TABLE `product_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_rate` varchar(255) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `FKiyof1sindb9qiqr9o8npj8klt` (`product_id`),
  KEY `FKiyf57dy48lyiftdrf7y87rnxi` (`user_id`),
  CONSTRAINT `FKiyf57dy48lyiftdrf7y87rnxi` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKiyof1sindb9qiqr9o8npj8klt` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'ROLE_ADMINISTRATOR'),(2,'ROLE_USER');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expired` bit(1) NOT NULL,
  `revoked` bit(1) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_pddrhgwxnms2aceeku9s2ewy5` (`token`),
  KEY `FKe32ek7ixanakfqsdaokm4q9y2` (`user_id`),
  CONSTRAINT `FKe32ek7ixanakfqsdaokm4q9y2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `is_email_active` bit(1) NOT NULL,
  `is_phone_active` bit(1) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `dob` datetime(6) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `one_time_password` varchar(255) DEFAULT NULL,
  `otp_requested_time` datetime(6) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'2023-11-30 05:10:21.000000','admin@gmail.com','Admin',_binary '\0',_binary '\0','test','$2a$10$PSSO4Sbb/PZKRhj8biloTunv4nfzbfBc8nW2xIbW8fE7.ea6nbcnC','0123456789','admin123','2023-11-30 00:00:00.000000','Nam',NULL,NULL,_binary ''),(2,NULL,'2023-11-30 05:10:17.000000','admin1@gmail.com','Admin',_binary '',_binary '\0','test','$2a$10$hpSUohELIeNRmfsDpgr.pO4FsEF1y8bwqop83q/TRlNmm1qTNFwXG','0216495242','admin123','2023-11-03 00:00:00.000000','Nam',NULL,NULL,_binary ''),(5,NULL,'2023-11-30 05:10:20.000000','trungkhangsteve@gmail.com','User',_binary '',_binary '\0','test','$2a$10$9OIF.7GKOaXpNc4Q/RLc3eEGnNZ82AenT5303byT96ks4pdHXpi6i','0245348648','yser','2023-11-08 00:00:00.000000','Nu',NULL,NULL,_binary '');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `user_address_id` bigint NOT NULL AUTO_INCREMENT,
  `is_default` bit(1) DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`user_address_id`),
  KEY `FKdaaxogn1ss81gkcsdn05wi6jp` (`address_id`),
  KEY `FKk2ox3w9jm7yd6v1m5f68xibry` (`user_id`),
  CONSTRAINT `FKdaaxogn1ss81gkcsdn05wi6jp` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FKk2ox3w9jm7yd6v1m5f68xibry` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,_binary '\0',1,2);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKa68196081fvovjhkek5m97n3y` (`role_id`),
  CONSTRAINT `FK859n2jvi8ivhui0rl0esws6o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKa68196081fvovjhkek5m97n3y` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1),(2,1),(5,1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variation`
--

DROP TABLE IF EXISTS `variation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variation` (
  `variation_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`variation_id`),
  KEY `FKcyhn1nd52sy3lm12vm62f5cmg` (`category_id`),
  CONSTRAINT `FKcyhn1nd52sy3lm12vm62f5cmg` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation`
--

LOCK TABLES `variation` WRITE;
/*!40000 ALTER TABLE `variation` DISABLE KEYS */;
INSERT INTO `variation` VALUES (1,'Size',10),(2,'Color',10),(5,'Size',11),(6,'Color',11),(100,'Size',7),(101,'Color',7);
/*!40000 ALTER TABLE `variation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variation_option`
--

DROP TABLE IF EXISTS `variation_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variation_option` (
  `variation_option_id` bigint NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  `variation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`variation_option_id`),
  KEY `FKlfkypq92cr21b9mtc7mihks1e` (`variation_id`),
  CONSTRAINT `FKlfkypq92cr21b9mtc7mihks1e` FOREIGN KEY (`variation_id`) REFERENCES `variation` (`variation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation_option`
--

LOCK TABLES `variation_option` WRITE;
/*!40000 ALTER TABLE `variation_option` DISABLE KEYS */;
INSERT INTO `variation_option` VALUES (1,'39',1),(2,'40',1),(3,'41',1),(4,'RED',2),(5,'BLUE',2),(6,'black',2),(36,'48',1),(37,'38',1),(38,'35',1),(39,'Pink',2),(68,'43',1),(70,'Yellow',2),(71,'50',1),(72,'51',1),(73,'37',1),(74,'36',1),(75,'42',1),(76,'Purple',2),(77,'49',1),(78,'Brown',2),(81,'52',1),(82,'White',2),(83,'55',1),(84,'Grey',2),(85,'44',1),(86,'Black',2),(87,'53',1),(88,'Orange',2),(89,'54',1),(90,'Cyan',2),(91,'56',1),(92,'Smoke',2),(185,'88',1),(186,'oiajwdoiajwdo',2),(187,'88',100),(188,'oiajwdoiajwdo',101),(193,'Red',2),(194,'Blue',2),(208,'39',100),(209,'Red',101),(210,'48',100),(211,'Blue',101),(212,'40',100),(213,'Red',101),(214,'38',100),(215,'Black',101),(216,'35',100),(217,'Red',101),(218,'43348',5),(219,'ezgsrgre',6),(220,'88',5),(221,'oiajwdoiajwdo',6);
/*!40000 ALTER TABLE `variation_option` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-02  5:46:13