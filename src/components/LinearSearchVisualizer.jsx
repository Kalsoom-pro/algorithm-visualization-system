import { useState, useEffect, useRef } from 'react'
import { linearSearch } from '../algorithms/linearSearch'

function LinearSearchVisualizer() {
    const [inputArray, setInputArray] = useState('5, 3, 8, 1, 9, 2')
    const [target, setTarget] = useState('5')
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(800)
    const timerRef = useRef(null)

    const stopAnimation = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        setIsPlaying(false)
    }

    const startAnimation = () => {
        if (steps.length === 0) return
        if (currentStep >= steps.length - 1) return
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

    const pauseAnimation = () => stopAnimation()
    const resumeAnimation = startAnimation

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

    useEffect(() => {
        return () => stopAnimation()
    }, [])

    useEffect(() => {
        if (steps.length > 0 && currentStep === steps.length - 1) {
            stopAnimation()
        }
    }, [currentStep, steps.length])

    const getMaxValue = (arr) => Math.max(...arr, 10)

    const startSearch = () => {
        stopAnimation()
        try {
            const arr = inputArray.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            const result = linearSearch(arr, target)
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
        } catch (error) {
            alert('Please enter numbers like: 5, 3, 8, 1, 9, 2')
        }
    }

    const generateRandomArray = () => {
        stopAnimation()
        const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
        setSteps([])
        setCurrentStep(0)
    }

    const currentStepData = steps[currentStep] || {
        array: inputArray.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n)),
        explanation: 'Ready',
        description: 'Enter array and target, then click Start',
        comparing: [],
        found: []
    }

    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Array:</label>
                    <input type="text" value={inputArray} onChange={(e) => setInputArray(e.target.value)} />
                    <button className="small-btn" onClick={generateRandomArray}>Random</button>
                </div>
                <div className="input-row">
                    <label>Target:</label>
                    <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
                </div>
            </div>

            <div className="controls-row">
                <button className="control-btn start" onClick={startSearch}>Start</button>
                <button className="control-btn pause" onClick={pauseAnimation}>Pause</button>
                <button className="control-btn resume" onClick={resumeAnimation}>Resume</button>
                <button className="control-btn restart" onClick={restartAnimation}>Restart</button>
                <div className="speed-control">
                    <label>Speed:</label>
                    <input type="range" min="300" max="1500" step="50" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
                    <span>{speed}ms</span>
                </div>
            </div>

            {steps.length > 0 && (
                <div className="visualization-area">
                    <div className="bars-container">
                        {currentStepData.array.map((value, index) => {
                            let barClass = 'bar'
                            if (currentStepData.comparing?.includes(index)) barClass += ' comparing'
                            if (currentStepData.found?.includes(index)) barClass += ' found'
                            const barHeight = (value / maxValue) * maxHeight
                            return (
                                <div key={index} className={barClass} style={{ height: `${barHeight}px` }}>
                                    <span className="value">{value}</span>
                                    <span className="index">{index}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="step-explanation">
                        <span className="step-badge">{currentStepData.explanation}</span>
                        <p className="step-description">{currentStepData.description}</p>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinearSearchVisualizer