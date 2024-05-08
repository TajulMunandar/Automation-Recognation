import { useRoutes } from "react-router-dom";

// route
import Logins from "./pages/auth/Logins";
import Dashboard from "./pages/dashboard/dashboard";

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
  ]);

  return <>{routes}</>;
}

export default App;
