import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, Moralis, web3 } = useMoralis();
    const chainId = parseInt(chainIdHex);
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    const [lotteryFee, setLotteryFee] = useState("0");
    const [numPlayer, setNumPlayer] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");
    const [startBlockNumber, setStartBlockNumber] = useState(0);

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

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    });

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        const numPlayersFromCall = (await getNumPlayers()).toString();
        const recentWinnerFromCall = (await getRecentWinner()).toString();
        setLotteryFee(entranceFeeFromCall);
        setNumPlayer(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
    }

    async function getCurrentBlockNum() {
        const num = await web3.getBlockNumber();
        console.log("New block: ", num);
        setStartBlockNumber(num);
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
            getCurrentBlockNum();
        }
    }, [isWeb3Enabled]);

    const handleSuccess = async function (tx) {
        await tx.wait(1);
        handleNewNotification(tx);
        updateUI();
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

    const eventABI = ["event WinnerPicked(address indexed winner)"];
    let iface = new ethers.utils.Interface(eventABI);

    const filter = {
        address: lotteryAddress,
        topics: [iface.getEventTopic("WinnerPicked")],
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            web3.on(filter, async (log) => {
                if (log.topics !== undefined && log.topics.length > 1) {
                    if (log.blockNumber >= startBlockNumber) {
                        setStartBlockNumber(log.blockNumber);
                        let newWinner = ethers.utils.hexStripZeros(
                            log.topics[1]
                        );
                        dispatch({
                            type: "info",
                            message: newWinner,
                            title: "Winner Picked!",
                            position: "topR",
                            icon: "bell",
                        });
                    }
                }

                updateUI();
            });
        }
    }, [isWeb3Enabled]);

    return (
        <div>
            Hi from lottery entrance!
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            // getCurrentBlockNum();
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            });
                        }}
                    >
                        Enter Lottery
                    </button>
                    Entrance Fee:{" "}
                    {ethers.utils.formatUnits(lotteryFee, "ether")} ETH <br />
                    Players: {numPlayer} <br />
                    Recent Winner: {recentWinner}
                </div>
            ) : (
                <div>No Lottery Address Detected!</div>
            )}
        </div>
    );
}
