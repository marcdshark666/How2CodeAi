const appState = {
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    hearts: 3,
    progress: 0,
    completedModules: []
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

// Initialization
function init() {
    // Add interactions to map
    document.addEventListener('click', () => { initAudio(); }, {once: true});
    renderMap();
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
        appState.hearts = 3;
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
                if(line.includes("print(")) {
                    hasPrint = true;
                    let match = line.match(/print\(['"](.*?)['"]\)/);
                    if(match) output += match[1] + "<br/>";
                }
            }
            if(!hasPrint && code.trim().length > 0 && !code.includes("=")) {
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
             appState.hearts = 3;
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
        
        let response = "I'm your AI instructor! ";
        if (currentLessonObj) {
            response += `It looks like you're in the ${currentLessonObj.lang || 'coding'} module right now. `;
            if(currentLessonObj.hint) {
                response += `Let me give you a push in the right direction: ${currentLessonObj.hint}`;
            } else {
                response += "Make sure you read the instructions carefully. Syntax is usually the biggest issue!";
            }
        } else {
            response += "Choose a module on the map to start learning. If you have questions about a specific concept, just ask!";
        }
        
        aiMsg.textContent = response;
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

init();
