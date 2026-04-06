const curriculumData = [
    {
        id: "module-html-basics",
        title: "HTML Grunderna",
        icon: "🌐",
        lessons: [
            {
                id: "html-l1",
                type: "info",
                instruction: "Hej! Jag är din kodning-robot. Vi ska börja med webbens byggsten, HTML! Redo att bygga din första hemsida?",
            },
            {
                id: "html-l2",
                type: "mcq",
                instruction: "Vad står HTML för?",
                options: [
                    "HyperText Markup Language",
                    "Home Tool Markup Language",
                    "Hyperlinks and Text Markup Language"
                ],
                correctAnswer: 0,
                feedback: "Helt rätt! Det är språket som strukturerar webben."
            },
            {
                id: "html-l3",
                type: "code",
                lang: "html",
                instruction: "Låt oss skriva din första kod! Skapa en rubrik genom att skriva <h1>Hej Världen!</h1> och tryck på Kör.",
                initialCode: "<!-- Skriv din HTML-kod här under -->\n",
                validationRegex: /<h1>.*<\/h1>/i,
                successFeedback: "Wow! Du skapade en rubrik! Ser du hur koden förvandlas till stor text?"
            }
        ]
    },
    {
        id: "module-python-basics",
        title: "Python för AI",
        icon: "🐍",
        lessons: [
            {
                id: "py-l1",
                type: "info",
                instruction: "Bra jobbat med HTML! Nu ska vi lära oss Python, ett superpopulärt språk för AI och Data. (Perfekt för Antigravity och Cursor!)",
            },
            {
                id: "py-l2",
                type: "mcq",
                instruction: "Hur skriver man ut text på skärmen i Python?",
                options: [
                    "echo 'Hej'",
                    "console.log('Hej')",
                    "print('Hej')"
                ],
                correctAnswer: 2,
                feedback: "Exakt! 'print()' är det magiska ordet i Python."
            },
            {
                id: "py-l3",
                type: "code",
                lang: "python", /* We will use normal iframe mock for this simple case or Pyodide */
                instruction: "Testa själv! Skriv print('Jag kodar!') och tryck på Kör.",
                initialCode: "# Skriv din kod här\n",
                validationRegex: /print\(.*['"].*['"].*\)/i,
                successFeedback: "Fantastiskt! Du är en riktig Python-mästare nu."
            }
        ]
    }
];
