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
                instruction: "Tjenare! Jag är din personliga kod-robot! Precis som på Coddy ska vi bygga solida grunder. Vi börjar med HTML. Det är språket som bygger upp alla webbsidor du besöker!",
            },
            {
                id: "html-l2",
                type: "mcq",
                instruction: "All text och design på webben ligger i 'Taggar'. De flesta taggar består av krokodilhapar: < och >. Vilket av dessa är en korrekt HTML-tagg?",
                options: [
                    "{text}",
                    "<rubrik>",
                    "[titel]"
                ],
                correctAnswer: 1,
                feedback: "Snyggt! '<rubrik>' är en tagg. Webbläsaren gömmer krokodilgapen och läser bara the magiska orden inuti."
            },
            {
                id: "html-l3",
                type: "mcq",
                instruction: "För att stoppa en tagg måste vi 'stänga' den, annars löper den amok över hela skärmen! En sluttagg har samma namn men inleds med ett snedstreck (/). Vilken är en korrekt sluttagg?",
                options: [
                    "<\rubrik>",
                    "</rubrik>",
                    "<rubrik/>"
                ],
                correctAnswer: 1,
                feedback: "Helt rätt! '</rubrik>' stänger taggen säkert."
            },            
            {
                id: "html-l4",
                type: "code",
                lang: "html",
                instruction: "Okej, ut i lekplatsen! Vår första RIKTIGA tagg heter 'h1' (står för Header 1, en gigantisk rubrik).\\n\\nUppgift: Stäng taggen korrekt!",
                initialCode: "<h1>Coddy är grymt!\n",
                validationRegex: /<\/h1>/i,
                successFeedback: "Wow! Du avslutade koden precis som ett proffs. Ser du effekten?",
                errorFeedback: "Du måste stänga taggen. Skriv </h1> i slutet!"
            },
            {
                id: "html-l5",
                type: "code",
                lang: "html",
                instruction: "Nu är det din tur. Skapa en helt egen <h1> tagg och skriv 'Jag kodar' inuti den.",
                initialCode: "<!-- Skriv koden här under -->\n",
                validationRegex: /<h1>[Jj]ag kodar<\/h1>/i,
                successFeedback: "Du knäckte det! Du börjar verkligen bygga ditt muskelminne.",
                errorFeedback: "Skrev du verkligen '<h1>Jag kodar</h1>'?"
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
                instruction: "Dags för Python! Precis som i Mimo är det grymt för data, AI och servrar. Python läser koden rad för rad, exakt som engelska.",
            },
            {
                id: "py-l2",
                type: "mcq",
                instruction: "För att få datorn att säga något använder vi kommandot 'print'. I Python måste allt vi vill skriva ut finnas inom parenteser (). Vilken rad är mest logisk?",
                options: [
                    "print 'hej'",
                    "print(hej)",
                    "print() hej"
                ],
                correctAnswer: 1,
                feedback: "Korrekt! I nästa steg ska vi se hur vi får texten att bli säker."
            },
            {
                id: "py-l3",
                type: "mcq",
                instruction: "Om vi bara skriver print(hej) tror datorn att hej är en matematisk variabel! För att förklara att det är en 'Text-sträng' måste vi lägga citationstecken runt texten. Vilken är rätt?",
                options: [
                    "print('hej')",
                    "print(\"hej\")",
                    "A och B ger samma resultat"
                ],
                correctAnswer: 2,
                feedback: "Snyggt jobbat! Både enkla (') och dubbla (\") citationstecken fungerar identiskt i Python."
            },
            {
                id: "py-l4",
                type: "code",
                lang: "python", 
                instruction: "Nu gör vi det PÅ RIKTIGT. Lika coolt som Coddy's editor. \\n\\nSkriv ett print()-kommando som skriver ut: Hello, Coddy!",
                initialCode: "# Skriv din kod här\n",
                validationRegex: /print\(['"]Hello, Coddy!['"]\)/i,
                successFeedback: "Underbart. Systemet förstod dig!",
                errorFeedback: "Se till att du skriver print('Hello, Coddy!') exakt."
            },
            {
                id: "py-l5",
                type: "info",
                instruction: "Ett sista koncept! VARIABLER. En variabel är som en låda du kan stoppa saker i för att komma ihåg dem till senare.",
            },
            {
                id: "py-l6",
                type: "code",
                lang: "python", 
                instruction: "För att spara i lådan skriver vi: namn = 'Alex'. Låt oss pröva! \\n\\nSkriv: user = 'Robot' och tryck på kör.",
                initialCode: "# Skapa variabeln under\n",
                validationRegex: /user\s*=\s*['"]Robot['"]/i,
                successFeedback: "Perfekt! Du la precis Data-strängen 'Robot' inuti variablen 'user'. Det är grunden till all mjukvara!",
                errorFeedback: "Nja, skriv det precis: user = 'Robot'"
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
                instruction: "Välkommen till Spelutveckling! 🎮\\n\\nHär ska vi kolla på C#, språket som används i Unity-motorn. Det är känt för att vara logiskt att lära sig och ha en extremt 'clean' kodstruktur.",
            },
            {
                id: "cs-l2",
                type: "mcq",
                instruction: "Unity använder en särskild metod för att skriva ut meddelanden i spel-konsolen. Det liknar Python's 'print', men är specifikt för Unity. Vilket av dessa tror du det är?",
                options: [
                    "console.log('Hej')",
                    "Debug.Log('Hej')",
                    "echo 'Hej'"
                ],
                correctAnswer: 1,
                feedback: "Snyggt! 'Debug.Log()' används jämnt i Unity för att felsöka din spelkod."
            },
            {
                id: "cs-l3",
                type: "mcq",
                instruction: "C# är ett 'starkt typat' språk. Det betyder att när vi skapar en låda (variabel) måste vi berätta EXAKT vilken typ av data som får ligga i den. Vilken kod skapar ett heltal (integer) med värdet 100?",
                options: [
                    "health = 100",
                    "int health = 100;",
                    "text health = 100;"
                ],
                correctAnswer: 1,
                feedback: "Perfekt! Du sa att datatypen är 'int' (heltal) och sen namnet. Notera också semikolonet ';' i slutet!"
            },
            {
                id: "cs-l4",
                type: "code",
                lang: "csharp", 
                instruction: "Din tur att koda C#! Var noga med strukturen, alla kodrader i C# måste avslutas med ett semikolon ( ; ). \\n\\nSkriv ett kommando som skriver ut: Hello Unity",
                initialCode: "// Skriv din Unity-kod här\n",
                validationRegex: /Debug\.Log\(['"]Hello Unity['"]\)\s*;/i,
                successFeedback: "Fantastiskt! Du är på god väg att bygga nästa storspel.",
                errorFeedback: "Skrev du: Debug.Log('Hello Unity') och GLÖMDE du semikolon ( ; ) på slutet?"
            }
        ]
    }
];
