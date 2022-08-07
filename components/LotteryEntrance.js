import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [lotteryFee, setLotteryFee] = useState("0");
    const dispatch = useNotification();

    const { runContractFunction: enterLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: lotteryFee,
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getLotteryFee",
        params: {},
    });

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString();
                setLotteryFee(entranceFeeFromCall);
            }
            updateUI();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
    };

    const handleNewNotification = function (tx) {
        dispatch({
            type: "info",
            message: "Transation Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };

    return (
        <div>
            Hi from lottery entrance!
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                    >
                        Enter Lottery
                    </button>
                    Entrance Fee:{" "}
                    {ethers.utils.formatUnits(lotteryFee, "ether")} ETH{" "}
                </div>
            ) : (
                <div>No Lottery Address Detected!</div>
            )}
        </div>
    );
}
