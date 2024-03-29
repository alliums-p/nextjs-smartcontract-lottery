import { useMoralis } from "react-moralis";
import { useEffect } from "react";

const CustomHeader = () => {
    const {
        enableWeb3,
        isWeb3Enabled,
        Moralis,
        account,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis();

    useEffect(() => {
        if (isWeb3Enabled) return;
        if (typeof window !== "undefined") {
            const isConnected = window.localStorage.getItem("connected");
            if (isConnected) {
                enableWeb3();
            }
        }
    }, [isWeb3Enabled]);

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                window.localStorage.removeItem("connected");
                deactivateWeb3();
                console.log("Null account found");
            }
        });
    }, []);

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{" "}
                    {account.slice(account.length - 4)}!
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3();
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem(
                                "connected",
                                "injected"
                            );
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
};

export default CustomHeader;
