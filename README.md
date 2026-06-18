# BEST CRM

System do zarządzania relacjami z firmami partnerskimi dla stowarzyszenia studenckiego BEST AGH.

## Szybki start

```bash
docker-compose up
```

Po uruchomieniu:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:8080
- **Panel Neo4j:** http://localhost:7474

Domyślne konto: `admin@best.pl` / `admin123`

## Uruchomienie ręczne

```bash
# 1. Baza danych
docker run -p 7687:7687 -p 7474:7474 neo4j

# 2. Backend (osobny terminal)
export NEO4J_PASSWORD=twoje_haslo
./mvnw spring-boot:run

# 3. Frontend (osobny terminal)
cd frontend && npm install && npm run dev
```

## Technologie

- **Backend:** Java 21, Spring Boot 4.0.6, Neo4j
- **Frontend:** React 18, Vite 5, Tailwind CSS 3
- **Baza:** Neo4j (grafowa)

## Dokumentacja

- [Dokumentacja techniczna](BEST_CRM_Dokumentacja_Techniczna.md)
- [Instrukcja użytkownika](BEST_CRM_Instrukcja_Uzytkownika.md)
- [Założenia funkcjonalne](założenia_funkcjonalne.md)
