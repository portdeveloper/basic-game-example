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
  const [gameOver, setGameOver] = useState(false)

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
    setGameOver(false)
    setScore(0)
    setTargets([])
  }

  const stopGame = () => {
    setGameStarted(false)
    setGameOver(false)
    setTargets([])
  }

  const endGame = () => {
    setGameStarted(false)
    setGameOver(true)
  }

  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      generateTarget()
    }, 2000)

    // Remove targets after 3 seconds if not clicked and end game if any are missed
    const cleanupInterval = setInterval(() => {
      setTargets(prev => {
        const currentTime = Date.now()
        const expiredTargets = prev.filter(target => currentTime - target.id >= 3000)
        
        // If any targets expired (were missed), end the game
        if (expiredTargets.length > 0) {
          endGame()
          return []
        }
        
        return prev.filter(target => currentTime - target.id < 3000)
      })
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
        {gameOver && (
          <div style={{ marginBottom: '10px' }}>
            <h3 style={{ color: 'red' }}>Game Over! You missed a target.</h3>
            <p>Final Score: {score}</p>
          </div>
        )}
        {!gameStarted ? (
          <button onClick={startGame} style={{ padding: '10px 20px', fontSize: '16px' }}>
            {gameOver ? 'Play Again' : 'Start Game'}
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
          <p><strong>Warning:</strong> Game ends if you miss any target!</p>
        </div>
      )}
    </div>
  )
}

export default Game
