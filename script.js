// Sample database storing programs categorized by skill level
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
            title: "List Comprehension Filtering",
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
            description: "Creating custom context workflows using classes with enter and exit magic methods.",
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
        return True # Suppresses exception if handled

with DatabaseConnection("MainServer") as db:
    print("Executing dynamic queries...")`
        }
    ]
};

// Selecting essential DOM elements
const tabButtons = document.querySelectorAll('.tab-btn');
const programListContainer = document.getElementById('program-list');
const programTitle = document.getElementById('program-title');
const programDesc = document.getElementById('program-desc');
const codeBlock = document.getElementById('code-block');
const copyBtn = document.getElementById('copy-btn');

let currentLevel = 'beginner';

// Render sidebar item lists based on active difficulty tier
function renderProgramList(level) {
    programListContainer.innerHTML = '';
    const programs = programData[level];

    programs.forEach((program, index) => {
        const li = document.createElement('li');
        li.classList.add('program-item');
        if (index === 0) li.classList.add('active'); // default select first item
        li.textContent = program.title;
        
        li.addEventListener('click', () => {
            document.querySelectorAll('.program-item').forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            displayCode(program);
        });

        programListContainer.appendChild(li);
    });

    // Automatically load data details of the first program item
    if (programs.length > 0) {
        displayCode(programs[0]);
    }
}

// Display selected snippet configuration directly on screen
function displayCode(program) {
    programTitle.textContent = program.title;
    programDesc.textContent = program.description;
    codeBlock.textContent = program.code;
    copyBtn.textContent = "Copy Code"; // reset button text state
}

// Event Listeners for switching Difficulty Tabs
tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        currentLevel = e.target.getAttribute('data-level');
        renderProgramList(currentLevel);
    });
});

// Copy to Clipboard Utility Feature
copyBtn.addEventListener('click', () => {
    const codeText = codeBlock.textContent;
    navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy Code";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy code text: ", err);
    });
});

// Initial application launch run execution
renderProgramList(currentLevel);