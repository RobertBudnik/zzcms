<div align="center">

# zzcms

**Moja prosta apka (Single Page Application) do trzymania notatek z wykładów, labów i skrawków kodu.**<br>
Napisana w 100% w czystym JavaScriptcie, bez ciężkich frameworków, w ciemnym klimacie "glassmorphism".

[![Live](https://img.shields.io/badge/Live-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://zzcms.vercel.app)
[![Repo](https://img.shields.io/badge/GitHub-Repo-000000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RobertBudnik/zzcms)

</div>

---

## <img src="https://api.iconify.design/lucide:camera.svg?color=%23a3a3a3" width="24" align="absmiddle"> Zrzuty ekranu

![Główny widok aplikacji](TUTAJ_WKLEJ_LINK_DO_ZDJECIA_GLOWNEGO)
*Główny widok kafelków z notatkami.*

![Widok edycji lub kodu](TUTAJ_WKLEJ_LINK_DO_INNEGO_ZDJECIA)
*Przykładowy zrzut z dedykowanego pola na kod i komendy.*

---

## <img src="https://api.iconify.design/lucide:lightbulb.svg?color=%23a3a3a3" width="24" align="absmiddle"> O co chodzi w projekcie?

Chciałem mieć jedno wygodne miejsce do archiwizacji uczelnianych materiałów, które działa szybko i opiera się na natywnych standardach webowych. Zamiast instalować Reacta i setki paczek `npm`, postawiłem na Vanilla JS.

**Główne ficzery:**
*   **Prosty system uprawnień:** Domyślnie tryb gościa (read-only). Po zalogowaniu (na sztywno jako admin) odkrywają się opcje edycji, usuwania i dodawania kafelków.
*   **Wygodne miejsce na kod:** Tekst z tagów i zapytań (np. SQL, Bash, Python) jest bezpiecznie formatowany i chroniony przed XSS.
*   **Status opanowania materiału:** Mały przycisk (⚡) pozwala odznaczyć, że dana partia materiału jest już ogarnięta (kafelek staje się lekko przezroczysty).
*   **Realtime:** WebSockety sprawiają, że jak dodam notatkę na telefonie, od razu pojawia się też na laptopie.

---

## <img src="https://api.iconify.design/lucide:layers.svg?color=%23a3a3a3" width="24" align="absmiddle"> Czego użyłem?

*   **Frontend:** HTML5, CSS3, Vanilla JS (ES6+). Zero zewnętrznych bibliotek UI.
*   **Baza & API:** Supabase (PostgreSQL). Darmowe i szybkie z gotowym API PostgREST.
*   **Hosting:** Vercel. Podpięty prosto pod repozytorium na GitHubie.

---

## <img src="https://api.iconify.design/lucide:terminal.svg?color=%23a3a3a3" width="24" align="absmiddle"> Jak odpalić u siebie?

Aplikacja to same pliki statyczne, więc klonujesz repo i odpalasz czymkolwiek (np. wbudowanym serwerem Pythona):

```bash
git clone [https://github.com/RobertBudnik/zzcms.git](https://github.com/RobertBudnik/zzcms.git)
cd zzcms
python3 -m http.server 3000
