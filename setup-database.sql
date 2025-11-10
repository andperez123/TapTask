-- Create tables for TapTask

CREATE TABLE IF NOT EXISTS `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user', 'creator', 'admin') DEFAULT 'user',
  `stripeCustomerId` varchar(255),
  `library` text,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `shortcuts` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `description` text NOT NULL,
  `category` varchar(100) NOT NULL,
  `tags` text,
  `price` int DEFAULT 0,
  `iCloudLink` text NOT NULL,
  `purchaseLink` text,
  `previewImage` text,
  `previewMedia` text,
  `creatorId` int NOT NULL,
  `creatorName` varchar(255) NOT NULL,
  `creatorAvatar` text,
  `status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `featured` int DEFAULT 0,
  `trending` int DEFAULT 0,
  `downloads` int DEFAULT 0,
  `purchases` int DEFAULT 0,
  `requiredIOSVersion` varchar(50),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_shortcuts_status` (`status`),
  INDEX `idx_shortcuts_category` (`category`),
  INDEX `idx_shortcuts_creator` (`creatorId`),
  INDEX `idx_shortcuts_featured` (`featured`),
  INDEX `idx_shortcuts_trending` (`trending`)
);

CREATE TABLE IF NOT EXISTS `creators` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL UNIQUE,
  `stripeAccountId` varchar(255),
  `stripeAccountStatus` enum('pending', 'active', 'restricted') DEFAULT 'pending',
  `totalEarnings` int DEFAULT 0,
  `pendingEarnings` int DEFAULT 0,
  `shortcutsSubmitted` int DEFAULT 0,
  `shortcutsApproved` int DEFAULT 0,
  `shortcutsSold` int DEFAULT 0,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `purchases` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `userId` int NOT NULL,
  `shortcutId` int NOT NULL,
  `price` int NOT NULL,
  `stripePaymentIntentId` varchar(255),
  `status` enum('pending', 'completed', 'refunded') DEFAULT 'pending',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_purchases_user` (`userId`),
  INDEX `idx_purchases_shortcut` (`shortcutId`)
);

CREATE TABLE IF NOT EXISTS `reports` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `shortcutId` int NOT NULL,
  `reportedBy` int NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending', 'resolved', 'dismissed') DEFAULT 'pending',
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO `users` (`openId`, `name`, `email`, `loginMethod`, `role`, `library`) VALUES
('user_sarah_001', 'Sarah Johnson', 'sarah@example.com', 'apple', 'creator', '[]'),
('user_mike_002', 'Mike Chen', 'mike@example.com', 'apple', 'creator', '[]'),
('user_emma_003', 'Emma Davis', 'emma@example.com', 'apple', 'creator', '[]');

-- Insert sample creators
INSERT INTO `creators` (`userId`, `stripeAccountStatus`, `totalEarnings`, `shortcutsSubmitted`, `shortcutsApproved`, `shortcutsSold`) VALUES
(1, 'active', 125673, 8, 7, 2813),
(2, 'active', 89234, 5, 4, 2324),
(3, 'active', 156789, 6, 6, 2677);

-- Insert sample shortcuts
INSERT INTO `shortcuts` (`title`, `slug`, `description`, `category`, `tags`, `price`, `iCloudLink`, `purchaseLink`, `previewImage`, `creatorId`, `creatorName`, `status`, `featured`, `trending`, `downloads`, `purchases`, `requiredIOSVersion`) VALUES
('Morning Routine Pro', 'morning-routine-pro', 'Start your day perfectly. This shortcut automatically opens your calendar, checks weather, plays your favorite playlist, and sends you a motivational quote.', 'Productivity', '["morning","routine","automation","calendar"]', 299, 'https://www.icloud.com/shortcuts/sample1', 'https://gumroad.com/l/morning-routine-pro', 'https://via.placeholder.com/400', 1, 'Sarah Johnson', 'approved', 1, 1, 1247, 856, '16.0'),
('Focus Mode Ultimate', 'focus-mode-ultimate', 'Eliminate distractions instantly. Enables Do Not Disturb, closes social apps, opens your task manager, and plays focus music.', 'Productivity', '["focus","productivity","work","concentration"]', 199, 'https://www.icloud.com/shortcuts/sample2', 'https://lemonsqueezy.com/shortcuts/focus-mode', 'https://via.placeholder.com/400', 1, 'Sarah Johnson', 'approved', 1, 0, 2341, 1523, '15.0'),
('Battery Health Checker', 'battery-health-checker', 'Check your iPhone battery health instantly. Shows battery percentage, charging status, and health metrics.', 'Utilities', '["battery","health","utilities","free"]', 0, 'https://www.icloud.com/shortcuts/battery-health', NULL, 'https://via.placeholder.com/400', 1, 'Sarah Johnson', 'approved', 1, 0, 5234, 0, '15.0'),
('Screenshot Cleaner', 'screenshot-cleaner', 'Clean up your photo library automatically. Deletes all screenshots older than 7 days with one tap.', 'Utilities', '["photos","cleanup","storage","free"]', 0, 'https://www.icloud.com/shortcuts/screenshot-cleaner', NULL, 'https://via.placeholder.com/400', 2, 'Mike Chen', 'approved', 1, 0, 8921, 0, '15.0'),
('Daily Affirmations', 'daily-affirmations', 'Start your day with positivity. Displays a random motivational affirmation every morning.', 'Health', '["wellness","motivation","mindfulness","free"]', 0, 'https://www.icloud.com/shortcuts/affirmations', NULL, 'https://via.placeholder.com/400', 1, 'Sarah Johnson', 'approved', 1, 1, 6789, 0, '15.0'),
('Currency Converter', 'currency-converter', 'Convert between 150+ currencies with real-time exchange rates. Perfect for travelers.', 'Utilities', '["currency","travel","finance","free"]', 0, 'https://www.icloud.com/shortcuts/currency-converter', NULL, 'https://via.placeholder.com/400', 3, 'Emma Davis', 'approved', 1, 1, 11234, 0, '16.0');



