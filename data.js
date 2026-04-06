const curriculumData = [
    {
        id: "module-html-basics",
        title: "HTML Grunderna",
        icon: "🌐",
        usage: "Används för att bygga strukturen på i princip alla webbsidor och webbappar (tillsammans med CSS och JavaScript).",
        lessons: [
            {
                id: "html-l1",
                type: "info",
                instruction: "Tjenare! Jag är din personliga AI-kodbot! Vi ska bygga solida grunder tillsammans. Vi börjar med HTML. Det är språket som bygger upp alla webbsidor du besöker!",
            },
            {
                id: "html-l2",
                type: "mcq",
                instruction: "All text och design på webben ligger inuti 'Taggar'. De flesta taggar består av krokodilgap: < och >. Vilket av dessa är en korrekt start-tagg i HTML?",
                options: [
                    "{text}",
                    "<rubrik>",
                    "[titel]"
                ],
                correctAnswer: 1,
                feedback: "Snyggt! Webbläsaren gömmer krokodilgapen och läser bara koden inuti.",
                hint: "Titta efter de två symbolerna < och > som ser ut som små pilar eller gap.",
                explanation: "I HTML används alltid symbolerna < och > för att markera början på ett HTML-element. Detta kallas för en start-tagg."
            },
            {
                id: "html-l3",
                type: "mcq",
                instruction: "För att stoppa en tagg måste vi 'stänga' den. En sluttagg har samma namn men inleds med ett snedstreck (/). Vilken är en korrekt sluttagg?",
                options: [
                    "<\rubrik>",
                    "</rubrik>",
                    "<rubrik/>"
                ],
                correctAnswer: 1,
                feedback: "Helt rätt! '</rubrik>' stänger taggen säkert.",
                hint: "Snedstrecket / måste ligga direkt efter den första <-symbolen.",
                explanation: "Syntaxen för en stängande tagg i HTML är alltid </namn>. Detta berättar för webbläsaren att elementet är slut."
            },
            {
                id: "html-l4",
                type: "mcq",
                instruction: "I HTML är h1 den allra största rubriken. Vad betyder 'h' tror du?",
                options: [
                    "Header (Rubrik)",
                    "Highlight (Markering)",
                    "Hypertext"
                ],
                correctAnswer: 0,
                feedback: "Korrekt! Header 1 till Header 6 finns tillgängliga.",
                hint: "Tänk på det engelska ordet för rubrik.",
                explanation: "H står för Header. H1 är nivå 1 (störst) och H6 är nivå 6 (minst)."
            },
            {
                id: "html-l5",
                type: "code",
                lang: "html",
                instruction: "Okej, ut i lekplatsen! Vår första RIKTIGA tagg heter 'h1'.\\n\\nUppgift: Stäng taggen korrekt!",
                initialCode: "<h1>Dags att koda!\n",
                validationRegex: /<\/h1>/i,
                successFeedback: "Wow! Du avslutade koden precis som ett proffs.",
                errorFeedback: "Du måste stänga taggen. Skriv </h1> i slutet!",
                hint: "Skriv den stängande taggen för h1 exakt efter texten.",
                explanation: "För att rubriken ska sluta gälla där texten tar slut måste du lägga till </h1>."
            },
            {
                id: "html-l6",
                type: "code",
                lang: "html",
                instruction: "Nu är det din tur. Skapa en helt egen <h1> tagg och skriv 'Jag kodar' inuti den.",
                initialCode: "<!-- Skriv koden här under -->\n",
                validationRegex: /<h1>[Jj]ag kodar<\/h1>/i,
                successFeedback: "Du knäckte det! Du börjar verkligen bygga ditt muskelminne.",
                errorFeedback: "Skrev du verkligen '<h1>Jag kodar</h1>'?",
                hint: "Börja med start-taggen. Sedan texten. Sedan sluttaggen.",
                explanation: "Korrekt syntax är: <h1>Jag kodar</h1>. Observera de små bokstäverna och < / > positionerna."
            }
        ]
    },
    {
        id: "module-python-basics",
        title: "Python för AI",
        icon: "🐍",
        usage: "Används flitigt för AI (Artificiell Intelligens), Maskininlärning, Data Science och backend-servrar.",
        lessons: [
            {
                id: "py-l1",
                type: "info",
                instruction: "Dags för Python! Det är grymt för AI och logik. Python läser koden väldigt rent och strukturerat.",
            },
            {
                id: "py-l2",
                type: "mcq",
                instruction: "För att få datorn att skriva ut en rad på skärmen använder vi 'print'. I Python måste allt vi vill skriva ut finnas inom parenteser (). Vilken rad är logisk?",
                options: [
                    "print 'hej'",
                    "print(hej)",
                    "print() hej"
                ],
                correctAnswer: 1,
                feedback: "Korrekt! Parenteserna omsluter alltid datan.",
                hint: "Ordet print ska följas direkt av parenteser som omsluter det du vill skriva ut.",
                explanation: "I moderna Python (version 3+) är print en inbyggd funktion, och funktioner kräver alltid parenteser för att anropas."
            },
            {
                id: "py-l3",
                type: "mcq",
                instruction: "Om vi bara skriver print(hej) tror datorn att 'hej' är en variabel! För att förklara att det är en text måste vi lägga citationstecken runt texten. Vilken är rätt?",
                options: [
                    "print('hej')",
                    "print(\"hej\")",
                    "A och B ger samma resultat"
                ],
                correctAnswer: 2,
                feedback: "Snyggt jobbat! Båda fungerar.",
                hint: "Testa att gissa på sista alternativet, Python är ganska flexibelt.",
                explanation: "I Python spelar det ingen roll om du använder enkla (') eller dubbla (\") citationstecken för att skapa strängar (text)."
            },
            {
                id: "py-l4",
                type: "mcq",
                instruction: "Vad kallas denna typ av text-data i programmering?",
                options: [
                    "String (Sträng)",
                    "Integer (Heltal)",
                    "Boolean"
                ],
                correctAnswer: 0,
                feedback: "Exakt. En sträng av karaktärer.",
                hint: "Tänk på ordet för ett rep eller ett snöre på engelska.",
                explanation: "Text i kod kallas 'String' (Sträng), eftersom det är en sekvens av karaktärer ihopkopplade i en följd."
            },
            {
                id: "py-l5",
                type: "code",
                lang: "python", 
                instruction: "Nu kliver vi in i terminalen!\\n\\nSkriv ett print()-kommando som exakt skriver ut: Hej AI!",
                initialCode: "# Skriv din kod här\n",
                validationRegex: /print\(['"]Hej AI!['"]\)/i,
                successFeedback: "Underbart. Terminalen förstod dig!",
                errorFeedback: "Se till att du skriver exakt 'Hej AI!'.",
                hint: "Glöm inte både citationstecken OCH parenteser runt texten Hej AI!",
                explanation: "Svaret är print('Hej AI!'). Vi måste både kalla på print() funktionen och ge den en String."
            },
            {
                id: "py-l6",
                type: "info",
                instruction: "Nästa koncept: VARIABLER. En variabel är som en digital kartong du kan stoppa saker i, och ge kartongen ett namn.",
            },
            {
                id: "py-l7",
                type: "code",
                lang: "python", 
                instruction: "För att spara 'Alex' i kartongen 'name' skriver vi: name = 'Alex'. Låt oss pröva! \\n\\nSkriv koden: user = 'Robot'.",
                initialCode: "# Skapa variabeln under\n",
                validationRegex: /user\s*=\s*['"]Robot['"]/i,
                successFeedback: "Perfekt! Du la precis Data-strängen 'Robot' inuti variablen 'user'. Det är grunden till all mjukvara!",
                errorFeedback: "Nja, kolla exakt på stavningen.",
                hint: "Variabelns namn står till vänster, sedan ett '=' tecken, och sedan värdet till höger.",
                explanation: "I Python deklarerar du variabler genom att bara skriva namn = värde. Så user = 'Robot' lagrar texten Robot."
            }
        ]
    },
    {
        id: "module-csharp-unity",
        title: "C# för Unity",
        icon: "🎮",
        usage: "Standard-språket för spelutveckling i Unity-motorn. Även populärt för företagsappar (Enterprise) via .NET.",
        lessons: [
            {
                id: "cs-l1",
                type: "info",
                instruction: "Välkommen till Spelutveckling! 🎮\\n\\nHär ska vi kolla på C#, språket som driver Unity-motorn. Det har en väldigt strikt men fantastiskt logisk kodstruktur.",
            },
            {
                id: "cs-l2",
                type: "mcq",
                instruction: "Eftersom C# är logiskt uppbyggt använder vi ofta ett objekt (konsolen) och ber den att göra något (logga data). Vad tror du Unity använder för sitt 'print' kommando?",
                options: [
                    "console.log('Hej')",
                    "Debug.Log('Hej')",
                    "echo 'Hej'"
                ],
                correctAnswer: 1,
                feedback: "Snyggt! 'Debug.Log()' används jämnt i Unity för att felsöka din spelkod.",
                hint: "Det har med felsökning ('debugging') i Unitys internkärna att göra.",
                explanation: "I Unity tillhör utskriftsfunktionen klassen 'Debug' och funktionen heter 'Log'."
            },
            {
                id: "cs-l3",
                type: "mcq",
                instruction: "Ett jätteviktigt syntax-krav i C#: Varje instruktion måste avslutas med ett specifikt tecken. Vilket?",
                options: [
                    "Punkt (.)",
                    "Semikolon (;)",
                    "Kolon (:)"
                ],
                correctAnswer: 1,
                feedback: "Exakt. Semikolonet är C#'s motsvarighet till en språklig punkt.",
                hint: "Det är ett tecken som ser ut som ett kommatecken blandat med en punkt.",
                explanation: "I C/C++/C# måste varje renodlat kod-påstående avslutas med ett semikolon (;) så att kompilatorn vet att raden är över."
            },
            {
                id: "cs-l4",
                type: "mcq",
                instruction: "C# är ett 'starkt typat' språk. När vi skapar en variabel måste vi berätta EXAKT vilken typ av data som får ligga i den. Vilken kod skapar ett heltal (integer) med värdet 100?",
                options: [
                    "health = 100;",
                    "int health = 100;",
                    "text health = 100;"
                ],
                correctAnswer: 1,
                feedback: "Perfekt! Du sa att datatypen är 'int' (heltal) och sen namnet.",
                hint: "Ordet för Heltal är Integer. Den kortaste formen av detta används som datatyp.",
                explanation: "'int' berättar för datorn hur mycket minne som krävs. Sedan kommer namnet 'health', sedan =, och sedan 100. Till sist semikolonet ;."
            },
            {
                id: "cs-l5",
                type: "code",
                lang: "csharp", 
                instruction: "Din tur att koda C#! Kom ihåg strukturen och de extremt viktiga semikolonen ( ; ). \\n\\nSkriv ett kommando som skriver ut: Hello Unity",
                initialCode: "// Skriv din Unity-kod här\n",
                validationRegex: /Debug\.Log\(['"]Hello Unity['"]\)\s*;/i,
                successFeedback: "Fantastiskt! Du är på god väg att bygga nästa storspel.",
                errorFeedback: "Fick du något komplieringsfel? Glömde du semikolon?",
                hint: "Koden är Debug.Log('Hello Unity');",
                explanation: "Hela meningen i C# blir: Debug.Log('Hello Unity'); – Om semikolon saknas kraschar hela spelet!"
            }
        ]
    },
    {
        id: "module-cpp-hardware",
        title: "C++ och System",
        icon: "⚙️",
        usage: "Spelmotorer (Unreal Engine), Operativsystem (Windows), och mjukvara där hyper-prestanda krävs (Webbläsare, AI-Cores).",
        lessons: [
            {
                id: "cpp-l1",
                type: "info",
                instruction: "C++ är branschens odjur! Det är extremt snabbt för att det körs sjukt nära datorns hårdvara (processorn). Mycket av AI:ns kärna är skrivet i detta.",
            },
            {
                id: "cpp-l2",
                type: "mcq",
                instruction: "Precis som i C# måste C++ ha en specifik ändelse på varje rad. Minns du vilken?",
                options: [
                    "Parentes ()",
                    "Semikolon (;)",
                    "Punkt (.)"
                ],
                correctAnswer: 1,
                feedback: "Rätt! C++ och C# kommer från samma C-familj.",
                hint: "Samma som i den förra lektionen om C#!",
                explanation: "C++ är grundspråket som C# och Java byggdes ifrån, där är semikolon (;) guldstandarden för avslut."
            },
            {
                id: "cpp-l3",
                type: "mcq",
                instruction: "I C++ är utskriftskommandot lite annorlunda. Det bygger på 'Character Output', och brukar skrivas in med speciella pilar (<<). Vad heter kommandot?",
                options: [
                    "std::cout",
                    "print>>",
                    "Console.Log"
                ],
                correctAnswer: 0,
                feedback: "Snyggt jobbat, cout står alltså för C-Out.",
                hint: "Vi letar efter 'C-Out' men det är gömt bakom 'std::'.",
                explanation: "'std::cout' står för Standard Character Output. Det är det snabbaste sättet att skicka bytes ut till terminalen."
            },
            {
                id: "cpp-l4",
                type: "mcq",
                instruction: "När vi skickar text till cout använder vi omdirigerings-pilar '<<'. Vilket påstående ser mest giltigt ut i C++?",
                options: [
                    "std::cout << 'Hej';",
                    "cout('Hej');",
                    "std::cout 'Hej';"
                ],
                correctAnswer: 0,
                feedback: "Perfekt! Vi 'skjuter' ordet Hej in i std::cout.",
                hint: "Pilen << visar att ordet 'Hej' strömmar (stream) in till std::cout.",
                explanation: "C++ använder IO-Streams. 'std::cout << ...' visar hur dataströmmen rinner in i terminalen."
            },
            {
                id: "cpp-l5",
                type: "code",
                lang: "cpp", 
                instruction: "Låt oss skicka en signal! \\n\\nSkriv C++ kommandot som skickar texten 'System Online' till std::cout.",
                initialCode: "// C++ Terminal\n",
                validationRegex: /std::cout\s*<<\s*['"]System Online['"]\s*;/i,
                successFeedback: "Du är helt otrolig! Du skrev just fungerande C++-kod.",
                errorFeedback: "Glömde du pilarna << eller kanske ett semikolon ; på slutet?",
                hint: "Koden är: std::cout << 'System Online';",
                explanation: "Vi anropar Standard-biblioteket med 'std::cout', skjuter in datan med '<<', skriver strängen 'System Online' och stänger satsen med ';'!"
            }
        ]
    }
];
