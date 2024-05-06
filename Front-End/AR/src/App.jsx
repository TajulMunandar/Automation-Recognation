import { useRoutes } from "react-router-dom";

// route
import Logins from "./pages/auth/Logins";

function App() {
  const routes = useRoutes([
    {
      path: "/login",
      element: <Logins />,
    },
  ]);

  return <>{routes}</>;
}

export default App;
