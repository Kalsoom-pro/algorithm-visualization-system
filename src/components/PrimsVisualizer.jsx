import { useState, useEffect, useRef } from 'react'
import { primsAlgorithm } from '../algorithms/primsAlgorithm'

function PrimsVisualizer() {
    const [nodeInput, setNodeInput] = useState('A, B, C, D')
    const [edgeInput, setEdgeInput] = useState('A-B:4, A-C:2, B-C:1, B-D:5, C-D:3')
    const [nodes, setNodes] = useState(['A', 'B', 'C', 'D'])
    const [edges, setEdges] = useState([
        { from: 'A', to: 'B', weight: 4 },
        { from: 'A', to: 'C', weight: 2 },
        { from: 'B', to: 'C', weight: 1 },
        { from: 'B', to: 'D', weight: 5 },
        { from: 'C', to: 'D', weight: 3 }
    ])
    const [steps, setSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1000)
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

    const updateNodesFromInput = () => {
        stopAnimation()
        try {
            const arr = nodeInput.split(',').map(n => n.trim())
            if (arr.length < 2) {
                alert('Please enter at least 2 nodes')
                return
            }
            setNodes(arr)
            reset()
        } catch (error) {
            alert('Please enter nodes like: A, B, C, D')
        }
    }

    const updateEdgesFromInput = () => {
        stopAnimation()
        try {
            const edgeList = edgeInput.split(',').map(e => e.trim())
            const parsedEdges = []
            for (let edge of edgeList) {
                const match = edge.match(/([A-Za-z0-9]+)-([A-Za-z0-9]+):(\d+)/)
                if (match) {
                    parsedEdges.push({ from: match[1], to: match[2], weight: parseInt(match[3]) })
                } else {
                    alert(`Invalid edge format: ${edge}. Use format: A-B:4`)
                    return
                }
            }
            setEdges(parsedEdges)
            reset()
        } catch (error) {
            alert('Please enter edges like: A-B:4, A-C:2')
        }
    }

    const generateRandomGraph = () => {
        stopAnimation()
        const randomNodes = ['A', 'B', 'C', 'D']
        const randomEdges = [
            { from: 'A', to: 'B', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'A', to: 'C', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'B', to: 'C', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'B', to: 'D', weight: Math.floor(Math.random() * 10) + 1 },
            { from: 'C', to: 'D', weight: Math.floor(Math.random() * 10) + 1 }
        ]
        setNodeInput(randomNodes.join(', '))
        setNodes(randomNodes)
        const edgeString = randomEdges.map(e => `${e.from}-${e.to}:${e.weight}`).join(', ')
        setEdgeInput(edgeString)
        setEdges(randomEdges)
        reset()
    }

    const startVisualization = () => {
        stopAnimation()
        const result = primsAlgorithm(nodes, edges)
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
        graph: { nodes: nodes, edges: edges },
        explanation: 'Ready',
        description: 'Enter graph and click Start',
        visited: [],
        edges: []
    }

    const getNodeCoordinates = (nodeList) => {
        const coords = {}
        const positions = [
            { x: 100, y: 50 }, { x: 300, y: 50 },
            { x: 200, y: 150 }, { x: 100, y: 250 },
            { x: 300, y: 250 }, { x: 200, y: 300 }
        ]
        nodeList.forEach((node, index) => {
            coords[node] = positions[index % positions.length]
        })
        return coords
    }

    const coords = getNodeCoordinates(nodes)

    return (
        <div className="visualizer">
            <div className="input-section">
                <div className="input-row">
                    <label>Nodes:</label>
                    <input type="text" value={nodeInput} onChange={(e) => setNodeInput(e.target.value)} />
                    <button className="small-btn" onClick={updateNodesFromInput}>Update Nodes</button>
                </div>
                <div className="input-row">
                    <label>Edges:</label>
                    <input type="text" value={edgeInput} onChange={(e) => setEdgeInput(e.target.value)} />
                    <button className="small-btn" onClick={updateEdgesFromInput}>Update Edges</button>
                </div>
                <div className="input-row">
                    <button className="small-btn" onClick={generateRandomGraph}>Random Graph</button>
                </div>
                <div className="current-array">
                    <strong>Current:</strong> Nodes [{nodes.join(', ')}] | Edges: {edges.map(e => `${e.from}-${e.to}:${e.weight}`).join(', ')}
                </div>
            </div>

            <div className="controls-row">
                <button className="control-btn start" onClick={startVisualization}>Start</button>
                <button className="control-btn pause" onClick={pauseAnimation}>Pause</button>
                <button className="control-btn resume" onClick={resumeAnimation}>Resume</button>
                <button className="control-btn restart" onClick={restartAnimation}>Restart</button>
                <div className="speed-control">
                    <label>Speed:</label>
                    <input type="range" min="300" max="2000" step="50" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} />
                    <span>{speed}ms</span>
                </div>
            </div>

            {steps.length > 0 && (
                <div className="visualization-area">
                    <svg width="400" height="300" style={{ margin: '0 auto', display: 'block' }}>
                        {currentStepData.graph.edges.map((edge, i) => {
                            const isSelected = currentStepData.edges?.some(e =>
                                (e[0] === edge.from && e[1] === edge.to) || (e[0] === edge.to && e[1] === edge.from)
                            )
                            if (!coords[edge.from] || !coords[edge.to]) return null
                            return (
                                <g key={i}>
                                    <line x1={coords[edge.from].x} y1={coords[edge.from].y}
                                          x2={coords[edge.to].x} y2={coords[edge.to].y}
                                          stroke={isSelected ? '#10b981' : '#ccc'} strokeWidth={isSelected ? 4 : 2} />
                                    <text x={(coords[edge.from].x + coords[edge.to].x) / 2}
                                          y={(coords[edge.from].y + coords[edge.to].y) / 2 - 5}
                                          textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">{edge.weight}</text>
                                </g>
                            )
                        })}
                        {currentStepData.graph.nodes.map(node => {
                            const isVisited = currentStepData.visited?.includes(node)
                            if (!coords[node]) return null
                            return (
                                <g key={node}>
                                    <circle cx={coords[node].x} cy={coords[node].y} r="25"
                                            fill={isVisited ? '#10b981' : '#667eea'} stroke="#333" strokeWidth="2" />
                                    <text x={coords[node].x} y={coords[node].y} textAnchor="middle" dy=".3em" fill="white" fontWeight="bold">{node}</text>
                                </g>
                            )
                        })}
                    </svg>

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

export default PrimsVisualizer