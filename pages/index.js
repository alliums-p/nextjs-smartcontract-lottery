import Head from "next/head";
import Image from "next/image";
// import CustomHeader from "../components/CustomHeader";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta
                    name="description"
                    content="Smart Contract Lottery frontend using Nextjs"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <LotteryEntrance />
        </div>
    );
}
