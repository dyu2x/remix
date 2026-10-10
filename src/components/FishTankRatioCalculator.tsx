import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Fish,
  Layers,
  Sparkles,
  Info,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Scale,
  Maximize2
} from 'lucide-react';
import { FishTankRatioSettings, DensityRatioStage, SystemMultiplier } from '../types';
import { defaultFishTankRatioSettings } from '../data/initialData';

interface FishTankRatioCalculatorProps {
  config?: FishTankRatioSettings;
}

export const FishTankRatioCalculator: React.FC<FishTankRatioCalculatorProps> = ({ config }) => {
  const currentConfig = config && config.enabled !== false ? config : defaultFishTankRatioSettings;

  // Calculation Input Mode: 'dimensions' | 'presets' | 'volume'
  const [calcMode, setCalcMode] = useState<'dimensions' | 'presets' | 'volume'>('dimensions');

  // Tank Shape: 'rectangular' | 'circular'
  const [tankShape, setTankShape] = useState<'rectangular' | 'circular'>('rectangular');

  // Units: 'meters' | 'feet'
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');

  // Rectangular dimensions
  const [length, setLength] = useState<number>(3.0); // meters
  const [width, setWidth] = useState<number>(2.0);   // meters
  const [waterDepth, setWaterDepth] = useState<number>(0.8); // meters

  // Circular dimensions
  const [diameter, setDiameter] = useState<number>(3.0); // meters

  // Direct volume input
  const [directVolumeLiters, setDirectVolumeLiters] = useState<number>(4800);

  // Selected Fish Stage
  const [selectedStageId, setSelectedStageId] = useState<string>(
    currentConfig.stages[1]?.stage_id || 'fingerling'
  );

  // Selected Culture System
  const [selectedSystemId, setSelectedSystemId] = useState<string>(
    currentConfig.systems[1]?.system_id || 'semi_intensive'
  );

  // Optional target fish count entered by user to check safety
  const [targetFishCount, setTargetFishCount] = useState<string>('');

  // Quick Tank Presets
  const presets = [
    {
      id: 'ibc',
      name: '1,000L IBC Tote Tank',
      volumeLiters: 1000,
      shape: 'rectangular' as const,
      l: 1.0,
      w: 1.0,
      d: 1.0,
      badge: 'Backyard / Nursery'
    },
    {
      id: 'round-10ft',
      name: '10ft Circular Tarpaulin Tank',
      volumeLiters: 7000,
      shape: 'circular' as const,
      dia: 3.0,
      d: 1.0,
      badge: 'Popular Commercial'
    },
    {
      id: 'concrete-med',
      name: 'Standard Concrete Tank (3m × 2m)',
      volumeLiters: 4800,
      shape: 'rectangular' as const,
      l: 3.0,
      w: 2.0,
      d: 0.8,
      badge: 'Mesina Farm Standard'
    },
    {
      id: 'pond-large',
      name: 'Grow-Out Earthen Pond (10m × 5m)',
      volumeLiters: 50000,
      shape: 'rectangular' as const,
      l: 10.0,
      w: 5.0,
      d: 1.0,
      badge: 'Commercial Harvest'
    }
  ];

  // Apply preset
  const handleApplyPreset = (p: typeof presets[0]) => {
    if (p.shape === 'rectangular') {
      setTankShape('rectangular');
      setLength(p.l);
      setWidth(p.w);
      setWaterDepth(p.d);
    } else {
      setTankShape('circular');
      setDiameter(p.dia || 3.0);
      setWaterDepth(p.d);
    }
    setUnit('meters');
    setDirectVolumeLiters(p.volumeLiters);
    setCalcMode('dimensions');
  };

  // Convert feet to meters if unit is feet
  const unitFactor = unit === 'feet' ? 0.3048 : 1.0;

  // Calculate volume in cubic meters (m³) and Liters
  const { volumeM3, volumeLiters, volumeGallons } = useMemo(() => {
    let m3 = 0;
    if (calcMode === 'volume') {
      const lit = Number(directVolumeLiters) || 0;
      m3 = lit / 1000;
    } else if (tankShape === 'rectangular') {
      const effectiveL = (Number(length) || 0) * unitFactor;
      const effectiveW = (Number(width) || 0) * unitFactor;
      const effectiveD = (Number(waterDepth) || 0) * unitFactor;
      m3 = effectiveL * effectiveW * effectiveD;
    } else {
      // Circular tank volume = π * (r²) * h
      const effectiveDia = (Number(diameter) || 0) * unitFactor;
      const radius = effectiveDia / 2;
      const effectiveD = (Number(waterDepth) || 0) * unitFactor;
      m3 = Math.PI * radius * radius * effectiveD;
    }

    const liters = Math.max(0, m3 * 1000);
    const gallons = liters * 0.264172;
    return {
      volumeM3: Math.max(0, m3),
      volumeLiters: Math.round(liters),
      volumeGallons: Math.round(gallons)
    };
  }, [calcMode, tankShape, unit, length, width, waterDepth, diameter, directVolumeLiters, unitFactor]);

  // Current selected stage & system config
  const selectedStage: DensityRatioStage = useMemo(() => {
    return (
      currentConfig.stages.find(s => s.stage_id === selectedStageId) ||
      currentConfig.stages[1] ||
      currentConfig.stages[0]
    );
  }, [currentConfig, selectedStageId]);

  const selectedSystem: SystemMultiplier = useMemo(() => {
    return (
      currentConfig.systems.find(sys => sys.system_id === selectedSystemId) ||
      currentConfig.systems[1] ||
      currentConfig.systems[0]
    );
  }, [currentConfig, selectedSystemId]);

  // Calculations
  const calculations = useMemo(() => {
    const multiplier = selectedSystem.multiplier || 1.0;
    const baseRec = selectedStage.recommended_per_m3;
    const baseMin = selectedStage.min_per_m3;
    const baseMax = selectedStage.max_per_m3;

    // Adjusted density per m³
    const densityRecommended = Math.round(baseRec * multiplier);
    const densityMin = Math.round(baseMin * multiplier);
    const densityMax = Math.round(baseMax * multiplier);

    // Total fish capacity
    const recFish = Math.round(volumeM3 * densityRecommended);
    const minFish = Math.round(volumeM3 * densityMin);
    const maxFish = Math.round(volumeM3 * densityMax);

    // Biomass calculation (kg)
    const avgWeightKg = (selectedStage.avg_weight_grams || 10) / 1000;
    const totalBiomassKg = recFish * avgWeightKg;

    // Daily feed requirement (kg/day)
    const feedPercent = selectedStage.feed_rate_percent || 5.0;
    const dailyFeedKg = (totalBiomassKg * feedPercent) / 100;
    const dailyFeedGrams = Math.round(dailyFeedKg * 1000);

    // Liters per fish
    const litersPerFish = recFish > 0 ? (volumeLiters / recFish).toFixed(1) : '0';

    // Target Fish check
    let targetEvaluation: {
      status: 'safe' | 'warning' | 'danger' | 'idle';
      message: string;
      actualDensity: number;
    } = { status: 'idle', message: '', actualDensity: 0 };

    if (targetFishCount && !isNaN(Number(targetFishCount)) && Number(targetFishCount) > 0) {
      const targetNum = Number(targetFishCount);
      const actualDens = volumeM3 > 0 ? Math.round(targetNum / volumeM3) : 0;
      if (actualDens <= densityRecommended) {
        targetEvaluation = {
          status: 'safe',
          message: 'Safe & Optimal stocking density! Minimal bio-stress and low cannibalism risk.',
          actualDensity: actualDens
        };
      } else if (actualDens <= densityMax) {
        targetEvaluation = {
          status: 'warning',
          message: 'Moderate / High stocking density. Requires strict oxygen monitoring and frequent water flushing.',
          actualDensity: actualDens
        };
      } else {
        targetEvaluation = {
          status: 'danger',
          message: 'Dangerously Overstocked! High risk of ammonia surge, stunted growth, and cannibalism.',
          actualDensity: actualDens
        };
      }
    }

    return {
      densityRecommended,
      densityMin,
      densityMax,
      recFish,
      minFish,
      maxFish,
      totalBiomassKg: totalBiomassKg.toFixed(2),
      dailyFeedKg: dailyFeedKg.toFixed(2),
      dailyFeedGrams,
      litersPerFish,
      targetEvaluation
    };
  }, [volumeM3, volumeLiters, selectedStage, selectedSystem, targetFishCount]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-border/80 shadow-2xl mb-12 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-extrabold uppercase tracking-widest mb-1.5">
            <Scale className="w-4 h-4" />
            <span>{currentConfig.badge || 'Aquaculture Bio-Calculators'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <span>{currentConfig.title || 'Fish-to-Tank Ratio Calculator'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
            {currentConfig.subtitle ||
              'Calculate safe stocking densities, water volume, and daily feeding guidelines for Clarias batrachus catfish.'}
          </p>
        </div>

        {/* Quick Presets Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-2xl border border-border/70 self-start md:self-center">
          <button
            type="button"
            onClick={() => setCalcMode('dimensions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calcMode === 'dimensions'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Custom Dimensions
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('presets')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calcMode === 'presets'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Farm Presets
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('volume')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              calcMode === 'volume'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Direct Liters
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT COLUMN: Inputs & Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Presets Grid (if selected) */}
          {calcMode === 'presets' && (
            <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/70">
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Select a Standard Tank Setup:</span>
                <span className="text-[11px] text-muted-foreground">Click to apply specs</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {presets.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="p-3 rounded-xl border border-border/70 bg-card hover:bg-primary/5 hover:border-primary/50 text-left transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground group-hover:text-primary">
                        {p.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      ~{p.volumeLiters.toLocaleString()} Liters
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dimension Inputs */}
          {calcMode === 'dimensions' && (
            <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">
                    {currentConfig.step1_title || '1. Tank Geometry:'}
                  </span>
                  <div className="flex rounded-xl bg-muted p-1 border border-border/60">
                    <button
                      type="button"
                      onClick={() => setTankShape('rectangular')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        tankShape === 'rectangular'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Rectangular / Pond
                    </button>
                    <button
                      type="button"
                      onClick={() => setTankShape('circular')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        tankShape === 'circular'
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Circular / Round
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground text-[11px]">Units:</span>
                  <button
                    type="button"
                    onClick={() => setUnit(unit === 'meters' ? 'feet' : 'meters')}
                    className="font-bold text-primary hover:underline uppercase text-[11px]"
                  >
                    {unit === 'meters' ? 'Meters (m)' : 'Feet (ft)'}
                  </button>
                </div>
              </div>

              {tankShape === 'rectangular' ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Length ({unit === 'meters' ? 'm' : 'ft'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={length}
                      onChange={e => setLength(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Width ({unit === 'meters' ? 'm' : 'ft'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={width}
                      onChange={e => setWidth(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Water Depth ({unit === 'meters' ? 'm' : 'ft'})
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.2"
                      value={waterDepth}
                      onChange={e => setWaterDepth(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Diameter ({unit === 'meters' ? 'm' : 'ft'})
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={diameter}
                      onChange={e => setDiameter(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">
                      Water Depth ({unit === 'meters' ? 'm' : 'ft'})
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.2"
                      value={waterDepth}
                      onChange={e => setWaterDepth(Math.max(0.1, Number(e.target.value)))}
                      className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground font-bold text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Volume Input */}
          {calcMode === 'volume' && (
            <div className="p-5 rounded-2xl bg-card/60 border border-border/70 space-y-3">
              <label className="text-xs font-bold text-foreground block">
                Enter Total Water Volume:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={directVolumeLiters}
                  onChange={e => setDirectVolumeLiters(Math.max(1, Number(e.target.value)))}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground font-bold text-base"
                />
                <span className="font-extrabold text-xs text-muted-foreground uppercase">
                  Liters
                </span>
              </div>
            </div>
          )}

          {/* Stage Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-primary" /> {currentConfig.step2_title || 'Fish Stage & Target Size:'}
              </span>
              <span className="text-[11px] text-muted-foreground font-normal">
                {selectedStage.size_range} ({selectedStage.avg_weight_grams}g avg)
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {currentConfig.stages.map(st => {
                const isSelected = selectedStageId === st.stage_id;
                return (
                  <button
                    key={st.stage_id}
                    type="button"
                    onClick={() => setSelectedStageId(st.stage_id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                        : 'bg-card/70 hover:bg-muted/70 text-foreground border-border/70'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{st.stage_name}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {st.size_range} • ~{st.avg_weight_grams}g
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Culture System Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> {currentConfig.step3_title || 'Aquaculture System Type:'}
              </span>
              <span className="text-[11px] font-bold text-primary">
                {selectedSystem.multiplier}x Density Factor
              </span>
            </label>

            <div className="space-y-2">
              {currentConfig.systems.map(sys => {
                const isSelected = selectedSystemId === sys.system_id;
                return (
                  <button
                    key={sys.system_id}
                    type="button"
                    onClick={() => setSelectedSystemId(sys.system_id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground ring-1 ring-primary/40'
                        : 'bg-card/60 hover:bg-muted/60 text-foreground border-border/70'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{sys.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {sys.description}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-muted text-foreground shrink-0">
                      {sys.multiplier}x
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Fish Count Check */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">
                Stocking Safety Checker (Optional):
              </label>
              <span className="text-[10px] text-muted-foreground">Test planned capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="e.g. 500"
                value={targetFishCount}
                onChange={e => setTargetFishCount(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-card border border-border text-foreground text-xs font-bold"
              />
              {targetFishCount && (
                <button
                  type="button"
                  onClick={() => setTargetFishCount('')}
                  className="p-2 rounded-xl glass text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {calculations.targetEvaluation.status !== 'idle' && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-scale-in ${
                  calculations.targetEvaluation.status === 'safe'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : calculations.targetEvaluation.status === 'warning'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                }`}
              >
                {calculations.targetEvaluation.status === 'safe' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {calculations.targetEvaluation.actualDensity} fish/m³ — {calculations.targetEvaluation.status.toUpperCase()}
                  </div>
                  <div className="text-[11px] mt-0.5 leading-relaxed">
                    {calculations.targetEvaluation.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results & Bio-Care Specs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Recommended Capacity Box */}
          <div className="glass-card rounded-3xl p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                {currentConfig.results_title || 'Recommended Stocking Range'}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary font-bold">
                {calculations.densityRecommended} fish / m³
              </span>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black hydro-text tracking-tight">
                {calculations.recFish.toLocaleString()}{' '}
                <span className="text-base sm:text-lg font-bold text-muted-foreground">
                  {selectedStage.stage_name}
                </span>
              </div>
              <div className="text-xs text-muted-foreground font-semibold mt-1 flex items-center gap-2">
                <span>Safe Range:</span>
                <b className="text-foreground">
                  {calculations.minFish.toLocaleString()} – {calculations.maxFish.toLocaleString()} fish
                </b>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border/50 text-center">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Water Volume</div>
                <div className="text-base font-extrabold text-foreground mt-0.5">
                  {volumeLiters.toLocaleString()} <span className="text-[10px]">L</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">{volumeM3.toFixed(2)} m³</div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Biomass</div>
                <div className="text-base font-extrabold text-foreground mt-0.5">
                  ~{calculations.totalBiomassKg} <span className="text-[10px]">kg</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">at maturity</div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/40">
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Water / Fish</div>
                <div className="text-base font-extrabold text-emerald-500 mt-0.5">
                  {calculations.litersPerFish} <span className="text-[10px]">L/fish</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">optimal buffer</div>
              </div>
            </div>
          </div>

          {/* Daily Feed & Nutrition Estimation */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" /> Estimated Daily Feed Requirement:
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                {selectedStage.feed_rate_percent}% body weight/day
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {calculations.dailyFeedGrams >= 1000
                  ? `${calculations.dailyFeedKg} kg`
                  : `${calculations.dailyFeedGrams} grams`}
              </span>
              <span className="text-xs text-muted-foreground">
                total floating catfish feed per day (split across 2 to 3 rations)
              </span>
            </div>

            <div className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              Feed early morning (7:00 AM) and dusk (5:30 PM). If fish consume all feed within 15 minutes, increase by 5%. If unconsumed feed remains after 20 minutes, scoop it out immediately to protect water purity.
            </div>
          </div>

          {/* Aeration & Water Quality Requirements */}
          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <Droplets className="w-4 h-4 text-accent" /> System Aeration & Quality Standards:
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Dissolved Oxygen (DO):</span>
                <span className="font-bold text-foreground text-right">{selectedSystem.aeration_req}</span>
              </div>
              <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Recommended Water Depth:</span>
                <span className="font-bold text-foreground">
                  {currentConfig.water_depth_min_cm || 50} cm – {currentConfig.water_depth_max_cm || 120} cm
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-muted/40">
                <span className="text-muted-foreground">Water Flushing Frequency:</span>
                <span className="font-bold text-foreground">
                  {selectedSystem.system_id === 'ras_biofloc'
                    ? '10% weekly top-up'
                    : selectedSystem.system_id === 'semi_intensive'
                    ? '30% – 50% every 3–4 days'
                    : '25% weekly or rainfall refresh'}
                </span>
              </div>
            </div>
          </div>

          {/* Hatchery Bio-Care Guidance Notes */}
          {currentConfig.guidance_notes && (
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <b className="text-foreground">{currentConfig.guidance_title || 'Mesina Farms Hatchery Protocol:'} </b>
                {currentConfig.guidance_notes}
              </div>
            </div>
          )}

          {/* Optional Disclaimer / Advisory Text */}
          {currentConfig.disclaimer_text && (
            <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
              <b className="text-foreground font-semibold">Advisory: </b>
              {currentConfig.disclaimer_text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
