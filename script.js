let bet = 50, balance = 10000, wonForSpin = 0, bonusGameStarted = false, bonusGameStartedTrigger = true, bonusGameSpins, bonusGameWon = 0, wildMemory = [], wildMemoryItems = 0;
let gameArea = Array(3).fill().map(() => Array(5).fill(0));
let payLines = [], payLinesIndex = 0;
let time = 50, step = 1, isLocked = false;

let isPlaying = false, slotMusic = new Audio('sound/Як козаки інопланетян зустрічали.mp3'), bonusMusic = new Audio('sound/Як козаки в футбол грали.mp3');
slotMusic.loop = "true";

slotMusic.onplaying = () => {
    isPlaying = true;
};
slotMusic.onpause = () => {
    isPlaying = false;
};

document.body.onkeyup = (e) => {
    if ((e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32) && isLocked == false) {
        spin();
    }
}

let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let updateGame = () => {
    drawSpin();

    let betArea = document.getElementById('bet');
    let balanceArea = document.getElementById('balance');

    betArea.innerHTML = bet;
    balanceArea.innerHTML = balance;
}

let musicSelected = () => {
    let musicButton = document.querySelector('#musicButton');

    if (isPlaying) {
        bonusGameStarted == true ? bonusMusic.pause() : slotMusic.pause();
        musicButton.style.border = '2px solid red';
    } else {
        bonusGameStarted == true ? bonusMusic.play() : slotMusic.play();
        musicButton.style.border = '2px solid green';
    }
}

let outNum = (numEnd, numStart, element, isUp) => {
    let e = document.querySelector(element);

    let t = Math.round(time / (numEnd / step));
    let interval = setInterval(() => {
        if(isUp == true) {
            numStart = numStart + step;

            if (numStart == numEnd) {
                clearInterval(interval);
            }
        }

        if(isUp == false) {
            numStart = numStart - step;
            
            if (numStart == numEnd) {
                clearInterval(interval);
            }
        }

        e.innerHTML = numStart;
    }, t);
}

let betUp = () => {
    if(bet < 100) {
        outNum(bet+10, bet, '#bet', true)

        bet += 10;          
    }
}

let betDown = () => {
    if(bet > 10) {
        outNum(bet-10, bet, '#bet', false)

        bet -= 10;
    }
}

let drawPlayedLines = async () => {
    try {
        for(let c = 0; c >= 0; c++) {
            for(let i = 0; i < payLinesIndex; i++) {
                for(let j = 0; j < payLines[i].length; j++) {
                    let point = document.getElementById(payLines[i][j]);
        
                    point.style.backgroundColor = "yellow";
                    point.style.border = "2px solid brown";
                }
        
                await sleep(500);
        
                for(let j = 0; j < payLines[i].length; j++) {
                    let point = document.getElementById(payLines[i][j]);
        
                    point.style.backgroundColor = "white";
                    point.style.border = "2px solid black";
                }
            } 
        }
    } catch {
        console.log('Skip');
    }   
}

let drawSpin = async () => {
    let area = document.querySelector('#area');
    let payArray = [], k = 0;

    
    for(let i = 0; i < 15; i++) {
        try {
            let point = document.getElementById(i);
            area.removeChild(point);
        } catch {
            break;
        }
    }

    await sleep(500);

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 5; j++) {
            payArray[k++] = gameArea[i][j];
        }
    }

    for(let i = 0; i < 15; i++) {
        let point = document.createElement('div');
        point.className = 'point';
        point.id = i;

        payArray[i] == 1 ? point.style.backgroundImage = "url('images/J.png')" : payArray[i];
        payArray[i] == 2 ? point.style.backgroundImage = "url('images/Q.png')" : payArray[i];
        payArray[i] == 3 ? point.style.backgroundImage = "url('images/K.png')" : payArray[i];
        payArray[i] == 4 ? point.style.backgroundImage = "url('images/A.png')" : payArray[i];
        payArray[i] == 5 ? point.style.backgroundImage = "url('images/Trophy.png')" : payArray[i];
        payArray[i] == 6 ? point.style.backgroundImage = "url('images/Oil.png')" : payArray[i];
        payArray[i] == 7 ? point.style.backgroundImage = "url('images/House.png')" : payArray[i];
        payArray[i] == 8 ? point.style.backgroundImage = "url('images/Oko.png')" : payArray[i];
        payArray[i] == 9 ? point.style.backgroundImage = "url('images/Tur.png')" : payArray[i];
        payArray[i] == 10 ? point.style.backgroundImage = "url('images/Graj.png')" : payArray[i];
        payArray[i] == 11 ? point.style.backgroundImage = "url('images/Wildx1.png')" : payArray[i];
        payArray[i] == 12 ? point.style.backgroundImage = "url('images/Wildx2.png')" : payArray[i];
        payArray[i] == 13 ? point.style.backgroundImage = "url('images/Wildx3.png')" : payArray[i];
        payArray[i] == 14 ? point.style.backgroundImage = "url('images/Scatter.png')" : payArray[i];
        
        area.appendChild(point);
    }
}

let spinWithSpinButton = () => {
    if(isLocked == false) {
        spin();
    }
}

let continueGame = () => {
    let bigWinBoard = document.querySelector('#bigWinBoard');
    bigWinBoard.style.visibility = "hidden";

    isLocked == false;
}

let spin = async () => {
    isLocked = true;
    // outNum(balance, balance-1, '#balance', true)
    let bigWinBoard = document.querySelector('#bigWinBoard');
    let bigWinBoardValue = document.querySelector('#bigWinBoardValue');
    let bigWinBoardText = document.querySelector('#bigWinBoardText');
    let balanceArea = document.getElementById('balance');
    bigWinBoard.style.visibility = "hidden";
    
    if(balance >= bet) {
        //outNum(balance-bet, balance, '#balance', false)

        balance -= bet;
        balanceArea.innerHTML = balance;

        playSpin();
        drawSpin();

        await sleep(500);
        let wonArea = document.querySelector('#won');
        wonArea.innerHTML = wonForSpin;

        if(wonForSpin > 0) {
            // outNum(balance+wonForSpin, balance, '#balance', true)
            balance += wonForSpin;
            balanceArea.innerHTML = balance;

            if(wonForSpin/bet >= 30) {
                bigWinBoardValue.innerHTML = wonForSpin;
                bigWinBoard.style.visibility = "visible";

                wonForSpin/bet >= 30 && wonForSpin/bet < 50 ? bigWinBoardText.innerHTML = "Великий виграш!" : bigWinBoardText;
                wonForSpin/bet >= 50 && wonForSpin/bet < 100 ? bigWinBoardText.innerHTML = "Супер виграш!" : bigWinBoardText;
                wonForSpin/bet >= 100 && wonForSpin/bet < 200 ? bigWinBoardText.innerHTML = "Мега виграш!" : bigWinBoardText;
                wonForSpin/bet >= 200 ? bigWinBoardText.innerHTML = "Грандіозний виграш!" : bigWinBoardText;
            }

            wonForSpin = 0;
        }

        if(payLinesIndex > 0) {
            drawPlayedLines();
        }

        if(bonusGameStarted == true) {
            let bonusArea = document.querySelector('#bonusGameBoard');
            let bonusGameBoardValue = document.querySelector('#bonusGameBoardValue');

            bonusGameBoardValue.innerHTML = "Ви виграли " + bonusGameSpins + " безкоштовних обертань";
            bonusArea.style.visibility = "visible";
        } 

        if(bonusGameStarted == false && wonForSpin/bet < 30) {
            isLocked = false;
        }
    } 
}

let playSpin = () => {
    generateGame();
    calculateWon();
}

let payTable = [
    { symbol: 1, pay: [0, 0, 0.2, 0.5, 1.5] },
    { symbol: 2, pay: [0, 0, 0.2, 0.5, 1.5] },
    { symbol: 3, pay: [0, 0, 0.2, 0.5, 1.5] },
    { symbol: 4, pay: [0, 0, 0.2, 0.5, 1.5] },
    { symbol: 5, pay: [0, 0, 0.5, 1.5, 5] },
    { symbol: 6, pay: [0, 0, 0.5, 2, 5.5] },
    { symbol: 7, pay: [0, 0, 0.5, 2.5, 6] },
    { symbol: 8, pay: [0, 0, 2, 5, 50] },
    { symbol: 9, pay: [0, 0, 2, 5.5, 55] },
    { symbol: 10, pay: [0, 0, 2, 6, 60] },
]

let lines = [
    // 0  1  2  3  4
    // 5  6  7  8  9
    // 10 11 12 13 14
    { line: 1, array: [        
        0, 1, 2, 3, 4          
    ] },                  
    { line: 2, array: [ 
        5, 6, 7, 8, 9
    ] },
    { line: 3, array: [ 
        10, 11, 12, 13, 14
    ] },
    { line: 4, array: [ 
        0, 6, 12, 8, 4
    ] },
    { line: 5, array: [ 
        10, 6, 2, 8, 14
    ] },
    { line: 6, array: [ 
        0, 6, 7, 8, 4
    ] },
    { line: 7, array: [ 
        10, 6, 7, 8, 14
    ] },
    { line: 8, array: [ 
        0, 6, 2, 8, 4
    ] },
    { line: 9, array: [ 
        5, 1, 7, 3, 9
    ] },
    { line: 10, array: [ 
        10, 6, 12, 8, 14
    ] },
    { line: 11, array: [ 
        5, 11, 7, 13, 9
    ] },
    { line: 12, array: [ 
        0, 11, 12, 13, 4
    ] },
    { line: 13, array: [ 
        10, 1, 2, 3, 14
    ] },
    { line: 14, array: [ 
        5, 1, 2, 3, 9
    ] },
    { line: 15, array: [ 
        5, 11, 12, 13, 9
    ] },
    { line: 16, array: [ 
        5, 1, 7, 13, 9
    ] },
    { line: 17, array: [ 
        5, 11, 7, 3, 9
    ] },
    { line: 18, array: [ 
        10, 11, 2, 13, 14
    ] },
    { line: 19, array: [ 
        10, 11, 7, 3, 4
    ] },
    { line: 20, array: [ 
        0, 1, 7, 13, 14
    ] },
]

let getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

let generateSymbol = (symbol) => {
    symbol = getRandomInt(10);

    if(symbol > 4 && symbol < 8) {
        let reroll = getRandomInt(6);

        reroll = 1 ? symbol : getRandomInt(4);
    }

    if(symbol == 8) {
        let reroll = getRandomInt(20);

        reroll = 1 ? symbol : getRandomInt(7);
    }

    if(symbol == 9) {
        let reroll = getRandomInt(25);

        reroll = 1 ? symbol : getRandomInt(7);
    }

    if(symbol == 10) {
        let reroll = getRandomInt(30);

        reroll = 1 ? symbol : getRandomInt(7);
    }

    return symbol;
}

let generateWilds = () => {
    let chance = getRandomInt(3010);

    if(chance >= 1 && chance <= 695) {
        let generatedWild, wild = getRandomInt(3);

        let wildPositionI = getRandomInt(3);
        let wildPositionJ = getRandomInt(3);

        wild == 1 ? generatedWild = 11 : generatedWild;
        wild == 2 ? generatedWild = 12 : generatedWild;
        wild == 3 ? generatedWild = 13 : generatedWild;

        if(gameArea[wildPositionI-1][wildPositionJ] < 11) {
            wildMemory[wildMemoryItems++] = [generatedWild, wildPositionI-1, wildPositionJ];
        
            //console.log('Generated wild ' + generatedWild + ' on position [' + (wildPositionI-1) + '; ' + wildPositionJ + ']');
        }
    }

    for(let wmi = 0; wmi < wildMemoryItems; wmi++) {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 5; j++) {
                if(i == wildMemory[wmi][1] && j == wildMemory[wmi][2]) {
                    gameArea[i][j] = wildMemory[wmi][0];
                }
                if(j == 4 && gameArea[i][j] > 10) {
                    let symbol = getRandomInt(10); 
                    gameArea[i][j] = generateSymbol(symbol);
                }
            }
        }
    }
    
}

let buildSymbol = (i, j, symbol) => {
    let chanceFortune = 7;

    if(j == 0) {         
        symbol = generateSymbol(symbol);
    } else {
        let fortune = getRandomInt(chanceFortune);

        if(gameArea[i][j-1] == 11 && gameArea[i][j-1] == 12 && gameArea[i][j-1] == 13) {
            symbol = generateSymbol(symbol);
        } else {
            fortune == 1 ? symbol = gameArea[i][j-1] : symbol = generateSymbol(symbol);
        }
    }

    return symbol;
}

let generateBonusGame = () => {
    let bonusChance = 173, scatters = 0; 

    for(let i = 0; i < 5; i++) {
        let scatterChance = getRandomInt(bonusChance);
    
        if(scatterChance >= 1 && scatterChance <= 10) {
            let randomPosition = getRandomInt(3);
            gameArea[randomPosition-1][i] = 14;
            scatters++;
        }
    }

    if(scatters >= 3) {
        scatters == 3 ? bonusGameSpins = 10 : bonusGameSpins;
        scatters == 4 ? bonusGameSpins = 15 : bonusGameSpins;
        scatters == 5 ? bonusGameSpins = 20 : bonusGameSpins;

        bonusGameStarted = true;
    }
}

let generateGame = () => {
    for(let j = 0; j < 5; j++) {
        let beautyCol = getRandomInt(3);

        beautyCol == 2 ? beautyCol = getRandomInt(3) : beautyCol;
        beautyCol == 3 ? beautyCol = getRandomInt(3) : beautyCol;

        for(let i = 0; i < 3; i++) {
            if(gameArea[i][j] != 11 && gameArea[i][j] != 12 && gameArea[i][j] != 13) {
                if(i == 0 && beautyCol > 1) {
                    if(beautyCol == 3) {
                        let symbol = buildSymbol(i, j);
    
                        for(let k = 0; k < 3; k++) {
                            gameArea[k][j] = symbol;
                        }
                    }
    
                    if(beautyCol == 2) {
                        let position = getRandomInt(2);
    
                        if(position == 1) {
                            let symbol = buildSymbol(i, j);
    
                            for(let k = 0; k < 2; k++) {
                                gameArea[k][j] = symbol;
                            }
    
                            gameArea[2][j] = generateSymbol(symbol);
                        }
                        
                        if(position == 2) {
                            let symbol = buildSymbol(i, j);
    
                            gameArea[0][j] = generateSymbol(symbol);
    
                            for(let k = 1; k < 3; k++) {
                                gameArea[k][j] = symbol;
                            }
                        }
                    }
                } else if(i >= 0 && beautyCol == 1) {
                    let symbol = buildSymbol(i, j);
    
                    gameArea[i][j] = symbol;
                }
            }
        }
    }
    
    if(bonusGameStarted == false) {
        generateBonusGame();
    }

    if(bonusGameStarted == true) {
        generateWilds();
    }
}

let playBonuseGame = () => {
    //bonusGameSpins = 10;
    bonusGameStartedTrigger = false;
    bonusGameWon = 0;

    for(let i = bonusGameSpins; i > 0; i--) {
        generateGame();
        //printGameArea();
        calculateWon();

        if(bonusGameWon > bet * 5000) {
            bonusGameWon = bet * 5000;

            break;
        }
    }

    //console.log('You won ' + bonusGameWon + 'uah in ' + bonusGameSpins + ' spins');

    //totalBonusesWon += bonusGameWon;

    bonusGameStarted = false;
    bonusGameStartedTrigger = true;
    bonusGameWon = 0;
    wildMemoryItems = 0;
    wildMemory = [];
    gameArea = Array(3).fill().map(() => Array(5).fill(0));
}

let calculateWon = () => {
    let payArray = [], k = 0, totalWon = 0;

    payLines = [];
    payLinesIndex = 0;
    
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 5; j++) {
            payArray[k++] = gameArea[i][j];
        }
    }

    for(let line = 0; line < 20; line++) {
        let paySymbol, counter = 0, lineWon = 0, preArray = [], preArrayIndex = 0;

        if(lines[line].array[0] == 0) {
            paySymbol = payArray[0];
        }
        if(lines[line].array[0] == 5) {
            paySymbol = payArray[5];
        }
        if(lines[line].array[0] == 10) {
            paySymbol = payArray[10];
        }

        let multiplyDetected = 0;

        if(paySymbol != 11) {
            for(let i = 0; i < 5; i++) {
                if((payArray[lines[line].array[i]] == paySymbol || payArray[lines[line].array[i]] == 11 || payArray[lines[line].array[i]] == 12 || payArray[lines[line].array[i]] == 13) && payArray[lines[line].array[i]] != 14) {
                    counter++;
                    preArray[preArrayIndex++] = lines[line].array[i];

                    if(payArray[lines[line].array[i]] == 12) {
                        multiplyDetected += 2;
                    }
                    if(payArray[lines[line].array[i]] == 13) {
                        multiplyDetected += 3;
                    }
                } else {
                    break;
                }
            }
        }

        if(counter >= 3) {
            payLines[payLinesIndex++] = preArray;
        }
        
        multiplyDetected == 0 ? multiplyDetected = 1 : multiplyDetected;

        let symbolName;

        if(paySymbol == 1) {
            symbolName = 'J';
            lineWon = bet * payTable[0].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 2) {
            symbolName = 'Q';
            lineWon = bet * payTable[1].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 3) {
            symbolName = 'K';
            lineWon = bet * payTable[2].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 4) {
            symbolName = 'A';
            lineWon = bet * payTable[3].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 5) {
            symbolName = 'Ō';
            lineWon = bet * payTable[4].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 6) {
            symbolName = 'Ū';
            lineWon = bet * payTable[5].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 7) {
            symbolName = 'Ã';
            lineWon = bet * payTable[6].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 8) {
            symbolName = '$';
            lineWon = bet * payTable[7].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 9) {
            symbolName = '€';
            lineWon = bet * payTable[8].pay[counter-1] * multiplyDetected;
        }
        if(paySymbol == 10) {
            symbolName = '£';
            lineWon = bet * payTable[9].pay[counter-1] * multiplyDetected;
        }

        paySymbol == 11 ? symbolName = '1' : symbolName;
        paySymbol == 12 ? symbolName = '2' : symbolName;
        paySymbol == 13 ? symbolName = '3' : symbolName;
        paySymbol == 14 ? symbolName = '%' : symbolName;

        if(counter >= 3 && symbolName != '%') {
           //console.log('On ' + (line+1) + ' line symbol ' + symbolName + ' repeat ' + counter + ' times. You won: ' + lineWon + 'uah');
        }

        totalWon += lineWon;
        wonForSpin = totalWon;
    }

    // for(let i = 0; i < payLines.length; i++) {
    //     console.log(payLines[i]);
    // }

    bonusGameWon += totalWon;

    // if(bonusGameStartedTrigger == true && bonusGameStarted == true) {
    //     //playBonuseGame();
    // }
    console.log('You won ' + totalWon + 'uah for this spin');
}

updateGame();