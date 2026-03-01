import { useRef, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const coreCS = [
    { name: "Data Structures & Algorithms", level: 95 },
    { name: "Object-Oriented Programming (OOP)", level: 90 },
    { name: "Operating Systems", level: 85 },
    { name: "Database Management Systems", level: 85 },
    { name: "System Design", level: 80 }
]

const tools = [
    { name: "Python", icon: "🐍" },
    { name: "PyTorch", icon: "🔥" },
    { name: "LangChain & LangGraph", icon: "🦜" },
    { name: "React & Three.js", icon: "⚛️" },
    { name: "Docker & AWS", icon: "🐳" },
    { name: "Unsloth & QLoRA", icon: "🦥" }
]

function ProgressBar({ level }) {
    return (
        <div className="w-full h-1 bg-electric-purple/20 rounded-full overflow-hidden mt-2">
            <div
                className="h-full bg-gradient-to-r from-electric-purple to-cyber-lime"
                style={{ width: `${level}%`, transition: 'width 1s ease-out' }}
            />
        </div>
    )
}

export default function Projects() {
    const [headerRef, headerVisible] = useScrollReveal()
    const [csRef, csVisible] = useScrollReveal()
    const [toolsRef, toolsVisible] = useScrollReveal()

    return (
        <section className="section" id="projects" style={{ overflow: 'auto' }}>
            <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', maxHeight: '85vh', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex flex-col justify-center">
                    <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
                        <div className="section-label text-electric-purple tracking-[0.3em]">// feed-forward-network</div>
                        <h2 className="section-title mb-12">
                            Technical <span className="text-cyber-lime">Core</span>
                        </h2>
                        <p className="text-gray mb-8 leading-relaxed">
                            The hidden layers of my architecture. A dense mesh of theoretical computer science foundations and cutting-edge AI engineering tools.
                        </p>
                    </div>

                    <div ref={csRef} className={`reveal delay-2 ${csVisible ? 'visible' : ''} glass p-8 border-electric-purple/30 mb-8`}>
                        <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-electric-purple">{'<'}</span>
                            Core Computer Science
                            <span className="text-electric-purple">{'>'}</span>
                        </h3>
                        <div className="space-y-4">
                            {coreCS.map((cs, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between text-sm font-mono text-gray">
                                        <span>{cs.name}</span>
                                    </div>
                                    <ProgressBar level={cs.level} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center">
                    <div ref={toolsRef} className={`reveal delay-4 ${toolsVisible ? 'visible' : ''} glass p-8 border-cyber-lime/30 h-full`}>
                        <h3 className="text-xl font-heading font-bold text-white mb-8 flex items-center gap-3">
                            <span className="text-cyber-lime">{'['}</span>
                            Frameworks & Tools
                            <span className="text-cyber-lime">{']'}</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {tools.map((tool, idx) => (
                                <div key={idx} className="glass p-4 border-electric-purple/20 flex flex-col items-center justify-center text-center hover:border-cyber-lime/50 hover:bg-cyber-lime/5 transition-colors group cursor-pointer h-32">
                                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
                                    <div className="font-mono text-xs text-gray group-hover:text-white transition-colors">{tool.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
