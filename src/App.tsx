import Layout from "./components/layout/component"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import PanelPage from "./pages/panel-page/component"
import UserPage from "./pages/user-page/component"
import ErrorPage from "./pages/error-page/component"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "user",
        index: true,
        element: <UserPage />,
        errorElement: <ErrorPage />,
      },
      { path: "manager", element: <PanelPage />, errorElement: <ErrorPage /> },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
