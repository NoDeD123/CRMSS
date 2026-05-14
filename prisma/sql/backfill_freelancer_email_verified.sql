-- Jednorazowo po wdrożeniu weryfikacji e-mail dla freelancera:
-- oznacz istniejące konta FREELANCER jako zweryfikowane, jeśli nie mają tokenu
-- (konta utworzone przed tą funkcją lub przez admina bez wysyłki maila).
UPDATE `User`
SET `emailVerifiedAt` = COALESCE(`emailVerifiedAt`, `createdAt`)
WHERE `role` = 'FREELANCER'
  AND `emailVerificationToken` IS NULL
  AND `emailVerifiedAt` IS NULL;
