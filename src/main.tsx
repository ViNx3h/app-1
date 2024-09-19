import { Amplify } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import React from "react";
import ReactDOM from "react-dom/client";
import outputs from "../amplify_outputs.json";
import App from "./App.tsx";
import "./index.css";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
