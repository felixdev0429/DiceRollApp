import { useState } from "react";
import { ethers } from "ethers";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useWallet, UseWalletProvider } from 'use-wallet';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {play} from "./contracts/DiceRoll";
import {
  isWalletConnected,
  shortenWalletAddress,
  getWalletAddress
} from "./lib/wallet";

const Gembites = () => {
  const wallet = useWallet();
  const [betNumber, setBetNumber] = useState('0');
  const [betAmount, setBetAmount] = useState('0');
  const [gameResult, setGameResult] = useState(null);
  const [canPlay, setBetPlay] = useState(true);

  const onPlayClick = async () => {
    if (wallet && wallet.ethereum) {
      setBetPlay(false);  
      setGameResult(null);
      const provider = new ethers.providers.Web3Provider(wallet.ethereum);
      const signer = await provider.getSigner();
      let win = await play(betNumber, betAmount, signer);
      console.log(win);
      setGameResult(win);
      setBetPlay(true);
    }
  }

  return (
    <Container className="p-3">
    <Row>
      <Col className="text-center">
        <Row>
          <Col className="d-flex justify-content-end">
            {!isWalletConnected(wallet) ? 
              <Button onClick={() => wallet.connect("injected")} >Connect</Button>:
              <Button >{shortenWalletAddress(getWalletAddress(wallet))}</Button>
            }
          </Col>
        </Row>
        <h1 className="mt-5 mb-5">Gembites Dice Roll</h1>
        <Row className="mt-5 mb-5">
          <Col><h2>Bet number</h2></Col>
          <Col>
            <Form.Control type="text" placeholder="Number" value={betNumber} onChange={(e) => setBetNumber(e.target.value)}/>
          </Col>
          <Col> </Col>
        </Row>
        
        <Row className="mt-5 mb-5">
          <Col><h2>Bet Amount</h2></Col>
          <Col>
            <Form.Control type="text" placeholder="Amount" value={betAmount} onChange={(e) => setBetAmount(e.target.value)}/>
          </Col>
          <Col>   
           <Button disabled={!canPlay} onClick={() => onPlayClick()}>Play</Button>
          </Col>
        </Row>
        { gameResult !== null &&  (
          gameResult ? (<h1 className="text-success">Win</h1>) : (<h1 className="text-danger">Lose</h1>))}

      </Col>
    </Row>
    </Container>
  );
}

const App = () => (
  <UseWalletProvider
    chainId={80001}
    connectors={{
      walletconnect: { rpcUrl: "https://rpc-mumbai.maticvigil.com" },
    }}
  >
    <Gembites />
  </UseWalletProvider>
)

export default App;
