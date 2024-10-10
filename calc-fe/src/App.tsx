import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";

import Home from "./screens/home";

import './index.css';

const paths = [ //An array named paths is defined to specify the routing paths and corresponding components.
  {
    path: '/',
    element: ( //The React component that will be rendered when the user navigates to this path
      <Home />
    ),
  },
];

const BrowserRouter = createBrowserRouter(paths); //This router will manage navigation within the app

const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={BrowserRouter} />;
    </MantineProvider>
  );
}

export default App;