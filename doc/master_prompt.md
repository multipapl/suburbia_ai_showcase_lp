Antigravity Master Prompt: Hybrid Workflow Landing Page
Role: You are an expert Senior Frontend Engineer and UI/UX Designer specializing in React, Tailwind CSS, and Framer Motion.

Objective: Build a high-end, dark-themed, interactive landing page for an Archviz Studio’s "Hybrid Workflow." The site must be modular, highly performant, and data-driven to allow easy content updates via a central configuration file.

1. Data Source & Preparation
First, analyze the following attached files:

AI ONBOARDING BASICS.md: Primary source for text, stage titles, and "Key Focus" points.

Exterior_Workflow_Video_Script.md: Source for stage durations to calculate the timeline proportions.

Slides.pdf: Visual reference for layout and the "Fork" logic.

Task 1: Create a src/data/workflowConfig.json file. This file will act as our "mini-admin." Every stage (1-7) must be an object containing:

id, title, description, keyFocus (array), duration (in seconds from the script).

checkpoint (string, if applicable).

mediaUrl: Placeholder string (e.g., /assets/stage1.mp4).


Special Logic for Stage 3 (The Fork): Include nested data for Scenario A (Precision) and Scenario B (Artistic), including their specific sub-steps (3.1 Core, 3.2 Rendering).

2. Core Architecture (The "Engine")
Task 2: Build the UI using a modular approach to save tokens on future updates:

App.js: Main entry point that fetches data from workflowConfig.json.

Layout.jsx: Global dark theme wrapper with smooth scroll.

StageSection.jsx: A reusable component that renders each stage with its text, media, and "Key Focus" badges.

StickyTimeline.jsx: A fixed-bottom navigation bar.


Proportional Spacing: The width of each segment must correspond to its duration from the config.

Progress Tracking: Highlight the current stage based on the user's scroll position.

3. Interactive Features & "The Fork"
Task 3: Implement the "Strategic Choice" logic at Stage 3:


The Switcher: Create a prominent UI element to toggle between Scenario A (Precision) and Scenario B (Artistic).


State Management: When a scenario is selected, the site must globally update its accent colors and the content of subsequent sub-sections (3.1 and 3.2).


Scenario A: Cyber Blue accents (#00D1FF).


Scenario B: Safety Orange accents (#FF8A00).

Animations: Use AnimatePresence from Framer Motion to smoothly transition content when the user toggles scenarios.

4. Styling & Visual Identity

Theme: Deep Black (#050505) with subtle grid overlays.

Typography: Modern Sans-serif (Inter or Montserrat).


Media Handling: All media blocks should have a 16:9 aspect ratio and support images, GIFs, or Video placeholders.


Polish: Add "Checkpoints" as small, glowing neon labels that appear next to stage titles when the project reaches a decision point.

5. Deployment Readiness
Ensure the site is fully responsive (mobile-first approach).

Optimize Framer Motion animations to trigger only when the component is in the viewport (whileInView).