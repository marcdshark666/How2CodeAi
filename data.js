const curriculumData = [
    {
        id: "module-html-basics",
        title: "HTML Basics",
        icon: "🌐",
        usage: "Used to build the core structure of basically all websites and web apps (along with CSS and JavaScript).",
        lessons: [
            {
                id: "html-l1",
                type: "info",
                instruction: "Hey there! I am your personal AI code-bot! We are going to build a solid foundation together. We'll start with HTML, the language that builds every webpage you visit!",
            },
            {
                id: "html-l2",
                type: "mcq",
                instruction: "All content and design on the web is wrapped in 'Tags'. Most tags consist of angle brackets: < and >. Which of these is a correct HTML opening tag?",
                options: [
                    "{text}",
                    "<header>",
                    "[title]"
                ],
                correctAnswer: 1,
                feedback: "Nicely done! the browser hides the angle brackets and only reads the magic code inside.",
                hint: "Look for the two symbols < and > that look like small arrows.",
                explanation: "In HTML, the symbols < and > are always used to specify the start of an HTML element. This is called an opening tag."
            },
            {
                id: "html-l3",
                type: "mcq",
                instruction: "To stop a tag, we have to 'close' it. A closing tag has the same name but starts with a slash (/). Which is a correct closing tag?",
                options: [
                    "<\header>",
                    "</header>",
                    "<header/>"
                ],
                correctAnswer: 1,
                feedback: "Exactly right! '</header>' closes the tag safely.",
                hint: "The forward-slash / must be placed directly after the first < symbol.",
                explanation: "The syntax for a closing tag in HTML is always </name>. This tells the browser that the element has ended."
            },
            {
                id: "html-l4",
                type: "mcq",
                instruction: "In HTML, h1 is the largest heading. What do you think 'h' stands for?",
                options: [
                    "Header",
                    "Highlight",
                    "Hypertext"
                ],
                correctAnswer: 0,
                feedback: "Correct! Header 1 through Header 6 are available.",
                hint: "Think about the English word for a title or heading.",
                explanation: "H stands for Header. H1 is level 1 (the largest) and H6 is level 6 (the smallest)."
            },
            {
                id: "html-l5",
                type: "code",
                lang: "html",
                instruction: "Alright, time for the playground! Our first REAL tag is named 'h1'.\\n\\nTask: Close the tag correctly!",
                initialCode: "<h1>Time to code!\n",
                validationRegex: /<\/h1>/i,
                successFeedback: "Wow! You finished the code just like a pro.",
                errorFeedback: "You need to close the tag. Write </h1> at the end!",
                hint: "Write the closing tag for h1 exactly after the text.",
                explanation: "For the heading to stop applying where the text ends, you must add </h1>."
            },
            {
                id: "html-l6",
                type: "code",
                lang: "html",
                instruction: "Now it's your turn. Create your very own <h1> tag and write 'I am coding' inside it.",
                initialCode: "<!-- Write your code below -->\n",
                validationRegex: /<h1>[Ii] am coding<\/h1>/i,
                successFeedback: "You cracked it! You are really building your muscle memory.",
                errorFeedback: "Did you actually write '<h1>I am coding</h1>'?",
                hint: "Start with the opening tag. Then the text. Then the closing tag.",
                explanation: "Correct syntax is: <h1>I am coding</h1>. Note standard lowercase letters and < / > positions."
            }
        ]
    },
    {
        id: "module-python-basics",
        title: "Python for AI",
        icon: "🐍",
        usage: "Used extensively for AI (Artificial Intelligence), Machine Learning, Data Science, and backend servers.",
        lessons: [
            {
                id: "py-l1",
                type: "info",
                instruction: "Time for Python! It is awesome for AI and logic. Python reads code very cleanly and structured.",
            },
            {
                id: "py-l2",
                type: "mcq",
                instruction: "To get the computer to print a line to the screen, we use 'print'. In Python, everything we want to print must be wrapped in parentheses (). Which line is logical?",
                options: [
                    "print 'hello'",
                    "print(hello)",
                    "print() hello"
                ],
                correctAnswer: 1,
                feedback: "Correct! The parentheses always enclose the data.",
                hint: "The word print must be followed directly by parentheses enclosing what you want to output.",
                explanation: "In modern Python (version 3+), print is a built-in function, and functions always require parentheses to be called."
            },
            {
                id: "py-l3",
                type: "mcq",
                instruction: "If we just write print(hello), the computer thinks 'hello' is a variable! To explain that it is text, we need to put quotes around it. Which is right?",
                options: [
                    "print('hello')",
                    "print(\"hello\")",
                    "A and B give the same result"
                ],
                correctAnswer: 2,
                feedback: "Nice job! Both work the same.",
                hint: "Try guessing the last option, Python is pretty flexible.",
                explanation: "In Python, it does not matter if you use single (') or double (\") quotes to create strings (text)."
            },
            {
                id: "py-l4",
                type: "mcq",
                instruction: "What is this type of text data called in programming?",
                options: [
                    "String",
                    "Integer",
                    "Boolean"
                ],
                correctAnswer: 0,
                feedback: "Exactly. A string of characters.",
                hint: "Think of a piece of rope or thread.",
                explanation: "Text in code is called a 'String', because it is a sequence of characters connected in a row."
            },
            {
                id: "py-l5",
                type: "code",
                lang: "python", 
                instruction: "Now we step into the terminal!\\n\\nWrite a print() command that exactly outputs: Hello AI!",
                initialCode: "# Write your code here\n",
                validationRegex: /print\(['"]Hello AI!['"]\)/i,
                successFeedback: "Wonderful. The terminal understood you!",
                errorFeedback: "Make sure you write exactly 'Hello AI!'.",
                hint: "Don't forget both the quotes AND the parentheses around the text Hello AI!",
                explanation: "The answer is print('Hello AI!'). We must both call the print() function and give it a String."
            },
            {
                id: "py-l6",
                type: "info",
                instruction: "Next concept: VARIABLES. A variable is like a digital box you can put things into, and give the box a name.",
            },
            {
                id: "py-l7",
                type: "code",
                lang: "python", 
                instruction: "To save 'Alex' in the box 'name' we write: name = 'Alex'. Let's try! \\n\\nType the code: user = 'Robot'.",
                initialCode: "# Create the variable below\n",
                validationRegex: /user\s*=\s*['"]Robot['"]/i,
                successFeedback: "Perfect! You just put the data string 'Robot' inside the variable 'user'. That is the foundation of all software!",
                errorFeedback: "Not quite, look at the exact spelling.",
                hint: "The variable's name is on the left, then an '=' sign, and then the value on the right.",
                explanation: "In Python, you declare variables by just writing name = value. So user = 'Robot' stores the text Robot."
            }
        ]
    },
    {
        id: "module-csharp-unity",
        title: "C# for Unity",
        icon: "🎮",
        usage: "The standard language for game development in the Unity Engine. Also popular for enterprise apps via .NET.",
        lessons: [
            {
                id: "cs-l1",
                type: "info",
                instruction: "Welcome to Game Development! 🎮\\n\\nHere we will look at C#, the language that powers the Unity engine. It has a very strict but wonderfully logical code structure.",
            },
            {
                id: "cs-l2",
                type: "mcq",
                instruction: "Because C# is logically structured, we often use an object (the console) and ask it to do something (log data). What do you think Unity uses for its 'print' command?",
                options: [
                    "console.log('Hi')",
                    "Debug.Log('Hi')",
                    "echo 'Hi'"
                ],
                correctAnswer: 1,
                feedback: "Nice! 'Debug.Log()' is used constantly in Unity to debug your game code.",
                hint: "It has to do with debugging in Unity's inner core.",
                explanation: "In Unity, the print function belongs to the 'Debug' class and the function is named 'Log'."
            },
            {
                id: "cs-l3",
                type: "mcq",
                instruction: "A very important syntax requirement in C#: Every statement must end with a specific character. Which one?",
                options: [
                    "Period (.)",
                    "Semicolon (;)",
                    "Colon (:)"
                ],
                correctAnswer: 1,
                feedback: "Exactly. The semicolon is C#'s equivalent to a spoken period.",
                hint: "It's a character that looks like a comma mixed with a period.",
                explanation: "In C/C++/C#, every pure code statement must end with a semicolon (;) so the compiler knows the line is over."
            },
            {
                id: "cs-l4",
                type: "mcq",
                instruction: "C# is a 'strongly typed' language. When we create a variable, we must tell it EXACTLY what type of data it can hold. What code creates an integer with the value 100?",
                options: [
                    "health = 100;",
                    "int health = 100;",
                    "text health = 100;"
                ],
                correctAnswer: 1,
                feedback: "Perfect! You stated the data type is 'int' and then the name.",
                hint: "The shortest form of the word Integer is used as the data type.",
                explanation: "'int' tells the computer how much memory is required. Then comes the name 'health', then =, and then 100. Finally the semicolon ;."
            },
            {
                id: "cs-l5",
                type: "code",
                lang: "csharp", 
                instruction: "Your turn to code C#! Remember the structure and the extremely important semicolons ( ; ). \\n\\nWrite a command that prints: Hello Unity",
                initialCode: "// Write your Unity code here\n",
                validationRegex: /Debug\.Log\(['"]Hello Unity['"]\)\s*;/i,
                successFeedback: "Fantastic! You are well on your way to building the next blockbuster game.",
                errorFeedback: "Did you get a compilation error? Forgot the semicolon?",
                hint: "The code is Debug.Log('Hello Unity');",
                explanation: "The entire sentence in C# is: Debug.Log('Hello Unity'); – If the semicolon is missing, the whole game crashes!"
            }
        ]
    },
    {
        id: "module-cpp-hardware",
        title: "C++ and Systems",
        icon: "⚙️",
        usage: "Game engines (Unreal Engine), Operating Systems (Windows), and software where hyper-performance is required (Browsers, AI Cores).",
        lessons: [
            {
                id: "cpp-l1",
                type: "info",
                instruction: "C++ is the beast of the industry! It is extremely fast because it runs very close to the computer's hardware (the processor). Much of the AI's core is written in this.",
            },
            {
                id: "cpp-l2",
                type: "mcq",
                instruction: "Just like in C#, C++ must have a specific ending on every statement. Remember which one?",
                options: [
                    "Parentheses ()",
                    "Semicolon (;)",
                    "Period (.)"
                ],
                correctAnswer: 1,
                feedback: "Right! C++ and C# come from the same C-family.",
                hint: "The same as in the previous lesson about C#!",
                explanation: "C++ is the foundation language that C# and Java were built from, where the semicolon (;) is the gold standard for endings."
            },
            {
                id: "cpp-l3",
                type: "mcq",
                instruction: "In C++, the print command is a bit different. It builds on 'Character Output', and is usually fed with special brackets (<<). What is the command called?",
                options: [
                    "std::cout",
                    "print>>",
                    "Console.Log"
                ],
                correctAnswer: 0,
                feedback: "Nice job, cout stands for C-Out.",
                hint: "We are looking for 'C-Out' but it is hidden behind 'std::'.",
                explanation: "'std::cout' stands for Standard Character Output. It is the fastest way to send bytes out to the terminal."
            },
            {
                id: "cpp-l4",
                type: "mcq",
                instruction: "When we send text to cout, we use redirection arrows '<<'. Which statement looks most valid in C++?",
                options: [
                    "std::cout << 'Hi';",
                    "cout('Hi');",
                    "std::cout 'Hi';"
                ],
                correctAnswer: 0,
                feedback: "Perfect! We 'shoot' the word Hi into std::cout.",
                hint: "The arrows << show that the word 'Hi' streams into std::cout.",
                explanation: "C++ uses IO-Streams. 'std::cout << ...' shows how the data stream flows into the terminal."
            },
            {
                id: "cpp-l5",
                type: "code",
                lang: "cpp", 
                instruction: "Let's send a signal! \\n\\nWrite the C++ command that sends the text 'System Online' to std::cout.",
                initialCode: "// C++ Terminal\n",
                validationRegex: /std::cout\s*<<\s*['"]System Online['"]\s*;/i,
                successFeedback: "You are absolutely incredible! You just wrote functional C++ code.",
                errorFeedback: "Did you forget the arrows << or maybe a semicolon ; at the end?",
                hint: "The code is: std::cout << 'System Online';",
                explanation: "We call the Standard library with 'std::cout', shoot the data in with '<<', write the string 'System Online' and close the statement with ';'!"
            }
        ]
    }
];
