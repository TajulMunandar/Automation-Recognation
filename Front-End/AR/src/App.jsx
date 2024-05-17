import { useRoutes, Navigate } from "react-router-dom";

// route
import Logins from "./pages/auth/Logins";
import Dashboard from "./pages/dashboard/dashboard";
import Users from "./pages/dashboard/user";
import Historys from "./pages/dashboard/historys";
import Audios from "./pages/dashboard/audio";

function App() {
  const routes = useRoutes([
    {
      path: "/login",
      element: <Logins />,
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
      path: "/",
      element: <Navigate to="/login" />,
    },
  ]);

  return <>{routes}</>;
}

export default App;
