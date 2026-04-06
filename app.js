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

// Initialization
function init() {
    loadState();
    
    if (!appState.maxHearts) {
        difficultyModal.classList.remove('hidden');
        btnDiffs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hearts = parseInt(e.currentTarget.getAttribute('data-hearts'));
                appState.maxHearts = hearts;
                appState.hearts = hearts;
                saveState();
                difficultyModal.classList.add('hidden');
                init(); // Re-run init now that we have hearts
            });
        });
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

function startModule(index) {
    initAudio();
    appState.currentModuleIndex = index;
    appState.currentLessonIndex = 0;
    appState.progress = 0;
    
    viewMap.classList.add('hidden');
    viewLesson.classList.remove('hidden');
    topNav.classList.remove('hidden');
    
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
        if (lowerText.includes('wrong') || lowerText.includes('fel') || lowerText.includes('error') || lowerText.includes('why') || lowerText.includes('varför') || lowerText.includes('hjälp') || lowerText.includes('help')) {
            if (currentLessonObj && currentLessonObj.type === 'code' && editorCode.trim().length > 0) {
                let codeLower = editorCode.toLowerCase();
                response = "Låt oss analysera din kod steg-för-steg! 🕵️‍♂️<br/><br/>";
                
                let foundError = false;
                if (currentLessonObj.lang === 'python') {
                    if (editorCode.includes("Print(") || editorCode.includes("PRINT(")) {
                        response += "1. **Stor Bokstav**: Du skrev `Print` med en stor bokstav. Python är helt skiftlägeskänsligt (Case Sensitive). Datorn vet inte vad 'Print' är, den förstår bara exakt `print` med små bokstäver.<br/><br/>";
                        foundError = true;
                    }
                    if (editorCode.includes("print ") && !editorCode.includes("(")) {
                        response += "2. **Parenteser Saknas**: Du skrev `print`, men du glömde att använda parenteserna direkt efteråt. `print()` är en funktion som behöver parenteser som händer för att hålla din data.<br/><br/>";
                        foundError = true;
                    }
                    if (!editorCode.includes('"') && !editorCode.includes("'") && codeLower.includes("hello")) {
                        response += "3. **Citattecken Saknas**: Du försöker skriva ut vanlig text, men du glömde sätta citattecken `\"` eller `'` runt texten! Utan dem tror datorn att texten är programkod.<br/><br/>";
                        foundError = true;
                    }
                }
                else if (currentLessonObj.lang === 'csharp' || currentLessonObj.lang === 'cpp') {
                    if (!editorCode.trim().endsWith(";")) {
                        response += "1. **Semikolon Saknas**: Du glömde den absolut viktigaste regeln i detta språk! Varje mening måste avslutas med ett semikolon `;`. Titta i slutet av din rad.<br/><br/>";
                        foundError = true;
                    }
                    if (currentLessonObj.lang === 'csharp' && codeLower.includes("debug.log") && !editorCode.includes("Debug.Log")) {
                        response += "2. **Stora Bokstäver**: C# är skiftlägeskänsligt. Funktionen måste skrivas exakt `Debug.Log` (stort D och stort L).<br/><br/>";
                        foundError = true;
                    }
                }
                
                if (!foundError) {
                    response += "Bra, din syntax/grammatik ser faktiskt helt rätt ut! Felet kan istället vara att du inte exakt skrev den text lektionen bad om. Lektionen vill att koden ska valideras för exakt: `" + (currentLessonObj.validationRegex ? currentLessonObj.validationRegex.source.replace(/\\/g, '') : "korrekt resultat") + "`. Kolla extra noga efter mellanslag och stavfel i din sträng!";
                }
            } else {
                 response = "Jag behöver se vad du försöker göra! Skriv kod i rutan så kan jag ge exakt steg-för-steg feedback.";
            }
        } 
        // 2. Advanced NLP Keywords if they ask about concepts
        else if (lowerText.includes('parenthes') || lowerText.includes('parentes') || lowerText.includes('bracket')) {
            response = "Parenteser `()` markerar nästan alltid ett **Funktionsanrop**. Exempel: `print` är bara ordet print, men `print()` betyder 'Utför detta nu!'. Det innanför parentesen är informationen du ger till funktionen.";
        } else if (lowerText.includes('quote') || lowerText.includes('citat')) {
            response = "Citattecken (`\"` eller `'`) skyddar text. Utan dem tror datorn att du försöker köra kod, och kraschar. Citattecken säger till datorn: 'Läs detta som vanlig mäsnklig text.' Text kallas för en String.";
        } else if (lowerText.includes('variab')) {
            response = "En variabel är som en digital flyttkartong. Du bestämmer ett namn: `namn = 'Alex'`. Nästa gång du säger `print(namn)` så tittar datorn i lådan och skriver ut 'Alex'.";
        } else if (lowerText.includes('semicolon') || lowerText.includes('semikolon') || lowerText.includes(';')) {
            response = "Semikolon `;` är otroligt kritiskt i t.ex. C# och C++. Där vi människor använder en punkt `.` för att avsluta en mening, använder datorn semikolon för att veta exakt var instruktionen tar slut.";
        } else if (lowerText.includes('print') || lowerText.includes('skriv')) {
            response = "Funktionen `print()` skickar data från minnet till din skärm. I C# heter det dock `Debug.Log()` och i C++ `std::cout`. Allt har exakt samma syfte!";
        } else if (currentLessonObj) {
            response += `Du är på lektionen för ${currentLessonObj.lang || 'allmän kod'}. `;
            if(currentLessonObj.hint) {
                response += `Här är min djupa ledtråd: ${currentLessonObj.hint}`;
            } else {
                response += "Läs testet lugnt. Om du är osäker, fråga mig 'Vad är fel med min kod?' så analyserar jag djupt!";
            }
        } else {
            response += "Jag är din AI-mentor! Fråga mig 'Vad är fel?' för stegvis genomgång, eller fråga om varför vi använder parenteser!";
        }
        
        aiMsg.innerHTML = response;
        chatHistory.appendChild(aiMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 800);
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
