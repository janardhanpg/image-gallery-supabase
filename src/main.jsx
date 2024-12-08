import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const supabaseUrl = "https://rzfrryiwywvubqvkjgpw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZnJyeWl3eXd2dWJxdmtqZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MzQzMDAsImV4cCI6MjA0OTIxMDMwMH0.Mya1Wv0XOg2c7ZciH97zldJ1lBKvu--zq1POWBNlv-M";

const supabase = createClient(supabaseUrl, supabaseKey);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </StrictMode>
);
