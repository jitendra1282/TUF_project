# 📅 Jitendra's Wall Calendar

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

**A premium, fully interactive wall calendar web app — built for the TUF Frontend Engineering Challenge.**

[🚀 Live Demo](https://tuf-project-five.vercel.app/) · [🎥 Demo Video](https://drive.google.com/drive/folders/1hzJdxRuamKhIJo9BJu3bXUTCL_-fTUyv?usp=sharing) · [📂 Repository](https://github.com/jitendra1282/TUF_project)

</div>

---

## 📖 Overview

Inspired by the tactile feel of physical wall calendars, this project transforms a classic aesthetic into a **premium digital experience**. It features fluid animations, intelligent date-range selection, a resizable notes panel, seasonal hero imagery, and a meticulous attention to design detail — all built from scratch using modern React patterns and zero boilerplate.

---

## ✨ Features

### 🗓 Core Calendar
| Feature | Description |
|---|---|
| **Wall Calendar Layout** | Full-bleed seasonal hero panel on the left + crafted date grid on the right |
| **Date Range Selection** | Two-click range picking with distinct start, end, and in-between visual states |
| **Month Navigation** | Smooth animated transitions between months via arrows or dropdown |
| **Seasonal Backgrounds** | Hero panel automatically changes imagery to reflect the current season |
| **Holiday Indicators** | Color-coded dots and contextual tooltips for standard holidays |

### 📝 Notes System
| Feature | Description |
|---|---|
| **Month Notes** | Global reminders and goals tied to the entire current month |
| **Range Notes** | Notes scoped to a specific selected date range (e.g., "Vacation: Apr 14–20") |
| **Resizable Panel** | Draggable divider lets you resize the notes area in real-time (25%–50% viewport) |

### 🎨 Design & UX
| Feature | Description |
|---|---|
| **Theme Switching** | Instant Light / Dark / System Auto modes with glassmorphism styling |
| **60fps Animations** | Spring-physics micro-interactions powered by Framer Motion |
| **Copy Summary** | One-click export of your selected dates + notes to clipboard |
| **Keyboard Navigation** | Full `Tab` / `Space` / `Enter` accessibility support |
| **Mini Month Preview** | Quick-glance adjacent months rendered inline |
| **Spiral Binding** | Decorative SVG spiral binding that reinforces the physical calendar metaphor |

### 📱 Responsive Design
- **Desktop:** Immersive full-screen side-by-side layout with draggable split pane
- **Mobile:** Graceful stacked layout with sticky month navigation header and swipe gestures

---

## 🏗 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI component framework |
| **Vite** | 8 | Build tool & dev server (HMR) |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Framer Motion** | 12 | Animations & spring physics |
| **date-fns** | 4 | Date arithmetic & calendar grid generation |
| **lucide-react** | latest | Clean SVG icon set |

---

## 🪝 React Architecture

The app is built on a clear, performant React pattern — state lives centrally, UI stays lean.

### State Management
- **`useReducer`** — Central brain of the app inside `CalendarContext`. Manages all date selection, boundary constraints, month navigation, and note state in one predictable reducer.
- **`useContext`** — Distributes calendar state globally to all components — zero prop drilling.

### Performance
- **`useMemo`** — Guards expensive computations like `buildCalendarGrid` (a 6-week matrix) so the grid never recalculates while the user is typing notes.
- **`useCallback`** — Memoizes touch-swipe and drag-frame event listeners, keeping child components from re-rendering unnecessarily.
- **`useRef`** — Drives direct `style.height` DOM mutations during split-pane dragging, bypassing React's render cycle entirely for silky-smooth resizing. Also used as a double-click debounce guard.
- **`useEffect`** — Handles background image preloading and syncs the `.dark` class with the HTML root.

### Custom Hooks
| Hook | Role |
|---|---|
| `useCalendar()` | Safe context accessor — throws if used outside `CalendarProvider` |
| `useSwipe()` | Tracks `touchstart`/`touchend` X-axis deltas to fire swipe navigation on mobile |
| `useIsDark()` | Reconciles `prefers-color-scheme` system preference with the user's manual override |

---

## 📁 Project Structure

```
src/
├── components/
│   └── WallCalendar/
│       ├── index.jsx                  # Root layout & split-pane orchestration
│       ├── context/                   # CalendarContext + useReducer state
│       ├── constants/                 # Holiday data, theme tokens
│       ├── utils/                     # dateHelpers, grid builder
│       └── components/
│           ├── HeroPanel.jsx          # Seasonal hero image panel
│           ├── SeasonalBackground.jsx # Season detection & image management
│           ├── DateGrid.jsx           # Calendar grid with range selection
│           ├── MonthNavigation.jsx    # Month/year navigation controls
│           ├── NotesPanel.jsx         # Month & range notes with tabs
│           ├── ThemeSwitcher.jsx      # Light / Dark / Auto toggle
│           ├── ExportButton.jsx       # Copy summary to clipboard
│           ├── MiniMonthPreview.jsx   # Compact adjacent month preview
│           └── SpiralBinding.jsx      # Decorative SVG spiral
├── App.jsx
├── main.jsx
├── index.css
└── App.css
```

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/jitendra1282/TUF_project.git
cd TUF_project

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

> Runs on `http://localhost:5173` by default.

---

## 💻 How to Use

1. **Pick a start date** — Click any date on the calendar grid.
2. **Pick an end date** — Click another date to create an animated range. Double-clicking a date clears the selection.
3. **Add notes** — Use the tabbed Notes Panel below the grid to write `Month` or `Range` notes.
4. **Resize the panel** — Drag the horizontal divider to reveal more notes space or more calendar.
5. **Switch months** — Use the `‹` / `›` arrows or click the month/year dropdown.
6. **Change theme** — Click the theme switcher (☀️ / 🌙 / 💻) in the top bar.
7. **Export** — Hit **Copy Summary** to copy your selected range and notes to the clipboard.

---

## 🔮 Future Roadmap

- [ ] **Backend Persistence** — Wire to Firebase / Supabase for cloud-saved notes per user
- [ ] **Drag-to-select** — Replace the two-click algorithm with a mouse-hold drag selection
- [ ] **Multi-user Sharing** — Color-coded overlapping ranges for team calendars
- [ ] **Recurring Events** — Support weekly/monthly repeating reminders
- [ ] **Export to iCal / Google Calendar** — One-click export of selected ranges as `.ics`

---

## 👤 Author

**Nandipati Jitendra Krishna Sri Sai**

[![GitHub](https://img.shields.io/badge/GitHub-jitendra1282-181717?style=flat-square&logo=github)](https://github.com/jitendra1282)

---

<div align="center">

Made with ❤️ for the **TUF Frontend Engineering Challenge**

</div>
