import { controls } from '../../constants/controls';
import { renderArena } from './arena';
const [firstFighter, secondFighter] = [ renderArena.firstFighter, renderArena.secondFighter];

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    setTimeout(() => (firstFighter.health <= 0  ? resolve(secondFighter) : resolve(firstFighter)), 500);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  let attack = getBlockPower(defender);
  let defense = getHitPower(attacker)
  return  defense >= attack ? 0 : attack - defense;
}

export function getHitPower(fighter) {
  // return hit power
  let randomNumber = Math.random() + 1;
  return fighter.attack * randomNumber;
}

export function getComboPower(fighter) {
  // return hit power
  return fighter.attack * 2;
}

export function getBlockPower(fighter) {
  // return block power
  let randomNumber = Math.random() + 1;
    return fighter.defense * randomNumber;
}

let isComboFirst, isComboSecond, index;
let previousTimeFirst, previousTimeSecond, currentTime;
export function keyDownAction(pressedKeys, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth) {
  [isComboFirst, isComboSecond] = [true, true];
  console.log(pressedKeys);
  controls.PlayerOneCriticalHitCombination.forEach(key => {
    isComboFirst = isComboFirst && pressedKeys.includes(key);
    if(!isComboFirst){return 0};
    index = pressedKeys.indexOf(key)
    pressedKeys.splice(index, 1);
  });

  controls.PlayerTwoCriticalHitCombination.forEach(key => {
    isComboSecond = isComboSecond && pressedKeys.includes(key);
    if(!isComboSecond){return 0};
    index = pressedKeys.indexOf(key)
    pressedKeys.splice(index, 1);
  });

  currentTime = new Date();

  function isValidInterval(previousTime){
    if(previousTime === undefined){
      return true;
    }
    let seconds = (currentTime - previousTime) / 1000;
    console.log(seconds);
    return seconds >= 10 ? true : false;
  }

  if(isComboFirst && isValidInterval(previousTimeFirst)){    
    pressedKeys.push('KeyComboFirst');
    previousTimeFirst = currentTime;
  }

  if(isComboSecond && isValidInterval(previousTimeSecond)){
    pressedKeys.push('KeyComboSecond')
    previousTimeSecond = currentTime;
  }

  if(pressedKeys.includes(controls.PlayerOneAttack) && pressedKeys.includes(controls.PlayerOneBlock)){
    index = pressedKeys.indexOf(controls.PlayerOneAttack);
    pressedKeys.splice(index, 1);
  }

  if(pressedKeys.includes(controls.PlayerTwoAttack) && pressedKeys.includes(controls.PlayerTwoBlock)){
    index = pressedKeys.indexOf(controls.PlayerTwoAttack);
    pressedKeys.splice(index, 1);
  }
  //pressedKeys = pressedKeys.filter(key => Object.values(controls).includes(key));
  if(pressedKeys.length != 0){ 
    console.log(pressedKeys);
    let damage;
    let firstAction = '';
    let secondAction = '';

    for (let i = 0; i < pressedKeys.length; i++) {
      switch(pressedKeys[i]){
        case 'KeyA': firstAction = 'attack'; break;
        case 'KeyD': firstAction = 'block'; break;
        case 'KeyJ': secondAction = 'attack'; break;
        case 'KeyL': secondAction = 'block'; break;
        case 'KeyComboFirst': firstAction = 'combo'; break;
        case 'KeyComboSecond': secondAction = 'combo'; break;
      }
    }

    const rightFighterbar = document.querySelector('#right-fighter-indicator');
    const leftFighterbar = document.querySelector('#left-fighter-indicator');
    if(firstAction === 'block' && secondAction !== 'combo'){return 0}
    if(secondAction === 'block' && firstAction !== 'combo'){return 0}

    if(firstAction === 'combo' || firstAction === 'attack'){
      firstAction === 'combo' ? damage = getComboPower(firstFighter) : damage = getDamage(firstFighter, secondFighter);
      secondFighter.health -= damage;
      console.log(damage);
      renderBar(rightFighterbar, secondFighter.health, secondMaxHealth);
    }

    if(secondAction === 'combo' || secondAction === 'attack'){
      secondAction === 'combo' ? damage = getComboPower(secondFighter) : damage = getDamage(secondFighter, firstFighter);
      firstFighter.health -= damage;
      console.log(damage);
      renderBar(leftFighterbar, firstFighter.health, firstMaxHealth);
    }

    function renderBar(bar, health, maxhealth){
      console.log(bar);
      bar.style.width = ((100*health)/maxhealth).toFixed(0) + '%';
      console.log(bar.style.width);
    }
    console.log(firstAction, secondAction);
  }
}