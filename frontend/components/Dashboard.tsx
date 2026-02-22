"use client";

import { useState, useEffect } from "react";
import { fetchLatestData, SensorData } from "@/lib/api";
import ECGGraph from "./ECGGraph";
import { Thermometer, Heart, Wind, AlertTriangle, Activity } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function Dashboard() {
    const [data, setData] = useState<SensorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await fetchLatestData();
                setData(result);
                setError(null);
            } catch (err) {
                setError("Failed to connect to backend API");
            } finally {
                setLoading(false);
            }
        };

        loadData(); // Initial load
        const interval = setInterval(loadData, 1000); // Poll every second

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin text-primary">
                    <Activity size={48} />
                </div>
            </div>
        );
    }

    const isTempCritical = data && data.temperature_f > 100;
    const isBpmCritical = data && data.pulse_bpm > 120;
    const isAirCritical = data && data.air_quality_ppm > 600;
    const isAirWarning = data && data.air_quality_ppm > 300 && data.air_quality_ppm <= 600;

    const hasAlerts = isTempCritical || isBpmCritical || isAirCritical;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Vitals Dashboard</h1>
                    <p className="text-slate-400 mt-1">Real-time IoT Patient Monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                    {error ? (
                        <span className="flex items-center text-danger text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-danger animate-pulse mr-2"></span>
                            Disconnected
                        </span>
                    ) : (
                        <span className="flex items-center text-success text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-2"></span>
                            Live (1Hz)
                        </span>
                    )}
                </div>
            </div>

            {hasAlerts && (
                <div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                    <AlertTriangle className="text-danger flex-shrink-0" size={24} />
                    <div className="flex-1">
                        <h3 className="font-semibold text-danger">Critical Alerts Detected</h3>
                        <ul className="list-disc list-inside text-sm mt-1">
                            {isTempCritical && <li>High Body Temperature ({data.temperature_f.toFixed(1)}°F)</li>}
                            {isBpmCritical && <li>Tachycardia Detected ({data.pulse_bpm} BPM)</li>}
                            {isAirCritical && <li>Dangerous Air Quality ({data.air_quality_ppm.toFixed(1)} PPM)</li>}
                        </ul>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-warning/20 border border-warning/50 text-warning p-4 rounded-xl flex items-center gap-4">
                    <AlertTriangle size={24} />
                    <p>{error}</p>
                </div>
            )}

            {!data && !error && (
                <div className="text-center text-slate-400 py-12">No data available</div>
            )}

            {data && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {}
                    <div className={cn(
                        "glass-card p-6 relative overflow-hidden transition-all duration-300",
                        isTempCritical ? "border-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : ""
                    )}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Thermometer className={isTempCritical ? "text-danger" : "text-primary"} size={24} />
                            </div>
                            <span className={cn(
                                "px-2.5 py-1 text-xs font-semibold rounded-full",
                                isTempCritical ? "bg-danger/20 text-danger" : "bg-primary/20 text-primary"
                            )}>
                                {isTempCritical ? "ALERT" : "NORMAL"}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Body Temperature</p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className={cn(
                                    "text-4xl font-bold tracking-tight",
                                    isTempCritical ? "text-danger" : "text-white"
                                )}>
                                    {data.temperature_f.toFixed(1)}
                                </span>
                                <span className="text-lg text-slate-400">°F</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className={cn(
                        "glass-card p-6 relative overflow-hidden transition-all duration-300",
                        isBpmCritical ? "border-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : ""
                    )}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Heart className={cn(
                                    isBpmCritical ? "text-danger" : "text-success",
                                    "animate-pulse" // Simple heartbeat animation
                                )} size={24} />
                            </div>
                            <span className={cn(
                                "px-2.5 py-1 text-xs font-semibold rounded-full",
                                isBpmCritical ? "bg-danger/20 text-danger" : "bg-success/20 text-success"
                            )}>
                                {isBpmCritical ? "ALERT" : "NORMAL"}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Heart Rate</p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className={cn(
                                    "text-4xl font-bold tracking-tight",
                                    isBpmCritical ? "text-danger" : "text-white"
                                )}>
                                    {data.pulse_bpm}
                                </span>
                                <span className="text-lg text-slate-400">BPM</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className={cn(
                        "glass-card p-6 relative overflow-hidden transition-all duration-300",
                        isAirCritical ? "border-danger/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                            isAirWarning ? "border-warning/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : ""
                    )}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Wind className={
                                    isAirCritical ? "text-danger" :
                                        isAirWarning ? "text-warning" : "text-primary"
                                } size={24} />
                            </div>
                            <span className={cn(
                                "px-2.5 py-1 text-xs font-semibold rounded-full",
                                isAirCritical ? "bg-danger/20 text-danger" :
                                    isAirWarning ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                            )}>
                                {isAirCritical ? "POOR" : isAirWarning ? "FAIR" : "GOOD"}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Air Quality</p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className={cn(
                                    "text-4xl font-bold tracking-tight",
                                    isAirCritical ? "text-danger" :
                                        isAirWarning ? "text-warning" : "text-white"
                                )}>
                                    {data.air_quality_ppm.toFixed(0)}
                                </span>
                                <span className="text-lg text-slate-400">PPM</span>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="glass-card p-6 md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-success/10 rounded-lg">
                                    <Activity className="text-success" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Live ECG Waveform</h3>
                                    <p className="text-xs text-slate-400">Real-time analog signal (AD8232)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <ECGGraph data={data.ecg_wave} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
