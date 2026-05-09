-- DreamJar Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS dreamjar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dreamjar;

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  coins INT DEFAULT 0,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  streak INT DEFAULT 0,
  last_active DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Saving Goals
CREATE TABLE saving_goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  saved_amount DECIMAL(15,2) DEFAULT 0,
  deadline DATE NOT NULL,
  category ENUM('gadget','travel','education','emergency','wedding','custom') DEFAULT 'custom',
  wishlist_image VARCHAR(255),
  motivation_note TEXT,
  status ENUM('active','completed','missed','archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Saving Transactions
CREATE TABLE saving_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  goal_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  coins_earned INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES saving_goals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pets
CREATE TABLE pets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL DEFAULT 'Buddy',
  type ENUM('cat','bunny','hamster','panda','dinosaur') DEFAULT 'cat',
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  hunger INT DEFAULT 80,
  happiness INT DEFAULT 80,
  energy INT DEFAULT 80,
  mood ENUM('happy','neutral','sad','sleeping') DEFAULT 'happy',
  last_fed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Pet Inventory
CREATE TABLE pet_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('hat','glasses','collar','toy','bed_decoration') NOT NULL,
  item_name VARCHAR(100) NOT NULL,
  item_key VARCHAR(50) NOT NULL,
  is_equipped BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Habits
CREATE TABLE habits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  habit_name VARCHAR(100) NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  frequency ENUM('daily','weekly','monthly') DEFAULT 'daily',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Challenges
CREATE TABLE challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  duration_days INT DEFAULT 7,
  reward_coins INT DEFAULT 50,
  reward_xp INT DEFAULT 100,
  challenge_type ENUM('no_shopping','no_snacks','daily_save','weekend_save','custom') DEFAULT 'custom',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Challenges
CREATE TABLE user_challenges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  challenge_id INT NOT NULL,
  status ENUM('active','completed','failed') DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE
);

-- Achievements
CREATE TABLE achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  badge_icon VARCHAR(50) DEFAULT '🏆',
  goal_id INT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES saving_goals(id) ON DELETE SET NULL
);

-- Goal Archives
CREATE TABLE goal_archives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  goal_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  target_amount DECIMAL(15,2) NOT NULL,
  saved_amount DECIMAL(15,2) NOT NULL,
  completion_date DATE,
  achievement_photo VARCHAR(255),
  reflection_note TEXT,
  status ENUM('completed','missed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES saving_goals(id) ON DELETE CASCADE
);

-- Seed Challenges
INSERT INTO challenges (title, description, duration_days, reward_coins, reward_xp, challenge_type) VALUES
('No Online Shopping', 'Avoid online shopping for 7 days straight', 7, 100, 200, 'no_shopping'),
('No Snacks Challenge', 'Skip snacks and save that money for your goal', 7, 80, 150, 'no_snacks'),
('Save Daily 10K', 'Save at least Rp10.000 every day for a week', 7, 120, 250, 'daily_save'),
('Weekend Saving Sprint', 'Save on both Saturday and Sunday this weekend', 2, 60, 100, 'weekend_save'),
('Boba-Free Week', 'No milk tea or boba for 7 days, redirect that cash!', 7, 90, 180, 'no_snacks'),
('Cook At Home', 'Cook your meals at home for 5 days, save on dining', 5, 100, 200, 'custom');
