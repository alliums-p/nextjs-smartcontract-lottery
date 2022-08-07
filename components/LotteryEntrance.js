import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();

    const chainId = parseInt(chainIdHex);

    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;

    // const { runContractFunction: enterLottery } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: lotteryAddress,
    //     functionName: "enterLottery",
    //     params: {},
    //     msgValue: "",
    // });

    const [lotteryFee, setLotteryFee] = useState("0");

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRequestConfirmations",
        params: {},
    });

    try {
        // const { runContractFunction: getEntranceFee } = useWeb3Contract({
        //     abi: abi,
        //     contractAddress: lotteryAddress,
        //     functionName: "getInterval",
        //     params: {},
        // });

        useEffect(() => {
            if (isWeb3Enabled) {
                async function updateUI() {
                    const entranceFeeFromCall = (
                        await getEntranceFee()
                    ).toString();
                    setLotteryFee(entranceFeeFromCall);
                }
                updateUI();
            }
        }, [isWeb3Enabled]);
    } catch (e) {
        console.log(e);
    }

    return (
        <div>
            <h1>Body</h1>
            <p>Lottery Address: {lotteryAddress}</p>
            <p>Fee: {lotteryFee}</p>
        </div>
    );
}
