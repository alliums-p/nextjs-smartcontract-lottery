import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();

    const chainId = parseInt(chainIdHex);

    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    const [lotteryFee, setLotteryFee] = useState("0");

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

    return (
        <div>
            Hi from lottery entrance!
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterLottery();
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
