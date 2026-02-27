import { useState, useEffect } from 'react';

const TOKENS = ["Hero", "About", "Experience", "Projects", "Achievements", "Contact"];

// Pre-computed mock attention weights for educational display
// Active token -> weights against all other tokens
const ATTENTION_WEIGHTS = [
    [1.00, 0.45, 0.20, 0.15, 0.30, 0.80], // Hero attending to others
    [0.45, 1.00, 0.85, 0.90, 0.60, 0.10], // About
    [0.20, 0.85, 1.00, 0.95, 0.70, 0.15], // Experience
    [0.15, 0.90, 0.95, 1.00, 0.88, 0.20], // Projects
    [0.30, 0.60, 0.70, 0.88, 1.00, 0.25], // Achievements
    [0.80, 0.10, 0.15, 0.20, 0.25, 1.00]  // Contact
];

export default function TransformerHUD() {
    const [activeIdx, setActiveIdx] = useState(0);

    useEffect(() => {
        const handleTokenChange = () => {
            if (window.activeTokenIdx !== undefined && window.activeTokenIdx !== activeIdx) {
                setActiveIdx(window.activeTokenIdx);
            }
        };

        window.addEventListener('tokenChanged', handleTokenChange);
        // Initial check
        handleTokenChange();

        return () => window.removeEventListener('tokenChanged', handleTokenChange);
    }, [activeIdx]);

    const currentToken = TOKENS[activeIdx] || TOKENS[0];
    const weights = ATTENTION_WEIGHTS[activeIdx] || ATTENTION_WEIGHTS[0];

    return (
        <div className="transformer-hud">
            {/* Model State Info */}
            <div className="hud-panel">
                <div className="hud-label">
                    Model_State // Active_Token
                </div>
                <div className="hud-token-header">
                    <span className="hud-token-name">{currentToken}</span>
                    <span className="hud-token-idx">Idx: {activeIdx}</span>
                </div>

                <div className="hud-math">
                    <div className="hud-math-row">
                        <span>Vector Q_{activeIdx}:</span>
                        <span className="hud-text-cyan">Projected</span>
                    </div>
                    <div className="hud-math-row">
                        <span>Compute:</span>
                        <span className="hud-text-gold">Softmax(Q·K^T / √d_k)</span>
                    </div>
                </div>
            </div>

            {/* Attention Heatmap Visualization */}
            <div className="hud-panel">
                <div className="hud-label">
                    Attention_Weights
                </div>

                <div>
                    {TOKENS.map((token, i) => {
                        const weight = weights[i];
                        const isSelf = i === activeIdx;
                        const scoreStr = weight.toFixed(2);
                        const barWidth = `${weight * 100}%`;

                        let labelClass = "hud-text-gray";
                        if (isSelf) labelClass = "hud-self";

                        let scoreClass = "hud-text-gray";
                        if (weight > 0.7 && !isSelf) scoreClass = "hud-high-attention";

                        return (
                            <div key={token} className="hud-weight-row">
                                <div className="hud-weight-header">
                                    <span className={labelClass}>
                                        {token} {isSelf && "(Self)"}
                                    </span>
                                    <span className={scoreClass}>
                                        {scoreStr}
                                    </span>
                                </div>
                                <div className="hud-bar-bg">
                                    <div
                                        className="hud-bar-fill"
                                        style={{ width: barWidth }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Visual Output Layer */}
            <div className="hud-panel">
                <div className="hud-label">
                    Value_Matrix_v(x)
                </div>
                <div className="hud-math">
                    Summing weighted Value vectors to produce Context Embedding for presentation layer.
                </div>
            </div>
        </div>
    );
}
