import { ethers } from "ethers";
import DiceRoll_abi from './DiceRoll.abi.json';
import RNG_abi from './RNG.abi.json';
import gbts_abi from './GBTS.abi.json';
import {getBigNumber} from '../lib/helper';
import mumbaiSecret from '../secret.mumbai.json';

export async function play(number, amount, signer) {

  const DiceRoll = new ethers.Contract(mumbaiSecret.DiceRollAddress, DiceRoll_abi, signer);
  const RNG = new ethers.Contract(mumbaiSecret.RNGAddress, RNG_abi, signer);
  const GBTS = new ethers.Contract(mumbaiSecret.GBTSAddress, gbts_abi, signer);

  await GBTS.approve(mumbaiSecret.DiceRollAddress, getBigNumber(amount));
  DiceRoll.bet(number, getBigNumber(amount), false);

  RNG.on("randomNumberArrived", (arrived, number, requestId) => {
    console.log('randomNumberArrived: ', arrived);
    console.log('Random Number: ', number);
    console.log('Request Id: ', requestId);
  })

  return new Promise((resolve, reject) => {

    DiceRoll.on("BetFinished", (player, expectedWin, win, betInfo) => {
      console.log("Game Number:", betInfo[7]);
      console.log("User Number: ", betInfo[1]);
      resolve(win) 
    });
  })
}