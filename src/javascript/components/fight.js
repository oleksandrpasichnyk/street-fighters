import { controls } from '../../constants/controls';
import { renderArena } from './arena';
const [firstFighter, secondFighter] = [ renderArena.firstFighter, renderArena.secondFighter];

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    setTimeout(() => (firstFighter.health <= 0  ? resolve(secondFighter) : resolve(firstFighter)), 500);
  });
}

export function getDamage(attacker, defender, type) {
  // return damage
  return getBlockPower(defender, type) >= getHitPower(attacker) ? 0 : getHitPower(attacker, type) - getBlockPower(defender, type);
}

export function getHitPower(fighter, type) {
  // return hit power
  if(fighter === null){return 0}
  return type === 'ordinary' ? fighter.attack * Math.random() + 1 : fighter.attack * 2;
}

export function getBlockPower(fighter, type) {
  // return block power
  if(fighter === null){return 0}
  return type === 'ordinary' ? fighter.defense * Math.random() + 1 : 0;
}

let isComboFirst, isComboSecond, index;
let previousTimeFirst, previousTimeSecond, currentTime;
export function keyDownAction(pressedKeys, firstFighter, secondFighter, firstMaxHealth, secondMaxHealth) {
  [isComboFirst, isComboSecond] = [true, true];
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
    
    let damage, attacker = null, defender = null, type = 'ordinary';
    let firstAction = '';
    let secondAction = '';

    for (let i = 0; i < pressedKeys.length; i++) {
      switch(pressedKeys[i]){
        case 'KeyA': firstAction = 'attack', attacker = firstFighter; break;
        case 'KeyD': firstAction = 'block', defender = firstFighter; break;
        case 'KeyJ': secondAction = 'attack', attacker = secondFighter; break;
        case 'KeyL': secondAction = 'block', defender = secondFighter; break;
        case 'KeyComboFirst': firstAction = 'combo', attacker = firstFighter, type = 'combo'; break;
        case 'KeyComboSecond': secondAction = 'combo', attacker = secondFighter, type = 'combo'; break;
      }
    }

    if(firstAction === secondAction){
      //damage = getDamage(attacker, defender, type);
    }else{
      
      damage = getDamage(attacker, defender, type);
      console.log(damage);

      if(defender === null){
        attacker === firstFighter ? defender = secondFighter : defender = firstFighter;
      }
      defender.health -= damage;
      console.log(defender.name + "health: " + defender.health);
      const rightFighterbar = document.querySelector('#right-fighter-indicator');
      const leftFighterbar = document.querySelector('#left-fighter-indicator');
      defender === firstFighter ? renderBar(leftFighterbar, defender.health, secondMaxHealth) : renderBar(rightFighterbar, defender.health, firstMaxHealth);
    }

    function renderBar(bar, health, maxhealth){
      console.log(bar);
      bar.style.width = ((100*health)/maxhealth).toFixed(0) + '%';
      console.log(bar.style.width);
    }
    console.log(firstAction, secondAction);
  }
}