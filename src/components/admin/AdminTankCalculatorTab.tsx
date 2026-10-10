import React, { useState } from 'react';
import {
  Scale,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Fish,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { SiteSettings, FishTankRatioSettings, DensityRatioStage, SystemMultiplier } from '../../types';
import { defaultFishTankRatioSettings } from '../../data/initialData';

interface AdminTankCalculatorTabProps {
  settings: SiteSettings;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const AdminTankCalculatorTab: React.FC<AdminTankCalculatorTabProps> = ({
  settings,
  onUpdateSettings
}) => {
  const initialConfig: FishTankRatioSettings =
    settings.tank_calculator && settings.tank_calculator.stages
      ? settings.tank_calculator
      : defaultFishTankRatioSettings;

  const [form, setForm] = useState<FishTankRatioSettings>(initialConfig);
  const [toast, setToast] = useState<string>('');

  // Sandbox simulation variables
  const [testVolumeM3, setTestVolumeM3] = useState<number>(4.8); // 4,800 Liters
  const [testStageId, setTestStageId] = useState<string>('fingerling');
  const [testSystemId, setTestSystemId] = useState<string>('semi_intensive');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleStageChange = (
    index: number,
    field: keyof DensityRatioStage,
    value: string | number
  ) => {
    const updatedStages = [...form.stages];
    updatedStages[index] = {
      ...updatedStages[index],
      [field]: typeof value === 'string' && !isNaN(Number(value)) && field !== 'stage_name' && field !== 'size_range' && field !== 'stage_id'
        ? Number(value)
        : value
    };
    setForm({ ...form, stages: updatedStages });
  };

  const handleSystemChange = (
    index: number,
    field: keyof SystemMultiplier,
    value: string | number
  ) => {
    const updatedSystems = [...form.systems];
    updatedSystems[index] = {
      ...updatedSystems[index],
      [field]: field === 'multiplier' ? Number(value) : value
    };
    setForm({ ...form, systems: updatedSystems });
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all tank ratio density calculations to Mesina Farms empirical hatchery standards?')) {
      setForm(defaultFishTankRatioSettings);
      showToast('Reset to default bio-precision parameters');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...settings,
      tank_calculator: form
    };
    onUpdateSettings(updated);
    showToast('Fish-to-Tank ratio parameters saved successfully!');
  };

  // Sandbox calculation
  const currentStage = form.stages.find(s => s.stage_id === testStageId) || form.stages[1];
  const currentSystem = form.systems.find(sys => sys.system_id === testSystemId) || form.systems[1];
  const testMultiplier = currentSystem.multiplier || 1.0;
  const testRecommendedFish = Math.round(testVolumeM3 * currentStage.recommended_per_m3 * testMultiplier);
  const testMinFish = Math.round(testVolumeM3 * currentStage.min_per_m3 * testMultiplier);
  const testMaxFish = Math.round(testVolumeM3 * currentStage.max_per_m3 * testMultiplier);
  const testBiomassKg = ((testRecommendedFish * (currentStage.avg_weight_grams || 6)) / 1000).toFixed(1);
  const testDailyFeedKg = (((Number(testBiomassKg) * (currentStage.feed_rate_percent || 5)) / 100)).toFixed(2);

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-scale-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" /> Fish-to-Tank Ratio Accuracy Calibrator
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calibrate catfish stocking densities (fish/m³), system multipliers, and daily feed percentages displayed on the public Fish Care guide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="py-2.5 px-4 rounded-xl glass text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-all"
            title="Reset to default standards"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Calculator Enable / Disable Toggle & Guide Headers */}
      <div className="glass-card rounded-3xl p-6 border border-border/70 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-foreground">Calculator Visibility</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  form.enabled !== false
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {form.enabled !== false ? '● Visible on Fish Care Page' : '○ Hidden from Visitors'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggles whether the interactive ratio calculator is displayed on the public Fish Care & Guides page.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.enabled !== false}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
          </label>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Top Badge Label</label>
            <input
              type="text"
              value={form.badge || ''}
              onChange={e => setForm({ ...form, badge: e.target.value })}
              placeholder="e.g. Aquaculture Bio-Calculators"
              className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-muted-foreground block mb-1">Guide Main Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground block mb-1">Subtitle / Bio-Badge Description</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={e => setForm({ ...form, subtitle: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
          />
        </div>
      </div>

      {/* SECTION 1: Interactive Labels & Section Headings */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 space-y-5">
        <div>
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" /> Calculator Section Headings & Interactive Labels
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Customize the step-by-step labels, section titles, and results headers displayed on the public calculator.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Step 1 Title (Dimensions)
            </label>
            <input
              type="text"
              value={form.step1_title || ''}
              onChange={e => setForm({ ...form, step1_title: e.target.value })}
              placeholder="e.g. 1. Tank Geometry & Volume"
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Step 2 Title (Growth Stage)
            </label>
            <input
              type="text"
              value={form.step2_title || ''}
              onChange={e => setForm({ ...form, step2_title: e.target.value })}
              placeholder="e.g. 2. Catfish Growth Stage"
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Step 3 Title (System / Tech)
            </label>
            <input
              type="text"
              value={form.step3_title || ''}
              onChange={e => setForm({ ...form, step3_title: e.target.value })}
              placeholder="e.g. 3. Culture Technology"
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-primary block mb-1">
              Results Card Heading
            </label>
            <input
              type="text"
              value={form.results_title || ''}
              onChange={e => setForm({ ...form, results_title: e.target.value })}
              placeholder="e.g. Recommended Stocking Range"
              className="w-full px-3 py-2 rounded-xl bg-muted border border-primary/50 text-foreground text-xs font-bold"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: Stocking Densities per Stage (fish / m³) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Fish className="w-4 h-4 text-primary" /> Stage Stocking Densities (Base: Semi-Intensive Concrete Tank)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify the recommended, minimum, and maximum fish per cubic meter (1 m³ = 1,000 Liters) for each biological growth stage.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {form.stages.map((st, idx) => (
            <div
              key={st.stage_id}
              className="p-5 rounded-2xl bg-card border border-border/70 space-y-4 hover:border-primary/40 transition-all shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={st.stage_name}
                      onChange={e => handleStageChange(idx, 'stage_name', e.target.value)}
                      className="font-bold text-sm text-foreground bg-transparent border-b border-dashed border-border focus:border-primary outline-none px-1"
                    />
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Stage Key: <code className="text-primary font-mono">{st.stage_id}</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-semibold">Size Range:</span>
                  <input
                    type="text"
                    value={st.size_range}
                    onChange={e => handleStageChange(idx, 'size_range', e.target.value)}
                    placeholder="e.g. 2.0 - 3.5 in"
                    className="w-32 px-2.5 py-1 rounded-lg bg-muted border border-border text-foreground text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Avg Weight (g)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={st.avg_weight_grams}
                    onChange={e => handleStageChange(idx, 'avg_weight_grams', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                    Recommended (fish/m³)
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    value={st.recommended_per_m3}
                    onChange={e => handleStageChange(idx, 'recommended_per_m3', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-muted border border-emerald-500/50 text-foreground font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Minimum (fish/m³)
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    value={st.min_per_m3}
                    onChange={e => handleStageChange(idx, 'min_per_m3', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground block mb-1">
                    Maximum (fish/m³)
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="1"
                    value={st.max_per_m3}
                    onChange={e => handleStageChange(idx, 'max_per_m3', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground font-mono font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-primary block mb-1">
                    Feed Rate (% BW/day)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="25"
                    value={st.feed_rate_percent}
                    onChange={e => handleStageChange(idx, 'feed_rate_percent', Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground font-mono font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Culture System Multipliers */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 space-y-6">
        <div>
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Culture System Multipliers
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scales base stocking densities depending on the farm setup's aeration and filtration capability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {form.systems.map((sys, idx) => (
            <div
              key={sys.system_id}
              className="p-5 rounded-2xl bg-card border border-border/70 space-y-3 relative shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">{sys.name}</span>
                <span className="text-[11px] font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                  {sys.multiplier}x
                </span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Multiplier Factor
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="4.0"
                  value={sys.multiplier}
                  onChange={e => handleSystemChange(idx, 'multiplier', Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground font-bold font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Aeration Specification
                </label>
                <input
                  type="text"
                  value={sys.aeration_req}
                  onChange={e => handleSystemChange(idx, 'aeration_req', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={sys.description}
                  onChange={e => handleSystemChange(idx, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-muted border border-border text-foreground text-xs leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Water Depth & Hatchery Bio-Protocol Notes */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/70 space-y-4">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
          <Droplets className="w-4 h-4 text-accent" /> Recommended Water Depth & Hatchery Protocol
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Minimum Water Depth (cm)
            </label>
            <input
              type="number"
              step="5"
              min="20"
              max="200"
              value={form.water_depth_min_cm}
              onChange={e => setForm({ ...form, water_depth_min_cm: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">
              Maximum Water Depth (cm)
            </label>
            <input
              type="number"
              step="5"
              min="30"
              max="300"
              value={form.water_depth_max_cm}
              onChange={e => setForm({ ...form, water_depth_max_cm: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-sm font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground block mb-1">
            Guidance Section Title
          </label>
          <input
            type="text"
            value={form.guidance_title || ''}
            onChange={e => setForm({ ...form, guidance_title: e.target.value })}
            placeholder="e.g. Mesina Farms Bio-Precision Aquaculture Principles"
            className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-bold"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground block mb-1">
            Hatchery Protocol Advice Note (Shown to farmers)
          </label>
          <textarea
            rows={3}
            value={form.guidance_notes || ''}
            onChange={e => setForm({ ...form, guidance_notes: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs leading-relaxed"
            placeholder="Advice notes for stocking, grading, and water change..."
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground block mb-1">
            Farming Advisory / Disclaimer Note
          </label>
          <input
            type="text"
            value={form.disclaimer_text || ''}
            onChange={e => setForm({ ...form, disclaimer_text: e.target.value })}
            placeholder="e.g. Estimations are based on empirical Clarias batrachus standards under standard water temperature."
            className="w-full px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground text-xs"
          />
        </div>
      </div>

      {/* SECTION 4: Live Accuracy Sandbox & Test Verifier */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card to-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Interactive Accuracy Sandbox
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded-full bg-primary/20">
            Real-Time Calculation Test
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Test your parameters on a live simulation before saving to ensure accuracy:
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-muted-foreground block mb-1">Test Water Volume (m³)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={testVolumeM3}
              onChange={e => setTestVolumeM3(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-xs"
            />
            <span className="text-[10px] text-muted-foreground mt-0.5 block font-mono">
              = {(testVolumeM3 * 1000).toLocaleString()} Liters
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground block mb-1">Test Fish Stage</label>
            <select
              value={testStageId}
              onChange={e => setTestStageId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-xs"
            >
              {form.stages.map(s => (
                <option key={s.stage_id} value={s.stage_id}>
                  {s.stage_name} ({s.size_range})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-muted-foreground block mb-1">Test Culture System</label>
            <select
              value={testSystemId}
              onChange={e => setTestSystemId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-xs"
            >
              {form.systems.map(sys => (
                <option key={sys.system_id} value={sys.system_id}>
                  {sys.name} ({sys.multiplier}x)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Computed Result Preview in Sandbox */}
        <div className="p-4 rounded-2xl bg-card border border-border/60 grid sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Computed Density</div>
            <div className="text-lg font-black text-primary mt-0.5">
              {Math.round(currentStage.recommended_per_m3 * testMultiplier)} <span className="text-xs">fish/m³</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Recommended Fish</div>
            <div className="text-lg font-black text-foreground mt-0.5">
              {testRecommendedFish.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Safe Min – Max</div>
            <div className="text-sm font-bold text-muted-foreground mt-1">
              {testMinFish.toLocaleString()} – {testMaxFish.toLocaleString()}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Daily Feed Req</div>
            <div className="text-lg font-black text-emerald-500 mt-0.5">
              {testDailyFeedKg} <span className="text-xs">kg/day</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
