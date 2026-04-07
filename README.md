# 📅 Interactive Wall Calendar UI

A beautifully designed, fully interactive wall calendar web component built as part of a Frontend Engineering Challenge. This project transforms a traditional static wall calendar aesthetic into a responsive, highly functional digital experience complete with date range selection and an integrated notes system.

## 🚀 Live Demo

[Live Demo Link (Vercel/Netlify Placeholder)]

## 🎥 Demo Video

[Video Link (Loom/YouTube Placeholder)]

**What is demonstrated:**
- Seamless date range selection with smooth animations.
- Month-level and range-based notes creation.
- Layout responsiveness switching between desktop and mobile formats.
- Theme switching with an auto-detecting system preference.

## 🖼 Preview / Screenshots

[Images/GIFs Placeholder: E.g., showing the hero image side-by-side with the active date grid and notes panel]

## ✨ Features

### Core Features
- **Wall Calendar Aesthetic:** Combines a high-impact hero image panel with a meticulously crafted date grid.
- **Day Range Selection:** Fluid multi-click selection supporting start, end, and in-between connected visual states.
- **Notes System:** Supports recording notes globally for the month or locally attached to a selected date range.
- **Fully Responsive Design:** Adapts from a beautiful side-by-side layout on desktop into a stacked layout structure for smaller screens.

### Bonus Features
- **Smooth Animations:** Integrated Micro-interactions including month cross-fades, spring-based date cell scaling, and page-like transitions.
- **Theme Switching:** Premium glassmorphism UI offering Light, Dark, and System Auto matching.
- **Holiday Indicators:** Integrated contextual tooltips denoting custom or standard holidays.
- **Copy Summary Feature:** Quick-action button generating a clipboard summary of selected dates and corresponding notes.
- **Mini Month Preview:** Convenient mini-calendars at the bottom displaying previous and upcoming month overviews.
- **Keyboard Navigation:** Accessibility-friendly layout allowing robust tabbing and keyboard interaction.

## 🧠 Design Decisions

- **Why this UI approach was chosen:** The UI was architected to evoke the tactile, premium feel of an authentic physical planner. 
- **Wall calendar inspiration:** The layout relies on spiral-binding visual cues and clear separation between photographic aesthetics (the Hero Image) and structured grid logic.
- **UX decisions:** The range selection prioritizes rapid connectivity, letting users visualize their timelines naturally as pill-shaped bars. The notes section is neatly tucked beneath the dates to keep context unified.
- **Responsiveness strategy:** Instead of compressing the hero image on mobile, the layout smartly stacks, and applies sticky behavior to month navigation so users never lose context when vertical scrolling.

## 🏗 Tech Stack

- **React / Vite:** For fast, modular component structures.
- **Tailwind CSS:** For highly-customizable atomic styling mixed with glassmorphic utility overlays.
- **Framer Motion:** Powering the heavy-lifting of spring physics and fluid micro-transitions.
- **date-fns:** Simplifying complex calendar mathematical generation.
- **lucide-react:** Providing clean, vectorized icons.

## 📁 Folder Structure

```text
src/
  components/
    WallCalendar/
      context/
      constants/
      utils/
      components/
        DateGrid.jsx
        HeroPanel.jsx
        NotesPanel.jsx
        ...
      index.jsx
  App.jsx
  index.css
```

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repo>
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

*(Runs automatically by default on `http://localhost:5173` or `3000` depending on the environment setup).*

## 🚀 Deployment

**Recommended Platform:** Vercel

**Steps:**
1. Connect your repository to Vercel.
2. Select the base directory and deploy.
3. *No backend configuration is required as this is a standalone frontend application utilizing local state logic.*

## 🧪 How to Use

1. **Select a start date:** Click any valid date in the calendar grid.
2. **Select an end date:** Click a subsequent date to link them and display the animated range selection bar.
3. **Add notes:** Click on the Notes Panel tabs below the calendar to type reminders for the `Month` or specified `Range`.
4. **Switch months:** Use the arrow keys in the month navigation bar or swipe natively on a mobile device.
5. **Toggle themes:** Use the sun/moon icon toggle in the upper right control tier to cycle Light/Dark styles.

## 📱 Responsiveness

- **Desktop layout behavior:** Displays a beautiful 55/45 split showcasing the Hero Image prominently alongside the Date Grid.
- **Mobile layout behavior:** Re-configures the grid to sit below the image. Uses a sticky header so month-controls remain pinned.
- **Touch usability:** Touch targets feature a minimum 44px safe-clicking height with specific tap-highlight suppression to ensure a native-app feel without visual glitches.

## ♿ Accessibility

- **Keyboard navigation:** Focus rings uniquely highlight elements as users `Tab` through date-cells, dropdowns, and text areas.
- **ARIA labels:** Implemented specifically on dynamic state elements like the Copy Status button, Day cells, and Theme selectors for screen-reader accuracy.
- **Focus states:** Enhanced with premium glow-rings instead of standard, abrupt browser outlines.

## ⚡ Performance Considerations

- Uses `useMemo` strictly across grid calculations (`buildCalendarGrid`) and derived holiday parsing mapping to ensure unnecessary re-renders are suppressed when typing in the notes sections.
- Lazy loads Hero Images and parses them asynchronously (`decoding="async"`) to ensure the page frame is unblocked while cycling heavy graphics.
- Clean dependency payload with no massive UI component libraries; relies predominantly on tailored markup.

## 🧩 Challenges & Solutions

- **Date range logic:** Accounting for users clicking dates across different months or clicking backwards. Solved with a lightweight unified Reducer (`CalendarContext`) tracking state phases effectively.
- **UI state management:** Keeping Note TextAreas localized to their selected Ranges despite constant month switching. Addressed seamlessly via hashing specific keys (e.g., `YYYY-MM-DD_YYYY-MM-DD`). 
- **Animations:** Connecting a contiguous rounded-pill style across separate grid cells natively required intricate offset layering, ultimately solved by evaluating bounding adjacent arrays via custom logic (`isFirstRange`, `isLastRange`).

## 🔮 Future Improvements

- **Backend persistence:** Connecting a DB (like Firebase or Supabase) to log notes natively to an authenticated profile.
- **Drag selection:** Incorporating mouse-drag API tracking rather than two-click confirmation for rapid highlighting.
- **Event scheduling:** Adding granular hours/minutes overlays onto specific saved days.
- **Multi-user support:** Allowing calendar sharing with color-coded multi-range overlap identifiers.

## 📊 Evaluation Alignment

- **Code Quality:** Architected with a clean Context/Reducer pattern avoiding massive prop drilling. File structure is rigidly separated by contextual concerns.
- **Component Architecture:** Encapsulates precise logic into functional bits (`NotesPanel`, `MonthNavigation`) utilizing pure functions.
- **UI/UX Polish:** Offers an immersive, beautiful aesthetic that elevates functional forms beyond classic table designs via glassmorphism and subtle elevation shadows.
- **Responsiveness:** Flawless cross-device transitions retaining high visual standards at any viewport.

## 🙌 Acknowledgements

- Deeply inspired by tactile, physical wall calendars and modern premium planner concepts.
- Constructed utilizing `React`, `date-fns`, and `Framer Motion`.
