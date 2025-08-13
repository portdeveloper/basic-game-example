import { useLogin, usePrivy } from '@privy-io/react-auth'
import Game from './Game'
import './App.css'

function App() {
  const { ready, authenticated} = usePrivy();
  const { login } = useLogin();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);


  if (!ready) {
    return <div>Loading...</div>
  }

  // Now it's safe to use other Privy hooks and state
  return (
    <div className="App">
      <button disabled={disableLogin} onClick={login}>
            Log in
        </button>
      <Game />
    </div>
  )
}

export default App
