# GH300 Quiz Wizard

A React 19 + Vite single-page app that steps through the provided `GH300-questions.yaml`, lets you answer each question in a wizard flow, shows your score, and offers a review mode with correct answers and explanations.

## Features
- Question-by-question wizard with progress bar
- Multi-select answers with letter labels
- Final score summary and percentage
- Review mode that highlights correct answers, your selections, and explanations
- Questions sourced directly from `public/GH300-questions.yaml`

## Getting started
Install dependencies (Node 20.19+ recommended to satisfy Vite engine check):
```bash
npm install
```

Run the dev server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

The quiz data lives in `public/GH300-questions.yaml` so it can be fetched at runtime. To replace the content, drop in a new YAML file with the same shape.

Example shape:
```yaml
- id: 1
  question: "What does Copilot do?"
  answers:
    - "Option A"
    - "Option B"
    - "Option C"
    - "Option D"
  correct_answer: ["A", "C"]
  explanation: "Brief explanation for why A and C are correct."
```
