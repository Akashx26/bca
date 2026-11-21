
/* =========================================
   VS CODE LAB MANUAL APPLICATION
   Main application controller
========================================= */

"use strict";

/* =========================================
   MANUAL CONFIGURATION
========================================= */

const MANUALS = {
    "lab-manual-1": {
        file: "data/lab-manual-1.json",
        title: "Lab Manual 1"
    },

    "lab-manual-2": {
        file: "data/lab-manual-2.json",
        title: "Lab Manual 2"
    },

    "ml-short": {
        file: "data/ml-short.json",
        title: "ML Short"
    },

    "dip-short": {
        file: "data/dip-short.json",
        title: "DIP Short"
    }
};

/* =========================================
   APPLICATION STATE
========================================= */

const AppState = {
    manuals: {},
    currentManual: null,
    currentProgram: null,
    isLoading: false
};

/* =========================================
   DOM ELEMENTS
========================================= */

const DOM = {
    manualTabs: document.getElementById("manualTabs"),
    programList: document.getElementById("programList"),
    manualName: document.getElementById("explorerManualName"),

    searchInput: document.getElementById("searchInput"),

    welcomeScreen: document.getElementById("welcomeScreen"),
    programContent: document.getElementById("programContent"),

    programTitle: document.getElementById("programTitle"),
    programAim: document.getElementById("programAim"),
    aimSection: document.getElementById("aimSection"),
    programSections: document.getElementById("programSections"),

    breadcrumb: document.getElementById("breadcrumb"),
    statusManual: document.getElementById("statusManual"),

    sidebar: document.getElementById("sidebar"),
    sidebarOverlay: document.getElementById("sidebarOverlay"),
    menuToggle: document.getElementById("menuToggle"),
    sidebarClose: document.getElementById("sidebarClose")
};

/* =========================================
   APPLICATION INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
    try {
        AppState.isLoading = true;

        showLoadingMessage();

        await loadAllManuals();

        setupManualTabs();
        setupSearch();
        setupMobileSidebar();

        const savedManual = localStorage.getItem("vscode-current-manual");
        const savedProgram = localStorage.getItem("vscode-current-program");

        const initialManual =
            MANUALS[savedManual] ? savedManual : "lab-manual-1";

        await selectManual(initialManual, false);

        if (savedProgram) {
            const programs = getCurrentPrograms();

            const savedItem = programs.find(
                program => program.id === savedProgram
            );

            if (savedItem) {
                selectProgram(savedItem.id);
            }
        }

        AppState.isLoading = false;

    } catch (error) {
        console.error("Application initialization failed:", error);
        showApplicationError(error.message);
    }
}

/* =========================================
   LOAD ALL JSON FILES
========================================= */

async function loadAllManuals() {
    const entries = Object.entries(MANUALS);

    const results = await Promise.all(
        entries.map(async ([manualId, config]) => {
            try {
                const response = await fetch(config.file);

                if (!response.ok) {
                    throw new Error(
                        `Unable to load ${config.file} (${response.status})`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data.programs)) {
                    throw new Error(
                        `${config.file} does not contain a valid programs array.`
                    );
                }

                AppState.manuals[manualId] = data;

                console.log(
                    `${data.manualTitle}: ${data.programs.length} programs loaded.`
                );

            } catch (error) {
                console.error(`Error loading ${manualId}:`, error);

                AppState.manuals[manualId] = {
                    manualId,
                    manualTitle: config.title,
                    programs: [],
                    loadError: error.message
                };
            }
        })
    );

    const successfulManuals = Object.values(AppState.manuals).filter(
        manual => !manual.loadError
    );

    if (successfulManuals.length === 0) {
        throw new Error(
            "None of the JSON files could be loaded. Check the data folder and Live Server."
        );
    }
}

/* =========================================
   MANUAL TAB EVENT LISTENERS
========================================= */

function setupManualTabs() {
    if (!DOM.manualTabs) return;

    const tabs = DOM.manualTabs.querySelectorAll(".manual-tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const manualId = tab.dataset.manual;

            if (manualId && MANUALS[manualId]) {
                selectManual(manualId);
            }
        });
    });
}

/* =========================================
   SELECT A MANUAL
========================================= */

async function selectManual(manualId, saveSelection = true) {
    const manual = AppState.manuals[manualId];

    if (!manual) {
        console.error("Manual not found:", manualId);
        return;
    }

    AppState.currentManual = manualId;
    AppState.currentProgram = null;

    updateActiveManualTab(manualId);

    if (DOM.manualName) {
        DOM.manualName.textContent = manual.manualTitle;
    }

    if (DOM.statusManual) {
        DOM.statusManual.textContent = manual.manualTitle;
    }

    if (DOM.searchInput) {
        DOM.searchInput.value = "";
    }

    renderProgramList(manual.programs);

    showWelcomeScreen();

    updateBreadcrumb(manual.manualTitle);

    if (saveSelection) {
        localStorage.setItem("vscode-current-manual", manualId);
        localStorage.removeItem("vscode-current-program");
    }

    closeMobileSidebar();
}

/* =========================================
   UPDATE ACTIVE MANUAL TAB
========================================= */

function updateActiveManualTab(manualId) {
    if (!DOM.manualTabs) return;

    const tabs = DOM.manualTabs.querySelectorAll(".manual-tab");

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.manual === manualId
        );
    });
}

/* =========================================
   GET CURRENT PROGRAMS
========================================= */

function getCurrentPrograms() {
    const manual = AppState.manuals[AppState.currentManual];

    return manual && Array.isArray(manual.programs)
        ? manual.programs
        : [];
}

/* =========================================
   RENDER EXPLORER PROGRAM LIST
========================================= */

function renderProgramList(programs) {
    if (!DOM.programList) return;

    DOM.programList.replaceChildren();

    if (!programs || programs.length === 0) {
        const empty = document.createElement("div");

        empty.className = "empty-programs";
        empty.textContent = "No programs are available in this manual.";

        DOM.programList.appendChild(empty);
        return;
    }

    programs.forEach(program => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = "program-item";
        item.dataset.programId = program.id;

        const icon = createPythonIcon();
        icon.classList.add("program-icon");

        const name = document.createElement("span");
        name.className = "program-name";

        name.textContent = getProgramLabel(program);

        item.append(icon, name);

        item.addEventListener("click", () => {
            selectProgram(program.id);
        });

        DOM.programList.appendChild(item);
    });
}

/* =========================================
   PYTHON FILE ICON
========================================= */

function createPythonIcon() {
    const wrapper = document.createElement("span");

    wrapper.className = "python-file-icon";

    wrapper.innerHTML = `
        <svg viewBox="0 0 24 24"
             width="16"
             height="16"
             aria-hidden="true">

            <path fill="#3776AB"
                d="M11.9 2c-5.1 0-4.8 2.2-4.8 2.2v2.3h4.9v.7H5.1S2 6.8 2 12s2.7 5.2 2.7 5.2h1.6v-2.2s-.1-2.7 2.7-2.7h4.7s2.6 0 2.6-2.5V4.7S16.7 2 11.9 2z"/>

            <path fill="#FFD43B"
                d="M12.1 22c5.1 0 4.8-2.2 4.8-2.2v-2.3H12v-.7h6.9s3.1.4 3.1-4.8-2.7-5.2-2.7-5.2h-1.6V9s.1 2.7-2.7 2.7h-4.7s-2.6 0-2.6 2.5v5.1S7.3 22 12.1 22z"/>
        </svg>
    `;

    return wrapper;
}

/* =========================================
   PROGRAM LABEL
========================================= */

function getProgramLabel(program) {
    const number = String(program.number ?? "").padStart(2, "0");

    return `Program ${number}`;
}

/* =========================================
   SELECT A PROGRAM
========================================= */

function selectProgram(programId) {
    const program = getCurrentPrograms().find(
        item => item.id === programId
    );

    if (!program) {
        console.error("Program not found:", programId);
        return;
    }

    AppState.currentProgram = program;

    updateActiveProgram(programId);

    renderProgram(program);

    showProgramContent();

    updateBreadcrumb(
        AppState.manuals[AppState.currentManual].manualTitle,
        getPythonFilename(program)
    );

    updatePythonTab(program);

    localStorage.setItem("vscode-current-program", programId);

    closeMobileSidebar();
}

/* =========================================
   UPDATE ACTIVE PROGRAM IN EXPLORER
========================================= */

function updateActiveProgram(programId) {
    if (!DOM.programList) return;

    const items = DOM.programList.querySelectorAll(".program-item");

    items.forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.programId === programId
        );
    });
}

/* =========================================
   PYTHON FILENAME
========================================= */

function getPythonFilename(program) {
    const number = String(program.number ?? 1).padStart(2, "0");

    return `program_${number}.py`;
}

/* =========================================
   UPDATE EDITOR TAB
========================================= */

function updatePythonTab(program) {
    const filename = document.getElementById("pythonTabFilename");

    if (filename) {
        filename.textContent = getPythonFilename(program);
    }
}

/* =========================================
   RENDER PROGRAM CONTENT
========================================= */

function renderProgram(program) {
    if (!DOM.programTitle || !DOM.programSections) return;

    DOM.programTitle.textContent =
        `Program ${program.number}: ${program.question || "Untitled Program"}`;

    DOM.programSections.replaceChildren();

    const aim = program.aim || "";

    if (DOM.aimSection && DOM.programAim) {
        DOM.aimSection.hidden = !aim;
        DOM.programAim.textContent = aim;
    }

    /*
       Some manuals store code directly in program.code.
       Others store it inside program.answer.code.
    */

    const mainCode =
        program.code ||
        program.answer?.code ||
        "";

    /*
       Display sub-exercises when available.
    */

    if (
        Array.isArray(program.subExercises) &&
        program.subExercises.length > 0
    ) {
        program.subExercises.forEach((exercise, index) => {
            renderExercise(exercise, index, mainCode);
        });

        /*
           If sub-exercises have no separate code, show
           the combined parent code only once.
        */

        const hasSeparateExerciseCode = program.subExercises.some(
            exercise => Boolean(exercise.code || exercise.answer?.code)
        );

        if (mainCode && !hasSeparateExerciseCode) {
            renderCodeSection(
                "Complete Program Code",
                mainCode
            );
        }

    } else if (mainCode) {
        renderCodeSection("Python Code", mainCode);

    } else if (program.answer?.type === "text") {
        renderTextSection(
            "Answer",
            program.answer.content || program.answer.text || ""
        );
    }

    /*
       Display viva questions if the JSON contains them.
    */

    if (Array.isArray(program.vivaQuestions) && program.vivaQuestions.length) {
        renderVivaQuestions(program.vivaQuestions);
    }

    /*
       Prompt-based tasks may have no executable code.
    */

    if (!DOM.programSections.children.length) {
        const message = document.createElement("p");

        message.className = "empty-programs";
        message.textContent =
            "No code listing is available for this program.";

        DOM.programSections.appendChild(message);
    }

    /*
       Apply syntax highlighting after rendering.
    */

    if (window.Prism) {
        Prism.highlightAllUnder(DOM.programSections);
    }
}

/* =========================================
   RENDER EXERCISE
========================================= */

function renderExercise(exercise, index, parentCode) {
    const wrapper = document.createElement("section");

    wrapper.className = "program-section";

    const heading = document.createElement("h2");

    heading.className = "exercise-title";

    heading.textContent =
        `Exercise ${exercise.id || index + 1}: ${exercise.question || ""}`;

    wrapper.appendChild(heading);

    if (exercise.aim) {
        const aim = document.createElement("p");

        aim.textContent = exercise.aim;
        wrapper.appendChild(aim);
    }

    const exerciseCode =
        exercise.code ||
        exercise.answer?.code ||
        "";

    if (exerciseCode) {
        wrapper.appendChild(
            createCodeContainer(exerciseCode)
        );
    }

    DOM.programSections.appendChild(wrapper);
}

/* =========================================
   RENDER CODE SECTION
========================================= */

function renderCodeSection(title, code) {
    const wrapper = document.createElement("section");

    wrapper.className = "program-section";

    const heading = document.createElement("h2");
    heading.textContent = title;

    wrapper.appendChild(heading);
    wrapper.appendChild(createCodeContainer(code));

    DOM.programSections.appendChild(wrapper);
}

/* =========================================
   CREATE CODE CONTAINER
========================================= */

function createCodeContainer(code) {
    const container = document.createElement("div");
    container.className = "code-container";

    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";

    const language = document.createElement("span");
    language.className = "code-language";
    language.textContent = "PYTHON";

    const copyButton = document.createElement("button");

    copyButton.type = "button";
    copyButton.className = "copy-button";
    copyButton.textContent = "Copy Code";

    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(code);

            copyButton.textContent = "Copied!";
            copyButton.classList.add("copied");

            setTimeout(() => {
                copyButton.textContent = "Copy Code";
                copyButton.classList.remove("copied");
            }, 1500);

        } catch (error) {
            console.error("Copy failed:", error);
            copyButton.textContent = "Copy failed";
        }
    });

    toolbar.append(language, copyButton);

    const pre = document.createElement("pre");
    pre.className = "language-python";

    const codeElement = document.createElement("code");
    codeElement.className = "language-python";

    /*
       textContent safely displays the code without
       interpreting it as HTML.
    */

    codeElement.textContent = code;

    pre.appendChild(codeElement);

    container.append(toolbar, pre);

    return container;
}

/* =========================================
   RENDER TEXT SECTION
========================================= */

function renderTextSection(title, content) {
    const section = document.createElement("section");
    section.className = "program-section";

    const heading = document.createElement("h2");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = content;

    section.append(heading, paragraph);

    DOM.programSections.appendChild(section);
}

/* =========================================
   RENDER VIVA QUESTIONS
========================================= */

function renderVivaQuestions(questions) {
    const section = document.createElement("section");
    section.className = "program-section";

    const heading = document.createElement("h2");
    heading.textContent = "Viva Questions";

    section.appendChild(heading);

    questions.forEach((item, index) => {
        const question = document.createElement("p");

        question.textContent =
            `${index + 1}. ${item.question || item}`;

        section.appendChild(question);

        if (item.answer) {
            const answer = document.createElement("p");

            answer.textContent = `Answer: ${item.answer}`;

            section.appendChild(answer);
        }
    });

    DOM.programSections.appendChild(section);
}

/* =========================================
   SHOW WELCOME SCREEN
========================================= */

function showWelcomeScreen() {
    if (DOM.welcomeScreen) {
        DOM.welcomeScreen.hidden = false;
    }

    if (DOM.programContent) {
        DOM.programContent.hidden = true;
    }
}

/* =========================================
   SHOW PROGRAM CONTENT
========================================= */

function showProgramContent() {
    if (DOM.welcomeScreen) {
        DOM.welcomeScreen.hidden = true;
    }

    if (DOM.programContent) {
        DOM.programContent.hidden = false;
    }
}

/* =========================================
   UPDATE BREADCRUMB
========================================= */

function updateBreadcrumb(manualTitle, filename = "") {
    if (!DOM.breadcrumb) return;

    DOM.breadcrumb.replaceChildren();

    const parts = [
        "LAB PROGRAMS",
        manualTitle
    ];

    if (filename) {
        parts.push(filename);
    }

    parts.forEach((part, index) => {
        if (index > 0) {
            const separator = document.createElement("span");

            separator.className = "breadcrumb-separator";
            separator.textContent = "›";

            DOM.breadcrumb.appendChild(separator);
        }

        const item = document.createElement("span");

        item.textContent = part;

        DOM.breadcrumb.appendChild(item);
    });
}

/* =========================================
   SEARCH
========================================= */

function setupSearch() {
    if (!DOM.searchInput) return;

    DOM.searchInput.addEventListener("input", () => {
        const query = DOM.searchInput.value
            .trim()
            .toLowerCase();

        const filteredPrograms = getCurrentPrograms().filter(program => {
            const question = (program.question || "").toLowerCase();
            const number = String(program.number || "");

            return (
                question.includes(query) ||
                number.includes(query)
            );
        });

        renderProgramList(filteredPrograms);
    });
}

/* =========================================
   MOBILE SIDEBAR
========================================= */

function setupMobileSidebar() {
    DOM.menuToggle?.addEventListener("click", openMobileSidebar);

    DOM.sidebarClose?.addEventListener("click", closeMobileSidebar);

    DOM.sidebarOverlay?.addEventListener("click", closeMobileSidebar);
}

function openMobileSidebar() {
    DOM.sidebar?.classList.add("open");
    DOM.sidebarOverlay?.classList.add("active");
}

function closeMobileSidebar() {
    DOM.sidebar?.classList.remove("open");
    DOM.sidebarOverlay?.classList.remove("active");
}

/* =========================================
   LOADING MESSAGE
========================================= */

function showLoadingMessage() {
    if (!DOM.programList) return;

    DOM.programList.textContent = "Loading programs...";
}

/* =========================================
   ERROR MESSAGE
========================================= */

function showApplicationError(message) {
    if (!DOM.programList) return;

    DOM.programList.replaceChildren();

    const error = document.createElement("div");

    error.className = "empty-programs";
    error.textContent = `Unable to load programs: ${message}`;

    DOM.programList.appendChild(error);
}

/* =========================================
   EXPOSE FUNCTIONS FOR OTHER FILES
========================================= */

window.AppState = AppState;
window.selectManual = selectManual;
window.selectProgram = selectProgram;
window.renderProgramList = renderProgramList;
window.getCurrentPrograms = getCurrentPrograms;
