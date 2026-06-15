const programData = {
    beginner: [
        {
            title: "Hello World",
            description: "The traditional starter program to print text output to the screen.",
            code: `print("Hello, World!")`
        },
        {
            title: "Check Prime Number",
            description: "A script utilizing basic loops and conditions to verify if an input number is prime.",
            code: `def is_prime(num):
    if num <= 1:
        return False
    for i in range(2, int(num**0.5) + 1):
        if num % i == 0:
            return False
    return True

number = 29
print(f"Is {number} prime?", is_prime(number))`
        }
    ],
    intermediate: [
        {
            title: "List Comprehension",
            description: "Transforming and filtering data lists compactly using pythonic syntax.",
            code: `# Filter even squares from a range
even_squares = [x**2 for x in range(10) if x % 2 == 0]
print("Even squares:", even_squares)`
        },
        {
            title: "File Read & Write",
            description: "Safely opening, writing, and processing text data using context managers.",
            code: `with open("example.txt", "w") as file:
    file.write("Python is versatile.\\nLearning everyday.")

with open("example.txt", "r") as file:
    for line in file:
        print(line.strip().upper())`
        }
    ],
    advanced: [
        {
            title: "Custom Context Manager",
            description: "Creating custom context workflows using classes with __enter__ and __exit__ magic methods.",
            code: `class DatabaseConnection:
    def __init__(self, db_name):
        self.db_name = db_name

    def __enter__(self):
        print(f"Connecting to database: {self.db_name}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection smoothly.")
        if exc_type:
            print(f"An error occurred: {exc_val}")
        return True  # Suppresses exception if handled

with DatabaseConnection("MainServer") as db:
    print("Executing dynamic queries...")`
        }
    ]
};

// DOM refs
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');
const programList = document.getElementById('program-list');
const viewerEmpty = document.getElementById('viewer-empty');
const viewer = document.getElementById('viewer');
const programTitle = document.getElementById('program-title');
const programDesc = document.getElementById('program-desc');
const codeBlock = document.getElementById('code-block');
const lineNumbers = document.getElementById('line-numbers');
const copyBtn = document.getElementById('copy-btn');
const breadcrumbLevel = document.getElementById('breadcrumb-level');
const breadcrumbTitle = document.getElementById('breadcrumb-title');
const mobileLevelBadge = document.getElementById('mobile-level-badge');
const levelBtns = document.querySelectorAll('.level-btn');

let currentLevel = 'beginner';

// Sidebar toggle (mobile)
function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
}
function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
}

menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
});
overlay.addEventListener('click', closeSidebar);

// Render line numbers
function renderLineNumbers(code) {
    const lines = code.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

// Display selected program
function displayCode(program) {
    viewerEmpty.style.display = 'none';
    viewer.style.display = 'flex';

    programTitle.textContent = program.title;
    programDesc.textContent = program.description;
    codeBlock.textContent = program.code;
    breadcrumbLevel.textContent = currentLevel;
    breadcrumbTitle.textContent = program.title;

    renderLineNumbers(program.code);

    // Reset copy button
    copyBtn.textContent = 'Copy';
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
        <path d="M2 10V2.5A.5.5 0 012.5 2H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    </svg> Copy`;
}

// Render sidebar list
function renderProgramList(level) {
    programList.innerHTML = '';
    const programs = programData[level];

    programs.forEach((program, index) => {
        const li = document.createElement('li');
        li.classList.add('program-item');
        if (index === 0) li.classList.add('active');
        li.textContent = program.title;

        li.addEventListener('click', () => {
            document.querySelectorAll('.program-item').forEach(i => i.classList.remove('active'));
            li.classList.add('active');
            displayCode(program);
            closeSidebar(); // close on mobile after selection
        });

        programList.appendChild(li);
    });

    if (programs.length > 0) displayCode(programs[0]);
}

// Level switcher
levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.getAttribute('data-level');
        mobileLevelBadge.textContent = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
        renderProgramList(currentLevel);
    });
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
        copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg> Copied!`;
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M2 10V2.5A.5.5 0 012.5 2H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            </svg> Copy`;
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => console.error('Copy failed:', err));
});

// Init
renderProgramList(currentLevel);
