import { Routes, Route } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { LearnMore } from './components/LearnMore';
import { PMISurvey } from "./components/PMISurvey";

export default function App() {
  return (
    <main className="font-sans text-neutral-900 bg-[#cbddd1] scroll-smooth">
      <Routes>
        <Route index element={<HeroSection />} />        
        <Route path="/learn" element={<LearnMore />} />
        <Route path="/quiz" element={<PMISurvey />} />
      </Routes>
    </main>
  );
}

