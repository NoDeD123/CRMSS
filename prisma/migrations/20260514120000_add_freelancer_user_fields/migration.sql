-- Dodaje pola freelancera + weryfikację e-mail.
-- Świadomie pominięto DROP kolumn istniejących w DB a nieobecnych w schema.prisma
-- (np. User.beneficiaryType, Invoice.paidAt), żeby nie utracić danych.
--
-- Rozszerzenie ENUM `role` o FREELANCER: zob. migrację `20260514120100_*`
-- (osobno — na niektórych bazach są legacy wartości role i MODIFY wymaga najpierw UPDATE).

ALTER TABLE `User`
  ADD COLUMN `phone` VARCHAR(191) NULL,
  ADD COLUMN `pesel` VARCHAR(191) NULL,
  ADD COLUMN `legalConsentsAt` DATETIME(3) NULL,
  ADD COLUMN `emailVerifiedAt` DATETIME(3) NULL,
  ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
  ADD COLUMN `emailVerificationSentAt` DATETIME(3) NULL;

CREATE UNIQUE INDEX `User_pesel_key` ON `User` (`pesel`);
CREATE UNIQUE INDEX `User_emailVerificationToken_key` ON `User` (`emailVerificationToken`);
