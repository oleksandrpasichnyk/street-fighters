import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter, firstEvent) {
  const [firstMaxHealth, secondMaxHealth] = [firstFighter.health, secondFighter.health];
  return new Promise((resolve) => {
    let pressedKeys = [];
    getPressedKey(firstEvent);

    function getPressedKey(event){
      let code = event.code;
      pressedKeys.push(code);
      setTimeout(() => { 
        if(pressedKeys.length !== 0){
          playRound(pressedKeys, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth);
          if(isFinished(firstFighter, secondFighter)){
            if(firstFighter.health <= 0 || secondFighter.health <= 0){
              document.removeEventListener('keydown', getPressedKey, false);
              firstFighter.health <= 0  ? resolve(secondFighter) : resolve(firstFighter);
            }else {
              reject(new Error("Can't determine a winner!"))
            }
          }
          pressedKeys = [];
          }
      }, 200);
    }
    document.addEventListener('keydown', getPressedKey, false);
  });
}

function isFinished(firstFighter, secondFighter){
  return firstFighter.health <= 0 || secondFighter.health <= 0;
}

// function getWinner(firstFighter, secondFighter, getPressedKey){
//   return new Promise((resolve, reject) => {
//     if(firstFighter.health <= 0 || secondFighter.health <= 0){
//       document.removeEventListener('keydown', getPressedKey, false);
//       firstFighter.health <= 0  ? resolve(secondFighter) : resolve(firstFighter);
//     }else {
//       reject(new Error("Can't determine a winner!"))
//     }
//   });
// }

export function getDamage(attacker, defender) {
  let attackValue = getHitPower(attacker);
  let defenseValue = getBlockPower(defender)
  return  defenseValue >= attackValue ? 0 : attackValue - defenseValue;
}

export function getHitPower(fighter) {
  let randomNumber = Math.random() + 1;
  return fighter.attack * randomNumber;
}

function getComboPower(fighter) {
  return fighter.attack * 2;
}

export function getBlockPower(fighter) {
  let randomNumber = Math.random() + 1;
    return fighter.defense * randomNumber;
}

function isCombo(combination, pressedKeys){
  let isComboAttack = controls[combination].every(v => pressedKeys.includes(v));
  if(!isComboAttack){return [false, pressedKeys]};
  controls[combination].forEach(key => {
    pressedKeys.splice(pressedKeys.indexOf(key), 1);
  });
  return [isComboAttack, pressedKeys];
};

function isValidInterval(previousTime, currentTime){
  if(previousTime === undefined){
    return true;
  }
  let seconds = (currentTime - previousTime) / 1000;
  return seconds >= 10 ? true : false;
}

function checkComboInterval(isComboAttack, pressedKeys, previousTime, currentTime, playerIndex){
  if(isComboAttack && isValidInterval(previousTime, currentTime)){
    pressedKeys.push(playerIndex === 1 ? 'PlayerOneCombo' : 'PlayerTwoCombo');
    previousTime = currentTime;
  }
  return [pressedKeys, previousTime];
}

let previousTimeFirst, previousTimeSecond;

function playRound(pressedKeys, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth) {
  let isComboFirst, isComboSecond, firstFighterAction, secondFighterAction;
  let currentTime = new Date();

  console.log(pressedKeys);

  [isComboFirst, pressedKeys] = [...isCombo('PlayerOneCriticalHitCombination', pressedKeys)];
  [isComboSecond, pressedKeys] = [...isCombo('PlayerTwoCriticalHitCombination', pressedKeys)];

  [pressedKeys, previousTimeFirst] = [...checkComboInterval(isComboFirst, pressedKeys, previousTimeFirst, currentTime, 1)];
  [pressedKeys, previousTimeSecond] = [...checkComboInterval(isComboSecond, pressedKeys, previousTimeSecond, currentTime, 2)];
  
  firstFighterAction = chooseOneAction(pressedKeys, 1);
  secondFighterAction = chooseOneAction(pressedKeys, 2);
  console.log(pressedKeys);
  console.log(firstFighterAction);
  console.log(secondFighterAction);
  calculateRound(firstFighterAction, secondFighterAction, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth)
}

function chooseOneAction(pressedKeys, fighterIndex){
  let fighterAction;

  if(pressedKeys.includes(fighterIndex === 1 ? 'PlayerOneCombo' : 'PlayerTwoCombo')){
    fighterAction = 'combo';
    console.log('It`s a combo!');
    return fighterAction;
  }
  
  if(pressedKeys.includes(fighterIndex === 1 ? controls.PlayerOneBlock : controls.PlayerTwoBlock)){
    fighterAction = 'block';
    return fighterAction;
  }

  if(pressedKeys.includes(fighterIndex === 1 ? controls.PlayerOneAttack : controls.PlayerTwoAttack)){
    fighterAction = 'attack';
    return fighterAction;
  }
}

function calculateRound(firstAction, secondAction, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth){
  let damage;
  
  if(firstAction === 'block' && secondAction !== 'combo'){return 0}
  if(secondAction === 'block' && firstAction !== 'combo'){return 0}

  if(firstAction === 'combo' || firstAction === 'attack'){
    firstAction === 'combo' ? damage = getComboPower(firstFighter) : damage = getDamage(firstFighter, secondFighter);
    secondFighter.health -= damage;
    renderBar('#right-fighter-indicator', secondFighter.health, secondMaxHealth);
  }

  if(secondAction === 'combo' || secondAction === 'attack'){
    secondAction === 'combo' ? damage = getComboPower(secondFighter) : damage = getDamage(secondFighter, firstFighter);
    firstFighter.health -= damage;
    renderBar('#left-fighter-indicator', firstFighter.health, firstMaxHealth);
  }
}

function renderBar(barId, health, maxhealth){
  let bar = document.querySelector(barId);
  if(health <= 0){
    bar.style.width = 0;
  }else{
    bar.style.width = ((100*health)/maxhealth).toFixed(0) + '%';
  }
  
}