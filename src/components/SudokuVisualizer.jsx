import { useState, useEffect, useRef } from 'react'
import { sudokuSolver } from '../algorithms/sudokuSolver'

function SudokuVisualizer() {
    const [boardInput, setBoardInput] = useState([
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ])
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(600)
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

    const resetBoard = () => {
        stopAnimation()
        const classic = [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ]
        setBoardInput(classic)
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

    const startVisualization = () => {
        stopAnimation()
        const result = sudokuSolver(boardInput)
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
        board: boardInput,
        explanation: 'Ready',
        description: 'Click Start to solve Sudoku',
        row: -1,
        col: -1,
        reason: ''
    }

    return (
        <div className="visualizer">
            <div className="controls-row">
                <button className="control-btn start" onClick={startVisualization}>Start</button>
                <button className="control-btn pause" onClick={pauseAnimation}>Pause</button>
                <button className="control-btn resume" onClick={resumeAnimation}>Resume</button>
                <button className="control-btn restart" onClick={restartAnimation}>Restart</button>
                <button className="control-btn reset" onClick={resetBoard}>Reset Board</button>
                <div className="speed-control">
                    <label>Speed:</label>
                    <input type="range" min="200" max="1500" step="50" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
                    <span>{speed}ms</span>
                </div>
            </div>

            {steps.length > 0 && (
                <>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}></div>
                    </div>

                    <div className="sudoku-main-container">
                        {/* LEFT SIDE - BOARD */}
                        <div className="sudoku-board-container">
                            <div className="sudoku-board">
                                {currentStepData.board.map((row, i) => (
                                    <div key={i} className="sudoku-row">
                                        {row.map((cell, j) => {
                                            const isHighlighted = i === currentStepData.row && j === currentStepData.col
                                            const isOriginal = boardInput[i] && boardInput[i][j] !== 0
                                            return (
                                                <div key={j} className={`sudoku-cell ${isHighlighted ? 'highlighted' : ''} ${isOriginal ? 'original' : ''}`}>
                                                    {cell !== 0 ? cell : ''}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div className="step-counter-small">
                                Step {currentStep + 1} of {steps.length}
                            </div>
                        </div>

                        {/* RIGHT SIDE - INFO */}
                        <div className="sudoku-info-container">
                            <div className="step-badge-large">{currentStepData.explanation}</div>
                            <p className="step-description-large">{currentStepData.description}</p>
                            {currentStepData.reason && (
                                <div className="step-reason-large">
                                    <span className="reason-text">{currentStepData.reason}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default SudokuVisualizer