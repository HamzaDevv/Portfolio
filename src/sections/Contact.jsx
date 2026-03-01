import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import useScrollReveal from '../hooks/useScrollReveal'

const SERVICE_ID = 'service_eiivilc'
const TEMPLATE_ID = 'template_k1axh85'
const PUBLIC_KEY = 'drcCNRuRSFNh1ri_w'

export default function Contact() {
    const formRef = useRef(null)
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const [headerRef, headerVisible] = useScrollReveal()
    const [formRevealRef, formVisible] = useScrollReveal()
    const [infoRef, infoVisible] = useScrollReveal()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        setError('')

        try {
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            setSent(true)
            formRef.current.reset()
            setTimeout(() => setSent(false), 5000)
        } catch (err) {
            setError('Transmission failed. Please try again.')
            console.error('EmailJS error:', err)
        } finally {
            setSending(false)
        }
    }


    return (
        <section className="section" id="contact" style={{ overflow: 'auto' }}>
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center" style={{ maxHeight: '85vh', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''} text-center mb-16`}>
                    <div className="section-label text-electric-purple tracking-[0.3em]">// softmax-distribution</div>
                    <h2 className="section-title">
                        Output <span className="text-cyber-lime">Layer</span>
                    </h2>
                    <p className="text-gray mt-4 max-w-lg mx-auto">
                        Computing final probabilities for Future Interests. Select the highest probability token to establish a connection.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    <div className="glass p-8 border-electric-purple/30">
                        <h3 className="font-heading text-2xl font-bold text-white mb-6">Transmission</h3>
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="from_name"
                                    placeholder="Identifier"
                                    required
                                    className="w-full bg-obsidian-light border border-electric-purple/20 p-3 text-white font-mono text-sm focus:border-cyber-lime outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="from_email"
                                    placeholder="Return Address"
                                    required
                                    className="w-full bg-obsidian-light border border-electric-purple/20 p-3 text-white font-mono text-sm focus:border-cyber-lime outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <textarea
                                    name="message"
                                    placeholder="Payload..."
                                    rows={4}
                                    required
                                    className="w-full bg-obsidian-light border border-electric-purple/20 p-3 text-white font-mono text-sm focus:border-cyber-lime outline-none transition-colors resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-3 bg-electric-purple/20 border border-electric-purple text-white font-mono text-sm hover:bg-electric-purple/40 transition-colors disabled:opacity-50"
                            >
                                {sending ? '⟳ TRANSMITTING...' : sent ? '✓ TRANSMITTED' : '→ SEND'}
                            </button>
                            {error && <p className="text-red-500 font-mono text-xs">{error}</p>}
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="glass p-6 border-electric-purple/20 flex items-center gap-4">
                            <div className="text-2xl">📧</div>
                            <div>
                                <div className="text-xs font-mono text-gray">Email</div>
                                <a href="mailto:ameerhamzakhan1305@gmail.com" className="text-white hover:text-cyber-lime transition-colors">ameerhamzakhan1305@gmail.com</a>
                            </div>
                        </div>
                        <div className="glass p-6 border-electric-purple/20 flex items-center gap-4">
                            <div className="text-2xl">📱</div>
                            <div>
                                <div className="text-xs font-mono text-gray">Phone</div>
                                <div className="text-white">+91-7987918845</div>
                            </div>
                        </div>
                        <div className="glass p-6 border-electric-purple/20 flex items-center gap-4">
                            <div className="text-2xl">🎓</div>
                            <div>
                                <div className="text-xs font-mono text-gray">Education</div>
                                <div className="text-white">IIEST Shibpur • B.Tech IT</div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <a href="https://www.linkedin.com/in/hamzadevv/" target="_blank" rel="noreferrer" className="flex-1 glass p-4 text-center font-mono text-sm text-gray hover:text-white hover:border-cyber-lime/50 transition-colors">
                                LinkedIn
                            </a>
                            <a href="https://github.com/HamzaDevv" target="_blank" rel="noreferrer" className="flex-1 glass p-4 text-center font-mono text-sm text-gray hover:text-white hover:border-cyber-lime/50 transition-colors">
                                GitHub
                            </a>
                            <a href="https://leetcode.com/u/HamzaDev87/" target="_blank" rel="noreferrer" className="flex-1 glass p-4 text-center font-mono text-sm text-gray hover:text-white hover:border-cyber-lime/50 transition-colors">
                                LeetCode
                            </a>
                        </div>
                    </div>
                </motion.div>


                <footer className="mt-32 border-t border-electric-purple/20 w-full pt-8 flex justify-between items-center font-mono text-xs text-gray">
                    <span>© 2026 Ameer Hamza Khan</span>
                    <span>Built with React Three Fiber</span>
                </footer>
            </div>
        </section>
    )
}
