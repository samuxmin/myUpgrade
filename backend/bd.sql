-- MariaDB dump 10.19  Distrib 10.6.16-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: tallerphp
-- ------------------------------------------------------
-- Server version	10.6.16-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Administrador`
--

DROP TABLE IF EXISTS `Administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Administrador` (
  `id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_administrador_usuario` FOREIGN KEY (`id`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Administrador`
--

LOCK TABLES `Administrador` WRITE;
/*!40000 ALTER TABLE `Administrador` DISABLE KEYS */;
INSERT INTO `Administrador` VALUES (1),(3),(4);
/*!40000 ALTER TABLE `Administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Carrito`
--

DROP TABLE IF EXISTS `Carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Carrito` (
  `idCarrito` int(11) NOT NULL AUTO_INCREMENT,
  `costoCarrito` decimal(10,2) NOT NULL,
  `cupon` decimal(10,2) DEFAULT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`idCarrito`),
  KEY `fk_carrito_usuario` (`id`),
  CONSTRAINT `fk_carrito_usuario` FOREIGN KEY (`id`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Carrito`
--

LOCK TABLES `Carrito` WRITE;
/*!40000 ALTER TABLE `Carrito` DISABLE KEYS */;
INSERT INTO `Carrito` VALUES (2,75.00,5.00,3),(5,120.00,10.00,5);
/*!40000 ALTER TABLE `Carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Carrito_Productos`
--

DROP TABLE IF EXISTS `Carrito_Productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Carrito_Productos` (
  `idCarrito` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  PRIMARY KEY (`idCarrito`,`idProducto`),
  KEY `fk_carrito_productos_productos` (`idProducto`),
  CONSTRAINT `fk_carrito_productos_carrito` FOREIGN KEY (`idCarrito`) REFERENCES `Carrito` (`idCarrito`) ON DELETE CASCADE,
  CONSTRAINT `fk_carrito_productos_productos` FOREIGN KEY (`idProducto`) REFERENCES `Productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Carrito_Productos`
--

LOCK TABLES `Carrito_Productos` WRITE;
/*!40000 ALTER TABLE `Carrito_Productos` DISABLE KEYS */;
INSERT INTO `Carrito_Productos` VALUES (2,1,3),(2,2,2),(3,4,3);
/*!40000 ALTER TABLE `Carrito_Productos` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Componentes_PCArmado`
--

DROP TABLE IF EXISTS `Componentes_PCArmado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Componentes_PCArmado` (
  `idPCArmado` int(11) NOT NULL,
  `idComponente` int(11) NOT NULL,
  PRIMARY KEY (`idPCArmado`,`idComponente`),
  KEY `fk_componentes_pcarmado_componentes` (`idComponente`),
  CONSTRAINT `fk_componentes_pcarmado_componentes` FOREIGN KEY (`idComponente`) REFERENCES `Productos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_componentes_pcarmado_pcarmados` FOREIGN KEY (`idPCArmado`) REFERENCES `Productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Componentes_PCArmado`
--

LOCK TABLES `Componentes_PCArmado` WRITE;
/*!40000 ALTER TABLE `Componentes_PCArmado` DISABLE KEYS */;
INSERT INTO Componentes_PCArmado (idPCArmado, idComponente) VALUES
(1, 13), -- NVIDIA GeForce RTX 3060 (GPU)
(1, 16), -- MSI B550 TOMAHAWK (Placa Base)
(1, 21), -- Corsair Vengeance LPX 16GB (RAM)
(1, 11), -- Samsung 860 EVO 500GB (Disco Duro)
(1, 25), -- EVGA 600 W1 600W (Fuente de Alimentación)
(1, 29); -- Corsair 4000D Airflow (Gabinete)

INSERT INTO Componentes_PCArmado (idPCArmado, idComponente) VALUES
(2, 5), -- AMD Ryzen 9 5900X (CPU)
(2, 15), -- AMD Radeon RX 6600 XT (GPU)
(2, 21), -- Corsair Vengeance LPX 16GB (RAM)
(2, 12), -- Kingston A400 960GB (Disco Duro)
(2, 25), -- EVGA 600 W1 600W (Fuente de Alimentación)
(2, 31); -- NZXT H510 (Gabinete)

INSERT INTO Componentes_PCArmado (idPCArmado, idComponente) VALUES
(3, 17), -- ASRock B450M PRO4 (Placa Base)
(3, 15), -- AMD Radeon RX 6600 XT (GPU)
(3, 21), -- Corsair Vengeance LPX 16GB (RAM)
(3, 12), -- Kingston A400 960GB (Disco Duro)
(3, 25), -- EVGA 600 W1 600W (Fuente de Alimentación)
(3, 30); -- Fractal Design Meshify C (Gabinete)

INSERT INTO Componentes_PCArmado (idPCArmado, idComponente) VALUES
(4, 4), -- Intel Core i5-11600K (CPU)
(4, 13), -- NVIDIA GeForce RTX 3060 (GPU)
(4, 16), -- MSI B550 TOMAHAWK (Placa Base)
(4, 21), -- Corsair Vengeance LPX 16GB (RAM)
(4, 11), -- Samsung 860 EVO 500GB (Disco Duro)
(4, 25), -- EVGA 600 W1 600W (Fuente de Alimentación)
(4, 32); -- Cooler Master MasterBox TD500 Mesh (Gabinete)
/*!40000 ALTER TABLE `Componentes_PCArmado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Compra`
--

DROP TABLE IF EXISTS `Compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Compra` (
  `IDcompra` int(11) NOT NULL AUTO_INCREMENT,
  `fechaCompra` date NOT NULL,
  `costoCarrito` decimal(10,2) NOT NULL,
  `depto` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `id` int(11) NOT NULL,
  PRIMARY KEY (`IDcompra`),
  KEY `fk_compra_comprador` (`id`),
  CONSTRAINT `fk_compra_comprador` FOREIGN KEY (`id`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Compra`
--

LOCK TABLES `Compra` WRITE;
/*!40000 ALTER TABLE `Compra` DISABLE KEYS */;
INSERT INTO `Compra` VALUES (1,'2024-01-01',100.00,'A','Calle Falsa 123',2),(2,'2024-02-01',150.00,'B','Avenida Siempre Viva 742',3),(3,'2024-03-01',200.00,'C','Calle Inventada 456',5),(4,'2024-06-11',370.00,'depto','direccion',2),(5,'2024-06-11',80.00,'depto','direccion',2),(6,'2024-06-11',30.00,'depto','direccion',2);
/*!40000 ALTER TABLE `Compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comprador`
--

DROP TABLE IF EXISTS `Comprador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Comprador` (
  `id` int(11) NOT NULL,
  `cel` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comprador_usuario` FOREIGN KEY (`id`) REFERENCES `Usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comprador`
--

LOCK TABLES `Comprador` WRITE;
/*!40000 ALTER TABLE `Comprador` DISABLE KEYS */;
INSERT INTO `Comprador` VALUES (2,'1234567890'),(3,'0987654321'),(5,'1122334455');
/*!40000 ALTER TABLE `Comprador` ENABLE KEYS */;
UNLOCK TABLES;


--
-- Table structure for table `Productos`
--
DROP TABLE IF EXISTS `Productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `categoria` enum('COMPONENTES','NOTEBOOKS','PERIFERICOS','PC') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_productos_administrador` (`admin_id`),
  CONSTRAINT `fk_productos_administrador` FOREIGN KEY (`admin_id`) REFERENCES `Administrador` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Productos`
--

LOCK TABLES `Productos` WRITE;
/*!40000 ALTER TABLE `Productos` DISABLE KEYS */;
INSERT INTO `Productos` (`precio`, `stock`, `descripcion`, `imagen`, `nombre`, `admin_id`, `categoria`) VALUES
-- PCs Armados
(999.99, 20, 'PC Armada 1', 'products/pc1.png', 'PC Armada 1', 1, 'PC'),
(1299.99, 15, 'PC Armada 2', 'products/pc2.png', 'PC Armada 2', 1, 'PC'),
(799.99, 25, 'PC Armada 3', 'products/pc3.png', 'PC Armada 3', 1, 'PC'),
(1099.99, 20, 'PC Armada 4', 'products/pc4.png', 'PC Armada 4', 1, 'PC'),

-- CPUs
(299.99, 50, 'AMD Ryzen 5 5600X, 6-Core, 12-Thread, 3.7 GHz', 'products/cpu1.png', 'AMD Ryzen 5 5600X', 1, 'COMPONENTES'),
(449.99, 40, 'AMD Ryzen 7 5800X, 8-Core, 16-Thread, 3.8 GHz', 'products/cpu2.png', 'AMD Ryzen 7 5800X', 1,'COMPONENTES'),
(499.99, 30, 'Intel Core i7-11700K, 8-Core, 16-Thread, 3.6 GHz', 'products/cpu3.png', 'Intel Core i7-11700K', 1,'COMPONENTES'),
(289.99, 60, 'Intel Core i5-11600K, 6-Core, 12-Thread, 3.9 GHz', 'products/cpu4.png', 'Intel Core i5-11600K', 1,'COMPONENTES'),
(799.99, 20, 'AMD Ryzen 9 5900X, 12-Core, 24-Thread, 3.7 GHz', 'products/cpu5.png', 'AMD Ryzen 9 5900X', 1,'COMPONENTES'),
(549.99, 35, 'Intel Core i9-11900K, 8-Core, 16-Thread, 3.5 GHz', 'products/cpu6.png', 'Intel Core i9-11900K', 1,'COMPONENTES'),

-- Discos Duros
(99.99, 100, 'Samsung 970 EVO Plus 500GB, NVMe M.2, PCIe Gen 3.0', 'products/ssd1.png', 'Samsung 970 EVO Plus 500GB', 2,'COMPONENTES'),
(149.99, 80, 'Western Digital Blue SN550 1TB, NVMe M.2, PCIe Gen 3.0', 'products/ssd2.png', 'WD Blue SN550 1TB', 2,'COMPONENTES'),
(199.99, 70, 'Crucial P5 1TB, NVMe M.2, PCIe Gen 3.0', 'products/ssd3.png', 'Crucial P5 1TB', 2,'COMPONENTES'),
(59.99, 120, 'Samsung 860 EVO 500GB, SATA III, 2.5 Inch', 'products/hdd1.png', 'Samsung 860 EVO 500GB', 2,'COMPONENTES'),
(89.99, 90, 'Kingston A400 960GB, SATA III, 2.5 Inch', 'products/hdd2.png', 'Kingston A400 960GB', 2,'COMPONENTES'),
(129.99, 75, 'SanDisk Ultra 3D 1TB, SATA III, 2.5 Inch', 'products/hdd3.png', 'SanDisk Ultra 3D 1TB', 2,'COMPONENTES'),

-- Motherboards
(199.99, 50, 'MSI B550 TOMAHAWK, AM4, ATX', 'products/mobo1.png', 'MSI B550 TOMAHAWK', 3,'COMPONENTES'),
(239.99, 45, 'ASUS ROG STRIX B550-F, AM4, ATX', 'products/mobo2.png', 'ASUS ROG STRIX B550-F', 3,'COMPONENTES'),
(259.99, 40, 'Gigabyte Z590 AORUS ELITE, LGA 1200, ATX', 'products/mobo3.png', 'Gigabyte Z590 AORUS ELITE', 3,'COMPONENTES'),
(179.99, 60, 'ASRock B450M PRO4, AM4, Micro-ATX', 'products/mobo4.png', 'ASRock B450M PRO4', 3,'COMPONENTES'),
(279.99, 35, 'ASUS TUF GAMING Z590-PLUS, LGA 1200, ATX', 'products/mobo5.png', 'ASUS TUF GAMING Z590-PLUS', 3,'COMPONENTES'),
(209.99, 50, 'MSI MPG Z490 GAMING EDGE WIFI, LGA 1200, ATX', 'products/mobo6.png', 'MSI MPG Z490 GAMING EDGE WIFI', 3,'COMPONENTES'),

-- GPUs
(699.99, 25, 'NVIDIA GeForce RTX 2080, 11GB GDDR6', 'products/gpu1.png', 'NVIDIA GeForce RTX 2080', 4,'COMPONENTES'),
(999.99, 20, 'NVIDIA GeForce RTX 3080, 10GB GDDR6X', 'products/gpu2.png', 'NVIDIA GeForce RTX 3080', 4,'COMPONENTES'),
(499.99, 30, 'NVIDIA GeForce RTX 3060, 12GB GDDR6', 'products/gpu3.png', 'NVIDIA GeForce RTX 3060', 4,'COMPONENTES'),
(649.99, 25, 'AMD Radeon RX 6700 XT, 12GB GDDR6', 'products/gpu4.png', 'AMD Radeon RX 6700 XT', 4,'COMPONENTES'),
(899.99, 20, 'AMD Radeon RX 6800 XT, 16GB GDDR6', 'products/gpu5.png', 'AMD Radeon RX 6800 XT', 4,'COMPONENTES'),
(499.99, 30, 'AMD Radeon RX 6600 XT, 8GB GDDR6', 'products/gpu6.png', 'AMD Radeon RX 6600 XT', 4,'COMPONENTES'),

-- RAM
(89.99, 100, 'Corsair Vengeance LPX 16GB (2 x 8GB) DDR4-3200', 'products/ram1.png', 'Corsair Vengeance LPX 16GB', 5,'COMPONENTES'),
(119.99, 80, 'G.Skill Ripjaws V 32GB (2 x 16GB) DDR4-3600', 'products/ram2.png', 'G.Skill Ripjaws V 32GB', 5,'COMPONENTES'),
(149.99, 70, 'Kingston HyperX Fury 64GB (4 x 16GB) DDR4-3200', 'products/ram3.png', 'Kingston HyperX Fury 64GB', 5,'COMPONENTES'),

-- Power Supplies
(69.99, 100, 'EVGA 600 W1, 80+ WHITE, 600W, Power Supply', 'products/psu1.png', 'EVGA 600 W1 600W', 6,'COMPONENTES'),
(89.99, 90, 'Corsair RM750x, 750W, 80+ GOLD, Fully Modular', 'products/psu2.png', 'Corsair RM750x 750W', 6,'COMPONENTES'),
(109.99, 80, 'Seasonic FOCUS GX-850, 850W, 80+ GOLD, Fully Modular', 'products/psu3.png', 'Seasonic FOCUS GX-850 850W', 6,'COMPONENTES'),

-- Notebooks
(899.99, 40, 'Dell XPS 13, Intel Core i7-1165G7, 16GB RAM, 512GB SSD', 'products/notebook1.png', 'Dell XPS 13', 7,'NOTEBOOKS'),
(1199.99, 30, 'Apple MacBook Air M1, 16GB RAM, 512GB SSD', 'products/notebook2.png', 'Apple MacBook Air M1', 7,'NOTEBOOKS'),
(1399.99, 25, 'HP Spectre x360, Intel Core i7-1165G7, 16GB RAM, 1TB SSD', 'products/notebook3.png', 'HP Spectre x360', 7,'NOTEBOOKS'),
(1099.99, 35, 'Lenovo ThinkPad X1 Carbon, Intel Core i7-1165G7, 16GB RAM, 512GB SSD', 'products/notebook4.png', 'Lenovo ThinkPad X1 Carbon', 7,'NOTEBOOKS'),

-- Keyboards
(99.99, 80, 'Logitech G Pro X Mechanical Gaming Keyboard', 'products/keyboard1.png', 'Logitech G Pro X', 8,'PERIFERICOS'),
(149.99, 70, 'Razer BlackWidow Elite Mechanical Gaming Keyboard', 'products/keyboard2.png', 'Razer BlackWidow Elite', 8,'PERIFERICOS'),
(119.99, 75, 'Corsair K95 RGB Platinum XT Mechanical Gaming Keyboard', 'products/keyboard3.png', 'Corsair K95 RGB Platinum XT', 8,'PERIFERICOS'),
(79.99, 100, 'HyperX Alloy FPS Pro Mechanical Gaming Keyboard', 'products/keyboard4.png', 'HyperX Alloy FPS Pro', 8,'PERIFERICOS'),

-- Cases
(99.99, 50, 'Corsair 4000D Airflow, ATX Mid Tower', 'products/case1.png', 'Corsair 4000D Airflow', 9,'COMPONENTES'),
(79.99, 60, 'NZXT H510, ATX Mid Tower', 'products/case2.png', 'NZXT H510', 9,'COMPONENTES'),
(149.99, 40, 'Fractal Design Meshify C, ATX Mid Tower', 'products/case3.png', 'Fractal Design Meshify C', 9,'COMPONENTES'),
(129.99, 45, 'Cooler Master MasterBox TD500 Mesh, ATX Mid Tower', 'products/case4.png', 'Cooler Master MasterBox TD500 Mesh', 9,'COMPONENTES');
UNLOCK TABLES;

--
-- Table structure for table `Usuario`
--

DROP TABLE IF EXISTS `Usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Usuario`
--

LOCK TABLES `Usuario` WRITE;
/*!40000 ALTER TABLE `Usuario` DISABLE KEYS */;
INSERT INTO `Usuario` VALUES (1,'Juan','Pérez','juan.perez@example.com','password123',"img/users/1.png"),(2,'Maria','Gonzales','maria.gonzalez@example.com','password456',"img/users/2.png"),(3,'Pedro','Rodríguez','pedro.rodriguez@example.com','password789',"img/users/3.png"),(4,'Ana','Martínez','ana.martinez@example.com','password321',"img/users/4.png"),(5,'Luis','Gómez','luis.gomez@example.com','password654',"img/users/5.png");
/*!40000 ALTER TABLE `Usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-11 19:11:35
