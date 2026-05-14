# Instalacja bazy danych dla formularza

## 1. Instalacja zależności

```bash
npm install mysql2
```

## 2. Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
DB_HOST=strefastartu.pl:3306
DB_USER=noded
DB_PASSWORD=farmerek1
DB_NAME=strefastartu
```

**Uwaga:** Dane do bazy są już skonfigurowane w kodzie API.

## 3. Utworzenie bazy danych

1. Zaloguj się do MySQL na serwerze:
```bash
mysql -h strefastartu.pl -u noded -p
```

2. Utwórz bazę danych (jeśli nie istnieje):
```sql
CREATE DATABASE strefastartu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Uruchom plik SQL:
```bash
mysql -h strefastartu.pl -u noded -p strefastartu < database_setup.sql
```

## 4. Struktura tabeli

Tabela `form_submissions` zawiera:
- `id` - unikalny identyfikator
- `full_name` - imię i nazwisko
- `email` - adres email (unikalny)
- `phone` - numer telefonu (opcjonalny)
- `age` - wiek (opcjonalny)
- `topic` - temat zgłoszenia
- `referral_source` - źródło informacji (opcjonalny)
- `referral_code` - kod polecenia (opcjonalny)
- `referral_other` - inne źródło (opcjonalny)
- `accept_rodo` - zgoda RODO
- `accept_privacy` - zgoda na politykę prywatności
- `created_at` - data utworzenia
- `updated_at` - data ostatniej aktualizacji

## 5. Sprawdzenie instalacji

Po uruchomieniu formularza, sprawdź czy dane są zapisywane:

```sql
SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 10;
```

## 6. Opcjonalne: Tabela błędów

Tabela `form_errors` automatycznie zapisuje błędy podczas zapisywania formularzy.
