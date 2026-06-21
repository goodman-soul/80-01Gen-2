import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LandlordDashboard from "@/pages/landlord/LandlordDashboard";
import DevicesPage from "@/pages/landlord/DevicesPage";
import StatisticsPage from "@/pages/landlord/StatisticsPage";
import StewardDashboard from "@/pages/steward/StewardDashboard";
import PrecoolingPage from "@/pages/steward/PrecoolingPage";
import AlertsPage from "@/pages/steward/AlertsPage";
import GuestHome from "@/pages/guest/GuestHome";
import BillPage from "@/pages/guest/BillPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/landlord" element={<LandlordDashboard />} />
        <Route path="/landlord/devices" element={<DevicesPage />} />
        <Route path="/landlord/statistics" element={<StatisticsPage />} />
        
        <Route path="/steward" element={<StewardDashboard />} />
        <Route path="/steward/precooling" element={<PrecoolingPage />} />
        <Route path="/steward/alerts" element={<AlertsPage />} />
        
        <Route path="/guest" element={<GuestHome />} />
        <Route path="/guest/bill" element={<BillPage />} />
      </Routes>
    </Router>
  );
}
