import { Login } from "./features/auth/Login";
import { Signup } from "./features/auth/Signup";
import { Protected } from "./features/protected/protected";
import App from "./App.jsx";

export const routes = [
    {
        path: "/",
        element: <Protected><App></App></Protected>,
    },
    {
        path: "/login",
        element: <Login></Login>,
    },
    {
        path: "/signup",
        element: <Signup></Signup>,
    }
]