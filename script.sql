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
  `city` mediumtext,
  `street_address` mediumtext,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES (24,'lmao','darrk','darrk burh'),(25,'lmao','darrk','darrk burh'),(26,'lmao','darrk','darrk burh'),(27,'lmao','darrk','darrk burh'),(31,'lmao','darrk','darrk burh'),(33,'lmao','darrk','darrk burh'),(34,'lmao','darrk','darrk burh'),(35,'lmao','darrk','darrk burh');
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
  `total_price` int DEFAULT NULL,
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
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_item_id` bigint DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `order_item_id` bigint DEFAULT NULL,
  PRIMARY KEY (`cart_item_id`),
  KEY `FK1uobyhgl1wvgt1jpccia8xxs3` (`cart_id`),
  KEY `FKj46f52s31n4pbpgucd6x2ci46` (`product_item_id`),
  KEY `FKjf5jd3pbctwr3xerd2hlsa6m1` (`order_item_id`),
  CONSTRAINT `FK1uobyhgl1wvgt1jpccia8xxs3` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`),
  CONSTRAINT `FKj46f52s31n4pbpgucd6x2ci46` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`product_item_id`),
  CONSTRAINT `FKjf5jd3pbctwr3xerd2hlsa6m1` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (20,358000,0,8,296,0,NULL),(21,427000,0,8,280,0,NULL),(22,358000,0,8,283,0,NULL),(23,358000,0,8,284,0,NULL),(24,358000,0,8,291,0,NULL),(25,358000,0,8,292,0,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,NULL,'Nam'),(2,NULL,'Nữ'),(3,1,'Giày Sabo'),(4,1,'Giày Sandal'),(5,1,'Giày Tây'),(6,1,'Giày Tăng chiều cao'),(7,1,'Giày Bốt'),(8,1,'Giày Thể Thao'),(9,1,'SNEAKER Nam'),(10,1,'Dép'),(11,2,'Giày Sandal'),(12,2,'Giày Cao Gót'),(13,2,'Giày Thời Trang'),(14,2,'Giày Búp Bê'),(15,2,'Giày Chạy Bộ - Đi Bộ'),(16,2,'Giày Thể Thao'),(17,2,'Dép'),(18,2,'Giày Bốt Nữ'),(19,2,'Giày Sabo Nữ'),(20,2,'SNEAKER Nữ'),(21,NULL,'Bé Trai'),(22,NULL,'Bé Gái'),(23,21,'Giày Thể Thao'),(24,21,'Giày Sandal'),(25,21,'Dép'),(26,21,'Giày Tập Đi'),(27,22,'Giày Búp Bê'),(28,22,'Giày Thể Thao'),(29,22,'Giày Sandal'),(30,22,'Dép');
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
  `estimated_shipping_time` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES (1,'Chuyển phát trong vòng 5 ngày kể từ khi đặt hàng',5,'Chuyển phát nhanh',18000),(2,'Chuyển phát hỏa tốc trong vòng 3 ngày kể từ khi đặt hàng',3,'Hỏa tốc',45000),(3,'Chuyên phát thần tốc',1,'Chuyển giao trong ngày',99000);
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
  `price` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `product_item_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKt4dc2r9nbvbujrljv3e23iibt` (`order_id`),
  KEY `FKcdqml0b87oh0ukk87wjx9fk86` (`product_item_id`),
  CONSTRAINT `FKcdqml0b87oh0ukk87wjx9fk86` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`product_item_id`),
  CONSTRAINT `FKt4dc2r9nbvbujrljv3e23iibt` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (23,'2023-12-07 15:54:17.812000',358000,2,31,716000,283),(25,'2023-12-07 16:16:58.117000',358000,3,33,1074000,283),(26,'2023-12-07 16:16:58.118000',358000,1,33,358000,296);
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
  `total_item` int DEFAULT NULL,
  `total_payment` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `address_id` bigint DEFAULT NULL,
  `delivery_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `order_status` bigint DEFAULT NULL,
  `final_payment` int DEFAULT NULL,
  `user_payment_method_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf5464gxwc32ongdvka2rtvw96` (`address_id`),
  KEY `FKtkrur7wg4d8ax0pwgo0vmy20c` (`delivery_id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  KEY `FKakb1bcbd52td26dlk8kvu0glv` (`order_status`),
  KEY `FKqippj57d958yt8kaefy29bv8q` (`user_payment_method_id`),
  CONSTRAINT `FKakb1bcbd52td26dlk8kvu0glv` FOREIGN KEY (`order_status`) REFERENCES `status_order` (`id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKf5464gxwc32ongdvka2rtvw96` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`),
  CONSTRAINT `FKqippj57d958yt8kaefy29bv8q` FOREIGN KEY (`user_payment_method_id`) REFERENCES `user_payment_method` (`id`),
  CONSTRAINT `FKtkrur7wg4d8ax0pwgo0vmy20c` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (31,'2023-12-07 15:54:17.817000',2,716000,'2023-12-07 15:54:17.817000',33,1,2,1,734000,1),(33,'2023-12-07 16:16:58.119000',4,1432000,'2023-12-07 16:16:58.119000',35,1,2,1,1450000,1);
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
  `describes` varchar(255) DEFAULT NULL,
  `name_method` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,'Thanh toán trực tuyến (VNPAY-QR, Thẻ tín dụng, Thẻ nội địa)','Ví VN Pay'),(2,'Thanh toán khi nhận hàng','COD'),(3,'Ví Momo','Ví Momo');
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
  `description` mediumtext,
  `name` varchar(255) DEFAULT NULL,
  `product_image` mediumtext,
  `category_id` bigint DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (37,'Chất liệu quai: chất liệu vải thấm hút tốt được gia công tỉ mỉ sẽ là sự lựa chọn mới mẻ cho tủ đồ của bạn. Chất liệu đế: EVA với các rãnh chống trơn trượt. Mặt lót mềm mại mang đến cho người dùng trải nghiệm thoải mái. Kiểu dáng: trẻ trung năng động, dễ dàng phối hợp cùng nhiều set đồ khác nhau.','Sandal Si Cao Su Nam BRM000900','https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',4,'2023-12-04 23:04:37.236000','2023-12-04 23:04:37.236000',_binary ''),(38,'Chất liệu quai: chất liệu vải thấm hút tốt được gia công tỉ mỉ sẽ là sự lựa chọn mới mẻ cho tủ đồ của bạn. Chất liệu đế: EVA với các rãnh chống trơn trượt. Mặt lót mềm mại mang đến cho người dùng trải nghiệm thoải mái. Kiểu dáng: trẻ trung năng động, dễ dàng phối hợp cùng nhiều set đồ khác nhau.','Sandal Eva Phun Nam BEM001500','https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',4,'2023-12-04 23:09:28.981000','2023-12-04 23:09:28.981000',_binary ''),(39,'Chất liệu quai: chất liệu vải thấm hút tốt được gia công tỉ mỉ sẽ là sự lựa chọn mới mẻ cho tủ đồ của bạn. Chất liệu đế: EVA với các rãnh chống trơn trượt. Mặt lót mềm mại mang đến cho người dùng trải nghiệm thoải mái. Kiểu dáng: trẻ trung năng động, dễ dàng phối hợp cùng nhiều set đồ khác nhau.','Sandal Eva Phun Nam HEM000700','https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',4,'2023-12-04 23:18:24.903000','2023-12-04 23:18:24.903000',_binary ''),(40,'Chất liệu quai: chất liệu vải thấm hút tốt được gia công tỉ mỉ sẽ là sự lựa chọn mới mẻ cho tủ đồ của bạn. Chất liệu đế: EVA với các rãnh chống trơn trượt. Mặt lót mềm mại mang đến cho người dùng trải nghiệm thoải mái. Kiểu dáng: trẻ trung năng động, dễ dàng phối hợp cùng nhiều set đồ khác nhau.','Giày Thể Thao Thông Dụng Nam Basic BSM000600','https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',8,'2023-12-04 23:40:20.460000','2023-12-04 23:40:20.460000',_binary ''),(41,'Chất liệu quai: da bò cao cấp, đường chỉ may tinh tế, đẹp mắt. Chất liệu đế: TPR có các rãnh chống trơn trượt. Độ cao: 2cm. Mặt lót  mềm tạo sự thoải mái trong khi di chuyển. Sabo sẽ trở thành một trợ thủ đắc lực không thể thiếu trong những ngày thời tiết thất thường hay trong những buổi đi chơi, đi du lịch cùng bạn bè và người thân.','Giày Sabo 7299','https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',8,'2023-12-04 23:47:56.516000','2023-12-07 15:21:40.926000',_binary ''),(42,'Chất liệu quai: chất liệu vải thấm hút tốt được gia công tỉ mỉ sẽ là sự lựa chọn mới mẻ cho tủ đồ của bạn. Chất liệu đế: EVA với các rãnh chống trơn trượt. Mặt lót mềm mại mang đến cho người dùng trải nghiệm thoải mái. Kiểu dáng: trẻ trung năng động, dễ dàng phối hợp cùng nhiều set đồ khác nhau.','Giày Thể Thao Nam DSM074500','https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',8,'2023-12-05 02:01:58.807000','2023-12-05 02:01:58.807000',_binary '');
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
) ENGINE=InnoDB AUTO_INCREMENT=912 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_configuration`
--

LOCK TABLES `product_configuration` WRITE;
/*!40000 ALTER TABLE `product_configuration` DISABLE KEYS */;
INSERT INTO `product_configuration` VALUES (734,208,425),(735,208,426),(736,209,427),(737,209,426),(738,210,428),(739,210,426),(740,211,429),(741,211,426),(742,212,430),(743,212,426),(744,213,431),(745,213,426),(746,214,432),(747,214,426),(748,215,425),(749,215,433),(750,216,427),(751,216,433),(752,217,428),(753,217,433),(754,218,429),(755,218,433),(756,219,430),(757,219,433),(758,220,431),(759,220,433),(760,221,432),(761,221,433),(762,222,425),(763,222,426),(764,223,427),(765,223,426),(766,224,428),(767,224,426),(768,225,429),(769,225,426),(770,226,430),(771,226,426),(772,227,431),(773,227,426),(774,228,432),(775,228,426),(776,229,425),(777,229,433),(778,230,427),(779,230,433),(780,231,428),(781,231,433),(782,232,429),(783,232,433),(784,233,430),(785,233,433),(786,234,431),(787,234,433),(788,235,432),(789,235,433),(790,236,425),(791,236,434),(792,237,427),(793,237,434),(794,238,428),(795,238,434),(796,239,429),(797,239,434),(798,240,430),(799,240,434),(800,241,431),(801,241,434),(802,242,432),(803,242,434),(804,243,425),(805,243,435),(806,244,427),(807,244,435),(808,245,428),(809,245,435),(810,246,429),(811,246,435),(812,247,430),(813,247,435),(814,248,431),(815,248,435),(816,249,432),(817,249,435),(818,250,425),(819,250,436),(820,251,427),(821,251,436),(822,252,428),(823,252,436),(824,253,429),(825,253,436),(826,254,430),(827,254,436),(828,255,431),(829,255,436),(830,256,432),(831,256,436),(832,257,437),(833,257,438),(834,258,439),(835,258,438),(836,259,440),(837,259,438),(838,260,441),(839,260,438),(840,261,442),(841,261,438),(842,262,443),(843,262,438),(844,263,444),(845,263,438),(846,264,437),(847,264,445),(848,265,439),(849,265,445),(850,266,440),(851,266,445),(852,267,441),(853,267,445),(854,268,442),(855,268,445),(856,269,443),(857,269,445),(858,270,444),(859,270,445),(860,271,439),(861,271,438),(862,272,440),(863,272,438),(864,273,441),(865,273,438),(866,274,442),(867,274,438),(868,275,443),(869,275,438),(870,276,444),(871,276,438),(872,277,439),(873,277,445),(874,278,440),(875,278,445),(876,279,441),(877,279,445),(878,280,442),(879,280,445),(880,281,443),(881,281,445),(882,282,444),(883,282,445),(884,283,437),(885,283,438),(886,284,439),(887,284,438),(888,285,440),(889,285,438),(890,286,441),(891,286,438),(892,287,442),(893,287,438),(894,288,443),(895,288,438),(896,289,444),(897,289,438),(898,290,437),(899,290,446),(900,291,439),(901,291,446),(902,292,440),(903,292,446),(904,293,441),(905,293,446),(906,294,442),(907,294,446),(908,295,443),(909,295,446),(910,296,444),(911,296,446);
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
  `price` int DEFAULT NULL,
  `product_image` mediumtext,
  `quantity_in_stock` int DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_item_id`),
  KEY `FKa9mjpi98ark8eovbtnnreygbb` (`product_id`),
  CONSTRAINT `FKa9mjpi98ark8eovbtnnreygbb` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_item`
--

LOCK TABLES `product_item` WRITE;
/*!40000 ALTER TABLE `product_item` DISABLE KEYS */;
INSERT INTO `product_item` VALUES (208,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',9,37,_binary '','2023-12-04 23:04:37.052000','2023-12-04 23:04:37.052000','Sandal Si Cao Su Nam BRM000900 '),(209,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',25,37,_binary '','2023-12-04 23:04:37.074000','2023-12-04 23:04:37.074000','Sandal Si Cao Su Nam BRM000900 '),(210,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',18,37,_binary '','2023-12-04 23:04:37.092000','2023-12-04 23:04:37.092000','Sandal Si Cao Su Nam BRM000900 '),(211,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',8,37,_binary '','2023-12-04 23:04:37.109000','2023-12-04 23:04:37.109000','Sandal Si Cao Su Nam BRM000900 '),(212,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',10,37,_binary '','2023-12-04 23:04:37.127000','2023-12-04 23:04:37.127000','Sandal Si Cao Su Nam BRM000900 '),(213,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',20,37,_binary '','2023-12-04 23:04:37.145000','2023-12-04 23:04:37.145000','Sandal Si Cao Su Nam BRM000900 '),(214,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705239/Product/brm000900nau1_dd41574e889b43cea463bcd64231e905_1024x1024_cik2ss.webp',8,37,_binary '','2023-12-04 23:04:37.160000','2023-12-04 23:04:37.160000','Sandal Si Cao Su Nam BRM000900 '),(215,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',10,37,_binary '','2023-12-04 23:04:37.177000','2023-12-04 23:04:37.177000','Sandal Si Cao Su Nam BRM000900 '),(216,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',11,37,_binary '','2023-12-04 23:04:37.187000','2023-12-04 23:04:37.187000','Sandal Si Cao Su Nam BRM000900 '),(217,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',5,37,_binary '','2023-12-04 23:04:37.198000','2023-12-04 23:04:37.198000','Sandal Si Cao Su Nam BRM000900 '),(218,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',18,37,_binary '','2023-12-04 23:04:37.209000','2023-12-04 23:04:37.209000','Sandal Si Cao Su Nam BRM000900 '),(219,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',11,37,_binary '','2023-12-04 23:04:37.218000','2023-12-04 23:04:37.218000','Sandal Si Cao Su Nam BRM000900 '),(220,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',20,37,_binary '','2023-12-04 23:04:37.228000','2023-12-04 23:04:37.228000','Sandal Si Cao Su Nam BRM000900 '),(221,339000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701705255/Product/brm000900den1_e3c8a7b5cd884a39a6d185ae286dc2fb_1024x1024_ttrl23.webp',8,37,_binary '','2023-12-04 23:04:37.236000','2023-12-04 23:04:37.236000','Sandal Si Cao Su Nam BRM000900 '),(222,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',9,38,_binary '','2023-12-04 23:09:28.844000','2023-12-04 23:09:28.844000','Sandal Eva Phun Nam BEM001500 '),(223,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',25,38,_binary '','2023-12-04 23:09:28.854000','2023-12-04 23:09:28.854000','Sandal Eva Phun Nam BEM001500 '),(224,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',18,38,_binary '','2023-12-04 23:09:28.864000','2023-12-04 23:09:28.864000','Sandal Eva Phun Nam BEM001500 '),(225,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',8,38,_binary '','2023-12-04 23:09:28.875000','2023-12-04 23:09:28.875000','Sandal Eva Phun Nam BEM001500 '),(226,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',10,38,_binary '','2023-12-04 23:09:28.887000','2023-12-04 23:09:28.887000','Sandal Eva Phun Nam BEM001500 '),(227,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',20,38,_binary '','2023-12-04 23:09:28.895000','2023-12-04 23:09:28.895000','Sandal Eva Phun Nam BEM001500 '),(228,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706210/Product/bem001500nau1_e4cff2cd67414911a9ecbd6b403c394e_1024x1024_gagcsj.jpg',8,38,_binary '','2023-12-04 23:09:28.908000','2023-12-04 23:09:28.908000','Sandal Eva Phun Nam BEM001500 '),(229,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',10,38,_binary '','2023-12-04 23:09:28.919000','2023-12-04 23:09:28.920000','Sandal Eva Phun Nam BEM001500 '),(230,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',11,38,_binary '','2023-12-04 23:09:28.930000','2023-12-04 23:09:28.930000','Sandal Eva Phun Nam BEM001500 '),(231,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',5,38,_binary '','2023-12-04 23:09:28.941000','2023-12-04 23:09:28.941000','Sandal Eva Phun Nam BEM001500 '),(232,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',18,38,_binary '','2023-12-04 23:09:28.950000','2023-12-04 23:09:28.950000','Sandal Eva Phun Nam BEM001500 '),(233,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',11,38,_binary '','2023-12-04 23:09:28.961000','2023-12-04 23:09:28.961000','Sandal Eva Phun Nam BEM001500 '),(234,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',20,38,_binary '','2023-12-04 23:09:28.971000','2023-12-04 23:09:28.971000','Sandal Eva Phun Nam BEM001500 '),(235,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706211/Product/bem001500den1_187bb7816a2446f4b64cb800bfe6ea5a_1024x1024_wqugkh.webp',8,38,_binary '','2023-12-04 23:09:28.981000','2023-12-04 23:09:28.981000','Sandal Eva Phun Nam BEM001500 '),(236,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',9,39,_binary '','2023-12-04 23:18:24.699000','2023-12-04 23:18:24.699000','Sandal Eva Phun Nam HEM000700 '),(237,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',25,39,_binary '','2023-12-04 23:18:24.710000','2023-12-04 23:18:24.710000','Sandal Eva Phun Nam HEM000700 '),(238,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',18,39,_binary '','2023-12-04 23:18:24.722000','2023-12-04 23:18:24.722000','Sandal Eva Phun Nam HEM000700 '),(239,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',8,39,_binary '','2023-12-04 23:18:24.731000','2023-12-04 23:18:24.731000','Sandal Eva Phun Nam HEM000700 '),(240,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',10,39,_binary '','2023-12-04 23:18:24.741000','2023-12-04 23:18:24.741000','Sandal Eva Phun Nam HEM000700 '),(241,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',20,39,_binary '','2023-12-04 23:18:24.751000','2023-12-04 23:18:24.751000','Sandal Eva Phun Nam HEM000700 '),(242,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706548/Product/hem000700kem1_2e0a521c4112491ea8a254c8fc622c1d_1024x1024_l6rij2.webp',8,39,_binary '','2023-12-04 23:18:24.758000','2023-12-04 23:18:24.758000','Sandal Eva Phun Nam HEM000700 '),(243,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',10,39,_binary '','2023-12-04 23:18:24.783000','2023-12-04 23:18:24.783000','Sandal Eva Phun Nam HEM000700 '),(244,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',11,39,_binary '','2023-12-04 23:18:24.791000','2023-12-04 23:18:24.791000','Sandal Eva Phun Nam HEM000700 '),(245,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',5,39,_binary '','2023-12-04 23:18:24.801000','2023-12-04 23:18:24.801000','Sandal Eva Phun Nam HEM000700 '),(246,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',18,39,_binary '','2023-12-04 23:18:24.809000','2023-12-04 23:18:24.809000','Sandal Eva Phun Nam HEM000700 '),(247,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',11,39,_binary '','2023-12-04 23:18:24.819000','2023-12-04 23:18:24.819000','Sandal Eva Phun Nam HEM000700 '),(248,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',20,39,_binary '','2023-12-04 23:18:24.827000','2023-12-04 23:18:24.827000','Sandal Eva Phun Nam HEM000700 '),(249,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706554/Product/hem000700xam1_e419f4ef2e07499a85ae9254aa8ed750_1024x1024_rfibl3.jpg',8,39,_binary '','2023-12-04 23:18:24.837000','2023-12-04 23:18:24.837000','Sandal Eva Phun Nam HEM000700 '),(250,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',10,39,_binary '','2023-12-04 23:18:24.857000','2023-12-04 23:18:24.857000','Sandal Eva Phun Nam HEM000700 '),(251,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',11,39,_binary '','2023-12-04 23:18:24.866000','2023-12-04 23:18:24.866000','Sandal Eva Phun Nam HEM000700 '),(252,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',5,39,_binary '','2023-12-04 23:18:24.872000','2023-12-04 23:18:24.872000','Sandal Eva Phun Nam HEM000700 '),(253,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',18,39,_binary '','2023-12-04 23:18:24.881000','2023-12-04 23:18:24.881000','Sandal Eva Phun Nam HEM000700 '),(254,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',11,39,_binary '','2023-12-04 23:18:24.888000','2023-12-04 23:18:24.888000','Sandal Eva Phun Nam HEM000700 '),(255,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',20,39,_binary '','2023-12-04 23:18:24.896000','2023-12-04 23:18:24.896000','Sandal Eva Phun Nam HEM000700 '),(256,460000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701706557/Product/hem000700xnh1_a85409b972954c0b90f836ccda4fabb8_1024x1024_d31vk2.jpg',8,39,_binary '','2023-12-04 23:18:24.903000','2023-12-04 23:18:24.903000','Sandal Eva Phun Nam HEM000700 '),(257,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',9,40,_binary '','2023-12-04 23:40:20.322000','2023-12-04 23:40:20.322000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(258,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',25,40,_binary '','2023-12-04 23:40:20.335000','2023-12-04 23:40:20.335000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(259,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',18,40,_binary '','2023-12-04 23:40:20.347000','2023-12-04 23:40:20.347000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(260,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',8,40,_binary '','2023-12-04 23:40:20.357000','2023-12-04 23:40:20.357000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(261,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',10,40,_binary '','2023-12-04 23:40:20.368000','2023-12-04 23:40:20.368000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(262,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',20,40,_binary '','2023-12-04 23:40:20.379000','2023-12-04 23:40:20.379000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(263,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707546/bsm000600den__2__77fab7e22db04fdfac9bf6543e74612a_3f58b358b0a64aaaaaa20ddc8af0c849_1024x1024_zhg7bs.jpg',8,40,_binary '','2023-12-04 23:40:20.393000','2023-12-04 23:40:20.393000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(264,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',10,40,_binary '','2023-12-04 23:40:20.408000','2023-12-04 23:40:20.408000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(265,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',11,40,_binary '','2023-12-04 23:40:20.414000','2023-12-04 23:40:20.414000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(266,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',5,40,_binary '','2023-12-04 23:40:20.421000','2023-12-04 23:40:20.421000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(267,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',18,40,_binary '','2023-12-04 23:40:20.431000','2023-12-04 23:40:20.431000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(268,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',11,40,_binary '','2023-12-04 23:40:20.441000','2023-12-04 23:40:20.441000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(269,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',20,40,_binary '','2023-12-04 23:40:20.450000','2023-12-04 23:40:20.450000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(270,368000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701707523/bsm000600trg__2__dc7ce618c3f14f9283a11fbff9e3b56a_1024x1024_uvt7ek.webp',8,40,_binary '','2023-12-04 23:40:20.460000','2023-12-04 23:40:20.460000','Giày Thể Thao Thông Dụng Nam Basic BSM000600'),(271,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.431000','2023-12-07 15:21:40.647000','Giày Sabo 7299'),(272,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.439000','2023-12-07 15:21:40.662000','Giày Sabo 7299'),(273,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.443000','2023-12-07 15:21:40.676000','Giày Sabo 7299'),(274,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.451000','2023-12-07 15:21:40.689000','Giày Sabo 7299'),(275,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.457000','2023-12-07 15:21:40.701000','Giày Sabo 7299'),(276,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708430/bsm000700den__2__458e2c4ec9854a638958a2261c6d3571_1024x1024_vxyobu.webp',25,41,_binary '','2023-12-04 23:47:56.463000','2023-12-07 15:21:40.835000','Giày Sabo 7299'),(277,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.471000','2023-12-07 15:21:40.849000','Giày Sabo 7299'),(278,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.478000','2023-12-07 15:21:40.863000','Giày Sabo 7299'),(279,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.486000','2023-12-07 15:21:40.878000','Giày Sabo 7299'),(280,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.495000','2023-12-07 15:21:40.893000','Giày Sabo 7299'),(281,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.506000','2023-12-07 15:21:40.909000','Giày Sabo 7299'),(282,427000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1701708546/bsm000700trg__2__58fd1971d56f4bd8851882b6e16cbdc3_1024x1024_y36okh.jpg',25,41,_binary '','2023-12-04 23:47:56.516000','2023-12-07 15:21:40.924000','Giày Sabo 7299'),(283,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',25,42,_binary '','2023-12-05 02:01:58.658000','2023-12-05 02:01:58.658000','Giày Thể Thao Nam DSM074500 '),(284,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',25,42,_binary '','2023-12-05 02:01:58.668000','2023-12-05 02:01:58.668000','Giày Thể Thao Nam DSM074500 '),(285,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',18,42,_binary '','2023-12-05 02:01:58.677000','2023-12-05 02:01:58.677000','Giày Thể Thao Nam DSM074500 '),(286,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',8,42,_binary '','2023-12-05 02:01:58.686000','2023-12-05 02:01:58.686000','Giày Thể Thao Nam DSM074500 '),(287,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',10,42,_binary '','2023-12-05 02:01:58.692000','2023-12-05 02:01:58.692000','Giày Thể Thao Nam DSM074500 '),(288,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',20,42,_binary '','2023-12-05 02:01:58.701000','2023-12-05 02:01:58.701000','Giày Thể Thao Nam DSM074500 '),(289,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',8,42,_binary '','2023-12-05 02:01:58.708000','2023-12-05 02:01:58.708000','Giày Thể Thao Nam DSM074500 '),(290,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',11,42,_binary '','2023-12-05 02:01:58.755000','2023-12-05 02:01:58.755000','Giày Thể Thao Nam DSM074500 '),(291,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',11,42,_binary '','2023-12-05 02:01:58.765000','2023-12-05 02:01:58.765000','Giày Thể Thao Nam DSM074500 '),(292,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',5,42,_binary '','2023-12-05 02:01:58.772000','2023-12-05 02:01:58.772000','Giày Thể Thao Nam DSM074500 '),(293,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',18,42,_binary '','2023-12-05 02:01:58.780000','2023-12-05 02:01:58.780000','Giày Thể Thao Nam DSM074500 '),(294,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',11,42,_binary '','2023-12-05 02:01:58.788000','2023-12-05 02:01:58.788000','Giày Thể Thao Nam DSM074500 '),(295,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',20,42,_binary '','2023-12-05 02:01:58.796000','2023-12-05 02:01:58.796000','Giày Thể Thao Nam DSM074500 '),(296,358000,'https://res.cloudinary.com/dmvncmrci/image/upload/v1700207260/cld-sample-5.jpg',8,42,_binary '','2023-12-05 02:01:58.807000','2023-12-05 02:01:58.807000','Giày Thể Thao Nam DSM074500 ');
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
  `description` mediumtext,
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
  `comment` mediumtext,
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
-- Table structure for table `status_order`
--

DROP TABLE IF EXISTS `status_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_status` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `status_order_chk_1` CHECK ((`status` between 0 and 10))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_order`
--

LOCK TABLES `status_order` WRITE;
/*!40000 ALTER TABLE `status_order` DISABLE KEYS */;
INSERT INTO `status_order` VALUES (1,'DANG_CHO_XU_LY',1),(2,'HOAN_TAT',2),(3,'DA_GIAO_HANG',3),(4,'DANG_VAN_CHUYEN',4),(5,'DA_HOAN_TIEN',5);
/*!40000 ALTER TABLE `status_order` ENABLE KEYS */;
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
  `dob` datetime(6) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `one_time_password` varchar(255) DEFAULT NULL,
  `otp_requested_time` datetime(6) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'2023-11-30 05:10:21.000000','admin@gmail.com','Admin',_binary '\0',_binary '\0','test','$2a$10$PSSO4Sbb/PZKRhj8biloTunv4nfzbfBc8nW2xIbW8fE7.ea6nbcnC','0123456789','2023-11-30 00:00:00.000000','Nam',NULL,NULL,_binary ''),(2,NULL,'2023-11-30 05:10:17.000000','admin1@gmail.com','Admin',_binary '',_binary '\0','test','$2a$10$hpSUohELIeNRmfsDpgr.pO4FsEF1y8bwqop83q/TRlNmm1qTNFwXG','0216495242','2023-11-03 00:00:00.000000','Nam',NULL,NULL,_binary ''),(5,NULL,'2023-11-30 05:10:20.000000','trungkhangsteve@gmail.com','User',_binary '',_binary '\0','test','$2a$10$9OIF.7GKOaXpNc4Q/RLc3eEGnNZ82AenT5303byT96ks4pdHXpi6i','0245348648','2023-11-08 00:00:00.000000','Nu',NULL,NULL,_binary ''),(7,NULL,NULL,'lmao@gmail.com','khang',_binary '',_binary '\0','thang','$2a$10$RS7F63EDxf.WVEmqhDIRHeT2jk8wfQZQS1dZtjrN1k0I/yWwqsFQa',NULL,NULL,NULL,NULL,NULL,_binary '\0');
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (23,_binary '\0',24,2),(24,_binary '\0',25,2),(25,_binary '\0',26,2),(26,_binary '\0',27,2),(27,_binary '\0',31,2),(28,_binary '\0',33,2),(29,_binary '\0',34,2),(30,_binary '\0',35,2);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_payment_method`
--

DROP TABLE IF EXISTS `user_payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_method_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm3fq7vaahnq9eb7al7cdxh519` (`user_id`),
  KEY `FKjj97m3tgdq73q80p2xh4xe5rn` (`payment_method_id`),
  CONSTRAINT `FKjj97m3tgdq73q80p2xh4xe5rn` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`),
  CONSTRAINT `FKm3fq7vaahnq9eb7al7cdxh519` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_payment_method`
--

LOCK TABLES `user_payment_method` WRITE;
/*!40000 ALTER TABLE `user_payment_method` DISABLE KEYS */;
INSERT INTO `user_payment_method` VALUES (1,2,2);
/*!40000 ALTER TABLE `user_payment_method` ENABLE KEYS */;
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
INSERT INTO `user_role` VALUES (1,1),(2,1),(5,1),(7,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation`
--

LOCK TABLES `variation` WRITE;
/*!40000 ALTER TABLE `variation` DISABLE KEYS */;
INSERT INTO `variation` VALUES (1,'Kích thước',3),(2,'Màu sắc',3),(3,'Kích thước',4),(4,'Màu sắc',4),(5,'Kích thước',8),(6,'Màu sắc',8),(7,'Kích thước',9),(8,'Màu sắc',9),(9,'Kích thước',10),(10,'Màu sắc',10),(11,'Kích thước',11),(12,'Màu sắc',11),(13,'Kích thước',12),(14,'Màu sắc',12),(15,'Kích thước',13),(16,'Màu sắc',13),(17,'Kích thước',14),(18,'Màu sắc',14),(19,'Kích thước',15),(20,'Màu sắc',15),(21,'Kích thước',16),(22,'Màu sắc',16),(23,'Kích thước',17),(24,'Màu sắc',17),(25,'Kích thước',18),(26,'Màu sắc',18),(27,'Kích thước',19),(28,'Màu sắc',19),(29,'Kích thước',20),(30,'Màu sắc',20),(31,'Kích thước',23),(32,'Màu sắc',23),(33,'Kích thước',24),(34,'Màu sắc',24),(35,'Kích thước',25),(36,'Màu sắc',25),(37,'Kích thước',26),(38,'Màu sắc',26),(39,'Kích thước',27),(40,'Màu sắc',27),(41,'Kích thước',28),(42,'Màu sắc',28),(43,'Kích thước',29),(44,'Màu sắc',29),(45,'Kích thước',30),(46,'Màu sắc',30);
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
) ENGINE=InnoDB AUTO_INCREMENT=448 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variation_option`
--

LOCK TABLES `variation_option` WRITE;
/*!40000 ALTER TABLE `variation_option` DISABLE KEYS */;
INSERT INTO `variation_option` VALUES (425,'38',3),(426,'Nâu',4),(427,'39',3),(428,'40',3),(429,'41',3),(430,'42',3),(431,'43',3),(432,'44',3),(433,'Đen',4),(434,'Kem',4),(435,'Xám',4),(436,'Xanh Nhớt',4),(437,'38',5),(438,'Đen',6),(439,'39',5),(440,'40',5),(441,'41',5),(442,'42',5),(443,'43',5),(444,'44',5),(445,'Trắng',6),(446,'Xám',6),(447,'Đỏ',6);
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

-- Dump completed on 2023-12-07 16:20:49
