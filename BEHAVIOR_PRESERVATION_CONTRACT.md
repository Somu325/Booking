# Behavior Preservation Contract (Do Not Break)

This contract outlines the critical behaviors, flows, and components that must remain unchanged during the refactor. Any modification to these areas requires rigorous testing and validation.

## 1. Behavior Checklist

### User (Client)
- [ ] **Authentication**: Login must work with `Usertoken` cookie. Role must be verified.
- [ ] **Dashboard**: Must list coaches fetched from `/coach/getAllCoaches`. Search functionality must work as is (client-side filtering).
- [ ] **Booking**:
    - [ ] Must fetch slots for specific date via `/slot/coach/${coachId}?date=${selectedDate}`.
    - [ ] Must display slots sorted by start time.
    - [ ] Booking confirmation must send correct payload: `{ userId, childId, coachId, slotId, bookingType, status }`.
    - [ ] `userId` must be retrieved from `localStorage`.
- [ ] **History**: Must display user bookings fetched from `/bookings/user/${userId}`.
- [ ] **Profile**: Must display user profile.

### Coach
- [ ] **Authentication**: Login must work with `Coachtoken` cookie. Role must be verified.
- [ ] **Dashboard**:
    - [ ] Must fetch ALL slots via `/slots-g-p/${coachId}`.
    - [ ] Must filter slots by date and status on the client side.
    - [ ] Must show booking details in a modal when a booked slot is clicked.
- [ ] **Scheduler**:
    - [ ] Must create Daily slots via `/slot/createSlot`.
    - [ ] Must create Weekly slots via `/slot/create-weekly-slots`.
    - [ ] Validation: End time > Start time, Future dates, Valid days of week, Duration min 60m, 0/30 min increments.
    - [ ] Must handle timezones correctly (sending `YYYY-MM-DD` and `HH:mm`).
- [ ] **Analytics**: Must display booking analytics.

### Admin
- [ ] **Authentication**: Login must work with `admintoken` cookie. Role must be verified.
- [ ] **Dashboard**: Must show system overview.

### Critical Flows & Semantics
- [ ] **Token Storage**: JWTs must be stored in `Usertoken`, `Coachtoken`, `admintoken` cookies.
- [ ] **Protected Routes**: Must check for specific role in decoded JWT.
- [ ] **Timezones**:
    - [ ] `Scheduler`: Uses `moment-timezone` for creation.
    - [ ] `SlotBooking`: Uses `new Date()` for display.
    - [ ] `CoachDashboard`: Uses `date-fns` for display.
    - [ ] **Constraint**: Do not unify timezone logic if it changes the values sent to/from API.

## 2. High-Risk Files

These files contain critical logic and "Do Not Break" behaviors.

| File Path | Risk Level | Reason |
| :--- | :--- | :--- |
| `src/components/UserPro/SlotBooking/SlotBooking.tsx` | **CRITICAL** | Booking logic, Date handling, API payload construction. |
| `src/components/GenerateWeeklySlots/scheduler.tsx` | **CRITICAL** | Slot creation logic, Complex validation, Timezone handling. |
| `src/components/Coach/Homepage/Homepage.tsx` | **HIGH** | Dashboard logic, Client-side filtering of all slots. |
| `src/components/UserProtectedRoutes.tsx` | **HIGH** | Auth flow, Token verification. |
| `src/components/CoachProtectedRoutes.tsx` | **HIGH** | Auth flow, Token verification. |
| `src/components/adminProtectedRoute.tsx` | **HIGH** | Auth flow, Token verification. |
| `src/components/config.ts` | **HIGH** | API Configuration. |

## 3. Refactor Safety Classification

| Component / Area | Classification | Guidelines |
| :--- | :--- | :--- |
| **UI Components** (Layouts, simple displays) | **SAFE** | Can be modernized using new UI libraries or CSS, provided visual regression testing is done. |
| **Dashboards** (`Screen.tsx`, `Coachdashboard.tsx`) | **CAUTION** | Be careful with data fetching and client-side filtering logic. Ensure `useEffect` dependencies are correct. |
| **Booking Logic** (`SlotBooking.tsx`) | **DO NOT TOUCH** | Logic for `handleConfirmBooking` and slot sorting must remain identical. |
| **Scheduler Logic** (`scheduler.tsx`) | **DO NOT TOUCH** | Validation logic and payload construction must remain identical. |
| **Auth Logic** (Protected Routes) | **DO NOT TOUCH** | Token decoding and role checking must remain identical. |
| **API Calls** | **DO NOT TOUCH** | Endpoints and payloads must remain identical. |
