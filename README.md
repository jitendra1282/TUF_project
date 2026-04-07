# 📅 Jitendra's Calendar

A beautifully designed, fully interactive wall calendar web component built as part of a Frontend Engineering Challenge. Inspired by the tactile and visual appeal of physical wall calendars, this project transforms a traditional aesthetic into a highly responsive, premium digital experience complete with fluid animations, date range selection, and an integrated notes system.

---

## 🚀 Live Demo
[https://tuf-project-five.vercel.app/](https://tuf-project-five.vercel.app/)

## 🎥 Demo Video
[Video Link (Loom/YouTube Placeholder)](#)

---

## ✨ Project Features

### Core Features
- **Wall Calendar Aesthetic:** Combines a high-impact, full-bleed hero image panel on the left with a meticulously crafted date grid on the right—just like a real wall calendar.
- **Day Range Selection:** Fluid multi-click selection supporting distinct visual states for the start date, end date, and dynamically connected in-between ranges.
- **Notes System:** 
  - *Month-level notes:* Record global reminders or goals tied to the current month.
  - *Range-based notes:* Attach specific notes directly to a selected timeline (e.g., "Vacation" for April 14th – April 20th).
- **Fully Responsive Design:** 
  - *Desktop:* Immersive, full-screen side-by-side layout.
  - *Mobile:* Graceful stacked layout with a sticky month-navigation header so users never lose context when scrolling the grid.

### Advanced / Bonus Features
- **Smooth Animations:** Buttery 60fps micro-interactions powered by Framer Motion, featuring seamless simultaneous month cross-fades without latency, spring-based date cell scaling, and sliding panels.
- **Theme Switching:** Premium glassmorphism UI offering instantly swappable Light, Dark, and System Auto modes.
- **Holiday Indicators:** Contextual tooltips and color-coded dots denoting specific custom or standard holidays dynamically.
- **Copy Summary Feature:** Quick-action shortcut generating a formatted clipboard text summary of your currently selected dates and corresponding notes.
- **Keyboard Navigation:** Accessibility-friendly layout allowing robust tabbing (`Space/Enter` interaction) for power users.
- **Custom Resizable Split-Pane:** An interactive, draggable horizontal handle that allows users to fluidly squish or expand the calendar grid and notes panel in real-time, strictly bound within desktop screen limits.

---

## 🏗 Tech Stack

- **React & Vite:** For fast, modular component structures and lightning-fast HMR payload delivery.
- **Tailwind CSS:** For highly-customizable atomic styling mixed with complex layout constraint grids.
- **Framer Motion:** Powering the heavy-lifting of spring physics and layout-level smooth page transitions.
- **date-fns:** Simplifying complex calendar leap-year and bounds mathematical generation.
- **lucide-react:** Providing clean, vectorized feather icons for the navigation and toolbar.

---

## 🪝 React Hooks Architecture

The project relies heavily on robust modern React paradigms to ensure peak performance without unnecessary DOM painting:

### Built-in Hooks
- **`useReducer`:** Acts as the brain of the application (`CalendarContext.jsx`), centralizing complex date logic, boundary constraints, and selection states away from UI components.
- **`useMemo`:** Heavily guards expensive calculations—like evaluating 6-week month boundary matrices (`buildCalendarGrid`)—so the grid doesn't recalculate when users type inside notes.
- **`useCallback`:** Memoizes heavy event listeners like touch-swipes and 60fps frame drags to prevent breaking memoized child components.
- **`useRef`:** Put to extreme use bypassing the React rendering tree to make direct `style.height` DOM manipulations during the Split-Pane dragging events, preventing the application from dragging sluggishly. Also used as a rapid-fire double-click guard.
- **`useContext`:** Used to distribute calendar data globally, completely avoiding prop-drilling.
- **`useEffect`:** Handles background background-image preloading caching and synchronizing the `.dark` class directly into the HTML root element.

### Custom Hooks
- **`useCalendar()`:** A strict context accessor wrapping that ensures safe payload deployments.
- **`useSwipe()`:** A custom utility tracking `onTouchStart` and `onTouchEnd` tracking X-axis deltas to fire native mobile swiping events.
- **`useIsDark()`:** Intercepts system media-queries (`prefers-color-scheme: dark`) and reconciles them with the user's manual override choice.

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo-link>
   cd project
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the local development server**
   ```bash
   npm run dev
   ```
*(Runs automatically on `http://localhost:5173` or `3000` depending on your environment setup).*

---

## 💻 How to Use

1. **Select a start date:** Click any valid date in the calendar grid.
2. **Select an end date:** Click a subsequent date to link them and visually display the animated range selection bar. (Clicking a date twice clears your selection).
3. **Add notes:** Click on the Notes Panel tabs below the calendar to type reminders for the general `Month` or your specified `Range`.
4. **Resize View:** Hover over the draggable divider above the notes panel and drag it up or down to reveal more notepad space or more calendar space.
5. **Switch months:** Use the left/right arrows, or interact with the dropdown.
6. **Export:** Click "Copy Summary" in the top right to dump your currently focused timeline into your system clipboard!

---

## 🔮 Future Scalability

- **Backend Persistence:** Ready to be wired up to Firebase/Supabase to save notes to a database natively.
- **Drag-to-select:** Currently uses a two-click bounding algorithm; can be expanded to support native mouse-hold drag events.
- **Multi-user Support:** Allowing calendar sharing with color-coded multi-range overlap identifiers for different team members.
