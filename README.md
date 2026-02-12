# GH300 Quiz Wizard

A React 19 + Vite single-page app that steps through the provided `GH300-questions.yaml`, lets you answer each question in a wizard flow, shows your score, and offers a review mode with correct answers and explanations.

## Features
- Question-by-question wizard with progress bar
- Multi-select answers with letter labels
- Final score summary and percentage
- Review mode that highlights correct answers, your selections, and explanations
- Questions sourced directly from `public/GH300-questions.yaml`
- Disclaimer gate before starting: content is web-scraped public material for personal GH300 prep;
  rights remain with Microsoft and GitHub

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

## Usage

1) Launch the app and acknowledge the disclaimer by clicking **Start Quiz**.
2) Answer each question; radios for single-answer, checkboxes for multi-answer.
3) Over-selecting multi-answer questions shows a warning; the last step allows finish even if
   unanswered (counts incorrect).
4) Scoring: +10 points per correct question, 70% of total points is the pass bar. Summary shows
   points, percent, pass/fail, and correct count.
5) Use **Review answers** anytime to inspect correct answers and explanations.

## Data
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
