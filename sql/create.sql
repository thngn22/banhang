-- address: table
CREATE TABLE `address` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `city` mediumtext,
  `street_address` mediumtext,
  `zip_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- cart: table
CREATE TABLE `cart` (
  `cart_id` bigint NOT NULL AUTO_INCREMENT,
  `total_item` int DEFAULT NULL,
  `total_price` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `FKl70asp4l4w0jmbm1tqyofho4o` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- cart_item: table
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
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- category: table
CREATE TABLE `category` (
  `category_id` bigint NOT NULL AUTO_INCREMENT,
  `parent_category_id` bigint DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `FKs2ride9gvilxy2tcuv7witnxc` (`parent_category_id`),
  CONSTRAINT `FKs2ride9gvilxy2tcuv7witnxc` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- category_promotion: table
CREATE TABLE `category_promotion` (
  `category_id` bigint NOT NULL,
  `promotion_id` bigint NOT NULL,
  KEY `FKifq0vw6tqt1urble6pp6jsnbt` (`promotion_id`),
  KEY `FK87cxk17uorcmb982dwfx6ofee` (`category_id`),
  CONSTRAINT `FK87cxk17uorcmb982dwfx6ofee` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `FKifq0vw6tqt1urble6pp6jsnbt` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- delivery: table
CREATE TABLE `delivery` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `estimated_shipping_time` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- order_item: table
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
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- orders: table
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
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- payment_method: table
CREATE TABLE `payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `describes` varchar(255) DEFAULT NULL,
  `name_method` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- product: table
CREATE TABLE `product` (
  `product_id` bigint NOT NULL AUTO_INCREMENT,
  `description` mediumtext,
  `name` varchar(255) DEFAULT NULL,
  `product_image` mediumtext,
  `category_id` bigint DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `sold` int DEFAULT NULL,
  `estimated_price` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `FK1mtsbur82frn64de7balymq9s` (`category_id`),
  CONSTRAINT `FK1mtsbur82frn64de7balymq9s` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- product_configuration: table
CREATE TABLE `product_configuration` (
  `product_configuration_id` bigint NOT NULL AUTO_INCREMENT,
  `product_item_id` bigint DEFAULT NULL,
  `variation_option_id` bigint DEFAULT NULL,
  PRIMARY KEY (`product_configuration_id`),
  KEY `FKd9wo8k6srbadxvi3l87wfqnfx` (`product_item_id`),
  KEY `FKm5sgep9e3ot2covfpw9l3ml7s` (`variation_option_id`),
  CONSTRAINT `FKd9wo8k6srbadxvi3l87wfqnfx` FOREIGN KEY (`product_item_id`) REFERENCES `product_item` (`product_item_id`),
  CONSTRAINT `FKm5sgep9e3ot2covfpw9l3ml7s` FOREIGN KEY (`variation_option_id`) REFERENCES `variation_option` (`variation_option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=946 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- product_item: table
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

-- promotion: table
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

-- review: table
CREATE TABLE `review` (
  `review_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `feedback` varchar(10000) DEFAULT NULL,
  `image_feedback` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `order_item_id` bigint DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  UNIQUE KEY `UK_fi19ihqypou1atahgbq3a0508` (`order_item_id`),
  KEY `FKiyof1sindb9qiqr9o8npj8klt` (`product_id`),
  KEY `FKiyf57dy48lyiftdrf7y87rnxi` (`user_id`),
  CONSTRAINT `FKcpceqmajrln2x7iqc4jua0hu1` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`),
  CONSTRAINT `FKiyf57dy48lyiftdrf7y87rnxi` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKiyof1sindb9qiqr9o8npj8klt` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- role: table
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- status_order: table
CREATE TABLE `status_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- token: table
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user: table
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

-- user_address: table
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
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user_payment_method: table
CREATE TABLE `user_payment_method` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_method_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm3fq7vaahnq9eb7al7cdxh519` (`user_id`),
  KEY `FKjj97m3tgdq73q80p2xh4xe5rn` (`payment_method_id`),
  CONSTRAINT `FKjj97m3tgdq73q80p2xh4xe5rn` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method` (`id`),
  CONSTRAINT `FKm3fq7vaahnq9eb7al7cdxh519` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- user_role: table
CREATE TABLE `user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `FKa68196081fvovjhkek5m97n3y` (`role_id`),
  CONSTRAINT `FK859n2jvi8ivhui0rl0esws6o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKa68196081fvovjhkek5m97n3y` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- variation: table
CREATE TABLE `variation` (
  `variation_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`variation_id`),
  KEY `FKcyhn1nd52sy3lm12vm62f5cmg` (`category_id`),
  CONSTRAINT `FKcyhn1nd52sy3lm12vm62f5cmg` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- variation_option: table
CREATE TABLE `variation_option` (
  `variation_option_id` bigint NOT NULL AUTO_INCREMENT,
  `value` varchar(255) DEFAULT NULL,
  `variation_id` bigint DEFAULT NULL,
  PRIMARY KEY (`variation_option_id`),
  KEY `FKlfkypq92cr21b9mtc7mihks1e` (`variation_id`),
  CONSTRAINT `FKlfkypq92cr21b9mtc7mihks1e` FOREIGN KEY (`variation_id`) REFERENCES `variation` (`variation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=460 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


