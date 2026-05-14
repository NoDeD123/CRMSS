## 2024-05-24 - [Architektura Bazy Danych CRM]
Decyzja: Zaprojektowanie monolitycznej struktury bazy danych w MySQL z użyciem Prisma ORM, opierającej się na relacyjnych powiązaniach między encjami: `User`, `Invoice` oraz `PaymentRequest`.

Wniosek:
- **Relacje:** Baza musi utrzymać ścisłe relacje (One-to-Many z User do Invoice i PaymentRequest). Wszystkie encje posiadają referencję do użytkownika w celu śledzenia powiązanych dokumentów oraz wymuszenia autoryzacji w API.
- **Bezpieczeństwo i Autoryzacja:** Role (`ADMIN`, `USER`, `COORDINATOR`, `ACCOUNTANT`) określone na poziomie bazy (enum `Role`) determinują widoczność danych w poszczególnych widokach frontendu (`pages/panel`).
- **Integralność i Indeksowanie:** Zastosowano `onDelete: Cascade` tam gdzie dokument należy stricte do użytkownika (jeśli użytkownik zostaje usunięty, usuwane są jego faktury - decyzja do weryfikacji w przyszłości z księgowością, tymczasowo przyjmujemy dla czystości). Zastosowano indeksy na statusy i daty oraz powiązania (ID użytkownika), po których aplikacja będzie najczęściej filtrować.

Konsekwencje:
Oparcie się na silnych więzach na poziomie DB odciąża warstwę aplikacyjną od dbania o integralność danych z powiązań i zwiększa ogólne bezpieczeństwo aplikacji od samego jej początku. Wdrożenie tego z użyciem Prisma dostarczy gotowe, zoptymalizowane pod kontem typowania i weryfikacji danych, modele DTO/zapytań dla szkieletu aplikacji.