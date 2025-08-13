import { useEffect, useState } from 'react';
import {
  usePrivy,
  type CrossAppAccountWithMetadata,
} from "@privy-io/react-auth";

export default function MonadGamesId() {
  const { authenticated, user, ready, logout } = usePrivy();
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Reset state when authentication changes
    setAccountAddress("");
    setMessage("");

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
            setAccountAddress(crossAppAccount.embeddedWallets[0].address);
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
