import { useRoutes, Navigate } from "react-router-dom";

// route
import Logins from "./pages/auth/Logins";
import Dashboard from "./pages/dashboard/dashboard";
import Users from "./pages/dashboard/user";
import Historys from "./pages/dashboard/historys";
import Audios from "./pages/dashboard/audio";
import LandingPage from "./pages/landingPage";
import AutomationRecognitionPage from "./pages/Audio";
import Register from "./pages/auth/Register";

function App() {
  const routes = useRoutes([
    {
      path: "/login",
      element: <Logins />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/historys",
      element: <Historys />,
    },
    {
      path: "/audios",
      element: <Audios />,
    },
    {
      path: "/automation",
      element: <AutomationRecognitionPage />,
    },
  ]);

  return <>{routes}</>;
}

export default App;
