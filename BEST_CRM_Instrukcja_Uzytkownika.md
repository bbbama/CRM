# Instrukcja Użytkownika - BEST CRM

> **Aplikacja do zarządzania relacjami z firmami partnerskimi**  
> Stowarzyszenie Studenckie BEST AGH

---

## Spis treści

1. [Czym jest BEST CRM?](#1-czym-jest-best-crm)
2. [Jak uruchomić aplikację?](#2-jak-uruchomić-aplikację)
3. [Logowanie](#3-logowanie)
4. [Panel główny (Dashboard)](#4-panel-główny-dashboard)
5. [Firmy partnerskie](#5-firmy-partnerskie)
6. [Osoby kontaktowe](#6-osoby-kontaktowe)
7. [Interakcje](#7-interakcje)
8. [Wydarzenia i edycje](#8-wydarzenia-i-edycje)
9. [Użytkownicy i role](#9-użytkownicy-i-role)
10. [Najczęstsze problemy](#10-najczęstsze-problemy)

---

## 1. Czym jest BEST CRM?

BEST CRM to proste narzędzie internetowe, które pomaga członkom stowarzyszenia BEST AGH zarządzać kontaktami z firmami partnerskimi.

**Co możesz zrobić w tej aplikacji:**

- Dodać firmę do bazy i śledzić jej dane.
- Zapisać osoby kontaktowe w danej firmie (z notatkami).
- Rejestrować każdy kontakt z firmą - e-mail, telefon, spotkanie, LinkedIn.
- Organizować wydarzenia (np. Inżynierskie Targi Pracy) i przypisywać do nich firmy.
- Przydzielać członków stowarzyszenia do konkretnych firm w ramach wydarzenia.
- Kontrolować, kto co widzi - są trzy poziomy dostępu.

---

## 2. Jak uruchomić aplikację?

### Sposób 1 - Docker (jedna komenda, najprostszy)

Otwórz terminal w folderze projektu i wpisz:

```bash
docker-compose up
```

Po uruchomieniu wejdź w przeglądarce na: **http://localhost**

### Sposób 2 - ręczne uruchomienie

**Krok 1:** Uruchom bazę danych Neo4j:

```bash
docker run -p 7687:7687 -p 7474:7474 neo4j
```

**Krok 2:** W drugim terminalu ustaw hasło i uruchom backend:

```bash
export NEO4J_PASSWORD=twoje_haslo
./mvnw spring-boot:run
```

**Krok 3:** W trzecim terminalu uruchom frontend:

```bash
cd frontend
npm install
npm run dev
```

Wejdź w przeglądarce na: **http://localhost:5173**

### Konto administratora

Przy pierwszym uruchomieniu system automatycznie tworzy konto admina:

| Pole | Wartość |
|---|---|
| E-mail | admin@best.pl |
| Hasło | admin123 |

---

## 3. Logowanie

1. Otwórz aplikację w przeglądarce.
2. Wpisz swój **e-mail** i **hasło**.
3. Kliknij **Zaloguj**.

![Logowanie]

> Nie masz konta? Poproś administratora o utworzenie.

Po zalogowaniu widzisz **panel główny (dashboard)**.

---

## 4. Panel główny (Dashboard)

Dashboard to strona, którą widzisz od razu po zalogowaniu. Znajdziesz tu:

| Element | Opis |
|---|---|
| **Menu górne** | Linki do Firm, Wydarzeń i Użytkowników (jeśli masz uprawnienia) |
| **Twoje dane** | Imię, nazwisko i rola w prawym górnym rogu |
| **Podsumowanie** | Liczba firm w bazie, liczba aktywnych firm, nadchodzące wydarzenia |
| **Szybkie akcje** | Przyciski "Dodaj firmę" i "Dodaj wydarzenie" |
| **Ostatnie aktywności** | Lista ostatnich interakcji w systemie |
| **Wyloguj** | Przycisk w prawym górnym rogu |

---

## 5. Firmy partnerskie

### Przeglądanie listy firm

Kliknij **"Firmy"** w menu. Zobaczysz tabelę z wszystkimi firmami:

| Kolumna | Opis |
|---|---|
| Nazwa | Nazwa firmy |
| Branża | Branża, w której działa firma |
| Status | Kolor: zielony (Aktywny), żółty (Potencjalny), czerwony (Czarna lista) |
| Kontakty | Liczba osób kontaktowych w firmie |

**Wyszukiwanie:** Wpisz nazwę lub branżę w pole wyszukiwania - lista zawęzi się automatycznie.

**Filtrowanie:** Kliknij przycisk "Aktywny", "Potencjalny" lub "Czarna lista", żeby zobaczyć tylko firmy z wybranym statusem.

### Dodawanie nowej firmy

1. Kliknij **"Dodaj firmę"** (przycisk na dashboardzie lub nad listą firm).
2. Wypełnij formularz:

| Pole | Opis |
|---|---|
| Nazwa | Nazwa firmy (wymagane) |
| Branża | Branża, np. IT, Finanse, Budownictwo |
| Strona WWW | Adres strony internetowej |
| Status | Wybierz: Potencjalny, Aktywny lub Czarna lista |

3. Kliknij **"Zapisz"**.

### Szczegóły firmy

Kliknij na nazwę firmy na liście. Zobaczysz:

- **Kartę firmy** - podstawowe dane i przyciski akcji.
- **Zakładkę "Osoby kontaktowe"** - lista osób wraz z formularzem dodawania.
- **Zakładkę "Interakcje"** - oś czasu wszystkich kontaktów z tą firmą.
- **Zakładkę "Wydarzenia"** - lista wydarzeń, w których firma uczestniczy.

**Zmiana statusu firmy:** Na karcie firmy kliknij przycisk ze statusem, żeby szybko zmienić go bez wchodzenia w edycję.

**Edycja:** Kliknij ikonę ołówka przy danych firmy.

**Usuwanie:** Tylko ADMIN może usunąć firmę.

---

## 6. Osoby kontaktowe

### Dodawanie osoby kontaktowej

1. Wejdź w **szczegóły firmy**.
2. Przejdź do zakładki **"Osoby kontaktowe"**.
3. Kliknij **"Dodaj osobę"**.
4. Wypełnij formularz:

| Pole | Opis |
|---|---|
| Imię | Imię (wymagane) |
| Nazwisko | Nazwisko (wymagane) |
| E-mail | Adres e-mail |
| Telefon | Numer telefonu |
| Stanowisko | Stanowisko w firmie |

5. Kliknij **"Dodaj"**.

### Notatki do osoby kontaktowej

1. Na liście osób kliknij w wybraną osobę.
2. W sekcji notatek kliknij **"Dodaj notatkę"**.
3. Wpisz treść i kliknij **"Dodaj"**.

Notatka automatycznie zapisuje autora (Ciebie) i datę.

---

## 7. Interakcje

Interakcja to zapis kontaktu z firmą. Możesz rejestrować e-maile, telefony, spotkania i wiadomości LinkedIn.

### Dodawanie interakcji

1. Wejdź w **szczegóły firmy**.
2. Przejdź do zakładki **"Interakcje"**.
3. Kliknij **"Dodaj interakcję"**.
4. Wypełnij formularz:

| Pole | Opis                                                         |
|---|--------------------------------------------------------------|
| Typ | Wybierz: E-mail, Telefon, Spotkanie, LinkedIn lub Inne       |
| Data | Data kontaktu (domyślnie dzisiejsza)                         |
| Notatka | Opisz, czego dotyczyła rozmowa                               |
| Autor | Wypełnia się automatycznie (Ty)                              |
| Wydarzenie | Opcjonalnie - wybierz wydarzenie, którego dotyczy interakcja |

5. Kliknij **"Zapisz"**.

Interakcje wyświetlają się na **osi czasu** - od najnowszej do najstarszej, z ikonką oznaczającą typ kontaktu.

---

## 8. Wydarzenia i edycje

### Przeglądanie wydarzeń

Kliknij **"Wydarzenia"** w menu. Zobaczysz listę wydarzeń (np. Inżynierskie Targi Pracy).

### Dodawanie wydarzenia

1. Kliknij **"Dodaj wydarzenie"**.
2. Wpisz **nazwę** wydarzenia.
3. Kliknij **"Zapisz"**.

### Dodawanie edycji wydarzenia

Każde wydarzenie może mieć wiele edycji (np. ITP 2024, ITP 2025).

1. Wejdź w **szczegóły wydarzenia**.
2. Kliknij **"Dodaj edycję"**.
3. Wypełnij formularz:

| Pole | Opis |
|---|---|
| Edycja | Numer, np. 2024 |
| Data rozpoczęcia | Kiedy edycja się zaczyna |
| Data zakończenia | Kiedy edycja się kończy |
| Lokalizacja | Gdzie odbywa się wydarzenie |
| Opis | Dodatkowe informacje |

4. Kliknij **"Zapisz"**.

### Przypisywanie firm do wydarzenia

W ramach edycji możesz przypisać członków stowarzyszenia do konkretnych firm:

1. W edycji kliknij **"Dodaj assignment"**.
2. Wybierz **członka**, który będzie kontaktował się z firmą.
3. Wybierz **firmę** i ustaw status: `Chce wejść`, `Nie chce wejść`, `Zastanawia się`.

---

## 9. Użytkownicy i role

### Rodzaje kont

| Rola | Może                                                                               |
|---|------------------------------------------------------------------------------------|
| **ADMIN** | Wszystko - dodawanie i usuwanie użytkowników, edycja i usuwanie firm, pełny dostęp |
| **MEMBER** | Dodawanie firm, interakcji, edytowanie wydarzeń                                    |
| **GUEST** | Tylko podgląd - nie może niczego zmieniać                                          |

### Zarządzanie użytkownikami (tylko ADMIN)

1. Kliknij **"Użytkownicy"** w menu.
2. Zobaczysz listę wszystkich kont w systemie.
3. Możesz:
   - **Dodać** nowego użytkownika (wpisz e-mail, imię, nazwisko, hasło, wybierz rolę).
   - **Edytować** istniejącego użytkownika.
   - **Usunąć** konto.

---

## 10. Najczęstsze problemy

| Problem | Rozwiązanie                                                                                            |
|---|--------------------------------------------------------------------------------------------------------|
| **Nie mogę się zalogować** | Sprawdź, czy wpisujesz dobry e-mail i hasło. Jeśli zapomniałeś hasła, poproś ADMINA o reset.           |
| **Nie widzę przycisku "Dodaj firmę"** | Twoje konto ma rolę GUEST - możesz tylko przeglądać dane. Poproś ADMINA o zmianę roli.                 |
| **Nie mogę usunąć firmy** | Tylko ADMIN może usuwać firmy.                                                                         |
| **Aplikacja nie odpowiada** | Spróbuj odświeżyć stronę (F5). Jeśli to nie pomoże, sprawdź, czy backend i baza danych są uruchomione. |
| **Widzę błąd 401** | Sesja wygasła. Zaloguj się ponownie.                                                                   |
| **Widzę błąd 403** | Nie masz uprawnień do tej operacji.                                                                    |
| **Strona nie działa po `docker-compose up`** | Zaczekaj chwilę - baza danych potrzebuje kilku sekund na start. Spróbuj odświeżyć stronę.              |
| **Gdzie znajdę dokumentację API?** | Pod adresem http://localhost:8080/swagger-ui.html (po uruchomieniu backendu).                          |
| **Jak dodać dużo firm na raz?** | Obecnie nie ma importu z pliku. Firmy trzeba dodawać pojedynczo przez formularz.                       |

---

## Podsumowanie - szybki start

```
1. Uruchom:           docker-compose up
2. Otwórz:            http://localhost
3. Zaloguj się:       admin@best.pl / admin123
4. Kliknij:           "Dodaj firmę"
5. Wypełnij dane:     Nazwa, Branża, Status
6. Kliknij:           "Zapisz"
7. Kliknij na firmę:  zobaczysz szczegóły
8. Dodaj osobę:       zakładka "Osoby kontaktowe" → "Dodaj osobę"
9. Dodaj interakcję:  zakładka "Interakcje" → "Dodaj interakcję"
10. Gotowe!           System zapisuje wszystko automatycznie.
```

---

*Dokumentacja użytkownika BEST CRM - wersja 1.0*  
