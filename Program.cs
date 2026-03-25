using Microsoft.AspNetCore.Connections;

ushort port = 8080;
if (args.Length == 1)
{
    if (!ushort.TryParse(args[0], out port))
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Ange ett giltigt portnummer som argument");
        Console.ResetColor();
        return 1;
    }
}
else if (args.Length > 1)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("För många argument");
    Console.ResetColor();
    Console.WriteLine(" - Om inget argument anges används port " + port);
    Console.WriteLine(" - Om ett argument anges tolkas det som portnumret");
    return 1;
}

var builder = WebApplication.CreateBuilder(args);
builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(LogLevel.None);
builder.WebHost.ConfigureKestrel(options => options.ListenLocalhost(port));
var app = builder.Build();

app.MapEcho();

try
{
    await app.StartAsync();
    Console.Clear();
    Console.Write("Skriver ut alla anrop mot ");
    Console.ForegroundColor = ConsoleColor.Cyan;
    Console.Write($"http://localhost:{port}");
    Console.ResetColor();
    Console.WriteLine();
    await app.WaitForShutdownAsync();
}
catch (Exception ex) when (ex is AddressInUseException || ex.InnerException is AddressInUseException)
{
    Console.Write("Porten ");
    Console.ForegroundColor = ConsoleColor.Red;
    Console.Write(port);
    Console.ResetColor();
    Console.WriteLine(" används redan, stäng det andra programmet eller välj en annan port");
    return 1;
}
return 0;