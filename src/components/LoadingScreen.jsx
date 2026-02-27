import { useRef, useState, useEffect } from 'react'

export default function LoadingScreen({ progress, loaded }) {
    const [statusText, setStatusText] = useState('LOADING ASSETS...')

    useEffect(() => {
        const messages = [
            'LOADING ASSETS...',
            'INITIALIZING NEURAL CLOUD...',
            'CALIBRATING POINT FIELD...',
            'COMPILING SHADERS...',
            'LOADING EXPERIENCE DATA...',
            'ESTABLISHING CONNECTIONS...',
            'SYSTEM READY',
        ]
        const idx = Math.min(Math.floor(progress / 16), messages.length - 1)
        setStatusText(messages[idx])
    }, [progress])

    return (
        <div className={`loading-screen ${loaded ? 'loaded' : ''}`}>
            <div className="loading-ascii">
                {`
 ╔══════════════════════════════════════╗
 ║   N E U R A L   C O M M A N D      ║
 ║          C E N T E R                ║
 ║                                      ║
 ║   >>> SYSTEM v2.0                   ║
 ╚══════════════════════════════════════╝
`}
            </div>
            <div className="loading-title">Initializing System</div>
            <div className="loading-bar-container">
                <div
                    className="loading-bar"
                    style={{ width: `${Math.round(progress)}%` }}
                />
            </div>
            <div className="loading-status">{statusText}</div>
        </div>
    )
}
