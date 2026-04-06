// State Management
let appState = {
    currentModuleIndex: null,
    currentLessonIndex: 0,
    hearts: 3,
    maxHearts: null,
    completedModules: [],
    unlockedModules: 1,
    progress: 0
};

// Sound Synthesizer (Web Audio API)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let audioInitialized = false;

function initAudio() {
    if(!audioInitialized && AudioContext) {
        audioCtx = new AudioContext();
        audioInitialized = true;
    }
}

function playSound(type) {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);     // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1); // C6
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }
}


// DOM Elements
const viewMap = document.getElementById('view-map');
const viewLesson = document.getElementById('view-lesson');
const mapContainer = document.getElementById('map-container');
const btnBack = document.getElementById('btn-back');
const topNav = document.getElementById('top-nav');
const progressFill = document.getElementById('progress-fill');
const heartsCount = document.getElementById('hearts-count');
const lessonInstruction = document.getElementById('lesson-instruction');
const interactiveArea = document.getElementById('interactive-area');
const btnCheck = document.getElementById('btn-check');

// Feedback Panel
const feedbackPanel = document.getElementById('feedback-panel');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackDesc = document.getElementById('feedback-desc');
const btnContinue = document.getElementById('btn-continue');
const btnHint = document.getElementById('btn-hint');

// State Variables for Lesson
let currentSelection = null;
let currentLessonObj = null;
let currentHintLevel = 0;

// AI Chat elements
const btnAskAi = document.getElementById('btn-ask-ai');
const aiChatModal = document.getElementById('ai-chat-modal');
const btnCloseChat = document.getElementById('btn-close-chat');
const btnSendChat = document.getElementById('btn-send-chat');
const chatInput = document.getElementById('chat-input');
const chatHistory = document.getElementById('chat-history');
const difficultyModal = document.getElementById('difficulty-modal');
const btnDiffs = document.querySelectorAll('.btn-diff');
const btnSettingsFloating = document.getElementById('btn-settings-floating');

// Difficulty / Settings Selection
btnDiffs.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const hearts = parseInt(e.currentTarget.getAttribute('data-hearts'));
        appState.maxHearts = hearts;
        appState.hearts = hearts;
        saveState();
        difficultyModal.classList.add('hidden');
        if (viewMap.classList.contains('hidden')) {
            // If they were doing a lesson, they just reset their hearts. Update ui.
            updateHearts();
        } else {
            init(); // Re-run init if we are on map
        }
    });
});

if (btnSettingsFloating) {
    btnSettingsFloating.addEventListener('click', () => {
        difficultyModal.classList.remove('hidden');
    });
}

// Initialization
function init() {
    loadState();
    
    if (!appState.maxHearts) {
        difficultyModal.classList.remove('hidden');
        return; // Wait for difficulty selection
    }

    // Add interactions to map
    document.addEventListener('click', () => { initAudio(); }, {once: true});
    renderMap();
    updateHearts();
    
    if (appState.currentModuleIndex !== null) {
        startModule(appState.currentModuleIndex);
    }
}

function renderMap() {
    viewMap.classList.remove('hidden');
    viewLesson.classList.add('hidden');
    topNav.classList.add('hidden');
    if(btnSettingsFloating) btnSettingsFloating.style.display = 'flex';
    
    mapContainer.innerHTML = '';
    
    curriculumData.forEach((mod, index) => {
        const nodeWrap = document.createElement('div');
        nodeWrap.style.display = 'flex';
        nodeWrap.style.flexDirection = 'column';
        nodeWrap.style.alignItems = 'center';
        nodeWrap.style.gap = '10px';
        nodeWrap.style.position = 'relative';

        const node = document.createElement('div');
        node.className = 'level-node';
        if (appState.completedModules.includes(index)) {
            node.classList.add('completed');
        } else {
            // All modules unlocked as requested
            node.classList.add('active');
        }
        node.innerHTML = mod.icon;

        // All unlocked
        node.addEventListener('click', () => startModule(index));

        const labelContainer = document.createElement('div');
        labelContainer.style.display = 'flex';
        labelContainer.style.alignItems = 'center';
        labelContainer.style.gap = '8px';

        const label = document.createElement('div');
        label.textContent = mod.title;
        label.style.fontWeight = 'bold';
        label.style.color = 'var(--text-secondary)';

        const infoBtn = document.createElement('button');
        infoBtn.textContent = 'ℹ️';
        infoBtn.title = 'Användningsområden';
        infoBtn.style.background = 'none';
        infoBtn.style.border = 'none';
        infoBtn.style.cursor = 'pointer';
        infoBtn.style.fontSize = '1.2rem';
        infoBtn.style.transition = 'transform 0.2s';
        infoBtn.onmouseover = () => infoBtn.style.transform = 'scale(1.2)';
        infoBtn.onmouseout = () => infoBtn.style.transform = 'scale(1)';
        infoBtn.addEventListener('click', (e) => {
             e.stopPropagation();
             alert(`Use case for ${mod.title}:\n\n${mod.usage}`);
        });

        labelContainer.appendChild(label);
        labelContainer.appendChild(infoBtn);

        nodeWrap.appendChild(node);
        nodeWrap.appendChild(labelContainer);
        mapContainer.appendChild(nodeWrap);
    });
}

function startModule(modIndex) {
    initAudio();
    appState.currentModuleIndex = modIndex;
    appState.currentLessonIndex = 0;
    appState.progress = 0;
    saveState();
    
    viewMap.classList.add('hidden');
    viewLesson.classList.remove('hidden');
    topNav.classList.remove('hidden');
    if(btnSettingsFloating) btnSettingsFloating.style.display = 'none';
    
    updateProgress();
    loadLesson();
}

function loadLesson() {
    feedbackPanel.classList.add('hidden');
    btnCheck.disabled = true;
    btnCheck.classList.remove('hidden');
    
    const module = curriculumData[appState.currentModuleIndex];
    if (appState.currentLessonIndex >= module.lessons.length) {
        if (!appState.completedModules.includes(appState.currentModuleIndex)) {
            appState.completedModules.push(appState.currentModuleIndex);
        }
        appState.hearts = appState.maxHearts;
        appState.currentModuleIndex = null;
        appState.currentLessonIndex = 0;
        saveState();
        alert("Wow, you completed the module!");
        if (appState.unlockedModules < curriculumData.length) {
            appState.unlockedModules++;
            saveState();
        }
        renderMap();
        return;
    }
    
    currentLessonObj = module.lessons[appState.currentLessonIndex];
    lessonInstruction.innerHTML = currentLessonObj.instruction;
    interactiveArea.innerHTML = '';
    currentSelection = null;
    
    appState.progress = (appState.currentLessonIndex / module.lessons.length) * 100;
    updateProgress();

    if (currentLessonObj.type === 'mcq') {
        renderMCQ(currentLessonObj);
        btnCheck.classList.add('hidden');
    } else if (currentLessonObj.type === 'info') {
        btnCheck.disabled = false;
        btnCheck.textContent = "Understood!";
    } else if (currentLessonObj.type === 'code') {
        renderCodeEditor(currentLessonObj);
        btnCheck.classList.add('hidden');
    }
}

function renderMCQ(lesson) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'mcq-options';
    
    lesson.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'mcq-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            currentSelection = idx;
            if (currentSelection === currentLessonObj.correctAnswer) {
                playSound('correct');
                showFeedback(true, "Correct!", currentLessonObj.feedback);
            } else {
                playSound('wrong');
                appState.hearts--;
                updateHearts();
                showFeedback(false, "Wrong Answer", "Unfortunately that was incorrect. Focus and try again!");
            }
        });
        optionsContainer.appendChild(btn);
    });
    
    interactiveArea.appendChild(optionsContainer);
}

function renderCodeEditor(lesson) {
    const container = document.createElement('div');
    container.className = 'code-editor-container';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    header.textContent = `index.${lesson.lang}`;
    
    const textarea = document.createElement('textarea');
    textarea.className = 'code-textarea';
    textarea.value = lesson.initialCode;
    textarea.spellcheck = false;
    
    const runBtnContainer = document.createElement('div');
    runBtnContainer.className = 'run-btn-container';
    const runBtn = document.createElement('button');
    runBtn.className = 'btn-run';
    runBtn.innerHTML = '▶ Run Code';
    
    const outputArea = document.createElement('div');
    outputArea.className = 'live-output';
    outputArea.id = 'live-output';
    outputArea.innerHTML = '<span style="color: #64748b;">(Result shown here - Console)</span>';
    
    runBtn.addEventListener('click', () => {
        const code = textarea.value;
        currentSelection = code;
        
        let valid = false;
        
        if (lesson.lang === 'html') {
            const iframe = document.createElement('iframe');
            iframe.className = 'live-iframe';
            outputArea.innerHTML = '';
            outputArea.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(`<body style="font-family:sans-serif; padding:10px;">${code}</body>`);
            doc.close();
        } else if (lesson.lang === 'python') {
            let output = "";
            let lines = code.split('\n');
            let hasPrint = false;
            for(let line of lines) {
                if(line.includes("Print(")) {
                    output += "<span style='color:var(--wrong-color);'>NameError: name 'Print' is not defined. Did you mean: 'print'?</span><br/>";
                }
                else if(line.includes("print(")) {
                    hasPrint = true;
                    let match = line.match(/print\(['"](.*?)['"]\)/);
                    if(match) output += match[1] + "<br/>";
                }
            }
            if(!hasPrint && code.trim().length > 0 && !code.includes("=") && !code.includes("Print(")) {
                 output = "<span style='color:var(--wrong-color);'>Nothing outputted. Use print()</span>";
            }
            outputArea.innerHTML = output || "Executed with no output.";
        } else if (lesson.lang === 'csharp') {
            let output = "";
            let lines = code.split('\n');
            let hasPrint = false;
            for(let line of lines) {
                if(line.includes("Debug.Log(")) {
                    hasPrint = true;
                    let match = line.match(/Debug\.Log\(['"](.*?)['"]\)/);
                    if(match) output += match[1] + "<br/>";
                } else if(line.includes("int ") || line.includes("string ") || line.includes("float ")) {
                    output += "<span style='color:#64748b'>Variable allocated in memory...</span><br/>";
                }
            }
            if(code.trim().length > 0 && !code.trim().endsWith(";")) {
                 output += "<span style='color:var(--wrong-color);'>Compilation Error: Missing semicolon (;) at the end!</span>";
            } else if(!hasPrint && code.trim().length > 0) {
                 output = (output || "") + "<span style='color:var(--wrong-color);'>Nothing outputted. Use Debug.Log()</span>";
            }
            
            outputArea.innerHTML = output || "Compiled with no output.";
        } else if (lesson.lang === 'cpp') {
            let output = "";
            let lines = code.split('\n');
            let hasPrint = false;
            for(let line of lines) {
                if(line.includes("std::cout")) {
                    hasPrint = true;
                    let match = line.match(/std::cout\s*<<\s*['"](.*?)['"]/);
                    if(match) output += match[1] + "<br/>";
                }
            }
            if(code.trim().length > 0 && !code.trim().endsWith(";")) {
                 output += "<span style='color:var(--wrong-color);'>Compilation Error: Missing semicolon (;)!</span>";
            } else if(!hasPrint && code.trim().length > 0) {
                 output = (output || "") + "<span style='color:var(--wrong-color);'>Nothing outputted. Use std::cout << </span>";
            }
            
            outputArea.innerHTML = output || "Compiled with no output.";
        }
        
        if (lesson.validationPattern) {
             const regex = new RegExp(lesson.validationPattern, 'i');
             if(regex.test(code)) valid = true;
        } else if (lesson.validationLogic) {
             try {
                valid = lesson.validationLogic(code);
             } catch(e) { valid = false; }
        } else {
             valid = lesson.validationRegex.test(code);
        }

        if (valid) {
            playSound('correct');
            showFeedback(true, "Correct!", currentLessonObj.successFeedback || "The code worked perfectly.");
        } else {
            playSound('wrong');
            appState.hearts--;
            updateHearts();
            showFeedback(false, "Syntax Error", currentLessonObj.errorFeedback || "Check your code again!");
        }
    });
    
    runBtnContainer.appendChild(runBtn);
    container.appendChild(header);
    container.appendChild(textarea);
    container.appendChild(runBtnContainer);
    
    interactiveArea.appendChild(container);
    interactiveArea.appendChild(outputArea);
}


btnCheck.addEventListener('click', () => {
    if (currentLessonObj.type === 'info') {
        playSound('correct');
        appState.currentLessonIndex++;
        loadLesson();
        return;
    }
});

btnHint.addEventListener('click', () => {
    if (currentHintLevel === 0) {
        feedbackTitle.textContent = "Hint 💡";
        feedbackDesc.textContent = currentLessonObj.hint || "Read the question carefully!";
        btnHint.textContent = "Show Answer & Explanation";
        currentHintLevel = 1;
    } else if (currentHintLevel === 1) {
        feedbackTitle.textContent = "Answer & Explanation 📖";
        let answerText = "";
        if (currentLessonObj.type === 'mcq') {
            answerText = currentLessonObj.options[currentLessonObj.correctAnswer];
        } else if (currentLessonObj.type === 'code') {
            answerText = currentLessonObj.validationRegex ? currentLessonObj.validationRegex.source.replace(/\\/g, '') : "Correct code structure.";
        }
        feedbackDesc.innerHTML = `<strong>The answer is:</strong> <br/><code>${answerText}</code><br/><br/><strong>Why?</strong><br/>${currentLessonObj.explanation || "Because it matches the syntax rules for this language."}`;
        btnHint.classList.add('hidden');
        currentHintLevel = 2;
    }
});

btnContinue.addEventListener('click', () => {
     if (feedbackPanel.classList.contains('wrong')) {
         feedbackPanel.classList.add('hidden');
         if(appState.hearts <= 0) {
             alert('You are out of hearts! Restarting the module.');
             appState.hearts = appState.maxHearts;
             updateHearts();
             startModule(appState.currentModuleIndex);
         }
         return;
    }
    appState.currentLessonIndex++;
    loadLesson();
});

btnBack.addEventListener('click', () => {
    renderMap();
});

function showFeedback(isCorrect, titleText, descText) {
    currentHintLevel = 0;
    feedbackPanel.classList.remove('hidden', 'wrong');
    btnHint.classList.add('hidden');
    
    if (!isCorrect) {
        feedbackPanel.classList.add('wrong');
        feedbackIcon.innerHTML = '×';
        feedbackTitle.textContent = titleText;
        feedbackDesc.textContent = descText;
        btnContinue.textContent = "Try again";
        
        if (currentLessonObj && (currentLessonObj.hint || currentLessonObj.explanation)) {
             btnHint.classList.remove('hidden');
             btnHint.textContent = "💡 Give me a hint";
        }
    } else {
        feedbackIcon.innerHTML = '✓';
        feedbackTitle.textContent = titleText;
        feedbackDesc.textContent = descText;
        btnContinue.textContent = "Continue";
    }
}

// ------------------------------------
// THE ADVANCED LOCAL BRAIN (AI)
// ------------------------------------

const knowledgeBase = [
    { keys: ['loop', 'for', 'while', 'repet', 'repeat'], text: "Let's talk about Loops! 🔄 A loop allows you to run the exact same code hundreds of times without having to type it out manually. It saves an enormous amount of time." },
    { keys: ['array', 'lista', 'list'], text: "An Array is like a large cabinet with many numbered drawers where you can store data in a specific order, instead of declaring 100 individual variables." },
    { keys: ['funktion', 'function', 'def', 'void'], text: "A Function is a block of code you build that performs a specific task. You 'call' the function later whenever you need it, rather than repeating code." },
    { keys: ['klass', 'class', 'objekt', 'object'], text: "Classes are like blueprints. If you build a racing game, you can make a Class called 'Car'. Then you can construct 100 car objects from that single blueprint!" },
    { keys: ['variabel', 'var', 'let', 'const', 'variable'], text: "A variable is like a digital storage box. You name it: `score = 10`. Later, you can increase it. This is how programs remember data like health points or names." },
    { keys: ['if', 'else', 'villkor', 'condition'], text: "If-statements are how programs make decisions! `If (player.health < 0) { GameOver(); }`. It checks IF something is true, otherwise it does something else." },
    { keys: ['string', 'sträng', 'text', 'quote', 'citat'], text: "A String is simply text meant for humans to read. You must always protect it with quotes `\"Text here\"` so the program stops reading it as code and doesn't crash." },
    { keys: ['int', 'integer', 'heltal'], text: "An Integer ('int') is a whole number, e.g. 5, 0 or -100. Unlike strings, you can do math with them: 5 + 5 = 10." },
    { keys: ['boolean', 'bool', 'sant', 'falskt', 'true', 'false'], text: "A Boolean is the purest form of data. It can only hold two states: True or False. Computers are fundamentally built from billions of tiny Booleans!" },
    { keys: ['api', 'fetch', 'nätverk', 'network'], text: "An API is a bridge between different programs. For example, if your app wants the weather, it asks a meteorological API. 'Do you have the weather in London?' and the server replies with data." },
    { keys: ['algoritm', 'algorithm'], text: "An algorithm is simply a step-by-step set of instructions for solving a problem. Just like a recipe for baking a cake, but for a computer!" },
    { keys: ['databas', 'database', 'sql'], text: "A database is where we safely and permanently store data (like a giant, secure Excel spreadsheet on a server). We use it to save user accounts, passwords, and game progress." },
    { keys: ['semicolon', 'semikolon', ';'], text: "The semicolon `;` is incredibly critical in C# and C++. Where humans use a period `.` to end a sentence, the computer requires a semicolon to know exactly where the instruction stops." },
    { keys: ['print', 'skriv', 'cout', 'log'], text: "In Python we use `print()`, in C# we use `Debug.Log()`, and in C++ it's `std::cout`. The purpose: To send text out from the computer's memory to the screen layout!" },
    { keys: ['parenthes', 'parentes', 'bracket'], text: "Parentheses `()` almost always mark a **Function Call**. `print` is just the word print, but `print()` means 'Execute this action right now!' with whatever is inside the parentheses." }
];

function analyzeGenericSyntax(code, lang) {
    let feedback = [];
    
    // Check balanced quotes
    let doubleQuotes = (code.match(/"/g) || []).length;
    let singleQuotes = (code.match(/'/g) || []).length;
    if (doubleQuotes % 2 !== 0) feedback.push("• Uneven amount of double quotes `\"`. You opened a string but never closed it (or vice versa).");
    if (singleQuotes % 2 !== 0) feedback.push("• Uneven amount of single quotes `'`. Quotes must always come in pairs!");
    
    // Check balanced parentheses
    let openParen = (code.match(/\(/g) || []).length;
    let closeParen = (code.match(/\)/g) || []).length;
    if (openParen > closeParen) feedback.push("• A parenthesis was opened `(` but never closed `)`. This causes the computer to wait for the instruction forever!");
    if (closeParen > openParen) feedback.push("• You have more closing parentheses `)` than opening ones. You must delete the extra ones.");
    
    // Specific Language Rule: Semicolons
    if (lang === 'csharp' || lang === 'cpp') {
        let codeTrimmed = code.trim();
        if (codeTrimmed.length > 0 && !codeTrimmed.endsWith(";") && !codeTrimmed.endsWith("}") && !codeTrimmed.startsWith("//")) {
            feedback.push("• Common Error: C# and C++ strictly require every instruction statement to end with a semicolon `;` (The golden rule!)");
        }
    }
    
    // Specific Language Rule: Capitalization
    if (lang === 'python') {
         if (code.includes("Print(") || code.includes("PRINT(")) {
             feedback.push("• Python is strictly case-sensitive. There is no built-in command named 'Print'. It must be entirely lowercase: `print`.");
         }
         let openSquig = (code.match(/\{/g) || []).length;
         if (openSquig > 0) feedback.push("• Tip: Typically, curly brackets `{...}` are not used for code blocks in Python. Python relies on 'indents' (spaces/tabs) instead!");
    } else if (lang === 'csharp') {
         if (code.toLowerCase().includes("debug.log") && !code.includes("Debug.Log")) {
             feedback.push("• C# is case-sensitive. The Unity console logger function is specifically spelled `Debug.Log`. Otherwise, the system can't see the function.");
         }
    } else if (lang === 'cpp') {
         if (code.toLowerCase().includes("cout") && !code.includes("std::cout")) {
             feedback.push("• When interacting with the C++ standard library terminal, you must use lowercase letters: `std::cout`.");
         }
    }
    
    return feedback;
}

// AI Chat Logic
btnAskAi.addEventListener('click', () => {
    aiChatModal.classList.remove('hidden');
});

btnCloseChat.addEventListener('click', () => {
    aiChatModal.classList.add('hidden');
});

function sendChatMessage() {
    const text = chatInput.value.trim();
    if(!text) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user-message';
    userMsg.textContent = text;
    chatHistory.appendChild(userMsg);
    chatInput.value = '';
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message ai-message';
        
        const lowerText = text.toLowerCase();
        let response = "";
        
        // Grab code from editor to do AI analysis
        let editorCode = "";
        if (currentLessonObj && currentLessonObj.type === 'code') {
            const textarea = document.querySelector('.code-textarea');
            if (textarea) editorCode = textarea.value;
        }
        
        // 1. Check if user is asking for debugging / error checking
        let isErrorCheck = lowerText.includes('wrong') || lowerText.includes('error') || lowerText.includes('why') || lowerText.includes('fix') || lowerText.includes('help') || lowerText.includes('correct') || lowerText.includes('work');
        
        if (isErrorCheck) {
            if (currentLessonObj && currentLessonObj.type === 'code' && editorCode.trim().length > 0) {
                
                let analysis = analyzeGenericSyntax(editorCode, currentLessonObj.lang);
                let langName = currentLessonObj.lang === 'csharp' ? "C#" : (currentLessonObj.lang === 'cpp' ? "C++" : "Python");
                
                response = `I am using my *Advanced Local Brain* to scan the **${langName}** code you wrote in the editor exactly as it is... 🕵️‍♂️<br/><br/>`;
                
                if (analysis.length > 0) {
                     response += "Bingo! I found some critical syntax/grammar errors that will crash your code:<br/><br/>" + analysis.join("<br/><br/>");
                } else {
                     response += "Interesting. Your grammar and syntax are actually flawless! No missing parentheses, quotes, or semicolons. The compiler is happy.<br/><br/>";
                     response += "If the system still says you are wrong, it's likely because your code doesn't output *exactly* what the lesson asked for. Check for tiny typos in the string!";
                     if(currentLessonObj.hint) response += `<br/><br/>**My Deep Hint for this specific level:** ${currentLessonObj.hint}`;
                }
            } else {
                 response = "I need to see what you're doing! Write some code in the editor, and ask me if it's correct or what is wrong. My brain will scan it live without you needing to copy and paste!";
            }
        } 
        // 2. Generic Knowledge Base Query (Handling all other programming questions)
        else {
            let answered = false;
            for (let item of knowledgeBase) {
                // Use RegEx bounds \b to ensure we match WHOLE words. 
                // That way, 'print' isn't mistakenly read as containing 'int'.
                if (item.keys.some(k => new RegExp(`\\b${k}\\b`, 'i').test(lowerText))) {
                     response = "🤖 " + item.text;
                     answered = true;
                     break;
                }
            }
            if (!answered) {
                 // Fallback to Free Wikipedia API for general programming concepts!
                 searchWikipediaConcept(text, aiMsg, chatHistory);
                 return; // Stop here, since fetch is asynchronous
            }
        }
        
        aiMsg.innerHTML = response;
        chatHistory.appendChild(aiMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 800);
}

async function searchWikipediaConcept(query, aiMsgElement, chatHistoryElement) {
    aiMsgElement.innerHTML = "Searching my external global database for '" + query + "'... 🌐";
    chatHistoryElement.appendChild(aiMsgElement);
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
    
    try {
        let cleanQuery = encodeURIComponent(query + " programming computer science");
        let res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${cleanQuery}&utf8=&format=json&origin=*`);
        let data = await res.json();
        
        if (data.query && data.query.search && data.query.search.length > 0) {
             let snippet = data.query.search[0].snippet;
             aiMsgElement.innerHTML = `🤖 **According to the global database:**<br/> ...${snippet}... <br/><br/>*(You can always ask me 'What is wrong with my code?' and I'll look directly at your editor!)*`;
        } else {
             if (currentLessonObj) {
                 aiMsgElement.innerHTML = `Relax! Read the instructions above. Here's a tip: ${currentLessonObj.hint || 'Try to identify the goal of the code.'} Remember, I can see your screen, just ask me "Is my code right?"`;
             } else {
                 aiMsgElement.innerHTML = "I couldn't find that exact term in my database. But I'm the How2CodeAi superbrain! You can ask me about loops, arrays, databases, APIs, etc!";
             }
        }
    } catch(err) {
         aiMsgElement.innerHTML = "Sorry, my system could not fetch the explanation right now. Let's focus on the active editor instead!";
    }
    chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

btnSendChat.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendChatMessage();
});

function updateProgress() {
    progressFill.style.width = appState.progress + '%';
    if(appState.currentLessonIndex === curriculumData[appState.currentModuleIndex].lessons.length - 1 && document.getElementById('feedback-panel') && !document.getElementById('feedback-panel').classList.contains('hidden') && !document.getElementById('feedback-panel').classList.contains('wrong')) {
         progressFill.style.width = '100%';
    }
}

function updateHearts() {
    heartsCount.textContent = appState.hearts;
}

function saveState() {
    localStorage.setItem('how2codeai_state', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('how2codeai_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Merge in case state structure changed
            appState = { ...appState, ...parsed };
        } catch(e) {
            console.error("Failed to load state", e);
        }
    }
}

init();
