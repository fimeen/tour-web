import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Booking from "@/pages/Booking";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import MyBookings from "@/pages/MyBookings";
import AdminBookings from "@/pages/AdminBookings";
import TourDetail from "@/pages/TourDetail";
import Tours from "@/pages/Tours";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/tours"} component={Tours} />
      <Route path={"/tours/:slug"} component={TourDetail} />
      <Route path={"/book/:slug"} component={Booking} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/login"} component={Login} />
      <Route path={"/account/bookings"} component={MyBookings} />
      <Route path={"/admin/bookings"} component={AdminBookings} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
