# Frontend Architecture Report: Booking App

## 1. Architecture Overview

### Tech Stack
*   **Framework**: React 18 + Vite (TypeScript)
*   **Routing**: React Router Dom v6
*   **State Management**: Local State (`useState`), Prop Drilling. No global state manager (Redux/Zustand) observed.
*   **Data Fetching**: Axios (direct calls in components)
*   **UI Library**: Material UI (Joy UI), Styled Components (in package.json but less prominent in observed files), CSS Modules/Global CSS.
*   **Charts**: Chart.js (`react-chartjs-2`), Recharts (in deps).
*   **Date/Time**: `date-fns`, `moment`, `moment-timezone`, `dayjs` (multiple libraries for same purpose).
*   **Auth**: JWT stored in Cookies (`Usertoken`, `Coachtoken`, `admintoken`). Role-based protection via wrapper components.

### Project Structure
*   `src/components/UserPro`: User-facing features (Booking, Profile, Auth).
*   `src/components/Coach`: Coach-facing features (Dashboard, Schedule, Analytics).
*   `src/components/admin`: Admin features (Dashboard, User/Coach Management).
*   `src/components/GenerateWeeklySlots`: Specific complex feature for slot generation.
*   `src/App.tsx`: Central routing configuration with Lazy Loading.

## 2. Feature List (Exhaustive)

### User (Client)
*   **Authentication**: Login, Signup, Reset Password, OTP Verification.
*   **Dashboard**: View available coaches, search/filter coaches by name/sport.
*   **Booking**: Select a slot, view slot details, book a slot (for self or child).
*   **Profile**: Manage personal details, add children (sub-users).
*   **History**: View booking history.

### Coach
*   **Authentication**: Login, Signup, Reset Password, OTP Verification.
*   **Dashboard**: View daily schedule, filter slots (booked, available, etc.), view booking details in modal.
*   **Scheduler**: Create slots (Daily/Weekly), set slot type (General/Personal), define working hours.
*   **Analytics**: View performance metrics.
*   **Profile**: Manage professional profile (Bio, Sport, Experience).

### Admin
*   **Authentication**: Login.
*   **Dashboard**: Overview of system stats (Daily/Weekly bookings).
*   **Management**: Manage Users, Manage Coaches (approve/verify).
*   **Analytics**: Real-time analytics, specific reports.
*   **Bookings**: View all bookings, Cancel bookings.

## 3. Data Flow & API Mapping

### Authentication Flow
1.  **Login**: POST `/login` -> returns JWT.
2.  **Storage**: Token stored in Cookies (`Usertoken`, etc.) & User info in `localStorage`.
3.  **Protection**: `ProtectedRoute` checks cookie existence and decodes JWT to verify role.

### Critical Data Paths
*   **Coach Availability**:
    *   GET `${Domain_URL}/coach/getAllCoaches` (User Dashboard)
    *   GET `${Domain_URL}/slots-g-p/${coachId}` (Coach Dashboard - fetches *all* slots)
    *   GET `${Domain_URL}/slot/coach/${coachId}?date=...` (User Booking - specific date)
*   **Booking Creation**:
    *   POST `${Domain_URL}/bookings` (User confirms booking)
    *   Validation: Checks for existing bookings, double booking prevention (server-side).
*   **Slot Creation**:
    *   POST `${Domain_URL}/slot/createSlot` (Daily)
    *   POST `${Domain_URL}/slot/create-weekly-slots` (Weekly)

## 4. State Management Patterns
*   **Local State Dominance**: Components manage their own data fetching and state.
*   **Prop Drilling**: Minimal, mostly passing IDs or callback functions.
*   **No Global Store**: Auth state is derived from Cookies/LocalStorage on mount.
*   **Refetching**: Data is refetched on component mount (useEffect). No caching strategy visible.

## 5. Performance Bottlenecks
*   **Client-Side Filtering**: `Coachdashboard` fetches *all* slots for a coach and filters them in the browser. This will scale poorly.
*   **Bundle Size**: Multiple heavy libraries for the same task (Moment + Date-fns + Dayjs).
*   **Rendering**: `Screen.tsx` (User Dashboard) re-renders on every search input change (controlled input) which might be slow with many coaches.

## 6. Anti-Patterns & Code Quality Issues
*   **"Any" Types**: Frequent use of `any` in TypeScript code (e.g., `catch (err: any)`), defeating the purpose of TS.
*   **Hardcoded Values**: Magic strings for roles, status ('booked', 'available').
*   **Inconsistent Naming**: Token names (`Usertoken`, `Coachtoken`), component naming (`Screen` vs `Dashboard`).
*   **Direct DOM Access**: `document.cookie` manipulation instead of using a library consistently (or just `js-cookie` which is installed).
*   **Duplicate Libraries**: Moment.js, Date-fns, and Day.js are all present.
*   **Security**: Storing sensitive user info in `localStorage` (like `coachId`, `email`).

## 7. Risky Areas (Do Not Break)
*   **Timezone Handling**: The app uses a mix of local time and UTC. `scheduler.tsx` uses `moment-timezone`, while `SlotBooking.tsx` uses native `Date`.
    *   *Risk*: Slots created in one timezone might appear at the wrong time for users in another.
*   **Booking Logic**: The `handleConfirmBooking` in `SlotBooking.tsx` has complex validation logic.
*   **Slot Generation**: The `Schedule` component has complex validation for time ranges and days of the week.

## 8. Refactoring Recommendations (Prioritized)
1.  **Standardize Date Library**: Pick one (e.g., `date-fns` or `dayjs`) and remove others to reduce bundle size.
2.  **Centralize API Logic**: Create an `api/` directory with typed service functions to handle endpoints and error handling globally.
3.  **Implement React Query**: Replace `useEffect` data fetching with React Query for caching, loading states, and better performance.
4.  **Unify Auth State**: Create an `AuthProvider` context to manage user session, tokens, and roles properly.
5.  **Fix Timezones**: Ensure all dates sent to backend are UTC, and formatted to local time only for display.
6.  **Server-Side Pagination**: Update `Coachdashboard` to fetch slots by date range from the server instead of fetching all.
