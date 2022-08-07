import { ConnectButton, Row, Col } from "web3uikit";
// import * as React from "react";

export default function Header() {
    return (
        <div>
            <Row alignItems="center">
                {/* <Col
                    breakpointsConfig={{
                        lg: 24,
                        md: 24,
                        sm: 16,
                        xs: 8,
                    }}
                    span={12}
                >
                    <div className="logo">Decentralized Lottery</div>
                </Col> */}
            </Row>

            <ConnectButton moralisAuth={false} />
        </div>
    );
}
