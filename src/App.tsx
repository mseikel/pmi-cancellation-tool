import { Routes, Route, useLocation } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { LearnMore } from './components/LearnMore';
import { PMISurvey } from "./components/PMISurvey";
import TakeAction from './components/TakeAction';
import NavBar from './components/NavBar';

export default function App() {
  const location = useLocation();

  return (
    <div className="font-sans text-neutral-900 bg-[#cbddd1] scroll-smooth">
      <NavBar /> 
      <main className="pt-[var(--nav-h)]">
        <Routes>
          <Route index element={<HeroSection />} />
          <Route path="/quiz" element={<PMISurvey />} />
          <Route path="/learn" element={<LearnMore />} />
          <Route path="/take-action" element={<TakeAction />} />
        </Routes>
      </main>
    </div>
  );
}
