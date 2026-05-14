# Instrukcja Wdrożenia i Uruchomienia (DEPLOYMENT)

Poniżej znajduje się krótki poradnik jak zdeployować zmigrowane MVP na nową bazę danych (np. o nazwie `strefa_crm`) i utworzyć konto testowe do sprawdzania całego systemu.

---

## 1. Konfiguracja bazy danych

Projekt korzysta z Prisma ORM z połączeniem do MySQL. Aby utworzyć połączenie z nową bazą danych (`strefa_crm`), postępuj według poniższych kroków:

1. Przejdź do głównego katalogu aplikacji.
2. Otwórz (lub utwórz) plik **`.env`**.
3. Wklej do niego ścieżkę do bazy w poniższym formacie (uzupełnij własnym hasłem i adresem Twojego serwera):
```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/strefa_crm"
JWT_SECRET="twój-unikalny-ciag-znakow-produkcyjnych-do-autoryzacji"
```
*(Uwaga: Ważne jest ustawienie środowiska: `NODE_ENV=production` do startu po testach by uaktywnić zabezpieczenia i ciastka HTTPS!)*

---

## 2. Zbudowanie struktury tabel

Mając pustą bazę MySQL `strefa_crm` i poprawnie wklejony adres URL, uruchom komendę:
```bash
npx prisma db push
```
*(Prisma sama wygeneruje i "wypchnie" wszystkie zmigrowane tabele dla CRM bezpośrednio na twój serwer).*

W celu zainstalowania klienta łączącego uruchom potem:
```bash
npx prisma generate
```

---

## 3. Konto startowe (Seed)
Aplikacja została zaprogramowana by wystartować z mocnym mechanizmem autoryzacji `bcrypt`. Aby nie dodawać sztucznie z poziomu PHPMyAdmin zakodowanych w hash haseł, dodaliśmy komendę seederową.

Będąc podłączonym do nowej bazy, uruchom polecenie:
```bash
npx prisma db seed
```
Zostanie utworzone konto głównego administratora, które posłuży Ci za przepustkę do testów w reszcie modułów MVP.

Dane logowania do pierwszego testowego administratora:
- **Login:** admin@strefastartu.pl
- **Hasło:** testoweAdmin123!
*(Będzie to konto na którym wejdziesz w "Zarządzanie Użytkownikami" - stamtąd możesz już naklikać z poziomu Reacta swoich testowych koordynatorów, księgową czy nowych beneficjentów).*

---

## 4. Budowanie i Deploy Produkcyjny

Kiedy baza jest załadowana tabelami i masz konto admina, zbuduj pliki statyczne React (Next.js):
```bash
npm run build
```

Rozpocznij proces serwera:
```bash
npm run start
```
*(Aplikacja wystartuje np. na localhost:3000 i będzie widoczna dla świata)*.
