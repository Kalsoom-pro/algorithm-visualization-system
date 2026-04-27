import { useState, useEffect, useRef } from 'react'
import { coinChange } from '../algorithms/coinChange'

function CoinChangeVisualizer() {
    const [coinInput, setCoinInput] = useState('1, 2, 5')
    const [amountInput, setAmountInput] = useState('11')
    const [coins, setCoins] = useState([1, 2, 5])
    const [amount, setAmount] = useState(11)
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(800)
    const timerRef = useRef(null)

    // Stop animation
    const stopAnimation = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        setIsPlaying(false)
    }

    // Start animation
    const startAnimation = () => {
        if (steps.length === 0) return
        if (currentStep >= steps.length - 1) {
            reset()
            return
        }
        setIsPlaying(true)
        timerRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= steps.length) {
                    stopAnimation()
                    return prev
                }
                return prev + 1
            })
        }, speed)
    }

    // Pause
    const pauseAnimation = () => stopAnimation()

    // Resume
    const resumeAnimation = () => {
        if (steps.length === 0) return
        if (currentStep >= steps.length - 1) {
            reset()
            return
        }
        setIsPlaying(true)
        timerRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= steps.length) {
                    stopAnimation()
                    return prev
                }
                return prev + 1
            })
        }, speed)
    }

    // Restart
    const restartAnimation = () => {
        stopAnimation()
        setCurrentStep(0)
        if (steps.length > 0) {
            setIsPlaying(true)
            timerRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev + 1 >= steps.length) {
                        stopAnimation()
                        return prev
                    }
                    return prev + 1
                })
            }, speed)
        }
    }

    // Reset
    const reset = () => {
        stopAnimation()
        setSteps([])
        setCurrentStep(0)
    }

    useEffect(() => {
        return () => stopAnimation()
    }, [])

    useEffect(() => {
        if (steps.length > 0 && currentStep === steps.length - 1) {
            stopAnimation()
        }
    }, [currentStep, steps.length])

    const updateCoinsFromInput = () => {
        stopAnimation()
        try {
            const arr = coinInput.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            setCoins(arr)
            reset()
        } catch (error) {
            alert('Please enter coins like: 1, 2, 5')
        }
    }

    const updateAmountFromInput = () => {
        stopAnimation()
        const val = parseInt(amountInput)
        if (isNaN(val) || val <= 0) {
            alert('Please enter a valid positive number')
            return
        }
        setAmount(val)
        reset()
    }

    const startVisualization = () => {
        stopAnimation()
        updateCoinsFromInput()
        updateAmountFromInput()
        const result = coinChange(coins, amount)
        setSteps(result)
        setCurrentStep(0)
        setIsPlaying(true)
        timerRef.current = setInterval(() => {
            setCurrentStep(prev => {
                if (prev + 1 >= result.length) {
                    stopAnimation()
                    return prev
                }
                return prev + 1
            })
        }, speed)
    }

    const generateRandomCoins = () => {
        stopAnimation()
        const random = Array.from({ length: 3 }, () => Math.floor(Math.random() * 5) + 1)
        setCoinInput(random.join(', '))
        setCoins(random)
        reset()
    }

    const currentStepData = steps[currentStep] || { 
        explanation: 'Ready', 
        description: 'Enter coins and amount, then click Start',
        amount: 0,
        coin: 0,
        minCoins: 0,
        coinsUsed: []
    }

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Coins:</label>
                    <input 
                        type="text" 
                        value={coinInput} 
                        onChange={(e) => setCoinInput(e.target.value)}
                        placeholder="e.g., 1, 2, 5"
                    />
                    <button className="small-btn" onClick={generateRandomCoins}>Random</button>
                    <button className="small-btn primary" onClick={updateCoinsFromInput}>Update</button>
                </div>
                <div className="input-row">
                    <label>Amount:</label>
                    <input 
                        type="number" 
                        value={amountInput} 
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                    />
                    <button className="small-btn primary" onClick={updateAmountFromInput}>Set</button>
                </div>
                <div className="current-array">
                    <strong>Current:</strong> Coins [{coins.join(', ')}], Amount = {amount}
                </div>
            </div>

            <div className="controls-row">
                <button className="control-btn start" onClick={startVisualization}>Start</button>
                <button className="control-btn pause" onClick={pauseAnimation}>Pause</button>
                <button className="control-btn resume" onClick={resumeAnimation}>Resume</button>
                <button className="control-btn restart" onClick={restartAnimation}>Restart</button>
                
                <div className="speed-control">
                    <label>Speed:</label>
                    <input 
                        type="range" 
                        min="300" 
                        max="2000" 
                        step="50"
                        value={speed} 
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                    />
                    <span>{speed}ms</span>
                </div>
            </div>

            {/* DP Table */}
            {steps.length > 0 && currentStepData.dpTable && (
                <div className="dp-table-container">
                    <h3>Dynamic Programming Table</h3>
                    <div className="dp-table-wrapper">
                        <table className="dp-table">
                            <thead>
                                <tr>
                                    <th>Amount</th>
                                    {currentStepData.dpTable.map((_, idx) => (
                                        <th key={idx}>{idx}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="row-header">Min Coins</td>
                                    {currentStepData.dpTable.map((val, idx) => (
                                        <td key={idx} className={idx === currentStepData.amount ? 'highlight' : ''}>
                                            {val === Infinity ? '∞' : val}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Result Display */}
            {steps.length > 0 && currentStepData.minCoins && (
                <div className="result-container">
                    <div className="result-box">
                        <span className="result-label">Minimum Coins:</span>
                        <span className="result-value">{currentStepData.minCoins}</span>
                    </div>
                    {currentStepData.coinsUsed && currentStepData.coinsUsed.length > 0 && (
                        <div className="result-box">
                            <span className="result-label">Coins Used:</span>
                            <span className="result-value coins-list">
                                {currentStepData.coinsUsed.join(' + ')} = {currentStepData.coinsUsed.reduce((a,b) => a + b, 0)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {steps.length > 0 && (
                <div className="visualization-area">
                    <div className="step-explanation">
                        <span className="step-badge">{currentStepData.explanation}</span>
                        <p className="step-description">{currentStepData.description}</p>
                    </div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CoinChangeVisualizer