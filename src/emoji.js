export function getEmojis(count) {
    let emojis = Array(count).fill(null);
    for (let x = 0; x < emojis.length; x++) {
        let emoji = getRandomEmoji();
        // we can't have duplicates
        while (emojis.indexOf(emoji) > 0) {
            emoji = getRandomEmoji();
        }
        emojis[x] = emoji;
    }

    return shuffle(emojis.concat(emojis));
}

// grab a random emoji.  128512 is the first emoji character, and there are 78 emojis
function getRandomEmoji() {
    const rando = Math.floor(Math.random() * 1000 % 78) - 1;
    return String.fromCodePoint(128512 + rando);
}

// randomize the order of the array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    var tmpArray = array.slice();
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = tmpArray[currentIndex];
      tmpArray[currentIndex] = tmpArray[randomIndex];
      tmpArray[randomIndex] = temporaryValue;
    }
  
    return tmpArray;
}
