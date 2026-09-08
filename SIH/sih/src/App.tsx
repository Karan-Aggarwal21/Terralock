import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './context';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { SimulationPage } from './pages/SimulationPage';
import { DelayDaysPage } from './pages/DelayDaysPage';
import { DelayReasonPage } from './pages/DelayReasonPage';
import { GisMapPage } from './pages/GisMapPage';
import { ExplainabilityPage } from './pages/ExplainabilityPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Hero Page matching UI Design */}
          <Route path="/" element={<LandingPage />} />

          {/* Operational Application Views */}
          <Route element={<AppLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="risk-analysis" element={<RiskAnalysisPage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="predictions">
              <Route path="delay-days" element={<DelayDaysPage />} />
              <Route path="delay-reason" element={<DelayReasonPage />} />
            </Route>
            <Route path="gis-map" element={<GisMapPage />} />
            <Route path="explainability" element={<ExplainabilityPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProjectProvider>
  );
};

export default App;
