import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import CreateList from "./components/lists/CreateList";
import ItemsPage from "./pages/ItemsPage";
import ListsPage from "./pages/ListsPage";
import StatisticsPage from "./pages/StatisticsPage";

// Context
import { ErrorProvider } from "./context/ErrorContext";

/**
 * App
 * Main application component that sets up:
 * - Global error handling with ErrorProvider
 * - Routing with React Router
 * - Toaster notifications with react-hot-toast
 *
 * Routes:
 * - "/" -> LandingPage
 * - "/create-list" -> CreateList
 * - "/items-page/:listId" -> ItemsPage
 * - "/lists-page" -> ListsPage
 * - "/statistics-page" -> StatisticsPage
 *
 * Layout:
 * - AppLayout wraps all routes, providing navbar, side menu, scroll-top button, and footer
 *
 * Toaster:
 * - Positioned at top-center
 * - Custom style (background, font, padding, shadow, rounded corners)
 */
function App() {
  return (
    <ErrorProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="create-list" element={<CreateList />} />
            <Route path="items-page/:listId" element={<ItemsPage />} />
            <Route path="lists-page" element={<ListsPage />} />
            <Route path="statistics-page" element={<StatisticsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Global toaster notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "inherit",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "16px 20px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
            backgroundColor: "#D0F0FD",
            color: "#585e68ff",
          },
        }}
      />
    </ErrorProvider>
  );
}

export default App;
