import { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const terminalLines = [
    { text: '$ unsloth finetune --model llama-3.1-8b --data legal_19k.jsonl', type: 'command' },
    { text: '[INFO] Loading base model: meta-llama/Llama-3.1-8B...', type: 'info' },
    { text: '[INFO] QLoRA config: r=64, alpha=16, dropout=0.05', type: 'info' },
    { text: '[GPU] NVIDIA A100-80GB detected │ VRAM: 79.2 GB', type: 'success' },
    { text: 'Epoch 1/3 ██████████░░░░░░░░░░░░ 33% │ Loss: 0.284', type: 'info' },
    { text: 'Epoch 2/3 ██████████████░░░░░░░░ 67% │ Loss: 0.098', type: 'info' },
    { text: 'Epoch 3/3 ██████████████████████ 100% │ Loss: 0.042', type: 'success' },
    { text: '[EVAL] BNS Benchmark: 94.2% │ Outperforms GPT-4o ✓', type: 'success' },
    { text: '[EXPORT] Quantizing to GGUF Q4_K_M... Done ✓', type: 'success' },
    { text: '$ model.push_to_hub("vaquill-legal-v4")', type: 'command' },
]

function TerminalWindow() {
    const [visibleLines, setVisibleLines] = useState(0)
    const ref = useRef(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        const interval = setInterval(() => {
            setVisibleLines((prev) => {
                if (prev >= terminalLines.length) {
                    clearInterval(interval)
                    return prev
                }
                return prev + 1
            })
        }, 600)
        return () => clearInterval(interval)
    }, [started])

    return (
        <div className="terminal-window" ref={ref}>
            <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="terminal-title">llama-finetune — A100 GPU</span>
            </div>
            <div className="terminal-body">
                {terminalLines.slice(0, visibleLines).map((line, i) => (
                    <div
                        key={i}
                        className="terminal-line"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        <span className={line.type === 'command' ? 'prompt' : line.type === 'success' ? 'success' : 'value'}>
                            {line.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const experiences = [
    {
        role: 'AI Engineer Intern',
        company: 'Vaquill AI',
        date: 'Dec 2025 — Present',
        points: [
            { text: 'High-Scale RAG: Engineered a legal retrieval system managing', metric: '19M+ documents' },
            { text: 'Deep Reasoning Tier: Developed "Deep Search" via multi-hop retrieval, achieving', metric: '91% Recall@10' },
            { text: 'Synthetic Data Engineering: Architected pipeline using DeepSeek APIs to generate', metric: '19K+ reasoning pairs' },
            { text: 'LLM Fine-Tuning: Fine-tuned Llama 3.1 8B via Unsloth/QLoRA on A100 GPUs — outperformed', metric: 'GPT-4o & o3-mini' },
            { text: 'Reliability: Built a critique layer (CRAG) with self-reflection loops, enforcing strict grounding to eliminate hallucinations', metric: null },
        ],
        showTerminal: true,
    },
    {
        role: 'Summer Research Intern',
        company: 'IDEAS-TIH (ISI Kolkata)',
        date: 'May 2025 — Jul 2025',
        points: [
            { text: 'Dukaan Sahaayak: Developed a smart inventory system using LangGraph-powered AI agents for automated billing', metric: null },
            { text: 'Process Optimization: Integrated Gemini OCR for handwritten extraction, reducing manual billing work by', metric: '70%' },
            { text: 'Local Inference: Deployed Ollama LLMs for offline query processing to ensure data privacy', metric: null },
        ],
        showTerminal: false,
    },
]

export default function Experience() {
    const [headerRef, headerVisible] = useScrollReveal()
    const [card1Ref, card1Visible] = useScrollReveal()
    const [card2Ref, card2Visible] = useScrollReveal()

    return (
        <section className="section" id="experience" style={{ minHeight: '100vh' }}>
            <div className="experience">
                <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
                    <div className="section-label">// experience</div>
                    <h2 className="section-title">
                        Mission <span className="accent">Log</span>
                    </h2>
                </div>

                <div className="timeline">
                    {experiences.map((exp, idx) => {
                        const cardRef = idx === 0 ? card1Ref : card2Ref
                        const cardVisible = idx === 0 ? card1Visible : card2Visible
                        return (
                            <div
                                key={idx}
                                ref={cardRef}
                                className={`timeline-item glass reveal ${cardVisible ? 'visible' : ''}`}
                                style={{ transitionDelay: `${idx * 0.15}s` }}
                            >
                                <div className="timeline-role">{exp.role}</div>
                                <div className="timeline-company">{exp.company}</div>
                                <div className="timeline-date">{exp.date}</div>
                                <ul className="timeline-points">
                                    {exp.points.map((point, pi) => (
                                        <li key={pi}>
                                            <strong>{point.text}</strong>
                                            {point.metric && (
                                                <span className="timeline-metric">{point.metric}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                {exp.showTerminal && <TerminalWindow />}
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
