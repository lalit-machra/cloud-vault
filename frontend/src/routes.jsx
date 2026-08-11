import { Login } from "./features/auth/Login";
import { Signup } from "./features/auth/Signup";
import { Protected } from "./features/protected/protected";
import { LandingPage } from "./features/landingPage/LandingPage";
import App from "./features/dashboard/App.jsx";

export const routes = [
    {
        path: "/",
        element: <LandingPage></LandingPage>
    },
    {
        path: "/login",
        element: <Login></Login>,
    },
    {
        path: "/signup",
        element: <Signup></Signup>,
    },
    {
        path: "/dashboard",
        element: <Protected><App></App></Protected>,
    },
]