using System.Text;

public static class MapEchoWrapper
{
    static readonly Lock locker = new();

    public static void MapEcho(this WebApplication app)
    {
        app.Run(async context =>
        {
            var cts = CancellationTokenSource.CreateLinkedTokenSource(
                context.RequestAborted,
                app.Lifetime.ApplicationStopping
            );

            // Läs hela HTTP requesten och skriv ut
            try
            {
                var body = await GetBodyAsync(context.Request, cts.Token);
                lock (locker)
                {
                    Console.WriteLine("\n\n");
                    PrintRequestLine(context.Request);
                    PrintHeaders(context.Request);
                    PrintBody(body);
                }
            }
            catch (OperationCanceledException)
            {
                return;
            }

            // Säkerställ att ett svar åker ut
            context.Response.StatusCode = 200;
        });
    }


    static void PrintRequestLine(HttpRequest request)
    {
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.Write($"{request.Method} ");

        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.Write($"{request.Scheme}://{request.Host}{request.Path}{request.QueryString} ");

        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.WriteLine($"HTTP/{request.Protocol.Replace("HTTP/", "")}");

        Console.ResetColor();
    }

    static void PrintHeaders(HttpRequest request)
    {
        foreach (var header in request.Headers)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(header.Key);

            Console.ForegroundColor = ConsoleColor.DarkGray;
            Console.Write(": ");

            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(string.Join(", ", header.Value.ToArray()));

            Console.ResetColor();
        }
    }

    static async Task<string?> GetBodyAsync(HttpRequest request, CancellationToken ct)
    {
        if (request.ContentLength > 0 || request.Headers.ContainsKey("Transfer-Encoding"))
        {
            request.EnableBuffering();

            using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync(ct);

            request.Body.Position = 0;
            return body;
        }
        return null;
    }

    static void PrintBody(string? body)
    {
        if (string.IsNullOrWhiteSpace(body))
            return;

        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine(body);
    }
}