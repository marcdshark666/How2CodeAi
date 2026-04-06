const appState = {
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    hearts: 3,
    progress: 0,
    completedModules: []
};

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
        } else if (index === appState.currentModuleIndex) {
            node.classList.add('active');
        } else {
            node.style.opacity = '0.5';
            node.style.cursor = 'not-allowed';
        }
        node.innerHTML = mod.icon;

        if (index <= appState.currentModuleIndex || appState.completedModules.includes(index)) {
             node.addEventListener('click', () => startModule(index));
        }

        const label = document.createElement('div');
        label.textContent = mod.title;
        label.style.fontWeight = 'bold';
        label.style.color = 'var(--text-secondary)';

        nodeWrap.appendChild(node);
        nodeWrap.appendChild(label);
        mapContainer.appendChild(nodeWrap);
    });
}

function startModule(index) {
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
            
            // Unlock next module
            if (appState.currentModuleIndex + 1 < curriculumData.length) {
                appState.currentModuleIndex++;
            }
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
    } else if (currentLessonObj.type === 'info') {
        btnCheck.disabled = false;
        btnCheck.textContent = "Förstått!";
    } else if (currentLessonObj.type === 'code') {
        renderCodeEditor(currentLessonObj);
        btnCheck.classList.add('hidden'); // Code editor has its own run button
    }
}

function renderMCQ(lesson) {
    btnCheck.textContent = "Kolla Svaret";
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'mcq-options';
    
    lesson.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'mcq-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mcq-option').forEach(el => el.classList.remove('selected'));
            btn.classList.add('selected');
            currentSelection = idx;
            btnCheck.disabled = false;
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
    outputArea.innerHTML = '<span style="color: #ccc;">(Resultatet visas här)</span>';
    
    runBtn.addEventListener('click', () => {
        const code = textarea.value;
        currentSelection = code; // Save code as answer
        
        // Live execution mockup
        if (lesson.lang === 'html') {
            const iframe = document.createElement('iframe');
            iframe.className = 'live-iframe';
            outputArea.innerHTML = '';
            outputArea.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(code);
            doc.close();
        } else if (lesson.lang === 'python') {
            // Very simple Mock execution for python
            let output = "";
            let lines = code.split('\n');
            let hasPrint = false;
            for(let line of lines) {
                if(line.includes("print(")) {
                    hasPrint = true;
                    // match print('hello') or print("hello")
                    let match = line.match(/print\(['"](.*?)['"]\)/);
                    if(match) output += match[1] + "<br/>";
                }
            }
            if(!hasPrint && code.trim().length > 0) {
                 output = "<span style='color:red;'>Inget utskrivet. Använd print()</span>";
            }
            outputArea.innerHTML = output || "Kördes utan utmatning.";
        }
        
        verifyCodeSyntax(code, lesson.validationRegex);
    });
    
    runBtnContainer.appendChild(runBtn);
    container.appendChild(header);
    container.appendChild(textarea);
    container.appendChild(runBtnContainer);
    
    interactiveArea.appendChild(container);
    interactiveArea.appendChild(outputArea);
}

function verifyCodeSyntax(code, regex) {
    if (regex.test(code)) {
        showFeedback(true, "Strålande!", currentLessonObj.successFeedback || "Koden fungerade perfekt.");
    } else {
        appState.hearts--;
        updateHearts();
        showFeedback(false, "Nja, inte riktigt...", "Försök igen! Kolla noga på instruktionerna.");
    }
}

btnCheck.addEventListener('click', () => {
    if (currentLessonObj.type === 'info') {
        appState.currentLessonIndex++;
        loadLesson();
        return;
    }
    
    if (currentLessonObj.type === 'mcq') {
        if (currentSelection === currentLessonObj.correctAnswer) {
            showFeedback(true, "Rätt!", currentLessonObj.feedback);
        } else {
            appState.hearts--;
            updateHearts();
            showFeedback(false, "Fel svar", "Det var tyvärr fel. Men du lär dig av dina misstag!");
        }
    }
});

btnContinue.addEventListener('click', () => {
    // Only advance if it was correct (or if it's info)
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
    // Correct
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
    
    // Set progress bar to 100% when completing the last lesson
    if(appState.currentLessonIndex === curriculumData[appState.currentModuleIndex].lessons.length - 1 && document.getElementById('feedback-panel') && !document.getElementById('feedback-panel').classList.contains('hidden') && !document.getElementById('feedback-panel').classList.contains('wrong')) {
         progressFill.style.width = '100%';
    }
}

function updateHearts() {
    heartsCount.textContent = appState.hearts;
}

// Start
init();
