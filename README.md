# zzcms — B&W Liquid-Glass Student Notes App

Aesthetic Single Page Application (SPA) zaprojektowana w stylistyce **Monochrome High-End Liquid-Glass (Glassmorphism)**, stworzona jako nowoczesne narzędzie do katalogowania materiałów, kodu źródłowego i notatek z zajęć akademickich.

## 🚀 Architektura i Stos Technologiczny

- **Frontend**: Pure Vanilla HTML5, CSS3, ES6 JavaScript. Brak ciężkich frameworków, natywny `dialog`, responsywny CSS Grid (`auto-fill`, `minmax`), zmienne CSS (`:root`), akcelerowany sprzętowo `backdrop-filter`.
- **Baza danych (BaaS)**: [Supabase](https://supabase.com) (PostgreSQL 17) z włączoną polityką Row Level Security (RLS) oraz synchronizacją w czasie rzeczywistym (Realtime).
- **Deployment**: [Vercel](https://vercel.com) z automatycznym CI/CD i globalną siecią Edge CDN.
- **Wersjonowanie**: Git & GitHub.

## 🌟 Funkcjonalności

- **Pełny CRUD**: Dodawanie, edycja, usuwanie oraz oznaczanie materiałów jako opanowane.
- **Trwałość danych**: Wszystkie dane są zapisywane w chmurze PostgreSQL w Supabase i synchronizowane na żywo.
- **Formatowanie kodu**: Dedykowany blok monospace dla skryptów, terminala i fragmentów kodu.
- **Obsługa linków i tagów**: Dynamiczne pigułki tagów i klikalne odnośniki do materiałów zewnętrznych.
- **Edycja**: Formularz ładuje dane bezpośrednio do modala z natywnym dialogiem.

## 📦 Uruchomienie lokalne

Wystarczy otworzyć plik `index.html` w dowolnej nowoczesnej przeglądarce lub uruchomić serwer statyczny:

```bash
npx serve .
# lub
python3 -m http.server 3000
```
