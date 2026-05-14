-- Dodaje wartość FREELANCER do kolumny `role` w MySQL (bez uruchamiania pełnego `db push`).
-- Dostosuj listę wartości w ENUM() do tego, co faktycznie masz w bazie — poniżej przykład
-- zgodny z aktualnym schema.prisma (Role).

ALTER TABLE `User` MODIFY COLUMN `role` ENUM (
  'ADMIN',
  'USER',
  'COORDINATOR',
  'ACCOUNTANT',
  'FINANCE',
  'FREELANCER'
) NOT NULL DEFAULT 'USER';
