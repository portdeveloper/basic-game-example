import { useState, useEffect } from 'react'

interface Target {
  id: number
  x: number
  y: number
}

const Game = () => {
  const [score, setScore] = useState(0)
  const [targets, setTargets] = useState<Target[]>([])
  const [gameStarted, setGameStarted] = useState(false)

  const generateTarget = () => {
    const newTarget: Target = {
      id: Date.now(),
      x: Math.random() * 400,
      y: Math.random() * 400
    }
    setTargets(prev => [...prev, newTarget])
  }

  const hitTarget = (targetId: number) => {
    setScore(prev => prev + 10)
    setTargets(prev => prev.filter(target => target.id !== targetId))
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setTargets([])
  }

  const stopGame = () => {
    setGameStarted(false)
    setTargets([])
  }

  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      generateTarget()
    }, 2000)

    // Remove targets after 3 seconds if not clicked
    const cleanupInterval = setInterval(() => {
      setTargets(prev => prev.filter(target => Date.now() - target.id < 3000))
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
  }, [gameStarted])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Click Target Game</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Score: {score}</h2>
        {!gameStarted ? (
          <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Start Game
          </button>
        ) : (
          <button onClick={stopGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            Stop Game
          </button>
        )}
      </div>
      
      {gameStarted && (
        <div 
          style={{ 
            position: 'relative', 
            width: '500px', 
            height: '500px', 
            border: '2px solid black',
            backgroundColor: '#f0f0f0'
          }}
        >
          {targets.map(target => (
            <div
              key={target.id}
              onClick={() => hitTarget(target.id)}
              style={{
                position: 'absolute',
                left: `${target.x}px`,
                top: `${target.y}px`,
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'red',
                cursor: 'pointer',
                border: '2px solid darkred'
              }}
            />
          ))}
        </div>
      )}
      
      {gameStarted && (
        <div style={{ marginTop: '10px' }}>
          <p>Click the red circles to score points!</p>
          <p>Targets disappear after 3 seconds if not clicked.</p>
        </div>
      )}
    </div>
  )
}

export default Game
