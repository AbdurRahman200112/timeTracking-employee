-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2024 at 06:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `phone_no` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `verification_code` varchar(6) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_token_expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `designation`, `phone_no`, `address`, `created_at`, `updated_at`, `verification_code`, `password_reset_token`, `password_reset_token_expires_at`) VALUES
(2, 'Huzaifa Naseer', 'huzaifanaseer03@gmail.com', '$2y$12$jO3ku.BkxhDcH4cSLyDaY.l/R5rQckVaXiIQN/dxO2gGyf9z5OAle', 'admin', '+923-317-1150595', 'Karachi', '2024-11-12 09:53:53', '2024-12-01 22:56:21', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `employment_type` enum('Full-Time','Part-Time','Adhoc') NOT NULL,
  `status` varchar(255) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `employment_type`, `status`, `latitude`, `longitude`, `location`, `created_at`, `updated_at`) VALUES
(1, 'Brandon Korsgaard', 'brandon.korsgaard@example.com', 'Full-Time', '', 40.712776, -74.005974, 'NewYork, USA', '2024-12-11 05:47:50', '2024-12-12 13:00:02'),
(2, 'John Doe', 'john.doe@example.com', 'Part-Time', '', 37.540700, -77.436000, 'Virginia, USA', '2024-12-11 05:47:50', '2024-12-12 13:00:41'),
(3, 'Jane Smith', 'jane.smith@example.com', 'Adhoc', '', 30.267200, -97.743100, 'Texas, USA', '2024-12-11 05:47:50', '2024-12-12 13:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2024_11_12_123655_create_signed_up_organizations_table', 2),
(3, '2024_11_12_132200_create_admins_table', 3),
(4, '2014_10_12_000000_create_users_table', 4),
(5, '2024_11_12_182118_add_verification_code_to_admins_table', 4),
(6, '2024_11_12_182340_add_email_verified_at_to_admins_table', 5),
(7, '2024_11_14_064919_add_verification_code_to_admins_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\Admin', 2, 'authToken', 'df68026bc231703e532a82419d2173f89900517bdac9d9ac5c7b60adf4ee8e77', '[\"*\"]', NULL, NULL, '2024-11-12 11:10:17', '2024-11-12 11:10:17'),
(2, 'App\\Models\\Admin', 2, 'authToken', '0ee42de6d86f6838425f12407c0acc6667ab211886c71098f937406cffe03a53', '[\"*\"]', NULL, NULL, '2024-11-12 11:10:38', '2024-11-12 11:10:38'),
(3, 'App\\Models\\Admin', 2, 'authToken', '51aae5242cfbe2f2d1efc288d93eec9e8bf9726cd2936f567934e3a40e514c1a', '[\"*\"]', NULL, NULL, '2024-11-12 11:30:42', '2024-11-12 11:30:42'),
(4, 'App\\Models\\Admin', 2, 'authToken', 'bd302887ef4d8ab83c60b0ba44ff26461c20c52208ae31be0a4a0c64575a3052', '[\"*\"]', NULL, NULL, '2024-11-12 11:36:50', '2024-11-12 11:36:50'),
(5, 'App\\Models\\Admin', 2, 'authToken', '076734e71d6fed6f0bc854ae87160edc7ce9594b43540881eb2148d1e4b4f26d', '[\"*\"]', NULL, NULL, '2024-11-12 11:39:45', '2024-11-12 11:39:45'),
(6, 'App\\Models\\Admin', 2, 'authToken', 'fc7fcf2b6a5cd351a1430139fc5282a6fd0a98d944e358fed04bcaff0ed1ec91', '[\"*\"]', NULL, NULL, '2024-11-12 11:43:05', '2024-11-12 11:43:05'),
(7, 'App\\Models\\Admin', 2, 'authToken', 'c843af943be849ad7c77b2a1db5e62810070df5d5e570e307f72fa206845bf7d', '[\"*\"]', NULL, NULL, '2024-11-12 11:45:31', '2024-11-12 11:45:31'),
(8, 'App\\Models\\Admin', 2, 'authToken', '690a4cacd015cd0fa0395274bda8864a28f7a28feb1d970a4d625f4fe940f050', '[\"*\"]', NULL, NULL, '2024-11-12 11:48:34', '2024-11-12 11:48:34'),
(9, 'App\\Models\\Admin', 2, 'authToken', '123b9a94553fefd8c1281631a87df4fc6aae085ee169410c00fd23d8336194af', '[\"*\"]', NULL, NULL, '2024-11-12 11:50:20', '2024-11-12 11:50:20'),
(10, 'App\\Models\\Admin', 2, 'authToken', '530da471f617bc5ee6318027562460cc63776f35ec117a0ff5db2d9b9417b52e', '[\"*\"]', NULL, NULL, '2024-11-12 11:51:50', '2024-11-12 11:51:50'),
(11, 'App\\Models\\Admin', 2, 'authToken', '4a4ece75d49a6127e9d33231eea61e496ddd929e7c9405187810fb75d1bfc9a0', '[\"*\"]', NULL, NULL, '2024-11-12 11:52:04', '2024-11-12 11:52:04'),
(12, 'App\\Models\\Admin', 2, 'authToken', '41947f5b4eab04d23a705f4ac3d31d3f98ae01bdd7ed50efb5c6db15711a7116', '[\"*\"]', NULL, NULL, '2024-11-12 11:56:42', '2024-11-12 11:56:42'),
(13, 'App\\Models\\Admin', 2, 'authToken', '2ab43fe9ba7d47e6752b63bf0d866936d3165cd927fcd944c4f231c8fbae1932', '[\"*\"]', NULL, NULL, '2024-11-12 11:58:05', '2024-11-12 11:58:05'),
(14, 'App\\Models\\Admin', 2, 'authToken', '6e0383e8c921ccb7d798652f624bf06a7cd3130c28d96cd4c0fb6c85b5ac9d18', '[\"*\"]', NULL, NULL, '2024-11-12 11:58:30', '2024-11-12 11:58:30'),
(15, 'App\\Models\\Admin', 2, 'authToken', '7e27750128491fa64b75a0b9cfcc1583fa37cbc2bbf25902e7ddae635cf5cd60', '[\"*\"]', NULL, NULL, '2024-11-12 11:59:11', '2024-11-12 11:59:11'),
(16, 'App\\Models\\Admin', 2, 'authToken', 'af33caa5a90f3998e2ccf4af1d6191a84f7b89da6015d4429ee3a1118c592701', '[\"*\"]', NULL, NULL, '2024-11-12 11:59:53', '2024-11-12 11:59:53'),
(17, 'App\\Models\\Admin', 2, 'authToken', 'e80fd7825f459f10252d7a2a30a388baf5c4a697a4058d5ae7151ebaf0e2d262', '[\"*\"]', NULL, NULL, '2024-11-12 12:10:19', '2024-11-12 12:10:19'),
(18, 'App\\Models\\Admin', 2, 'authToken', '33a9830a474223651bfe9dabfa5ae76b185ff908ac467f4dbd8e8b3d114a9c6e', '[\"*\"]', NULL, NULL, '2024-11-12 12:10:31', '2024-11-12 12:10:31'),
(19, 'App\\Models\\Admin', 2, 'authToken', '3e831f2da4a87ed42a85b8332be18b198aa1d0f173089467b2369051e4fd887e', '[\"*\"]', NULL, NULL, '2024-11-12 12:17:16', '2024-11-12 12:17:16'),
(20, 'App\\Models\\Admin', 2, 'authToken', '81aa4e7ee8dc32bd28f3f30312bc8208fd995d26de7c3a95205413c67a490e9c', '[\"*\"]', NULL, NULL, '2024-11-12 12:20:55', '2024-11-12 12:20:55'),
(21, 'App\\Models\\Admin', 2, 'authToken', 'bd07ca569659a263fc2eca076d2309b804b88d7597ea58ede709f5d7b5a579f1', '[\"*\"]', NULL, NULL, '2024-11-12 12:21:10', '2024-11-12 12:21:10'),
(22, 'App\\Models\\Admin', 2, 'authToken', '3cf7780a676dc58f22db1203b43c02cc774509d3a0bb6c480d11e431d184d83f', '[\"*\"]', NULL, NULL, '2024-11-12 12:28:20', '2024-11-12 12:28:20'),
(23, 'App\\Models\\Admin', 2, 'authToken', '2dafa2f38f81de807f3fc10056e7e762a4b0e9131ebceb438af2a4219f6ec125', '[\"*\"]', NULL, NULL, '2024-11-12 12:30:30', '2024-11-12 12:30:30'),
(24, 'App\\Models\\Admin', 2, 'authToken', '7266d3b57889ecc73961a8848adfcd7f68fc286aaa7bc68265648ea311b9b8fd', '[\"*\"]', NULL, NULL, '2024-11-12 12:31:32', '2024-11-12 12:31:32'),
(25, 'App\\Models\\Admin', 2, 'authToken', 'ae82f96adab76bc451e0c8dc5881a9d96c537367df7a260f1ea5e4f9d472dbab', '[\"*\"]', NULL, NULL, '2024-11-12 12:31:58', '2024-11-12 12:31:58'),
(26, 'App\\Models\\Admin', 2, 'authToken', '2b46c5178016b02a82bf75d6cc1cd8b257cac9516f46de3076c5df8f6b20a481', '[\"*\"]', NULL, NULL, '2024-11-12 12:32:20', '2024-11-12 12:32:20'),
(27, 'App\\Models\\Admin', 2, 'authToken', '265ceecca5f0333feb21b974f9a178a6835118e554c567ca0996621c6a13b262', '[\"*\"]', NULL, NULL, '2024-11-12 12:32:34', '2024-11-12 12:32:34'),
(28, 'App\\Models\\Admin', 2, 'authToken', '0cdce0f168af3d62ac6125b37b9ad5640c01bad8fcb66212e860a40abe0c588d', '[\"*\"]', NULL, NULL, '2024-11-12 12:32:52', '2024-11-12 12:32:52'),
(29, 'App\\Models\\Admin', 2, 'authToken', 'a6234cc4fdc173c424a16e8d07291e56eb0d34bca4ee0917498f20b1b911ea77', '[\"*\"]', NULL, NULL, '2024-11-12 12:34:00', '2024-11-12 12:34:00'),
(30, 'App\\Models\\Admin', 2, 'authToken', '061b1ca96fff022fb7f4edb3c90912a7b25a8a24715772a3da89907434e70ace', '[\"*\"]', NULL, NULL, '2024-11-12 13:42:54', '2024-11-12 13:42:54'),
(31, 'App\\Models\\Admin', 2, 'authToken', 'f8a03096b78d6e7cf9b2fbdafca24fc5baa99237ef15d825dc4cedd32da8c521', '[\"*\"]', NULL, NULL, '2024-11-14 13:28:11', '2024-11-14 13:28:11'),
(32, 'App\\Models\\Admin', 2, 'authToken', 'f1fc69e308088457fb0ee1223ba405d1263ffd744b4af04a3874660b1db34e5f', '[\"*\"]', NULL, NULL, '2024-11-14 13:30:46', '2024-11-14 13:30:46'),
(33, 'App\\Models\\Admin', 2, 'authToken', '23f38f601429f93c3d896d03863f7553234d8ae32344695f99013c8e08d3d459', '[\"*\"]', NULL, NULL, '2024-11-14 13:34:21', '2024-11-14 13:34:21'),
(34, 'App\\Models\\Admin', 2, 'authToken', '56f25419e68d9218b295a36bde83dc347c5276dcd0c88593dd577e147b5fb205', '[\"*\"]', NULL, NULL, '2024-11-14 13:38:31', '2024-11-14 13:38:31'),
(35, 'App\\Models\\Admin', 2, 'authToken', '013a3c09b44302a5de4607d733d01e7c11de04b9093190b9a709f97f54862c2c', '[\"*\"]', NULL, NULL, '2024-11-14 13:42:50', '2024-11-14 13:42:50'),
(36, 'App\\Models\\Admin', 2, 'authToken', 'f349d773e62b760b3fbc8534d0013f0d8ae6c3324f26238b2d37904b315e6103', '[\"*\"]', NULL, NULL, '2024-11-14 14:44:29', '2024-11-14 14:44:29'),
(37, 'App\\Models\\Admin', 2, 'authToken', 'bd33765906e09d6611de51eed6f72155412dace2395d011d0d6d9a73119d37b6', '[\"*\"]', NULL, NULL, '2024-11-14 14:53:58', '2024-11-14 14:53:58'),
(38, 'App\\Models\\Admin', 2, 'authToken', '02e012de64c6a4cbd238b30a2918617cdb4042c933eb5a99fc0639a16d8304ad', '[\"*\"]', NULL, NULL, '2024-11-14 14:54:20', '2024-11-14 14:54:20'),
(39, 'App\\Models\\Admin', 2, 'authToken', '322f6ad1b40a7ebad692602d593b00ace84f986929ea671bd4bbce37203e4c07', '[\"*\"]', NULL, NULL, '2024-11-14 15:07:10', '2024-11-14 15:07:10'),
(40, 'App\\Models\\Admin', 2, 'authToken', '9774212ff5bef9c57245d7e15710787dd7023b663b54ae2a0abf15989c03fcb9', '[\"*\"]', NULL, NULL, '2024-11-14 15:11:34', '2024-11-14 15:11:34'),
(41, 'App\\Models\\Admin', 2, 'authToken', '2b6e658f9637d90dd07353b3886d700146672f3e92a281af999e5cd39841564e', '[\"*\"]', NULL, NULL, '2024-11-14 15:15:15', '2024-11-14 15:15:15'),
(42, 'App\\Models\\Admin', 2, 'authToken', '18b8fe87726061a0194396130966d6cad1847bc8e1a4ad5bf7bf3a53d6bae6d5', '[\"*\"]', NULL, NULL, '2024-11-14 15:16:24', '2024-11-14 15:16:24'),
(43, 'App\\Models\\Admin', 2, 'authToken', '04aefbd786cf715a858eb182db725ae616c27df7c1dd6c510584198df334cafc', '[\"*\"]', NULL, NULL, '2024-11-14 15:17:43', '2024-11-14 15:17:43'),
(44, 'App\\Models\\Admin', 2, 'authToken', '9361888258412be6807d6f005942a2fb245f7d7525f428ab91cf6f67298ca935', '[\"*\"]', NULL, NULL, '2024-11-14 15:37:26', '2024-11-14 15:37:26'),
(45, 'App\\Models\\Admin', 2, 'authToken', 'b5bab298a701b6877b034b39502ffc42d6a1f191ac035a8e92843c94471345b0', '[\"*\"]', NULL, NULL, '2024-11-14 15:39:17', '2024-11-14 15:39:17'),
(46, 'App\\Models\\Admin', 2, 'authToken', '3170dcfef1b2c830238d559ebcbfb75b9f772cf5e1d24b3ce7c35e2f6e5c88b1', '[\"*\"]', NULL, NULL, '2024-11-14 15:49:14', '2024-11-14 15:49:14'),
(47, 'App\\Models\\Admin', 2, 'authToken', '2d31ad298cde192970454078917914d3f20c843a4e33e7f02d9b890f05a21396', '[\"*\"]', NULL, NULL, '2024-11-14 16:09:56', '2024-11-14 16:09:56'),
(48, 'App\\Models\\Admin', 2, 'authToken', '70dac33152b88eb1d602852b6ab7df84cc49e1d8b966ce80966b31f59f58062d', '[\"*\"]', NULL, NULL, '2024-11-14 16:13:32', '2024-11-14 16:13:32'),
(49, 'App\\Models\\Admin', 2, 'authToken', '7ae6cad22f6534b8676394c01c15a64a67a9c69c818c13721ceed6dd01df11f1', '[\"*\"]', NULL, NULL, '2024-11-14 16:22:04', '2024-11-14 16:22:04'),
(50, 'App\\Models\\Admin', 2, 'authToken', '051cf76b5760c8d8bb60a832f42d9a2b612cf1e6751b35463c3776bdf9fc6c65', '[\"*\"]', NULL, NULL, '2024-11-14 16:28:03', '2024-11-14 16:28:03'),
(51, 'App\\Models\\Admin', 2, 'authToken', '414b30eab3671fc6938026c9bef38a00131da31f0e060de6b5ff27eb41fb90de', '[\"*\"]', NULL, NULL, '2024-11-14 16:31:31', '2024-11-14 16:31:31'),
(52, 'App\\Models\\Admin', 2, 'authToken', 'fa837617c56a7aa27f966c8a86f8bc8cb6a8606af269926c534b83549769ebad', '[\"*\"]', NULL, NULL, '2024-11-14 16:32:46', '2024-11-14 16:32:46'),
(53, 'App\\Models\\Admin', 2, 'authToken', '1229a0f01206359c9d678a7ce0dc456d77bcf57d463800a97df923d67ed1a66f', '[\"*\"]', NULL, NULL, '2024-11-14 16:33:45', '2024-11-14 16:33:45'),
(54, 'App\\Models\\Admin', 2, 'authToken', '38a2a056e8cde620b59edf66360ad5ab170a251e62492713b8c1a2235d3b6bce', '[\"*\"]', NULL, NULL, '2024-11-14 16:35:13', '2024-11-14 16:35:13'),
(55, 'App\\Models\\Admin', 2, 'authToken', 'f95f793382075e714721e9a1997cc3ee16450fa5f54acc65178d65d036088362', '[\"*\"]', NULL, NULL, '2024-11-14 16:36:24', '2024-11-14 16:36:24'),
(56, 'App\\Models\\Admin', 2, 'authToken', 'dbabaad09f9c0d0e53c8c7014f812909b609535555cbd67e29dd800609a4b680', '[\"*\"]', NULL, NULL, '2024-11-14 16:38:40', '2024-11-14 16:38:40'),
(57, 'App\\Models\\Admin', 2, 'authToken', '243c5e6123491a7a7f3641c971f2c55c8dc73e048b95bc979ea6d3280695ef28', '[\"*\"]', NULL, NULL, '2024-11-14 16:52:09', '2024-11-14 16:52:09'),
(58, 'App\\Models\\Admin', 2, 'authToken', '120ea3d13d77c98cfe7372cecb4b3070d429863858d8def4768de2c381f488a7', '[\"*\"]', NULL, NULL, '2024-11-14 16:53:44', '2024-11-14 16:53:44'),
(59, 'App\\Models\\Admin', 2, 'authToken', 'a6acfcac7957eb382f285b8c7fe0a8c99862d541d456b47e3f9166602b4c5004', '[\"*\"]', NULL, NULL, '2024-11-14 16:54:24', '2024-11-14 16:54:24'),
(60, 'App\\Models\\Admin', 2, 'authToken', '7d1c885705e5c3aee15ea5caec776bf52c873fd39a314b3ea2de16ed4b03b420', '[\"*\"]', NULL, NULL, '2024-11-14 16:55:21', '2024-11-14 16:55:21'),
(61, 'App\\Models\\Admin', 2, 'authToken', 'be8ad2959521d263e67b202944d497d8bc62da5f95deb0159a7d33021b33bb23', '[\"*\"]', NULL, NULL, '2024-11-14 16:56:13', '2024-11-14 16:56:13'),
(62, 'App\\Models\\Admin', 2, 'authToken', '6051406b6334591e0eb6533e864e8b83f9fe80c1e099e5507bbbd39a1fc9ac8b', '[\"*\"]', NULL, NULL, '2024-11-14 16:56:38', '2024-11-14 16:56:38'),
(63, 'App\\Models\\Admin', 2, 'authToken', 'b0de503e0edf7c37b3f09450c16dbb814f31d056bf7435868479d148f4eb639a', '[\"*\"]', NULL, NULL, '2024-11-14 17:20:16', '2024-11-14 17:20:16'),
(64, 'App\\Models\\Admin', 2, 'authToken', '14dd3d69abe950827e8a11fd63d07d47fd192830833060919793de73df98b26d', '[\"*\"]', NULL, NULL, '2024-11-15 04:46:44', '2024-11-15 04:46:44'),
(65, 'App\\Models\\Admin', 2, 'authToken', '0eb667f8f84c14286cbd191221b022b9febc6dfc7c137c6db801abe30d92983b', '[\"*\"]', NULL, NULL, '2024-11-15 05:33:55', '2024-11-15 05:33:55'),
(66, 'App\\Models\\Admin', 2, 'authToken', '356421b1c68a0dba315d7bb6947691737f3f50a36f1f66955832e633e0c60bf4', '[\"*\"]', NULL, NULL, '2024-11-17 00:48:46', '2024-11-17 00:48:46'),
(67, 'App\\Models\\Admin', 2, 'authToken', 'eb9e8f57bcbe8e99b5f92b46120607d84c25318bd07e632a240485b5d7d0f086', '[\"*\"]', NULL, NULL, '2024-11-17 00:49:48', '2024-11-17 00:49:48'),
(68, 'App\\Models\\Admin', 2, 'authToken', '8d4118c75fe6f93e93e386811ba69d9b7e6483cd261e8c965120c719bb66e137', '[\"*\"]', NULL, NULL, '2024-11-17 00:50:35', '2024-11-17 00:50:35'),
(69, 'App\\Models\\Admin', 2, 'authToken', 'c27e36a837c71767bd49da020a1ba96f9a31c7590898cfbc7b69d4a1d8d87d68', '[\"*\"]', NULL, NULL, '2024-11-17 00:52:17', '2024-11-17 00:52:17');

-- --------------------------------------------------------

--
-- Table structure for table `signed_up_organizations`
--

CREATE TABLE `signed_up_organizations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date_signed_up` date NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `monthly_plan` enum('Pending','Active','Expired') NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `signed_up_organizations`
--

INSERT INTO `signed_up_organizations` (`id`, `date_signed_up`, `company_name`, `contact_email`, `contact_phone`, `monthly_plan`, `created_at`, `updated_at`) VALUES
(1, '2024-11-15', 'agagga', 'qaziabdurrahman12@gmil.com', '03171150595', 'Expired', '2024-11-12 07:39:21', '2024-11-12 07:39:21'),
(2, '2024-11-14', 'agagga', 'qaziabdurrahman12@gmil.com', '03171150595', 'Active', '2024-11-12 07:54:12', '2024-11-12 07:54:12'),
(3, '2024-11-14', 'agagga', 'qaziabdurrahman12@gmil.com', '03171150595', 'Active', '2024-11-12 07:54:38', '2024-11-12 07:54:38'),
(4, '2024-11-14', 'agagga', 'qaziabdurrahman12@gmil.com', '03171150595', 'Active', '2024-11-12 12:34:14', '2024-11-12 12:34:14');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_title` varchar(100) NOT NULL,
  `date_hired` date NOT NULL,
  `license` enum('Yes','No') NOT NULL,
  `document_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `time_tracking`
--

CREATE TABLE `time_tracking` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `entry_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `working_hours` time NOT NULL,
  `overtime` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `time_tracking`
--

INSERT INTO `time_tracking` (`id`, `employee_id`, `entry_date`, `start_time`, `end_time`, `working_hours`, `overtime`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-09-04', '08:30:00', '19:30:00', '11:00:00', '01:30:00', '2024-12-11 05:47:59', '2024-12-11 05:47:59'),
(2, 1, '2024-09-03', '08:30:00', '19:30:00', '11:00:00', '00:45:00', '2024-12-11 05:47:59', '2024-12-11 05:47:59'),
(3, 1, '2024-09-02', '08:30:00', '19:30:00', '11:00:00', NULL, '2024-12-11 05:47:59', '2024-12-11 05:47:59'),
(4, 1, '2024-09-01', '08:30:00', '19:30:00', '11:00:00', NULL, '2024-12-11 05:47:59', '2024-12-11 05:47:59'),
(5, 2, '2024-09-01', '08:30:00', '19:30:00', '11:00:00', NULL, '2024-12-11 05:47:59', '2024-12-11 05:47:59'),
(6, 3, '2024-09-01', '08:30:00', '18:15:00', '09:45:00', NULL, '2024-12-11 05:47:59', '2024-12-11 05:47:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `signed_up_organizations`
--
ALTER TABLE `signed_up_organizations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `time_tracking`
--
ALTER TABLE `time_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `signed_up_organizations`
--
ALTER TABLE `signed_up_organizations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `time_tracking`
--
ALTER TABLE `time_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `time_tracking`
--
ALTER TABLE `time_tracking`
  ADD CONSTRAINT `time_tracking_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
