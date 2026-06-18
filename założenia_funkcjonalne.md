# System CRM dla Stowarzyszenia Studenckiego - Opis Projektu

## 1. Założenia projektu

Głównym celem projektu jest stworzenie prostego i intuicyjnego narzędzia wspierającego współpracę członków stowarzyszenia z firmami zewnętrznymi.

Aktualnie informacje o kontaktach biznesowych są rozproszone - część wiedzy istnieje tylko w głowach poszczególnych osób, część gubi się w wątkach mailowych, a reszta trafia do różnych, niepowiązanych arkuszy kalkulacyjnych. Chcemy to zmienić i zebrać wszystko w jednym miejscu, które pozwoli nam:

* mieć pełny przegląd partnerów i historii rozmów z nimi,
* wiedzieć, kto ostatnio kontaktował się z daną firmą i kiedy,
* śledzić, którzy sponsorzy są zaangażowani w konkretne wydarzenia,
* pilnować zaplanowanych follow-upów, żeby żaden ważny termin nie umknął.

## 2. Krótki wstęp teoretyczny

Projekt jest aplikacją typu **CRM** (*Customer Relationship Management*) - czyli systemem służącym do zarządzania relacjami z partnerami zewnętrznymi.

Kluczową decyzją techniczną było zastosowanie **grafowej bazy danych (Neo4j)** zamiast klasycznego podejścia relacyjnego. Wybór ten wynika ze specyfiki danych, którymi operujemy - w stowarzyszeniu niemal wszystko jest ze sobą w jakiś sposób powiązane:

* **Członek** stowarzyszenia prowadzi rozmowy z **Firmą**,
* **Firma** zostaje sponsorem konkretnego **Wydarzenia**,
* każda taka rozmowa jest rejestrowana jako osobna **Interakcja**.

Baza grafowa naturalnie odzwierciedla tego typu sieć zależności - dane przechowywane są jako węzły i krawędzie, co znacznie ułatwia analizę powiązań i odpowiada temu, jak te relacje wyglądają w rzeczywistości.

## 3. Zakres funkcjonalności

### Zarządzanie partnerami (firmami)
* Baza firm wraz z danymi kontaktowymi.
* Statusy współpracy (np. *aktywny partner*, *potencjalny*, *zawieszone kontakty*).
* Przypisywanie konkretnych osób odpowiedzialnych za kontakt z daną firmą.

### Zarządzanie wydarzeniami
* Prowadzenie listy organizowanych eventów (np. warsztaty, targi pracy).
* Możliwość przypisania firm do wydarzeń w roli sponsorów.

### Rejestrowanie kontaktów (interakcje)
* Zapis każdego maila, rozmowy telefonicznej czy spotkania.
* Informacje o tym: kto rozmawiał, z kim, kiedy i co z tego wynikło.
* Planowanie przypomnień o kolejnym kontakcie.

### Użytkownicy i role
* Każdy członek posiada własne konto w systemie.
* Zdefiniowane role dostępu: **Admin** (pełne uprawnienia), **Członek** (dodawanie i edycja danych), **Gość** (wyłącznie podgląd).
