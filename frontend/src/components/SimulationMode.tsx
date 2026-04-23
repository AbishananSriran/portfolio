import { CornerDownLeft, Atom } from 'lucide-react';

export default function SimulationMode({ simulationMode, setSimulationMode }) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400 blur-lg opacity-70 animate-pulse pointer-events-none" />

            <button
                onClick={() => {
                    setSimulationMode((prev: boolean) => !prev)
                }}
                className="bg-white text-black px-4 py-2 rounded-full shadow-xl hover:scale-110 transition-transform duration-200"
            >
                {simulationMode ? (
                    <CornerDownLeft className="w-5 h-5" />
                ) : (
                    <Atom className="w-5 h-5 animate-spin [animation-duration:8s]" />
                )}
            </button>
        </div>
      </div>
    )
}