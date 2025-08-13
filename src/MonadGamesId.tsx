import { useEffect, useState } from 'react';
import {
  usePrivy,
  type CrossAppAccountWithMetadata,
} from "@privy-io/react-auth";

export default function MonadGamesId() {
  const { authenticated, user, ready, logout } = usePrivy();
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoadingUsername, setIsLoadingUsername] = useState<boolean>(false);
  const [hasCheckedUsername, setHasCheckedUsername] = useState<boolean>(false);

  // Function to fetch username from the API
  const fetchUsername = async (walletAddress: string) => {
    if (!walletAddress) return;
    
    setIsLoadingUsername(true);
    setHasCheckedUsername(false);
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username || "");
      } else {
        console.error("Failed to fetch username:", response.statusText);
        setUsername("");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setUsername("");
    } finally {
      setIsLoadingUsername(false);
      setHasCheckedUsername(true);
    }
  };

  useEffect(() => {
    // Reset state when authentication changes
    setAccountAddress("");
    setUsername("");
    setMessage("");
    setHasCheckedUsername(false);

    // Check if privy is ready and user is authenticated
    if (authenticated && user && ready) {
      // Check if user has linkedAccounts
      if (user.linkedAccounts.length > 0) {
        // Get the cross app account created using Monad Games ID
        const crossAppAccount: CrossAppAccountWithMetadata = user.linkedAccounts.filter(
          account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
        )[0] as CrossAppAccountWithMetadata;

        if (crossAppAccount) {
          // The first embedded wallet created using Monad Games ID, is the wallet address
          if (crossAppAccount.embeddedWallets.length > 0) {
            const walletAddress = crossAppAccount.embeddedWallets[0].address;
            setAccountAddress(walletAddress);
            // Fetch username for this wallet address
            fetchUsername(walletAddress);
          }
        } else {
          setMessage("Monad Games ID account not found in linked accounts.");
        }
      } else {
        setMessage("You need to link your Monad Games ID account to continue.");
      }
    }
  }, [authenticated, user, ready]);

  if (!ready) {
    return <div>Loading Monad Games ID...</div>;
  }

  if (!authenticated) {
    return <div>Please log in to view your Monad Games ID.</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px 0' }}>
      <h3>Monad Games ID</h3>
      {accountAddress ? (
        <div>
          {username && (
            <div style={{ marginBottom: '15px' }}>
              <p><strong>Username:</strong></p>
              <p style={{ 
                fontSize: '18px',
                color: '#2e7d32',
                fontWeight: 'bold',
                margin: '5px 0'
              }}>
                {username}
              </p>
            </div>
          )}
          {isLoadingUsername && (
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#666', fontStyle: 'italic' }}>Loading username...</p>
            </div>
          )}
          {!username && hasCheckedUsername && !isLoadingUsername && (
            <div style={{ 
              marginBottom: '15px', 
              padding: '12px', 
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '6px' 
            }}>
              <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
                <strong>No username found!</strong>
              </p>
              <p style={{ margin: '0 0 12px 0', color: '#856404', fontSize: '14px' }}>
                Register a username to enhance your gaming experience.
              </p>
              <a 
                href="https://monad-games-id-site.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              >
                Register Username
              </a>
            </div>
          )}
          <p><strong>Wallet Address:</strong></p>
          <p style={{ 
            fontFamily: 'monospace', 
            backgroundColor: '#f5f5f5', 
            padding: '8px', 
            borderRadius: '4px',
            wordBreak: 'break-all'
          }}>
            {accountAddress}
          </p>
          <button 
            onClick={logout}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: '#ff6b6b' }}>{message}</p>
        </div>
      )}
    </div>
  );
}
