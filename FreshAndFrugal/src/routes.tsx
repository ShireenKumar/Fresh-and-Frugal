import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login"; 
import Error from "./pages/error";
import Home from "./pages/home";
import Signup from "./pages/signup";
import ProtectedRoutes from "./components/ProtectedRoutes";

export const router = createBrowserRouter([
    {
        element: <ProtectedRoutes />,
        children: [
            {
            path: "/",
            element: <Home />,
            errorElement: <Error />
            }, 
           
              {
                path: "/home", 
                element: <Home />, 
                errorElement: <Error />
              },
              
        ],
        
    },
    {
        path: "/login", 
        element: <Login />, 
        errorElement: <Error />
      },
      {
        path: "/signup", 
        element: <Signup />, 
        errorElement: <Error />
      }

]);
export default router;