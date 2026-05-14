-- Kolumny użytkownika dla freelancera + weryfikacja e-mail (MySQL).
-- Wykonaj na bazie wskazanej w DATABASE_URL (np. strefa_crm).
--
-- Zanim uruchomisz:
--   1) Upewnij się, że w ENUM `role` jest FREELANCER — zob. add_freelancer_role_mysql.sql
--   2) Jeśli któraś kolumna już istnieje, usuń odpowiedni fragment ADD COLUMN
--      i odpowiedni CREATE UNIQUE INDEX (lub wykonuj instrukcje pojedynczo).
--
-- Po wykonaniu: zrestartuj aplikację (Prisma Client już zna te pola).

ALTER TABLE `User`
  ADD COLUMN `phone` VARCHAR(191) NULL,
  ADD COLUMN `pesel` VARCHAR(191) NULL,
  ADD COLUMN `legalConsentsAt` DATETIME(3) NULL,
  ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
  ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
  ADD COLUMN `emailVerificationSentAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `User_pesel_key` ON `User` (`pesel`);
CREATE UNIQUE INDEX `User_emailVerificationToken_key` ON `User` (`emailVerificationToken`);
