# Shopping List App – Frontend

This is the **frontend** of the Shopping List application, built with **React, Vite, Tailwind CSS, and daisyUI**.  
It provides a **modern, responsive, and mobile-friendly interface** for managing shopping lists, items, categories, units, and statistics.  
The frontend also supports **real-time updates** via **Supabase Realtime**, allowing multiple users to see changes instantly without refreshing the page.

## 📖 Table of Contents

- [🛠️ Tech Stack](#tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [⚠️ Error Handling](#-error-handling)
  - [Global Error Context](#1-global-error-context)
  - [Error Normalization Utility](#2-error-normalization-utility)
  - [API Request Handling](#3-api-request-handling)
  - [Hooks Integration](#4-hooks-integration)
  - [Summary](#summary)
- [✅ Validation](#-validation)
- [⚡ Real-time Updates](#-real-time-updates)
  - [Supabase Client](#supabase-client)
- [🚀 Run Locally](#-run-locally)


---

<a id="tech-stack"></a>
## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-lightgrey)
![Vite](https://img.shields.io/badge/Vite-lightgrey)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-lightgrey)
![daisyUI](https://img.shields.io/badge/daisyUI-lightgrey)

The frontend is designed to be **fast, lightweight, and user-friendly** with a focus on cross-device usability:

- **React** – Component-based UI library for building interactive views.  
- **Vite** – Next-generation build tool with lightning-fast HMR for development.  
- **Tailwind CSS** – Utility-first CSS framework for responsive and consistent styling.  
- **daisyUI** – Tailwind-based component library with pre-designed UI components.  
- **PWA support** – With `manifest.json`, icons, and meta tags for installing the app on mobile/desktop.  
- **lucide-react** – Lightweight icon library for category icons and other UI elements.  
- **react-hot-toast** – Toast notification library for global success and error messages.  
- **Supabase JS SDK** – Provides real-time subscriptions and API communication with Supabase.  
- **pdfmake** – Generates PDFs from shopping lists and items with full RTL support.  

---

## 📂 Folder Structure

```text
frontend/
├── public/                   
├── src/
│   ├── api/                  # API service files
│   │   ├── ...     
│   │   └── http.js           # Standardized fetch wrapper with error handling (uses constants.js)
│   ├── assets/               # Fonts, Lottie animations, and other static assets
│   ├── components/           # Reusable React components
│   │   ├── common/           # Components used across the app (CustomInput.jsx, Modal.jsx, Toasts, etc.)
│   │   ├── items/            # Components related to ItemsPage.jsx
│   │   ├── layout/           # App layout components (AppLayout.jsx, SideMenu.jsx, Header.jsx, etc.)
│   │   ├── lists/            # Components related to ListsPage.jsx
│   │   └── statistics/       # Components related to StatisticsPage.jsx
│   ├── context/              # React context providers
│   │   └── ErrorContext.js   # Centralized error & success toast notifications
│   ├── hooks/                # Custom hooks for managing state, business logic (validation and real-time updates)
│   ├── pages/                # Page-level components (route targets)
│   ├── supabase-realtime/    # Real-time subscriptions using Supabase
│   │   ├── supabaseClient.js # Supabase client initialization
│   │   └── realtimeSubscriptions.js # Subscribe to lists and items in real-time
│   ├── utils/                # Utility functions and shared constants
│   │   ├── constants.js      # API base URL, endpoints, font configurations, etc.
│   │   ├── errors.js         # AppError class and createError helper
│   │   └── pdfUtilsPdfMake.js # Functions for generating PDFs (with RTL support)
│   ├── validators/           # Form and input validation functions
│   │   ├── itemValidator.js
│   │   └── listValidator.js
│   └── App.jsx               # Root App component + routing setup

```

---

## ⚠️ Error Handling
how requests are processed, errors normalized, and notifications displayed to the user.

### 1. Global Error Context
**File:** `context/ErrorContext.jsx`

The application uses a React context to handle global errors and success messages.

#### Features:

- **`ErrorProvider`** wraps the app and exposes:
  - `showError(err)` – normalizes any error and shows a toast notification.
  - `showSuccess(msg)` – shows a success toast notification.
- **`useErrorHandler` hook** – provides easy access to `showError` and `showSuccess`.

#### Example:

```jsx
const { showError, showSuccess } = useErrorHandler();

try {
  await apiCall();
  showSuccess("Operation successful");
} catch (err) {
  showError(err);
}
```

> Notes:
showError always uses createError() from utils/errors.js to normalize errors.
All notifications are displayed via react-hot-toast.

### 2. Error Normalization Utility
**File:** `utils/errors.js`

#### `AppError` Class
- Extends the native JavaScript `Error`.
- Fields:
  - `code` – application-specific error code (`NETWORK_ERROR`, `SERVER_ERROR`, etc.).
  - `message` – human-readable message (supports Hebrew messages).
  - `status` – optional HTTP status code.
  - `details` – optional additional debug information.

###### `createError(err, status?)`
A helper function to normalize any error into an `AppError`.

1. **Already an AppError:** returned as-is.
2. **Network errors** (TypeError containing "fetch"): returns an `AppError` with:
   - `code: "NETWORK_ERROR"`
   - `message: "לא הצלחנו להתחבר לשרת. בדוק חיבור אינטרנט."`
3. **Other errors:** returns an `AppError` with:
   - `code: "UNKNOWN_ERROR"`
   - `message`: either the original error message or `"אירעה שגיאה לא צפויה"`
   - optional `status` if provided

##### Example Usage

```jsx
import { createError, AppError } from "../utils/errors";

try {
  await fetch("/api/data");
} catch (err) {
  throw createError(err, 500); // ensures a standardized AppError
}
```

### 3. API Request Handling

The frontend interacts with the backend exclusively through standardized API calls using the `request` helper function.    
All API functions automatically integrate with the application's error handling system.

#### `request(url, options)`

**File:** `api/http.js`

A centralized helper for making API requests.

#### Flow

1. **Send the request** with JSON headers and any additional options.
2. **Check response status (`res.ok`)**:
   - If the response is **not OK**:
     - Attempt to parse JSON for server-provided messages.
     - Throw an `AppError` with:
       - `code: "AUTH_ERROR"` if status `401`
       - `code: "SERVER_ERROR"` otherwise
       - `message`: server message or fallback `"שגיאת שרת (status)"`
3. **Handle empty responses (`204`)** → return `null`.
4. **Catch network or unexpected errors** → pass to `createError()` to normalize as `AppError`.

#### Example Usage

```js
import { request } from "./http";

async function fetchLists() {
  try {
    const data = await request("/api/lists");
    return data;
  } catch (err) {
    showError(err); // AppError guaranteed
  }
}
```

### 4. Hooks Integration
Every hook that performs asynchronous operations should follow the same pattern:

1. **`try/catch`** for all async calls.
2. **`showError(err)`** for user-visible errors.
3. Optional **`showSuccess(msg)`** for successful operations.
4. **Safe state updates** only when operations succeed.

This approach guarantees **consistent error handling** and **user feedback** across all hooks in the application.

### Summary

The frontend application follows a consistent pattern for error handling across all components, hooks, and API calls.

#### Key Points

1. **Network errors / fetch failures** → normalized as `NETWORK_ERROR` with a user-friendly message.
2. **Server errors (HTTP 4xx/5xx)** → mapped to `SERVER_ERROR` or `AUTH_ERROR`.
3. **Unknown errors** → normalized as `UNKNOWN_ERROR`.
4. **All errors** are:
   - Wrapped in `AppError`.
   - Passed to `showError()` from `ErrorContext` → displayed as toast notifications.
5. **Success messages** use `showSuccess()` → toast notifications for positive feedback.
6. **State updates remain safe** even when errors occur (e.g., resetting lists or statistics to default states if a fetch fails).

#### Outcome

Every API request or asynchronous operation is guaranteed to either:

- Complete successfully and optionally show a success message, or
- Result in a normalized error that is displayed to the user, while maintaining consistent internal state.

---

## ✅ Validation

The frontend includes a **validation layer** to ensure data integrity before sending requests to the backend. This layer helps prevent invalid data, reduces errors, and improves user experience.

### Validators

**Files:**
- `validators/listValidator.js` – Validates lists (creation and updates).
- `validators/itemValidator.js` – Validates items (creation and updates).

### Integration with Error Handling

- Validation errors are caught before API calls.
- Errors are displayed to the user using **react-hot-toast** via the global `ErrorContext`.
- Example:

```jsx
import { validateList } from "../validators/listValidator";
import { useErrorHandler } from "../context/ErrorContext";

const { showError } = useErrorHandler();

try {
  validateList(listData); // throws if invalid
  await apiCreateList(listData);
} catch (err) {
  showError(err); // normalized toast notification
}
```

---

## ⚡ Real-time Updates

The Shopping List frontend integrates **real-time functionality** using **Supabase Realtime**. This ensures that multiple users see updates immediately without refreshing the page.

### Supabase Client

**File:** `supabase-realtime/supabaseClient.js`

- Initializes the Supabase client using environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Provides a single shared `supabase` instance for subscriptions.

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 🚀 Run Locally

### 1. Install dependencies:
```bash
cd frontend
npm install
```

### 2. Create .env file
`frontend/.env`
```.env
# Backend API URL
VITE_APP_API_URL=http://localhost:3000
# Your Supabase Realtime URL (for real-time synchronization)
VITE_SUPABASE_URL=your-supabase-url
# Your Supabase anonymous key (for secure API calls)
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run
```bash
npm run dev
```

> This will start: Frontend → http://localhost:5173   

---
