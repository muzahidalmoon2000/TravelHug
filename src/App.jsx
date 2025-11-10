import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home.jsx";
import TravelPlan from "./page/TravelPlan.jsx";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plan" element={<TravelPlan />} />
    </Routes>
    </BrowserRouter>
  );
}
