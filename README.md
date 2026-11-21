# BCA Practical Exam Companion

### Your practical exam. Your programs. One workspace.

A VS Code-inspired web application designed for **BCA 5th Semester students**, bringing practical programs from Machine Learning and Neural Network Lab and Digital Image Processing Lab into one organized workspace.

No endlessly scrolling through PDFs. No searching through multiple folders. No wasting time locating programs.

**Find it. Open it. Copy it. Get going.**

---

## 🎯 About the Project

BCA Practical Exam Companion is a browser-based academic utility that provides centralized access to laboratory programs from multiple practical manuals.

The application organizes practical questions, program aims, Python code and sub-exercises in a familiar coding environment inspired by Visual Studio Code.

It is designed to make practical program access faster and more convenient.

## 📚 Subjects Covered

### 1. Machine Learning and Neural Network Lab

Access practical programs and exercises related to Machine Learning, Artificial Intelligence and Neural Network concepts.

### 2. Digital Image Processing Lab

Browse practical programs and exercises related to Digital Image Processing operations and laboratory concepts.

### Integrated Lab Collections

The application currently includes four lab-manual datasets:

- Machine Learning Lab Manual
- Digital Image Processing Lab Manual
- Machine Learning Short Manual
- Digital Image Processing Short Manual

## ⚡ Features

| Feature | Description |
|---|---|
| Multiple Lab Collections | Switch between four integrated lab datasets. |
| Program Explorer | Browse programs through an organized sidebar. |
| Instant Search | Quickly locate practical programs. |
| Program Details | View practical questions and program aims. |
| Exercise Organization | Access individual sub-exercises and their code. |
| One-Click Copy | Copy Python code directly to the clipboard. |
| Syntax Highlighting | Improved Python code readability using Prism.js. |
| Persistent Selection | Remembers the previously selected manual and program. |
| Responsive Interface | Supports desktop and mobile browsers. |
| Developer-Style Workspace | Navigate programs through a VS Code-inspired interface. |

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Application functionality |
| JSON | Lab manual data storage |
| Prism.js | Python syntax highlighting |
| Local Storage | Remembering user selections |
| Clipboard API | Copying program code |

## 📁 Project Structure

```text
labcode/
│
├── css/
│   ├── editor.css
│   ├── layout.css
│   ├── responsive.css
│   ├── sidebar.css
│   └── style.css
│
├── data/
│   ├── dip-short.json
│   ├── lab-manual-1.json
│   ├── lab-manual-2.json
│   └── ml-short.json
│
├── js/
│   └── app.js
│
├── .gitignore
├── index.html
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- Visual Studio Code (recommended).
- Live Server extension for local development.

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Akashx26/bca.git
```

**2. Navigate into the project**

```bash
cd bca
```

**3. Open the project in Visual Studio Code**

**4. Launch the application**

- Install the Live Server extension if necessary.
- Right-click `index.html`.
- Select **Open with Live Server**.

The application will open in your default browser.

> A local web server is recommended because the application loads JSON datasets using JavaScript `fetch()`.

## 📖 How to Use

1. Launch the application in your browser.
2. Select the required laboratory manual.
3. Browse available programs in the Explorer sidebar.
4. Select a program to view its question, aim and code.
5. Review the program and use the Copy Code button.
6. Switch between manuals whenever required.

## 🌐 Deployment

The application is a static website and can be deployed using Cloudflare Pages.

**Planned hosting platform:** Cloudflare Pages

**Planned website URL:** `https://bca.pages.dev`

The final URL depends on the availability of the selected Cloudflare Pages project name.

## 🔮 Future Enhancements

- AI-powered program explanations.
- Interactive Python code execution.
- Program output previews.
- Dedicated viva-voce revision mode.
- Bookmarks and favorite programs.
- Practical preparation progress tracking.
- Mock practical examination mode.
- Step-by-step code explanations.

## 🎓 Target Audience

- BCA 5th Semester students.
- Students preparing for Machine Learning practical examinations.
- Students preparing for Neural Network practical examinations.
- Students preparing for Digital Image Processing practical examinations.

## 👨‍💻 Developer

**Akash**

GitHub: [@Akashx26](https://github.com/Akashx26)

Repository: [BCA Practical Exam Companion](https://github.com/Akashx26/bca)

---

## ⚠️ Disclaimer

This is an independent educational project developed for practical-program reference and examination preparation.

Students are responsible for following their institution's examination rules and permitted-resource policies.

The interface is inspired by Visual Studio Code. This project is not affiliated with, sponsored by, or endorsed by Microsoft.

---

**Made for practicals. Built for speed.**