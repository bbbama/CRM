# Dokumentacja systemu BEST CRM

## Czym jest ta aplikacja?

BEST CRM to system webowy do zarzadzania relacjami z firmami partnerskimi, stworzony dla stowarzyszenia studenckiego BEST AGH. Aplikacja pomaga sledzic kontakty ze sponsorami, organizowac wydarzenia i przechowywac historie interakcji w jednym miejscu.

---

## Funkcjonalnosci

### Zarzadzanie firmami partnerskimi
- Dodawanie nowych firm do bazy (nazwa, branza, strona WWW)
- Przegladanie listy wszystkich firm z mozliwoscia wyszukiwania po nazwie lub branzy
- Zmiana statusu firmy: Potencjalny, Aktywny, Czarna lista
- Usuwanie firm (tylko dla administratora)

### Osoby kontaktowe
- Dodawanie osob kontaktowych do kazdej firmy (imie, nazwisko, email, telefon, stanowisko)
- Edycja i usuwanie osob kontaktowych
- Dodawanie notatek do kazdej osoby (kto napisal, kiedy, tresc)

### Historia interakcji
- Rejestrowanie kontaktow z firma: email, telefon, spotkanie, LinkedIn
- Kazda interakcja zapisuje: typ, date, notatke, autora i opcjonalnie powiazane wydarzenie
- Wyswietlanie historii w formie osi czasu

### Wydarzenia i edycje
- Tworzenie wydarzen (np. Inzynierskie Targi Pracy)
- Dodawanie edycji do wydarzen (rok, daty, lokalizacja, opis)
- Przypisywanie czlonkow stowarzyszenia do konkretnych edycji
- Przypisywanie firm do czlonkow - kazdy czlonek ma liste firm, z ktorymi ma sie skontaktowac
- Sledzenie statusu firm w ramach edycji: Chce wejsc, Nie chce wejsc, Zastanawia sie
- Rejestrowanie interakcji w kontekscie edycji i assignmentu

### Zarzadzanie uzytkownikami
- Trzy role: ADMIN, MEMBER, GUEST
- ADMIN moze wszystko (dodawanie/usuwanie uzytkownikow, edycja firm, usuwanie)
- MEMBER moze dodawac firmy, interakcje, edytowac wydarzenia
- GUEST ma tylko podglad

### Logowanie i bezpieczenstwo
- Logowanie przez email i haslo
- Token JWT do autoryzacji kazdego zapytania
- Hasla przechowywane w formie zahashowanej (BCrypt)

---

## Jak dziala aplikacja od srodka

Aplikacja to dwie czesci: backend (Java) i frontend (React), ktore komunikuja sie przez REST API.

### Backend (Java + Spring Boot)

Backend dziala na porcie 8080 i udostepnia endpointy REST. Kazdy endpoint jest zabezpieczony i wymaga przeslania tokena JWT w naglowku Authorization.

**Architektura warstwowa:**

1. **Kontrolery** - Przyjmuja zapytania HTTP, deleguja do serwisow, zwracaja odpowiedzi
2. **Serwisy** - Zawieraja logike biznesowa, przetwarzaja dane
3. **Repozytoria** - Komunikuja sie z baza danych Neo4j
4. **Modele (encje)** - Odwzorowuja wezly i relacje w grafie

Kontroler nie zawiera logiki biznesowej - tylko przyjmuje dane, wywoluje serwis i zwraca odpowiedz. Serwis zawiera cala logike. Repozytorium to gotowy interfejs Spring Data, ktory sam generuje zapytania do bazy.

Przykladowy przeplyw dla dodania nowej firmy:
1. Frontend wysyla POST na /api/partners z danymi w JSON
2. PartnerController przyjmuje zapytanie
3. Wylwoluje metode savePartner w PartnerServiceImpl
4. PartnerServiceImpl wywoluje partnerRepository.save(partner)
5. Neo4j zapisuje nowy wezel w bazie
6. Zapisany obiekt wraca przez wszystkie warstwy do frontendu

### Frontend (React + Vite)

Frontend dziala na porcie 5173 i wyswietla interfejs uzytkownika.

**Struktura:**

1. **Strony (pages/)** - Glowne widoki: logowanie, lista firm, szczegoly firmy, wydarzenia, uzytkownicy
2. **Hooki (hooks/)** - Logika stanu i polaczenia z API, wydzielona poza komponenty
3. **Komponenty (components/)** - Reuzywalne elementy UI: karty, formularze, przyciski, os czasu
4. **Serwis API (services/api.js)** - Konfiguracja Axiosa, automatycznie dodaje token JWT do kazdego zapytania

Stan aplikacji jest przechowywany lokalnie w komponentach (useState, useEffect). Nie ma Reduxa ani Zustanda - do prostego CRM-a to zbedne.

Po stronie frontendu nie ma logiki biznesowej - kazda akcja wywoluje endpoint API i czeka na odpowiedz.

### Jak dziala baza grafowa (Neo4j)

W przeciwienstwie do tradycyjnych baz SQL (tabele, wiersze, klucze obce), Neo4j przechowuje dane jako **grafy**. Sklada sie z dwoch rzeczy:

**Wezly (Nodes)** - to obiekty, np. Firma, Uczestnik, Wydarzenie
**Relacje (Relationships)** - to polaczenia miedzy wezlami, np. "Firma JEST PARTNEREM Wydarzenia"

Kazdy wezel moze miec wlasciwosci (properties), czyli zwykle pola jak nazwa, email, data. Relacje tez moga miec wlasciwosci - na przykład relacja PARTNER_OF miedzy Firma a Wydarzeniem ma pole status (CHCE_WEJSC, NIE_CHCE_WEJSC).

**Jak wyglada graf w tej aplikacji:**

```
[Uzytkownik] -- ODPOWIEDZIALNY_ZA --> [Firma]
[Uzytkownik] -- WYKONAL --> [Interakcja]
[Uzytkownik] -- DODAL --> [Notatka]
[Uzytkownik] -- PRZYPISANY_DO --> [Assignment]

[Wydarzenie] -- MA_EDYCJE --> [EdycjaWydarzenia]
[Wydarzenie] <-- JEST_PARTNEREM -- [Firma]  (z statusem na relacji)

[EdycjaWydarzenia] -- MA_ASSIGNMENT --> [Assignment]
[Assignment] -- KONTAKTUJE_SIE_Z --> [Firma]  (z statusem na relacji)

[Firma] -- ZATRUDNIA --> [OsobaKontaktowa]
[OsobaKontaktowa] -- MA_NOTATKE --> [Notatka]

[Interakcja] -- Z_KONTAKTEM --> [OsobaKontaktowa]
[Interakcja] -- Z_FIRMA --> [Firma]
[Interakcja] -- DOTYCZY --> [Wydarzenie]
```

Zaleta grafu jest to, ze mozna latwo przejsc od Firmy do wszystkich Interakcji, potem do Osob Kontaktowych, potem do Notatek - bez zlozonych JOINow. W SQL potrzeba kilku tabel laczacych, w grafie po prostu "idziesz po relacjach".

W kodzie wyglada to tak, ze kazda encja ma adnotacje @Node, a pola z lista innych encji maja adnotacje @Relationship. Przykladowo, klasa Event ma pole:

```java
@Relationship(type = "HAS_EDITION", cascadeUpdates = true)
private List<EventEdition> editions;
```

To mowi Neo4j: "Zapisz to jako relacje HAS_EDITION miedzy wezlem Event a wezlami EventEdition".

---

## Technologie

### Backend
- **Java 21** - jezyk programowania
- **Spring Boot 4.0.6** - framework do budowania aplikacji webowych
- **Spring Security** - logowanie, role, autoryzacja
- **Spring Data Neo4j** - obsluga bazy grafowej (mapowanie obiektowo-grafowe)
- **JWT (jjwt 0.11.5)** - tokeny autoryzacyjne
- **Lombok** - zmniejsza ilosc kodu (gettery, settery, konstruktory)
- **ModelMapper** - mapowanie miedzy encjami a DTO
- **BCrypt** - hashowanie hasel

### Baza danych
- **Neo4j** - grafowa baza danych (lokalnie na porcie 7687 przez Bolt)

### Frontend
- **React 18** - biblioteka do budowania interfejsow
- **Vite 5** - narzedzie do budowania projektu (szybsze od CRA)
- **React Router 7** - nawigacja miedzy stronami
- **Axios** - wykonywanie zapytan HTTP do backendu
- **Tailwind CSS 3** - stylowanie (klasy w HTML zamiast osobnych plikow CSS)

---

## Uruchomienie aplikacji

### Wymagania
- Java 21
- Node.js 18+
- Neo4j (lokalnie lub w Dockerze)

### Backend
1. Uruchom Neo4j (np. przez Docker: `docker run -p 7687:7687 -p 7474:7474 neo4j`)
2. Ustaw zmienna srodowiskowa NEO4J_PASSWORD
3. `./mvnw spring-boot:run` - backend wystartuje na porcie 8080
4. Przy pierwszym uruchomieniu automatycznie utworzy sie konto admin: admin@best.pl / admin123

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` - frontend wystartuje na porcie 5173

### Dostep do API
- Swagger UI: http://localhost:8080/swagger-ui.html

---

## Struktura plikow

```
crm/
  pom.xml                          - zaleznosci Mavena
  src/main/java/com/bestcrm/
    CrmApplication.java            - punkt wejscia aplikacji
    annotation/                    - adnotacje zabezpieczajace (@AdminOnly)
    config/                        - konfiguracja Springa, security, inicjalizacja danych
    controller/                    - REST API (8 kontrolerow)
    dto/                           - klasy DTO (7 sztuk)
    exception/                     - globalna obsluga bledow
    model/                         - encje Neo4j (10 klas)
    repository/                    - interfejsy do bazy danych
    security/                      - JWT (generowanie, walidacja, filtr)
    service/                       - logika biznesowa (interface + implementacja)
  src/main/resources/
    application.properties         - ustawienia (Neo4j, JWT)
  src/test/java/                   - testy jednostkowe
  frontend/
    src/
      pages/                       - widoki stron (7 plikow)
      hooks/                       - logika stanu (7 plikow)
      components/                  - komponenty UI (ok. 20 plikow)
        ui/                        - wspolne elementy (przyciski, karty, inputy)
        partner/                   - komponenty dla firm
        event/                     - komponenty dla wydarzen
        contact/                   - komponenty dla osob kontaktowych
        interaction/               - komponenty dla interakcji
        member/                    - komponenty dla uzytkownikow
      services/api.js              - konfiguracja Axiosa
      App.jsx                      - glowny komponent z routingiem
```

---

## Zasady w kodzie

W projekcie staralismy sie trzymac dobrych praktyk:

- **SOLID** - kazda klasa ma jedna odpowiedzialnosc, serwisy maja interfejsy, zaleznosci sa wstrzykiwane przez konstruktor
- **KISS** - nie ma skomplikowanych wzorców tam, gdzie nie sa potrzebne. Proste CRUD, bez przesadnej abstrakcji
- **DRY** - wspolne pola (id) sa w klasie bazowej, powtarzajace sie adnotacje @PreAuthorize zastapiono wlasnymi adnotacjami, sa wspolne komponenty UI na froncie

Architektura jest warstwowa: kontroler nie zna bazy danych, serwis nie zna HTTP, repozytorium nie wie o uzytkownikach. Kazda warstwa robi swoje i przekazuje dalej.
