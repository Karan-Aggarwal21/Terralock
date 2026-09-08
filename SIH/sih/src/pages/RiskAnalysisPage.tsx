import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context';
import { ProbabilityGauge } from '../components/common/ProbabilityGauge';
import { RiskBadge } from '../components/common/RiskBadge';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ShieldAlert, FileText, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { getRiskConfig } from '../constants/risk';

export const RiskAnalysisPage: React.FC = () => {
  const { selectedProject, isLoading, error, refreshProjects } = useProject();

  if (isLoading && !selectedProject) {
    return <LoadingState fullHeight message="Computing probability model vector..." />;
  }

  if (error && !selectedProject) {
    return (
      <ErrorState
        title="Risk Analysis Telemetry Offline"
        message={error}
        onRetry={refreshProjects}
        fullHeight
      />
    );
  }

  if (!selectedProject) {
    return (
      <EmptyState
        title="No Project Selected"
        message="Please select a project to inspect its delay probability and risk attribution breakdown."
        fullHeight
      />
    );
  }

  const riskConfig = getRiskConfig(selectedProject.risk_level);
  const sortedFactors = [...selectedProject.risk_factors].sort((a, b) => b.importance - a.importance);

  return (
    <div className="space-y-7">
      {/* 1. Project Context & Jurisdiction Banner */}
      <section aria-label="Project Context" className="bg-white border border-[#E5E9E6] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-sm sm:text-[15px] font-bold tracking-wider text-[#527568] uppercase font-sans">
                STATUTORY RISK ANALYSIS & DELAY ASSESSMENT
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#FAFBF9] border border-[#E5E9E6] text-[#374151]">
                {selectedProject.project_id}
              </span>
              <RiskBadge level={selectedProject.risk_level} size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#101827] tracking-tight leading-tight font-sans">
              {selectedProject.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4B5563] pt-1.5 font-sans">
              <span>Corridor: <strong className="text-[#101827] font-semibold">{selectedProject.corridor_name || 'Primary Corridor Section'}</strong></span>
              <span>•</span>
              <span>Jurisdiction: <strong className="text-[#101827] font-semibold">{selectedProject.state || 'National'}</strong></span>
              <span>•</span>
              <span>Acquisition Status: <strong className="text-[#2D7A4F] bg-[#edf7f1] border border-[#c6e6d2] px-2.5 py-0.5 rounded font-semibold">{selectedProject.status || 'In Acquisition'}</strong></span>
              <span>•</span>
              <span>Land Required: <strong className="text-[#101827] font-semibold">{selectedProject.land_required_ha} Ha</strong></span>
              <span>•</span>
              <span>Budget: <strong className="text-[#101827] font-semibold">₹{selectedProject.total_budget_cr} Cr</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              to="/predictions/delay-days"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F4F6] text-xs sm:text-sm font-semibold text-[#527568] border border-[#E5E9E6] transition-colors cursor-pointer"
            >
              <span>Delay Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/gis-map"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D7A4F] hover:bg-[#22633f] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>Cadastral GIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Primary Decision-Making Section: Gauge + Executive Risk Narrative */}
      <section aria-label="Risk Likelihood & Narrative" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prominent Probability Score & Gauge */}
        <div className="bg-white border border-[#E5E9E6] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col items-center justify-between text-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#4B5563] font-sans">
              Delay Probability
            </span>
            <RiskBadge level={selectedProject.risk_level} size="sm" />
          </div>

          <ProbabilityGauge
            probability={selectedProject.delay_probability}
            size={230}
            label="LIKELIHOOD OF DELAY"
            className="my-3"
          />

          <div className="w-full mt-4 pt-4 border-t border-[#E5E9E6] text-left text-sm text-[#4B5563] space-y-2.5 font-sans">
            <div className="flex justify-between items-center">
              <span className="font-medium">Risk Classification:</span>
              <span className="font-bold px-2.5 py-0.5 rounded text-xs" style={{ color: riskConfig.colorHex, backgroundColor: riskConfig.bgHex }}>
                {selectedProject.risk_level} RISK
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Primary Factor:</span>
              <span className="text-[#101827] font-semibold truncate max-w-[60%] text-right">
                {selectedProject.delay_reason}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Standard Threshold:</span>
              <span className="text-[#101827] font-semibold">
                {(riskConfig.min * 100).toFixed(0)}% – {(riskConfig.max * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Executive Narrative & Key Decision Criteria */}
        <div className="lg:col-span-2 bg-white border border-[#E5E9E6] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-[#E5E9E6]">
              <div className="p-1.5 rounded-lg bg-[#edf7f1] border border-[#c6e6d2] text-[#2D7A4F]">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm sm:text-[15px] font-bold tracking-tight text-[#101827] font-sans">
                Executive Risk Narrative & Decision Guidance
              </h3>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#FAFBF9] border border-[#E5E9E6] mb-5">
              <p className="text-sm sm:text-[15px] leading-relaxed text-[#374151] font-sans">
                {selectedProject.risk_explanation ||
                  `Project ${selectedProject.name} currently exhibits a ${selectedProject.risk_level} delay probability of ${(selectedProject.delay_probability * 100).toFixed(1)}%. Primary exposure is concentrated in ${selectedProject.delay_reason}, requiring targeted inter-agency administrative coordination to avoid schedule drift beyond ${selectedProject.predicted_delay_days} days.`}
              </p>
            </div>

            {/* Core Decision Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl border border-[#E5E9E6] bg-[#FAFBF9] text-sm">
                <span className="text-xs text-[#6B7280] uppercase block font-bold font-sans">Expected Schedule Drift</span>
                <span className="text-xl font-extrabold text-[#101827] block mt-1 font-sans">
                  {selectedProject.predicted_delay_days} Days
                </span>
                <span className="text-xs text-[#6B7280] mt-1 block font-sans">
                  Window: <strong className="text-[#101827]">{selectedProject.predicted_delay_range.min}–{selectedProject.predicted_delay_range.max} days</strong>
                </span>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E9E6] bg-[#FAFBF9] text-sm">
                <span className="text-xs text-[#6B7280] uppercase block font-bold font-sans">Administrative Priority</span>
                <span className="text-xl font-extrabold block mt-1 font-sans" style={{ color: riskConfig.colorHex }}>
                  {selectedProject.risk_level === 'CRITICAL' ? 'Immediate Action' : selectedProject.risk_level === 'HIGH' ? 'High Oversight' : selectedProject.risk_level === 'MODERATE' ? 'Proactive Monitor' : 'Standard Routine'}
                </span>
                <span className="text-xs text-[#6B7280] mt-1 block font-sans">
                  District Monitoring Standard
                </span>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E9E6] bg-[#FAFBF9] text-sm">
                <span className="text-xs text-[#6B7280] uppercase block font-bold font-sans">Assessment Confidence</span>
                <span className="text-xl font-extrabold text-[#2D7A4F] block mt-1 font-sans">
                  {(selectedProject.delay_reason_confidence * 100).toFixed(0)}% Certainty
                </span>
                <span className="text-xs text-[#6B7280] mt-1 block font-sans">
                  Multi-registry alignment
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E9E6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#4B5563] font-sans">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2D7A4F]" />
              <span className="font-semibold text-[#101827]">Assessment Telemetry: Synchronized</span>
            </span>
            <Link
              to="/explainability"
              className="text-[#2D7A4F] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Inspect Detailed Factor Attributions (F3)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Contributing Risk Factors Breakdown */}
      <section aria-label="Risk Factors Breakdown" className="bg-white border border-[#E5E9E6] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-4 border-b border-[#E5E9E6]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#101827] font-sans">
              Contributing Risk Factors &amp; Relative Impact Breakdown
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 font-sans">
              Core administrative and operational drivers influencing the {(selectedProject.delay_probability * 100).toFixed(1)}% delay probability
            </p>
          </div>

          <span className="text-xs sm:text-sm text-[#101827] bg-[#edf7f1] border border-[#c6e6d2] px-3 py-1 rounded-lg self-start sm:self-auto font-bold font-sans">
            {sortedFactors.length} Identified Drivers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedFactors.map((factor, idx) => {
            const percent = (factor.importance * 100).toFixed(1);
            const isPrimary = idx === 0;

            return (
              <div
                key={factor.name}
                className={`p-4 rounded-xl border transition-all ${isPrimary
                    ? 'border-[#2D7A4F]/50 bg-[#edf7f1]/60'
                    : 'border-[#E5E9E6] bg-[#FAFBF9]'
                  }`}
              >
                <div className="flex items-center justify-between text-sm mb-2 font-sans">
                  <span className="font-bold text-[#101827] flex items-center gap-2 text-sm sm:text-[15px]">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${isPrimary ? 'bg-[#2D7A4F] text-white' : 'bg-[#E5E9E6] text-[#374151]'
                      }`}>
                      #{idx + 1}
                    </span>
                    {factor.name}
                  </span>
                  <span className="font-bold text-sm sm:text-[15px]" style={{ color: isPrimary ? riskConfig.colorHex : '#101827' }}>
                    {percent}% Relative Share
                  </span>
                </div>

                <div className="w-full bg-[#E5E9E6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: isPrimary ? riskConfig.colorHex : '#2D7A4F',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Underlying Operational & Statutory Indicators Matrix */}
      {selectedProject.risk_input_metrics && selectedProject.risk_input_metrics.length > 0 && (
        <section aria-label="Statutory Parameters" className="bg-white border border-[#E5E9E6] rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="mb-5 pb-4 border-b border-[#E5E9E6]">
            <h3 className="text-sm sm:text-base font-bold text-[#101827] font-sans">
              Statutory &amp; Operational Parameter Inputs
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 font-sans">
              Empirical registry indicators feeding the delay probability assessment across administrative, judicial, and cadastral dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProject.risk_input_metrics.map((metric) => {
              const isSevere = metric.impactLevel === 'severe';
              const isModerate = metric.impactLevel === 'moderate';

              return (
                <div
                  key={metric.metric}
                  className="p-4 rounded-xl border border-[#E5E9E6] bg-[#FAFBF9] text-sm space-y-2 font-sans"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#6B7280] uppercase font-bold">{metric.category}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${isSevere
                          ? 'bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]'
                          : isModerate
                            ? 'bg-[#fef9ee] text-[#b45309] border border-[#fde68a]'
                            : 'bg-[#edf7f1] text-[#2D7A4F] border border-[#c6e6d2]'
                        }`}
                    >
                      {isSevere ? (
                        <ShieldAlert className="w-3.5 h-3.5" />
                      ) : isModerate ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{metric.impactLevel}</span>
                    </span>
                  </div>

                  <span className="font-bold text-[#101827] block text-sm sm:text-[15px]">
                    {metric.metric}
                  </span>

                  <div className="text-xs sm:text-sm font-semibold text-[#2D7A4F]">
                    Recorded Status: {metric.value}
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed">
                    {metric.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
