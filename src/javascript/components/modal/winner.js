import {showModal} from "./modal";

export function showWinnerModal(fighter) {
  // call showModal function 
  console.log(fighter);
  const winnerInfo = {
    title: 'Winner is ' + fighter.name
    //bodyElement: 
  }
  showModal(winnerInfo);
}
