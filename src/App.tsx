import Layout from "./components/layout/component"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import PanelPage from "./pages/panel-page/component"
import HomePage from "./pages/home-page/component"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/panel", element: <PanelPage /> },
    ],
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
