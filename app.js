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

// State Variables for Lesson
let currentSelection = null;
let currentLessonObj = null;

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
             alert(`Användningsområde för ${mod.title}:\n\n${mod.usage}`);
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
        // Module Complete!
        if (!appState.completedModules.includes(appState.currentModuleIndex)) {
            appState.completedModules.push(appState.currentModuleIndex);
        }
        renderMap();
        return;
    }
    
    currentLessonObj = module.lessons[appState.currentLessonIndex];
    lessonInstruction.innerHTML = currentLessonObj.instruction;
    interactiveArea.innerHTML = '';
    currentSelection = null;
    
    // Calculate and Update Progress
    appState.progress = (appState.currentLessonIndex / module.lessons.length) * 100;
    updateProgress();

    if (currentLessonObj.type === 'mcq') {
        renderMCQ(currentLessonObj);
        btnCheck.classList.add('hidden'); // Hide check button for MCQ, we auto-advance
    } else if (currentLessonObj.type === 'info') {
        btnCheck.disabled = false;
        btnCheck.textContent = "Förstått!";
    } else if (currentLessonObj.type === 'code') {
        renderCodeEditor(currentLessonObj);
        btnCheck.classList.add('hidden'); // Code editor has its own run button
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
            // Auto-check MCQ
            if (currentSelection === currentLessonObj.correctAnswer) {
                playSound('correct');
                showFeedback(true, "Rätt!", currentLessonObj.feedback);
            } else {
                playSound('wrong');
                appState.hearts--;
                updateHearts();
                showFeedback(false, "Fel svar", "Det var tyvärr fel. Men du lär dig av dina misstag!");
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
    runBtn.innerHTML = '▶ Kör Kod';
    
    const outputArea = document.createElement('div');
    outputArea.className = 'live-output';
    outputArea.id = 'live-output';
    outputArea.innerHTML = '<span style="color: #64748b;">(Resultatet visas här - Console)</span>';
    
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
                    // match print('hello') or print("hello")
                    let match = line.match(/print\(['"](.*?)['"]\)/);
                    if(match) output += match[1] + "<br/>";
                } else if(line.includes("=")) {
                    // super dummy mock for variables
                    output += "<span style='color:#64748b'>Variabel sparad i minnet...</span><br/>";
                }
            }
            if(!hasPrint && code.trim().length > 0 && !code.includes("=")) {
                 output = "<span style='color:var(--wrong-color);'>Inget utskrivet. Använd print()</span>";
            }
            outputArea.innerHTML = output || "Kördes utan utmatning.";
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
                    output += "<span style='color:#64748b'>Variabel allokerad i minnet...</span><br/>";
                }
            }
            // require semicolon
            if(code.trim().length > 0 && !code.trim().endsWith(";")) {
                 output += "<span style='color:var(--wrong-color);'>Kompileringsfel: Saknar semikolon (;) i slutet av raden!</span>";
            } else if(!hasPrint && code.trim().length > 0) {
                 output = (output || "") + "<span style='color:var(--wrong-color);'>Inget utskrivet. Använd Debug.Log()</span>";
            }
            
            outputArea.innerHTML = output || "Kompilerad utan utmatning.";
        }
        
        // Validation logic
        if (lesson.validationPattern) {
             const regex = new RegExp(lesson.validationPattern, 'i');
             if(regex.test(code)) valid = true;
        } else if (lesson.validationLogic) {
             // eval basic validation logic provided in data.js
             try {
                valid = lesson.validationLogic(code);
             } catch(e) { valid = false; }
        } else {
             // Fallback regex
             valid = lesson.validationRegex.test(code);
        }

        if (valid) {
            playSound('correct');
            showFeedback(true, "Strålande koder!", currentLessonObj.successFeedback || "Koden fungerade perfekt.");
        } else {
            playSound('wrong');
            appState.hearts--;
            updateHearts();
            showFeedback(false, "Nja, inte riktigt...", currentLessonObj.errorFeedback || "Kolla koden en gång till!");
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
    // Info view check
    if (currentLessonObj.type === 'info') {
        playSound('correct');
        appState.currentLessonIndex++;
        loadLesson();
        return;
    }
});

btnContinue.addEventListener('click', () => {
    if (feedbackPanel.classList.contains('wrong')) {
         feedbackPanel.classList.add('hidden');
         if(appState.hearts <= 0) {
             alert('Du har slut på hjärtan! Vi startar om modulen.');
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
    feedbackPanel.classList.remove('hidden', 'wrong');
    if (!isCorrect) {
        feedbackPanel.classList.add('wrong');
        feedbackIcon.innerHTML = '×';
        feedbackTitle.textContent = titleText;
        feedbackDesc.textContent = descText;
        btnContinue.textContent = "Försök igen";
    } else {
        feedbackIcon.innerHTML = '✓';
        feedbackTitle.textContent = titleText;
        feedbackDesc.textContent = descText;
        btnContinue.textContent = "Fortsätt";
    }
}

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
