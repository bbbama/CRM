# Dokumentacja Techniczna - BEST CRM

> **Technologie:** Java 21, Spring Boot 4.0.6, React 18, Neo4j  
> **Wersja dokumentu:** 1.0

---

## 1. Zdefiniowanie tematu projektu

BEST CRM to aplikacja webowa typu CRM (Customer Relationship Management) dla stowarzyszenia studenckiego BEST AGH. System służy do centralizacji informacji o firmach partnerskich, zarządzania kontaktami, organizacji wydarzeń oraz śledzenia historii interakcji.

**Cele projektu:**
- Zastąpienie rozproszonych arkuszy kalkulacyjnych i wątków mailowych jednym, spójnym systemem.
- Usprawnienie komunikacji pomiędzy członkami stowarzyszenia a firmami partnerskimi.
- Umożliwienie szybkiego dostępu do pełnej historii kontaktów z każdą firmą.
- Zapewnienie kontroli dostępu w oparciu o role użytkowników.

---

## 2. Analiza wymagań użytkownika

### Wymagania funkcjonalne

| ID | Wymaganie | Opis |
|---|---|---|
| F01 | Zarządzanie firmami | Użytkownik może dodawać, edytować, usuwać i wyszukiwać firmy partnerskie. |
| F02 | Zarządzanie osobami kontaktowymi | Każda firma może mieć wiele osób kontaktowych z notatkami. |
| F03 | Rejestracja interakcji | Użytkownik rejestruje kontakt z firmą (e-mail, telefon, spotkanie, LinkedIn) z datą, autorem i opisem. |
| F04 | Zarządzanie wydarzeniami | System umożliwia tworzenie wydarzeń i edycji, przypisywanie członków i firm. |
| F05 | Assignment | Członek stowarzyszenia zostaje przypisany do firm w ramach edycji ze statusem. |
| F06 | Role użytkowników | ADMIN (pełny dostęp), MEMBER (dodawanie/edycja), GUEST (tylko podgląd). |
| F07 | Logowanie i autoryzacja | Logowanie przez e-mail i hasło, autoryzacja przez token JWT. |

### Wymagania niefunkcjonalne

| ID | Wymaganie | Opis |
|---|---|---|
| NF01 | Architektura | Single Page Application z backendem REST API. |
| NF02 | Backend | Java 21, Spring Boot 4.0.6. |
| NF03 | Frontend | React 18, Vite 5, Tailwind CSS 3. |
| NF04 | Baza danych | Neo4j (grafowa baza danych). |
| NF05 | Bezpieczeństwo | Hasła przechowywane w formie zahashowanej (BCrypt), autoryzacja JWT. |

---

## 3. Zaprojektowanie funkcji

| Funkcja | Opis |
|---|---|
| Zarządzanie firmami | CRUD, zmiana statusu (ACTIVE / POTENTIAL / BLACKLISTED), wyszukiwanie po nazwie i branży. |
| Osoby kontaktowe | CRUD dla firmy, dodawanie notatek do osoby. |
| Interakcje | Zapis kontaktu (typ, data, notatka, autor, powiązane wydarzenie). |
| Wydarzenia | CRUD wydarzeń i edycji, przypisywanie członków i firm. |
| Assignment | Przypisanie członka do firm w ramach edycji, śledzenie statusu (ACCEPTED / REJECTED / IN_PROGRESS). |
| Użytkownicy | Rejestracja, logowanie, autoryzacja na podstawie roli. |
| Wyszukiwanie i filtrowanie | Filtrowanie firm po nazwie, branży, statusie. |

---

## 4. Budowa i analiza diagramu przepływu danych (DFD)

### Architektura systemu

```
[Przeglądarka] <--HTTP/JSON--> [Backend (port 8080)] <--Bolt--> [Neo4j (port 7687)]
       ^                                |
       | HTTP/JSON                      |
   [Frontend React (port 5173)]    [Spring Security]
```

System oparty jest na architekturze klient-serwer. Frontend komunikuje się z backendem przez REST API. Każde zapytanie przechodzi przez warstwę Spring Security, która weryfikuje token JWT i sprawdza uprawnienia.

### Przepływ danych - przykład dodania firmy

```
1. Użytkownik wypełnia formularz w przeglądarce
       |
2. Frontend wysyła POST /api/partners z danymi w JSON
       |
3. JwtAuthenticationFilter sprawdza token JWT
       |
4. Spring Security weryfikuje rolę (AdminOnly / MemberOrAdmin / ReadAccess)
       |
5. PartnerController przyjmuje żądanie, wywołuje serwis
       |
6. PartnerServiceImpl zapisuje przez partnerRepository do Neo4j
       |
7. Zapisany obiekt wraca przez wszystkie warstwy do frontendu
```

### Elementy sterujące przepływem

| Element | Rola |
|---|---|
| Spring Security | Filtruje każde żądanie HTTP przed przekazaniem do kontrolera. |
| Token JWT | Wymagany w nagłówku `Authorization: Bearer <token>`. |
| Role (ADMIN/MEMBER/GUEST) | Ograniczają dostęp do określonych endpointów. |
| Adnotacje (@AdminOnly, @MemberOrAdmin, @ReadAccess) | Chronią konkretne endpointy na poziomie kontrolera. |

---

## 5. Zdefiniowanie encji (obiektów) oraz ich atrybutów

### Member (użytkownik systemu)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny, generowany automatycznie |
| firstName | String | Imię |
| lastName | String | Nazwisko |
| email | String | E-mail (unikalny, używany do logowania) |
| password | String | Hash hasła (BCrypt) |
| role | Enum (ADMIN/MEMBER/GUEST) | Rola użytkownika |

Implementuje `UserDetails` (Spring Security). Relacje: `RESPONSIBLE_FOR` → Partner.

### Partner (firma)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| name | String | Nazwa firmy |
| webPage | String | Adres strony WWW |
| industry | String | Branża |
| status | Enum (ACTIVE/POTENTIAL/BLACKLISTED) | Status współpracy |

Relacje: `PARTNER_OF` → Event (z ParticipationStatus), `ACQUIRED_AT` → Event, `RESPONSIBLE_FOR` ← Member.

### CompanyContact (osoba kontaktowa w firmie)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| firstName | String | Imię |
| lastName | String | Nazwisko |
| email | String | Adres e-mail |
| phoneNumber | String | Numer telefonu |
| position | String | Stanowisko |
| linkedinUrl | String | Profil LinkedIn |

Relacje: `WORKS_FOR` → Partner, `HAS_NOTE` → ContactNote.

### ContactNote (notatka do osoby kontaktowej)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| content | String | Treść notatki |
| createdAt | LocalDateTime | Data utworzenia |

Relacja: `ADDED_BY` → Member.

### Interaction (interakcja z firmą)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| type | Enum (EMAIL/PHONE/MEETING/LINKEDIN/OTHER) | Typ kontaktu |
| date | LocalDateTime | Data interakcji |
| note | String | Treść notatki |
| status | Enum (IN_PROGRESS/DONE/REJECTION) | Status współpracy |
| isResponsive | boolean | Czy firma była responsywna |

Relacje: `WITH_CONTACT` → CompanyContact, `WITH_PARTNER` → Partner, `REGARDING` → Event, `PERFORMED_BY` → Member.

### Event (wydarzenie)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| name | String | Nazwa wydarzenia |

Relacje: `HAS_EDITION` → EventEdition, `PARTNER_OF` ← Partner.

### EventEdition (edycja wydarzenia)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| edition | Integer | Numer edycji |
| startingDate | LocalDate | Data rozpoczęcia |
| endingDate | LocalDate | Data zakończenia |
| localisation | String | Lokalizacja |
| description | String | Opis |

Relacja: `HAS_ASSIGNMENT` → ContactAssignment.

### ContactAssignment (przypisanie członka do firm w edycji)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |

Relacje: `ASSIGNED_TO` → Member, `CONTACTED_PARTNER` → AssignedPartner.

### AssignedPartner (firma w assignmentcie - relacja rozszerzona o status)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| partner | Partner (TargetNode) | Powiązana firma |
| status | Enum (ACCEPTED/REJECTED/IN_PROGRESS) | Status kontaktu |

### PartnerOf (uczestnictwo firmy w wydarzeniu - relacja rozszerzona o status)

| Atrybut | Typ | Opis |
|---|---|---|
| id | Long | Klucz główny |
| event | Event (TargetNode) | Powiązane wydarzenie |
| status | Enum (ACCEPTED/REJECTED/IN_PROGRESS) | Status uczestnictwa |

### Diagram relacji

```
[Member] -- RESPONSIBLE_FOR --> [Partner]
[Member] <-- PERFORMED_BY -- [Interaction]
[Member] <-- ADDED_BY -- [ContactNote]
[Member] <-- ASSIGNED_TO -- [ContactAssignment]

[Event] -- HAS_EDITION --> [EventEdition]
[Event] <-- PARTNER_OF -- [Partner]  (z statusem: ACCEPTED/REJECTED/IN_PROGRESS)
[Partner] -- ACQUIRED_AT --> [Event]

[EventEdition] -- HAS_ASSIGNMENT --> [ContactAssignment]
[ContactAssignment] -- CONTACTED_PARTNER --> [AssignedPartner] --> [Partner]

[Partner] <-- WORKS_FOR -- [CompanyContact]
[CompanyContact] -- HAS_NOTE --> [ContactNote]

[Interaction] -- WITH_CONTACT --> [CompanyContact]
[Interaction] -- WITH_PARTNER --> [Partner]
[Interaction] -- REGARDING --> [Event]
[Interaction] -- PERFORMED_BY --> [Member]
```

## 6. Projektowanie tabel, kluczy i indeksów

Baza danych oparta jest na modelu grafowym Neo4j. W przeciwieństwie do relacyjnych baz SQL, dane są przechowywane jako **węzły** (nodes) i **relacje** (relationships). Poniższe zestawienie przedstawia logiczne odpowiedniki tabel.

### Węzły (odpowiedniki tabel)

| Węzeł | Klasa Java | Opis |
|---|---|---|
| Member | `Member.java` | Użytkownicy systemu |
| Partner | `Partner.java` | Firmy partnerskie |
| CompanyContact | `CompanyContact.java` | Osoby kontaktowe |
| ContactNote | `ContactNote.java` | Notatki |
| Interaction | `Interaction.java` | Interakcje |
| Event | `Event.java` | Wydarzenia |
| EventEdition | `EventEdition.java` | Edycje wydarzeń |
| ContactAssignment | `ContactAssignment.java` | Przypisania członków |
| AssignedPartner | `AssignedPartner.java` | Firmy w assignmentie (z polem status) |
| PartnerOf | `PartnerOf.java` | Uczestnictwo firmy w wydarzeniu (z polem status) |

### Indeksy

| Indeks | Cel |
|---|---|
| `email` na węźle `Member` | Przyspiesza logowanie |
| `name` na węźle `Partner` | Przyspiesza wyszukiwanie firm |
| `industry` na węźle `Partner` | Przyspiesza filtrowanie po branży |
| `type` na węźle `Interaction` | Przyspiesza filtrowanie interakcji |

### Klucze i więzy

- Każdy węzeł posiada unikalny identyfikator `id` (typ `Long`) generowany automatycznie przez Neo4j (`@GeneratedValue`).
- Unikalność adresu e-mail na węźle `Member` wymusza constraint na poziomie bazy danych.

### Relacje

| Typ relacji | Kierunek | Opis |
|---|---|---|
| `RESPONSIBLE_FOR` | Member → Partner | Kto kontaktuje się z firmą |
| `PERFORMED_BY` | Interaction → Member | Kto wykonał interakcję |
| `ADDED_BY` | ContactNote → Member | Kto dodał notatkę |
| `ASSIGNED_TO` | ContactAssignment → Member | Do kogo należy assignment |
| `HAS_EDITION` | Event → EventEdition | Wydarzenie ma edycje |
| `PARTNER_OF` | Partner → Event | Firma uczestniczy w wydarzeniu (z polem status) |
| `ACQUIRED_AT` | Partner → Event | Firma pozyskana z wydarzenia |
| `HAS_ASSIGNMENT` | EventEdition → ContactAssignment | Edycja ma przypisania |
| `CONTACTED_PARTNER` | ContactAssignment → AssignedPartner | Assignment zawiera firmy (z polem status) |
| `HAS_NOTE` | CompanyContact → ContactNote | Osoba kontaktowa ma notatki |
| `WORKS_FOR` | CompanyContact → Partner | Osoba pracuje w firmie |
| `WITH_CONTACT` | Interaction → CompanyContact | Interakcja dotyczy osoby |
| `WITH_PARTNER` | Interaction → Partner | Interakcja dotyczy firmy |
| `REGARDING` | Interaction → Event | Interakcja dotyczy wydarzenia |

## 7. Interfejsy do prezentacji, edycji i obsługi danych

### Formularze

| Formularz | Pola | Uwagi                                          |
|---|---|------------------------------------------------|
| **Firma** | Nazwa (text), Branża (text/select), Strona WWW (url), Status (select) | Po zapisie przekierowanie do widoku szczegółów |
| **Osoba kontaktowa** | Imię (text), Nazwisko (text), E-mail (email), Telefon (tel), Stanowisko (text) | Osadzony w widoku firmy                        |
| **Interakcja** | Typ (select), Data (date), Notatka (textarea), Autor (automat), Wydarzenie (select, opcjonalne) | Autor = zalogowany użytkownik                  |
| **Notatka** | Treść (textarea) | Osadzony w widoku osoby kontaktowej            |
| **Wydarzenie** | Nazwa (text) | -                                              |
| **Edycja wydarzenia** | Edycja (number), Data rozpoczęcia (date), Data zakończenia (date), Lokalizacja (text), Opis (textarea) | -                                              |

### Widoki

| Widok | Elementy |
|---|---|
| **Lista firm** | Tabela (Nazwa, Branża, Status, Liczba kontaktów), wyszukiwarka, przycisk "Dodaj firmę" |
| **Szczegóły firmy** | Zakładki (Osoby kontaktowe, Interakcje, Wydarzenia), karta firmy, oś czasu interakcji |
| **Lista wydarzeń** | Karty wydarzeń, przycisk "Dodaj wydarzenie" |
| **Szczegóły wydarzenia** | Karta wydarzenia, lista edycji, przypisani członkowie i firmy |
| **Użytkownicy** | Tabela użytkowników (tylko ADMIN) |

---

## 8. Wizualizacja danych

| Widok | Sposób wizualizacji |
|---|---|
| **Lista firm** | Status oznaczony kolorami: zielony = Aktywny, żółty = Potencjalny, czerwony = Czarna lista |
| **Oś czasu interakcji** | Chronologiczna lista z ikonami: koperta (e-mail), słuchawka (telefon), ikona spotkania, logo LinkedIn |
| **Widok wydarzenia** | Karta z informacjami, lista edycji, lista przypisanych członków i firm |
| **Dashboard** | Ostatnie interakcje, najbliższe wydarzenia, firmy wymagające uwagi |

Dane prezentowane są w formie interaktywnych widoków webowych (React + Tailwind CSS). W przyszłości możliwy eksport do PDF/CSV.

---

## 9. Zdefiniowanie panelu sterowania aplikacji

Dashboard jest głównym widokiem po zalogowaniu i zawiera:

- **Nawigacja główna:** linki do stron Firmy, Wydarzenia, Użytkownicy (tylko ADMIN).
- **Przycisk wylogowania**.
- **Informacje o zalogowanym użytkowniku:** imię, nazwisko, rola.
- **Podsumowanie:** liczba firm w bazie, liczba aktywnych firm, liczba nadchodzących wydarzeń.
- **Szybkie akcje:** przycisk "Dodaj firmę", "Dodaj wydarzenie".
- **Ostatnie aktywności:** lista ostatnich interakcji w systemie.

Panel jest responsywny, dostosowany do urządzeń mobilnych. W zależności od roli użytkownika niektóre elementy mogą być ukryte (np. zarządzanie użytkownikami widoczne tylko dla ADMIN).

---

## 10. Makropolecenia

| Makropolecenie | Dostępne z poziomu | Działanie |
|---|---|---|
| Szybkie dodawanie firmy | Dashboard, lista firm | Otwiera formularz dodawania firmy |
| Szybkie dodawanie interakcji | Karta firmy | Otwiera formularz, automatycznie wypełnia datę (dziś) i autora |
| Filtrowanie jednym kliknięciem | Lista firm | Przyciski filtrów według statusu (Aktywny, Potencjalny, Czarna lista) |
| Zmiana statusu firmy | Karta firmy | Zmienia status bez wchodzenia w edycję |
| Przypisanie do mnie | Karta firmy / edycja | Przypisuje firmę do zalogowanego użytkownika w kontekście edycji |

---

## 11. Wprowadzanie danych

| Metoda | Opis                                                                                                                                                                                              |
|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ręczne** | Formularze interfejsu użytkownika - podstawowa metoda wprowadzania danych.                                                                                                                        |
| **Automatyczne** | Przy pierwszym uruchomieniu aplikacji tworzone jest konto administratora (admin@best.pl / admin123) w klasie `DataInitializer`. Data interakcji i autor są wypełniane automatycznie przez system. |
| **Import** | Obecnie brak. W przyszłości możliwe dodanie importu z CSV/Excel dla firm i osób kontaktowych.                                                                                                     |

---

## 12. Dokumentacja użytkownika

> Pełna instrukcja użytkownika znajduje się w osobnym dokumencie **BEST_CRM_Instrukcja_Uzytkownika.md**.

---

## 13. Opracowanie dokumentacji technicznej

### Stos technologiczny

| Warstwa | Technologia | Wersja |
|---|---|--------|
| Język backendu | Java | 21     |
| Framework backendu | Spring Boot | 4.0.6  |
| Bezpieczeństwo | Spring Security + JWT (jjwt 0.11.5) | -      |
| Baza danych | Neo4j (grafowa) | -      |
| Mapowanie obiektowo-grafowe | Spring Data Neo4j | -      |
| Język frontendu | JavaScript (React) | 18     |
| Narzędzie budowania | Vite | 5      |
| Routing | React Router | 7      |
| Klient HTTP | Axios | -      |
| CSS | Tailwind CSS | 3      |
| Mapowanie DTO | ModelMapper | -      |
| Zmniejszenie boilerplate'u | Lombok | -      |
| Hashowanie haseł | BCrypt | -      |

### Architektura warstwowa (backend)

```
Kontroler (HTTP) → Serwis (logika biznesowa) → Repozytorium (Neo4j)
```

#### Kontrolery (8)

| Plik | Odpowiedzialność |
|---|---|
| `AuthController.java` | Logowanie, rejestracja |
| `PartnerController.java` | Zarządzanie firmami |
| `CompanyContactController.java` | Zarządzanie osobami kontaktowymi |
| `ContactNoteController.java` | Zarządzanie notatkami |
| `InteractionController.java` | Rejestrowanie interakcji |
| `EventController.java` | Zarządzanie wydarzeniami |
| `EventEditionController.java` | Zarządzanie edycjami wydarzeń |
| `MemberController.java` | Zarządzanie użytkownikami |

#### Serwisy (9 interfejsów + implementacje)

Każdy kontroler ma odpowiadający mu serwis, który zawiera całą logikę biznesową. Serwisy posiadają interfejs i implementację (np. `PartnerService` / `PartnerServiceImpl`).

#### Repozytoria (5)

| Plik | Odpowiedzialność |
|---|---|
| `PartnerRepository.java` | Operacje na firmach |
| `CompanyContactRepository.java` | Operacje na osobach kontaktowych |
| `InteractionRepository.java` | Operacje na interakcjach |
| `EventRepository.java` | Operacje na wydarzeniach |
| `MemberRepository.java` | Operacje na użytkownikach |

#### Modele (10 klas @Node/@RelationshipProperties + 5 enumów)

Węzły: `Member`, `Partner`, `CompanyContact`, `ContactNote`, `Interaction`, `Event`, `EventEdition`, `ContactAssignment`.  
Relacje rozszerzone: `AssignedPartner` (@RelationshipProperties), `PartnerOf` (@RelationshipProperties).  
Enumeracje: `Role`, `PartnerStatus`, `InteractionType`, `CooperationStatus`, `ParticipationStatus`.  
Klasa bazowa: `BaseEntity` (zawiera pole `id`).

#### DTO (9)

`AuthRequest`, `AuthResponse`, `PartnerDTO`, `CompanyContactDTO`, `ContactNoteDTO`, `InteractionDTO`, `EventDTO`, `EventEditionDTO`, `MemberDTO`.

#### Security

| Plik | Odpowiedzialność |
|---|---|
| `JwtService.java` | Generowanie i walidacja tokenów JWT |
| `JwtAuthenticationFilter.java` | Filtr przechwytujący każde żądanie HTTP i weryfikujący token |

#### Config

| Plik | Odpowiedzialność |
|---|---|
| `SecurityConfig.java` | Główna konfiguracja Spring Security, CORS, filtr JWT |
| `SecurityBeansConfig.java` | Definicje beanów security |
| `DataInitializer.java` | Inicjalizacja bazy przy starcie (konto admina) |
| `MapperConfig.java` | Konfiguracja ModelMapper |
| `ApplicationConfig.java` | Beany systemowe (AuthenticationManager, BCrypt) |

#### Exception

| Plik | Odpowiedzialność |
|---|---|
| `GlobalExceptionHandler.java` | Globalna obsługa błędów (@ControllerAdvice) |
| `ResourceNotFoundException.java` | Wyjątek dla zasobu nie znalezionego |

### Struktura plików

```
crm/
├── Dockerfile                              # Obraz backendu (multi-stage build)
├── docker-compose.yml                      # Uruchamia bazę + backend + frontend
├── pom.xml                                 # Zależności Mavena
│
├── src/main/java/com/bestcrm/
│   ├── CrmApplication.java                 # Punkt wejścia aplikacji
│   ├── annotation/
│   │   ├── AdminOnly.java                  # Tylko ADMIN
│   │   ├── MemberOrAdmin.java              # MEMBER i ADMIN
│   │   └── ReadAccess.java                 # Wszystkie role (podgląd)
│   ├── config/                             # 5 plików (SecurityConfig, DataInitializer itd.)
│   ├── controller/                         # 8 kontrolerów REST
│   ├── dto/                                # 9 klas DTO
│   ├── exception/                          # 2 pliki (obsługa błędów)
│   ├── model/                              # 10 klas + 5 enumów
│   ├── repository/                         # 5 interfejsów
│   ├── security/                           # 2 pliki (JWT)
│   └── service/                            # 18 plików (interface + implementacja)
│
├── src/main/resources/
│   └── application.properties              # Ustawienia Neo4j, JWT
│
├── src/test/java/                          # Testy jednostkowe
│
└── frontend/
    ├── Dockerfile                          # Obraz frontendu (Nginx)
    ├── nginx.conf                          # Konfiguracja Nginx
    └── src/
        ├── pages/                          # 7 stron: Login, Partners, PartnerDetails,
        │                                   #   Events, EventDetails, EditionDetails, Users
        ├── hooks/                          # 9 hooków + index.js
        ├── components/
        │   ├── ui/                         # 16 komponentów (Button, Card, SearchInput itd.)
        │   ├── partner/                    # PartnerCard, PartnerQuickAdd
        │   ├── event/                      # EventCard, EditionCard, AddEventForm, AddEditionForm
        │   ├── contact/                    # ContactCard, AddContactForm, ContactNoteList
        │   ├── interaction/                # InteractionForm, InteractionTimeline
        │   ├── member/                     # MemberListItem, AddMemberForm
        │   └── Navbar.jsx                  # Pasek nawigacji
        ├── services/
        │   └── api.js                      # Konfiguracja Axiosa (interceptory JWT)
        └── App.jsx                         # Routing

Pliki konfiguracyjne (root):
├── .env                                    # Zmienne środowiskowe (hasła, klucze JWT)
├── .dockerignore                           # Pliki pomijane przy budowie Dockera
├── DOKUMENTACJA_TECHNICZNA.md              # Dodatkowa dokumentacja techniczna
├── założenia_funkcjonalne.md               # Opis biznesowy projektu
└── Dokumentacja.md                         # Główna dokumentacja (skonsolidowana)
```

### Zasady w kodzie

| Zasada | Zastosowanie |
|---|---|
| **SOLID** | Każda klasa ma jedną odpowiedzialność. Serwisy mają interfejsy. Zależności wstrzykiwane przez konstruktor. |
| **KISS** | Proste CRUD, bez przesadnej abstrakcji. |
| **DRY** | Wspólne pole `id` w `BaseEntity`. Własne adnotacje zamiast powtarzania `@PreAuthorize`. Wspólne komponenty UI. |
| **Warstwowość** | Kontroler nie zna bazy danych. Serwis nie zna HTTP. Repozytorium nie wie o użytkownikach. |

---

## 14. API — obsługa błędów

Backend zwraca błędy w ujednoliconym formacie JSON. Każda odpowiedź błędu zawiera pole `message` z opisem problemu oraz, w przypadku błędów walidacji, dodatkowe szczegóły.

### Kody HTTP

| Kod | Znaczenie | Kiedy występuje |
|---|---|---|
| **200 OK** | Żądanie wykonane pomyślnie | GET, PUT, DELETE |
| **201 Created** | Zasób utworzony pomyślnie | POST |
| **400 Bad Request** | Błędne dane wejściowe | Walidacja nie przeszła, brak wymaganych pól, zły format JSON |
| **401 Unauthorized** | Brak autoryzacji | Token JWT brakuje, wygasł lub jest nieprawidłowy |
| **403 Forbidden** | Brak uprawnień | Użytkownik ma token, ale rola nie pozwala na wykonanie operacji |
| **404 Not Found** | Zasób nie istnieje | Próba odczytu/edycji/usunięcia nieistniejącego rekordu |
| **500 Internal Server Error** | Błąd serwera | Niespodziewany wyjątek po stronie backendu |

### Przykładowe odpowiedzi błędów

**400 Bad Request - walidacja**

```json
{
  "message": "Nazwa firmy jest wymagana",
  "status": 400,
  "timestamp": "2026-06-18T12:00:00"
}
```

**401 Unauthorized - brak tokena**

```json
{
  "message": "Pełna autoryzacja jest wymagana aby uzyskać dostęp do tego zasobu",
  "status": 401,
  "timestamp": "2026-06-18T12:00:00"
}
```

**403 Forbidden - brak uprawnień**

```json
{
  "message": "Nie masz uprawnień do wykonania tej operacji",
  "status": 403,
  "timestamp": "2026-06-18T12:00:00"
}
```

**404 Not Found - brak zasobu**

```json
{
  "message": "Partner o id 999 nie został znaleziony",
  "status": 404,
  "timestamp": "2026-06-18T12:00:00"
}
```

**500 Internal Server Error**

```json
{
  "message": "Wystąpił wewnętrzny błąd serwera",
  "status": 500,
  "timestamp": "2026-06-18T12:00:00"
}
```

---

## 15. Przykład wywołania API

### POST /api/partners - dodanie nowej firmy

#### Żądanie (request)

**Endpoint:** `POST http://localhost:8080/api/partners`

**Nagłówki:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Body (JSON):**
```json
{
  "name": "TechCorp",
  "industry": "Informatyka",
  "webPage": "https://techcorp.pl",
  "status": "POTENTIAL"
}
```

#### Odpowiedź (response)

**Status:** `201 Created`

**Body (JSON):**
```json
{
  "id": 42,
  "name": "TechCorp",
  "industry": "Informatyka",
  "webPage": "https://techcorp.pl",
  "status": "POTENTIAL"
}
```

**Możliwe błędy:**

| Kod | Przyczyna |
|---|---|
| 400 | Brak wymaganego pola `name` |
| 401 | Brak lub nieprawidłowy token JWT |
| 403 | Rola GUEST próbuje dodać firmę |

---

## 16. Jak rozwijać projekt — przykład dodania nowej encji krok po kroku

Poniższy przykład pokazuje, jak dodać nową encję `Tag` (słownik tagów dla firm) - od modelu po frontend.

### Krok 1: Model (backend)

Utwórz klasę `Tag.java` w pakiecie `model/`:

```java
package com.bestcrm.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Node;

@Node
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tag extends BaseEntity {
    private String name;
    private String color;
}
```

Jeśli encja ma mieć relację z inną encją (np. `Partner` może mieć wiele tagów), dodaj pole w `Partner.java`:

```java
@Relationship(type = "HAS_TAG")
private List<Tag> tags = new ArrayList<>();
```

### Krok 2: Repozytorium (backend)

Utwórz `TagRepository.java` w pakiecie `repository/`:

```java
package com.bestcrm.repository;

import com.bestcrm.model.Tag;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface TagRepository extends Neo4jRepository<Tag, Long> {
    // Spring Data Neo4j automatycznie generuje metody CRUD
    // Możesz dodać własne zapytania np.:
    // Optional<Tag> findByName(String name);
}
```

### Krok 3: DTO (backend)

Utwórz `TagDTO.java` w pakiecie `dto/`:

```java
package com.bestcrm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
    private Long id;
    private String name;
    private String color;
}
```

### Krok 4: Serwis (backend)

Utwórz interfejs `TagService.java` i implementację `TagServiceImpl.java` w pakiecie `service/`:

```java
// TagService.java
public interface TagService {
    List<TagDTO> getAllTags();
    TagDTO createTag(TagDTO tagDTO);
    void deleteTag(Long id);
}

// TagServiceImpl.java
@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {
    private final TagRepository tagRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
            .map(tag -> modelMapper.map(tag, TagDTO.class))
            .toList();
    }

    @Override
    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = modelMapper.map(tagDTO, Tag.class);
        Tag saved = tagRepository.save(tag);
        return modelMapper.map(saved, TagDTO.class);
    }

    @Override
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
    }
}
```

### Krok 5: Kontroler (backend)

Utwórz `TagController.java` w pakiecie `controller/`:

```java
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @GetMapping
    @ReadAccess
    public ResponseEntity<List<TagDTO>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @PostMapping
    @MemberOrAdmin
    public ResponseEntity<TagDTO> createTag(@RequestBody @Valid TagDTO tagDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(tagService.createTag(tagDTO));
    }

    @DeleteMapping("/{id}")
    @AdminOnly
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Krok 6: Hook (frontend)

Utwórz `useTags.js` w `frontend/src/hooks/`:

```javascript
import { useState, useEffect } from 'react';
import api from '../services/api';

export function useTags() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tags')
            .then(res => setTags(res.data))
            .finally(() => setLoading(false));
    }, []);

    const createTag = async (tagData) => {
        const res = await api.post('/tags', tagData);
        setTags(prev => [...prev, res.data]);
        return res.data;
    };

    const deleteTag = async (id) => {
        await api.delete(`/tags/${id}`);
        setTags(prev => prev.filter(t => t.id !== id));
    };

    return { tags, loading, createTag, deleteTag };
}
```

### Krok 7: Komponent (frontend)

Utwórz komponent `TagBadge.jsx` w `frontend/src/components/ui/`:

```jsx
export default function TagBadge({ name, color }) {
    return (
        <span
            className="inline-block px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: color, color: '#fff' }}
        >
            {name}
        </span>
    );
}
```

### Krok 8: Eksport i użycie (frontend)

Dodaj eksport w `frontend/src/components/index.js`:

```javascript
export { default as TagBadge } from './ui/TagBadge';
```

Następnie użyj komponentu w widoku szczegółów firmy (`PartnerDetails.jsx`), wyświetlając tagi w karcie firmy.

### Podsumowanie kroków

```
BACKEND:
  1. Model (@Node)          → model/Tag.java
  2. Repozytorium           → repository/TagRepository.java
  3. DTO                    → dto/TagDTO.java
  4. Serwis (interface + impl) → service/TagService.java + TagServiceImpl.java
  5. Kontroler              → controller/TagController.java

FRONTEND:
  6. Hook                   → hooks/useTags.js
  7. Komponent              → components/ui/TagBadge.jsx
  8. Eksport i użycie       → components/index.js + strona docelowa
```

---

## 17. Uruchomienie aplikacji

### Wymagania

- Java 21
- Node.js 18+
- Docker (opcjonalnie, do uruchomienia Neo4j lub całego stosu)

### Opcja 1 - Docker (zalecana)

Jedna komenda uruchamia bazę danych, backend i frontend:

```bash
docker-compose up
```

Po uruchomieniu:

| Serwis | Adres |
|---|---|
| Backend (API) | http://localhost:8080 |
| Frontend | http://localhost (port 80) |
| Neo4j (panel) | http://localhost:7474 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

Przy pierwszym uruchomieniu automatycznie tworzy się konto administratora:

- **E-mail:** admin@best.pl
- **Hasło:** admin123

### Opcja 2 - ręczna

**1. Uruchom Neo4j:**

```bash
docker run -p 7687:7687 -p 7474:7474 neo4j
```

**2. Ustaw hasło Neo4j:**

```bash
export NEO4J_PASSWORD=twoje_haslo
```

**3. Uruchom backend:**

```bash
./mvnw spring-boot:run
```

Backend wystartuje na porcie `8080`.

**4. Uruchom frontend:**

```bash
cd frontend
npm install
npm run dev
```

Frontend wystartuje na porcie `5173`.

---

## 18. Konfiguracja środowiska

### application.properties

```properties
spring.application.name=crm

spring.neo4j.uri=bolt://localhost:7687
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=${NEO4J_PASSWORD}

jwt.secret-key=moj-bardzo-tajny-klucz-ktory-ma-przynajmniej-32-znaki-dlugosci
jwt.expiration=86400000
```

### .env (docker-compose)

```env
DB_USERNAME=neo4j
DB_PASSWORD=bartekbartek
JWT_SECRET=moj-bardzo-tajny-klucz-ktory-ma-przynajmniej-32-znaki-dlugosci
```

Zmienna `NEO4J_PASSWORD` musi być ustawiona przed uruchomieniem backendu (przez `export` lub w `docker-compose.yml`).
