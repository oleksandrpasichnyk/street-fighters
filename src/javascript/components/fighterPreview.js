import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  let {source, name, health, attack, defense} = fighter;
  const positionClassName = position === 'right' ? 'fighter-preview___right fighter-preview' : 'fighter-preview___left fighter-preview';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  let preview = document.createElement("div");
  preview.innerHTML = `<img src="${source}" alt="">
                <h1>${name}</h1>
                <p>Health: ${health} </p>
                <p>Attack: ${attack}</p>
                <p>Defence: ${defense}</p>`
  fighterElement.append(preview);

  // todo: show fighter info (image, name, health, etc.)

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
