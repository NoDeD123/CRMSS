-- Rozszerza ENUM `role` o FREELANCER; zachowuje FINANCE obecne w produkcyjnej bazie.

ALTER TABLE `User` MODIFY COLUMN `role` ENUM (
  'ADMIN',
  'USER',
  'COORDINATOR',
  'ACCOUNTANT',
  'FINANCE',
  'FREELANCER'
) NOT NULL DEFAULT 'USER';
