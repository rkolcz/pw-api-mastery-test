# Pw - 3 podejścia do warstwy HTTP

## Własnym framework do testów API
<details>

<summary>Wstęp</summary>
<br>

W Playwright testy API można pisać “niskopoziomowo” (bezpośrednio robiąc requesty), ale w większych projektach szybko pojawia się problem:
- dużo powtarzalnego kodu (URL, path, headers, params, body),
- testy stają się mało czytelne,
- konfiguracja requestów miesza się z logiką testu,
- trudno utrzymać spójny styl w zespole.

Własnym framework do testów API to koncepcje w której budujesz cienką warstwę abstrakcji nad wykonywaniem requestów (mini-framework). Pozwala to składać request “z klocków” i pisać testy bardziej deklaratywnie.

</details>

<details>

<summary>Co robimy</summary>
<br>

Budujemy własną warstwę abstrakcji (mini-framework) do testów API w Playwright, która pozwala opisywać zapytania HTTP w sposób deklaratywny i czytelny.

Zamiast pisać w testach “techniczne” szczegóły requestu w jednym miejscu, rozbijamy je na logiczne elementy (URL, path, parametry, nagłówki, body) i składamy je w formie łańcucha wywołań (fluent interface). Dzięki temu test zaczyna wyglądać jak opis żądania, a nie jak kod infrastrukturalny.

</details>

<details>

<summary>Dlaczego to robimy</summary>
<br>

W prawdziwych projektach testy API szybko rosną i wtedy pojawiają się problemy:
- duplikacja (ciągle te same fragmenty: baseURL, auth header, parametry),
- spadek czytelności (test miesza “co testujemy” z “jak robimy request”),
- trudniejsza konserwacja (zmiana np. autoryzacji wymaga edycji wielu testów),
- brak spójności (każdy pisze requesty trochę inaczej).

Ta warstwa abstrakcji przenosi “mechanikę” requestów do jednego miejsca, a w testach zostawia głównie intencję.

</details>

<details>

<summary>Oczekiwany rezultat</summary>
<br>

- Czytelniejsze testy – testy stają się bardziej opisowe, “self-documenting”.
- Mniej powtórzeń – konfiguracja requestów i wspólne elementy trafiają do jednej klasy/warstwy.
- Łatwiejsze zmiany – np. nowy header, token, baseURL, logowanie → poprawiasz raz, a nie w 50 miejscach.
- Standaryzację w zespole – każdy buduje requesty w tym samym stylu.
- Lepszą skalowalność suite testowej – gdy rośnie liczba endpointów i scenariuszy, struktura się broni.

</details>

<details>

<summary>Instrukcja - budowa własnego frameworka</summary>

### Krok 1: Stwórz builder requestów uywając Fluent Interface Design pattern
W pliku ```utils/request-handler.ts``` tworzysz klasę ```RequestHandler```, która zbiera (kolekcjonuje) parametry requestu z testu, zapisuje je w polach prywatnych, zwraca this z każdej metody, żeby umożliwić “łańcuchowanie” wywołań.

> [!NOTE]
> To podejście jest znane jako: 
> Builder pattern (składanie obiektu krok po kroku)
> Fluent Interface Design (płynny interfejs, chaining)

### Krok 2: Dodaj fixture i wstrzykuj RequestHandler do testów
Utwórz bazowy plik z fixtures (```fixtures/base.fixtures.ts```), w którym bierzesz domyślny ```test``` z pw jako ```base```, a następnie rozszerzasz go o fixture. Dzięki temu ```RequestHandler``` nie jest już tworzony ręcznie w każdym teście.

</details>

____

### 1. “Domyślnie” w Playwright: request/APIRequestContext
**Plusy:**
- działa w tym samym runnerze co UI (@playwright/test)
- wbudowane: baseURL, storageState, trace, retry, timeouts, reporty
- łatwo mieszać API + UI (seed danych, logowanie przez API itd.)

**Zastosowanie:**
Większość projektów, szczególnie gdy API wspiera UI testy.

### 2. Axios (albo inny HTTP client)
**Plusy:**
- interceptory, transformacje, ekosystem
- łatwo użyć też poza Playwrightem (np. w utilach)

**Minusy:**
- tracisz część integracji Playwrighta (reporting, trace powiązany z requestami, spójne timeouts, fixtures)
- auth/storageState mniej “spójne” z UI światem
- utrzymujesz dodatkową zależność i konfigurację

**Zastosowanie:**
Testy API niezależnie od Playwrighta (np. też w innych runnerach), bądź potrzebujesz specyficznych funkcji klienta HTTP (np. nietypowe interceptory, custom transport)

### 3. Własny framework (wyższa abstrakcja)
To jest nadal Playwright pod spodem, tylko tworzysz request handler/client, fluent API typu .path().params().getRequest(200), oraz wspólne asercje, walidatory statusów, logowanie, modele. To podejście to krok w stronę bardziej “frameworkowego” i dojrzałego testowania API: testy są bardziej czytelne i stabilne w utrzymaniu, a logika składania requestów jest scentralizowana i możliwa do rozbudowy (np. o logowanie, walidację statusów, retry, wspólne asercje).

**Plusy:**
- czytelniejsze testy (“business language”)
- mniej duplikacji
- łatwiej utrzymać duże API suite

**Minusy:**
- możesz łatwo przeabstrahować (debug trudniejszy)
- trzeba pilnować, żeby framework nie ukrywał zbyt dużo (np. request/response)

**Zastosowanie:**
Średni/duży zestaw testów API, kilka osób w zespole.
<br >
<br >
<br >

### Wnioski do zastosowania w projekcie
**Najpierw:** surowe request + proste helpery (clients/, builders/, asserts/)

**Potem** (gdy testów przybywa): fluent interface / request handler

**Axios:** tylko gdy musisz albo chcesz współdzielić klienta poza Playwrightem.