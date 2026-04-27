import { useState, useEffect, useRef } from 'react'
import { quickSort } from '../algorithms/quickSort'

function QuickSortVisualizer() {
    const [inputArray, setInputArray] = useState('5, 3, 8, 1, 9, 2')
    const [array, setArray] = useState([5, 3, 8, 1, 9, 2])
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(500)
    const timerRef = useRef(null)

    // Stop animation
    const stopAnimation = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
        setIsPlaying(false)
    }

    // Start animation from current step
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

    // Pause animation
    const pauseAnimation = () => {
        stopAnimation()
    }

    // Resume animation
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

    // Restart from beginning
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

    // Cleanup on unmount
    useEffect(() => {
        return () => stopAnimation()
    }, [])

    // Auto-stop when animation completes
    useEffect(() => {
        if (steps.length > 0 && currentStep === steps.length - 1) {
            stopAnimation()
        }
    }, [currentStep, steps.length])

    const getMaxValue = (arr) => {
        return Math.max(...arr, 10)
    }

    const updateArrayFromInput = () => {
        stopAnimation()
        try {
            const arr = inputArray.split(',').map(n => parseInt(n.trim()))
            if (arr.some(isNaN)) {
                alert('Please enter valid numbers only')
                return
            }
            setArray(arr)
            setSteps([])
            setCurrentStep(0)
        } catch (error) {
            alert('Please enter numbers like: 5, 3, 8, 1, 9, 2')
        }
    }

    const generateRandomArray = () => {
        stopAnimation()
        const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1)
        setInputArray(random.join(', '))
        setArray(random)
        setSteps([])
        setCurrentStep(0)
    }

    const startVisualization = () => {
        stopAnimation()
        updateArrayFromInput()
        const result = quickSort(array)
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

    const currentStepData = steps[currentStep] || { 
        array: array, 
        explanation: 'Ready to start', 
        description: 'Enter your array and click Start Quick Sort',
        comparing: [],
        swapping: [],
        pivotIndex: -1
    }

    const maxValue = getMaxValue(currentStepData.array)
    const maxHeight = 250

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Enter Array:</label>
                    <input 
                        type="text" 
                        value={inputArray} 
                        onChange={(e) => setInputArray(e.target.value)}
                        placeholder="e.g., 5, 3, 8, 1, 9, 2"
                    />
                    <button className="small-btn" onClick={generateRandomArray}>Random</button>
                    <button className="small-btn primary" onClick={updateArrayFromInput}>Update</button>
                </div>
                <div className="current-array"><strong>Current:</strong> [{array.join(', ')}]</div>
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
                        min="100" 
                        max="1500" 
                        step="50"
                        value={speed} 
                        onChange={(e) => setSpeed(parseInt(e.target.value))}
                    />
                    <span>{speed}ms</span>
                </div>
            </div>

            {steps.length > 0 && (
                <div className="visualization-area">
                    <div className="bars-container">
                        {currentStepData.array.map((value, index) => {
                            let barClass = 'bar'
                            if (currentStepData.comparing?.includes(index)) barClass += ' comparing'
                            if (currentStepData.swapping?.includes(index)) barClass += ' swapping'
                            if (currentStepData.pivotIndex === index) barClass += ' pivot'
                            if (currentStepData.sorted?.includes(index)) barClass += ' sorted'
                            
                            return (
                                <div
                                    key={index}
                                    className={barClass}
                                    style={{ height: `${(value / maxValue) * maxHeight}px` }}
                                >
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

export default QuickSortVisualizer