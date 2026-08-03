import { Login } from "./features/auth/Login";
import { Signup } from "./features/auth/Signup";
import App from "./App.jsx";

export const routes = [
    {
        path: "/",
        element: <App></App>,
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