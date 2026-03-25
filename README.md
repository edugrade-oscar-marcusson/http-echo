# http-echo

En ASP.NET server som skriver ut den senaste HTTP requesten till terminalen.
Detta är användbart för att kunna se vad exakt en klient skickar, exempelvis via
[Postman](https://www.postman.com/), [cURL](https://curl.se/) eller kod som
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
från Javascript eller
[HttpClient](https://learn.microsoft.com/en-us/dotnet/fundamentals/networking/http/httpclient)
från C#.

## Användning

Programmet startas antingen rakt av eller med ett portnummer som argument. Om
inget argument anges startar servern på port `8080`.

### Utveckling

Under utveckling kör vi med `dotnet run` som vanligt:

| Kommandexempel     | Förklaring                      |
| ------------------ | ------------------------------- |
| `dotnet run`       | Startar servern på port `8080`  |
| `dotnet run 80`    | Startar servern på port `80`    |
| `dotnet run 12052` | Startar servern på port `12052` |

### Installerat

Om servern har installerats via `npm run install`så körs den via `http-echo`:

| Kommandexempel    | Förklaring                      |
| ----------------- | ------------------------------- |
| `http-echo`       | Startar servern på port `8080`  |
| `http-echo 80`    | Startar servern på port `80`    |
| `http-echo 12052` | Startar servern på port `12052` |

## Bygge och installation

För att underlätta cross-platform arbete så finns ett
[NPM](https://www.npmjs.com/) projekt i root-mappen. Denna kan användas för att
bygga, installera och avinstallera programmet automatiskt:

| Kommandexempel      | Förklaring                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| `npm run build`     | Bygger en release-version som placeras i root-mappen                     |
| `npm run install`   | Samma som `build`, men flyttar programmet så att den är globalt åtkomlig |
| `npm run uninstall` | Tar bort det installerade programmet                                     |

### Programnamn om `npm run build` körs

Programmet kommer heta `http-echo.exe` på Windows, men bara `http-echo` för alla
andra. Ska programmet bara byggas och köras (men inte installeras) så körs det
såhär på Windows:

```bash
npm run build
./http-echo.exe
```

Medan samma sak under Mac eller Linux skulle se ut såhär:

```bash
npm run build
./http-echo
```
