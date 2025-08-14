import { useEffect, useState } from 'react';
import { usePrivy, type CrossAppAccountWithMetadata } from "@privy-io/react-auth";

export default function MonadGamesId() {
  const { authenticated, user, ready, logout } = usePrivy();
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUsername = async (walletAddress: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
      if (response.ok) {
        const data = await response.json();
        setUsername(data.hasUsername ? data.user.username : "");
      }
    } catch (err) {
      console.error("Error fetching username:", err);
      setError("Failed to load username");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAccountAddress("");
    setUsername("");
    setError("");

    if (authenticated && user && ready && user.linkedAccounts.length > 0) {
      const crossAppAccount = user.linkedAccounts.find(
        account => account.type === "cross_app" && account.providerApp.id === "cmd8euall0037le0my79qpz42"
      ) as CrossAppAccountWithMetadata;

      if (crossAppAccount?.embeddedWallets.length > 0) {
        const walletAddress = crossAppAccount.embeddedWallets[0].address;
        setAccountAddress(walletAddress);
        fetchUsername(walletAddress);
      } else {
        setError("Monad Games ID account not found");
      }
    } else if (authenticated && user && ready) {
      setError("Please link your Monad Games ID account");
    }
  }, [authenticated, user, ready]);

  if (!ready) return <div>Loading...</div>;
  if (!authenticated) return <div>Please log in to view your Monad Games ID</div>;

  return (
    <div className="monad-games-id">
      <h3>Monad Games ID</h3>
      
      {error && <p className="error">{error}</p>}
      
      {accountAddress && (
        <div>
          {loading ? (
            <p>Loading username...</p>
          ) : username ? (
            <div className="username-section">
              <strong>Username: {username}</strong>
            </div>
          ) : (
            <div className="no-username">
              <p>No username found</p>
              <a href="https://monad-games-id-site.vercel.app/" target="_blank" rel="noopener noreferrer">
                Register Username
              </a>
            </div>
          )}
          
          <div className="wallet-section">
            <p><strong>Wallet:</strong></p>
            <code>{accountAddress}</code>
          </div>
          
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
