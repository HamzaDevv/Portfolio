import { useState, useRef } from 'react'
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
        <section className="section" id="contact" style={{ minHeight: '100vh' }}>
            <div className="contact">
                <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
                    <div className="section-label">// contact</div>
                    <h2 className="section-title" style={{ marginBottom: 48 }}>
                        Establish <span className="accent">Connection</span>
                    </h2>
                </div>

                <div className="contact-grid">
                    <div ref={formRevealRef} className={`reveal-left ${formVisible ? 'visible' : ''}`}>
                        <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="from_name">Identifier</label>
                                <input
                                    id="from_name"
                                    type="text"
                                    name="from_name"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="from_email">Return Address</label>
                                <input
                                    id="from_email"
                                    type="email"
                                    name="from_email"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Transmission</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Your message..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className={`form-submit ${sent ? 'sent' : ''}`}
                                disabled={sending}
                            >
                                {sending ? '⟳ TRANSMITTING...' : sent ? '✓ TRANSMITTED' : '→ SEND TRANSMISSION'}
                            </button>
                            {error && (
                                <p style={{ color: '#ff5f57', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                                    {error}
                                </p>
                            )}
                        </form>
                    </div>

                    <div ref={infoRef} className={`reveal-right ${infoVisible ? 'visible' : ''}`}>
                        <div className="contact-info">
                            <div className="contact-item glass">
                                <div className="contact-item-icon">📧</div>
                                <div>
                                    <div className="contact-item-label">Email</div>
                                    <div className="contact-item-value">
                                        <a href="mailto:ameerhamzakhan1305@gmail.com">ameerhamzakhan1305@gmail.com</a>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-item glass">
                                <div className="contact-item-icon">📱</div>
                                <div>
                                    <div className="contact-item-label">Phone</div>
                                    <div className="contact-item-value">+91-7987918845</div>
                                </div>
                            </div>

                            <div className="contact-item glass">
                                <div className="contact-item-icon">🎓</div>
                                <div>
                                    <div className="contact-item-label">Education</div>
                                    <div className="contact-item-value">IIEST Shibpur • B.Tech IT • 8.24 CGPA</div>
                                </div>
                            </div>

                            <div className="social-links">
                                <a
                                    href="https://www.linkedin.com/in/hamzadevv/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    title="LinkedIn"
                                >
                                    in
                                </a>
                                <a
                                    href="https://github.com/HamzaDevv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    title="GitHub"
                                >
                                    GH
                                </a>
                                <a
                                    href="https://leetcode.com/u/hamzadevv/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="social-link"
                                    title="LeetCode"
                                >
                                    LC
                                </a>
                            </div>

                            <a
                                href="/Ameer_Hamza_Khan_Resume_M.pdf"
                                download
                                className="download-btn"
                            >
                                ⬇ Download Resume
                            </a>
                        </div>
                    </div>
                </div>

                <footer className="footer">
                    <span>© 2026 Ameer Hamza Khan — Built with React Three Fiber</span>
                    <div className="footer-links">
                        <a href="https://www.linkedin.com/in/hamzadevv/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://github.com/HamzaDevv" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </footer>
            </div>
        </section>
    )
}
