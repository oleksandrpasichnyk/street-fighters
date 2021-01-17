import {showModal} from "./modal";

export function showWinnerModal(fighter) {
  // call showModal function 
  let winnerData = document.createElement('div');
  winnerData.classList.add('winner-data');
  let winnerImage = document.createElement('img');
  winnerImage.classList.add('winner-image');
  winnerImage.src = fighter.source;
  let winnerIndexes = document.createElement('p');
  winnerIndexes.classList.add('winner-indexes');
  winnerIndexes.innerHTML = `
    id: ${fighter._id};<br>
    health: ${fighter.health};<br>
    attack: ${fighter.attack};<br>
    defense: ${fighter.defense};
  `

  winnerData.append(winnerImage, winnerIndexes);

  console.log(fighter);
  const winnerInfo = {
    title: 'Winner is ' + fighter.name,
    bodyElement: winnerData
  }
  showModal(winnerInfo);
}
