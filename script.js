let bet = 50, balance = 1000000, startDraw = true, wonForSpin = 0, bonusGameStarted = false, bonusGameStartedTrigger = true, bonusGameSpins, bonusGameWon = 0, wildMemory = [], wildMemoryItems = 0;
let gameArea = Array(3).fill().map(() => Array(5).fill(0));
let payLines = [], payLinesIndex = 0;
let isLocked = false, bonusBuyActive = false, bonusBuySpins, isMusic = true, goldenBet = false, firstDraw = true;
let slotMusic = new Audio('sound/Як козаки інопланетян зустрічали.mp3'), bonusMusic = new Audio('sound/Нечиста сила.mp3'), bonusMusicStart = new Audio('sound/bonusMusicStart.mp3'), spinSound = new Audio('sound/spin2.mp3'), touchSound = new Audio('sound/touch.mp3'), bigWinSound = new Audio('sound/bigWinMusic.mp3'), bigWinSoundStart = new Audio('sound/bigWinPreload.mp3'), bigWinSoundEnd = new Audio('sound/bigWinEnd.mp3'), wonSound = new Audio('sound/wonSound.wav');
let payArray = [], payArrayIndex = 0;
let cancelled = false, timePressed, continueSpin = true, cancelledAutoSpins = true;

slotMusic.loop = "true", bonusMusic.loop = "true", slotMusic.volume = 0, bonusMusic.volume = 0, spinSound.volume = 0, bonusMusicStart.volume = 0, bigWinSound.volume = 0, bigWinSoundStart.volume = 0, wonSound.volume = 0, touchSound.volume = 0, bigWinSoundEnd.volume = 0;

let spinButton = document.querySelector('#spinButton');

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
    // 0  1  2  3  4
    // 5  6  7  8  9
    // 10 11 12 13 14
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#previewContainer').style.visibility = 'visible';
});

document.body.onkeyup = (e) => {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
        stopAutoSpins();

        if(isLocked == false) {
            spin();
        }
        
        stopFunction();
    }
}

document.body.onkeydown = (e) => {
    if(e.key == " " || e.code == "Space" || e.keyCode == 32) {
        setTimeout(() => {
            stopAutoSpins();

            if(isLocked == false) {
                turboSpin();
            }
        }, 500)
    }
}

let stopFunction = () => {
    cancelled = true;
}

let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let closePreview = () => {
    document.querySelector('#previewContainer').style.visibility = 'hidden';
    document.querySelector('#gameContainer').style.visibility = 'visible';

    updateGame();
    musicSelected();
    
    slotMusic.play();
}

let closeValueWarning = () => {
    let valueWarningBlock = document.querySelector('#valueWarning');
    valueWarningBlock.style.visibility = 'hidden';

    isLocked = false;
}

let drawMoneyValue = (element, value, additionalInformation) => {
    let rounded = 100, currency = '₴'; //₴

    if(additionalInformation) {
        element.innerHTML = additionalInformation + ((value / rounded).toFixed(2) + currency);
    } else {
        element.innerHTML = (value / rounded).toFixed(2) + currency;
    }
    
}

let doublechache = () => {
    if(bonusGameStarted) {
        return;
    }

    let doubleChancheButton = document.getElementById('doubleChancheButton');
    let totalbet;
    let betArea = document.getElementById('bet');

    if(goldenBet == false) {
        goldenBet = true;
        totalbet = bet + bet / 2;

        doubleChancheButton.style.color = 'rgb(194, 194, 0)';
        doubleChancheButton.style.borderColor = 'yellow';

        drawMoneyValue(betArea, totalbet);
    } else {
        goldenBet = false;
        totalbet = bet;

        doubleChancheButton.style.color = 'black';
        doubleChancheButton.style.borderColor = 'red';

        drawMoneyValue(betArea, totalbet);
    }
}

let drawNumber = async (e, startValue, step, number, t) => {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            startValue = startValue + step;
    
            drawMoneyValue(e, startValue);
    
            if(cancelled) {
                cancelled = false;
    
                drawMoneyValue(e, number);
                clearInterval(interval);
                resolve('end');
    
                bigWinSound.pause();
                bigWinSoundEnd.play();
            }
    
            if (startValue >= number) {
                drawMoneyValue(e, number);
                clearInterval(interval);
                resolve('end');
            }
        }, t);

    })
}

let outputNumber = async (number, elementId, isTurbo) => {
    let e = document.getElementById(elementId), startValue = 0, time = 8000, step = Math.round(number / 300);
    let t = Math.round(time / (number / step));

    if(isTurbo) {
        cancelled = true;
    } else {
        cancelled = false;
    }

    let stop = await drawNumber(e, startValue, step, number, t);
}

let updateGame = () => {
    drawSpin();
    checkBonusBuy();

    let totalbet;
    let wonArea = document.getElementById('won');
    let betArea = document.getElementById('bet');
    let betAreaBB = document.getElementById('bet2');
    let balanceArea = document.getElementById('balance');

    if(goldenBet == true) {
        totalbet = bet + bet / 2;
    } else {
        totalbet = bet;
    }

    drawMoneyValue(wonArea, 0);
    drawMoneyValue(betArea, totalbet);
    drawMoneyValue(betAreaBB, bet);
    drawMoneyValue(balanceArea, balance);
}

let musicSelected = () => {
    let musicButton = document.querySelector('#musicButton');

    if(isMusic) {
        slotMusic.volume = 1;
        bonusMusic.volume = 1;
        spinSound.volume = 1;
        bonusMusicStart.volume = 1;
        bigWinSound.volume = 1;
        bigWinSoundStart.volume = 1;
        wonSound.volume = 1;
        touchSound.volume = 1;
        bigWinSoundEnd.volume = 1;

        musicButton.style.border = '2px solid green';

        isMusic = false;
    } else {
        slotMusic.volume = 0;
        bonusMusic.volume = 0;
        spinSound.volume = 0;
        bonusMusicStart.volume = 0;
        bigWinSound.volume = 0;
        bigWinSoundStart.volume = 0;
        wonSound.volume = 0;
        touchSound.volume = 0;
        bigWinSoundEnd.volume = 0;

        musicButton.style.border = '2px solid red';

        isMusic = true;
    }
}

let openInformation = () => {
    try {
        for(let i = 1; i <= 10; i++) {
            let payId = 'pay' + i;
            let paySymbol = document.getElementById(payId);
    
            for(let j = 5; j >= 3; j--) {
                let paySymbolId = 'symbolInfo' + j;
                let paySymbolInformation = document.getElementById(paySymbolId);
                paySymbol.removeChild(paySymbolInformation);
            }
        }
    } catch {

    }

    for(let i = 1; i <= 10; i++) {
        let payId = 'pay' + i;
        let paySymbol = document.getElementById(payId);

        for(let j = 5; j >= 3; j--) {
            let paySymbolInformation = document.createElement('b');

            paySymbolInformation.id = 'symbolInfo' + j;
            drawMoneyValue(paySymbolInformation, (bet * payTable[i-1].pay[j-1]), (j + ' - '));
            paySymbol.appendChild(paySymbolInformation);
        }
    }

    let minBetBlock = document.querySelector('#minBet');
    let maxBetBlock = document.querySelector('#maxBet');

    drawMoneyValue(minBetBlock, 10, 'Мінімальна ставка: ');
    drawMoneyValue(maxBetBlock, 10000, 'Максимальна ставка: ');

    let informationBoard = document.querySelector('#informationBoard');
    informationBoard.style.visibility = 'visible';
}

let closeInformation = () => {
    let informationBoard = document.querySelector('#informationBoard');
    informationBoard.style.visibility = 'hidden';
} 

let buy = (numOfSpins) => {
    if(numOfSpins == 10 && balance >= bet * 100) {
        balance -= bet * 99;
        bonusBuySpins = 3;
        bonusBuyActive = true;

        let bonusBuyArea = document.querySelector("#bonusBuy");
        let balanceArea = document.getElementById('balance');

        drawMoneyValue(balanceArea, balance);
        bonusBuyArea.style.visibility = 'hidden';

        spin();
    }
    if(numOfSpins == 15 && balance >= bet * 300) {
        balance -= bet * 299;
        bonusBuySpins = 4;
        bonusBuyActive = true;

        let bonusBuyArea = document.querySelector("#bonusBuy");
        let balanceArea = document.getElementById('balance');

        drawMoneyValue(balanceArea, balance);
        bonusBuyArea.style.visibility = 'hidden';

        spin();
    }
    if(numOfSpins == 20 && balance >= bet * 650) {
        balance -= bet * 649;
        bonusBuySpins = 5;
        bonusBuyActive = true;

        let bonusBuyArea = document.querySelector("#bonusBuy");
        let balanceArea = document.getElementById('balance');

        drawMoneyValue(balanceArea, balance);
        bonusBuyArea.style.visibility = 'hidden';

        spin();
    }
    if(numOfSpins == 25 && balance >= bet * 350) {
        balance -= bet * 349;
        bonusBuySpins = getRandomIntDiapasone(3, 6);
        bonusBuyActive = true;

        let bonusBuyArea = document.querySelector("#bonusBuy");
        let balanceArea = document.getElementById('balance');

        drawMoneyValue(balanceArea, balance);
        bonusBuyArea.style.visibility = 'hidden';

        spin();
    }
}

let checkBonusBuy = () => {
    let bonusBuyPrice10 = document.querySelector("#bonusBuyPrice10");
    let bonusBuyPrice15 = document.querySelector("#bonusBuyPrice15");
    let bonusBuyPrice20 = document.querySelector("#bonusBuyPrice20");
    let bonusBuyPrice25 = document.querySelector("#bonusBuyPrice25");

    drawMoneyValue(bonusBuyPrice10, (bet * 100));
    drawMoneyValue(bonusBuyPrice15, (bet * 300));
    drawMoneyValue(bonusBuyPrice20, (bet * 650));
    drawMoneyValue(bonusBuyPrice25, (bet * 350));

    if(balance < bet * 100) {
        bonusBuyPrice10.style.color = 'red';
    } else {
        bonusBuyPrice10.style.color = 'black';
    }
    if(balance < bet * 300) {
        bonusBuyPrice15.style.color = 'red';
    } else {
        bonusBuyPrice15.style.color = 'black';
    }
    if(balance < bet * 650) {
        bonusBuyPrice20.style.color = 'red';
    } else {
        bonusBuyPrice20.style.color = 'black';
    }
    if(balance < bet * 350) {
        bonusBuyPrice25.style.color = 'red';
    } else {
        bonusBuyPrice25.style.color = 'black';
    }
}

let bonusBuy = () => {
    if(!bonusGameStarted) {
        isLocked = true;
        let bonusBuyArea = document.querySelector("#bonusBuy");
        bonusBuyArea.style.visibility = 'visible';
    }
}

let openAutoSpinNavigation = () => {
    if(bonusGameStarted) {
        return;
    }

    if(cancelledAutoSpins == false) {
        stopAutoSpins();

        return;
    }
 
    let autoSpinsBoard = document.querySelector('#autoSpinsBoard');

    autoSpinsBoard.style.visibility = 'visible';
}

const numberOfAutoSpinsValue = document.querySelector("#numberOfAutoSpinsValue");
const numberOfAutoSpinsInput = document.querySelector("#numberOfAutoSpinsInput");

numberOfAutoSpinsValue.textContent = numberOfAutoSpinsInput.value;

numberOfAutoSpinsInput.addEventListener("input", (event) => {
    numberOfAutoSpinsValue.textContent = event.target.value;
});

let startAutoSpins = async () => {
    let autoSpinsBoard = document.querySelector('#autoSpinsBoard');
    let autoSpinsNumber = document.querySelector('#numberOfSpins');

    let autoSpins = numberOfAutoSpinsInput.value;
    autoSpinsNumber.innerHTML = autoSpins;
    autoSpinsNumber.style.visibility = 'visible';

    autoSpinsBoard.style.visibility = 'hidden';
    cancelledAutoSpins = false;

    for(let i = autoSpins; i > 0; i--) {
        if(cancelledAutoSpins || bonusGameStarted) {
            stopAutoSpins();

            return;
        }

        autoSpins--;
        autoSpinsNumber.innerHTML = autoSpins;

        await spin();
    }

    stopAutoSpins();
}

let stopAutoSpins = () => {
    let autoSpinsNumber = document.querySelector('#numberOfSpins');
    autoSpinsNumber.style.visibility = 'hidden';

    cancelledAutoSpins = true;
}

let closeAutoSpins = () => {
    let autoSpinsBoard = document.querySelector('#autoSpinsBoard');

    autoSpinsBoard.style.visibility = 'hidden';
}

let closeBonusBuy = () => {
    isLocked = false;

    let bonusBuyArea = document.querySelector("#bonusBuy");
    bonusBuyArea.style.visibility = 'hidden';
}

let betUp = () => {
    if(!bonusGameStarted) {
        if(bet < 10000) {
            let betArea = document.querySelector('#bet');
            let betArea2 = document.querySelector('#bet2');
            let totalbet;
    
            if(bet < 100) {
                bet += 10;
            } else if(bet < 1000) {
                bet += 100;
            } else if(bet >= 1000) {
                bet += 1000;
            }
    
            if(goldenBet == true) {
                totalbet = bet + bet / 2;
            } else {
                totalbet = bet;
            }

            drawMoneyValue(betArea, totalbet);
            drawMoneyValue(betArea2, bet);
    
            checkBonusBuy();
        }
    }
}

let betDown = () => {
    if(!bonusGameStarted) {
        if(bet > 10) {
            let betArea = document.querySelector('#bet');
            let betArea2 = document.querySelector('#bet2');
            let totalbet;

            if(bet <= 100) {
                bet -= 10;
            } else if(bet <= 1000) {
                bet -= 100;
            } else if(bet > 1000) {
                bet -= 1000;
            }

            if(goldenBet == true) {
                totalbet = bet + bet / 2;
            } else {
                totalbet = bet;
            }

            drawMoneyValue(betArea, totalbet);
            drawMoneyValue(betArea2, bet);

            checkBonusBuy();
        }
    }
}

let maxBet = () => {
    if(!bonusGameStarted) {
        let betArea = document.querySelector('#bet');
        let betArea2 = document.querySelector('#bet2');
        let totalbet;

        bet = 10000;

        if(goldenBet == true) {
            totalbet = bet + bet / 2;
        } else {
            totalbet = bet;
        }

        drawMoneyValue(betArea, totalbet);
        drawMoneyValue(betArea2, bet);

        checkBonusBuy();
    }
}

let drawPlayedLines = async (isTurbo) => {
    if(isTurbo) {
        cancelled = true;
    } else {
        cancelled = false;
    }

    for(let i = 0; i < payLinesIndex; i++) {
        for(let j = 1; j < 6; j++) {
            if(payLines[i][j] != null) {
                let point = document.getElementById(payLines[i][j]);
                point.style.backgroundColor = "yellow";
            } else {
                let point = document.getElementById(lines[payLines[i][0]].array[j-1]);
                point.style.backgroundColor = "rgb(255, 255, 213)";
            }
        }

        await sleep(750);

        for(let j = 1; j < 6; j++) {
            if(payLines[i][j] != null) {
                let point = document.getElementById(payLines[i][j]);
                point.style.backgroundColor = "white";
            } else {
                let point = document.getElementById(lines[payLines[i][0]].array[j-1]);
                point.style.backgroundColor = "white";
            }
        }

        if(cancelled) {
            cancelled = false;

            return;
        }
    } 
}

let drawSymbol = (symbol, payArray, i, j, scattersChecked) => {
    symbol.style.backgroundColor = 'white';

    if(payArray[i+j] == 1) { symbol.style.backgroundImage = "url('images/J.png')" };
    if(payArray[i+j] == 2) { symbol.style.backgroundImage = "url('images/Q.png')" };
    if(payArray[i+j] == 3) { symbol.style.backgroundImage = "url('images/K.png')" };
    if(payArray[i+j] == 4) { symbol.style.backgroundImage = "url('images/A.png')" };
    if(payArray[i+j] == 5) { symbol.style.backgroundImage = "url('images/Trophy.png')" };
    if(payArray[i+j] == 6) { symbol.style.backgroundImage = "url('images/Oil.png')" };
    if(payArray[i+j] == 7) { symbol.style.backgroundImage = "url('images/House.png')" };
    if(payArray[i+j] == 8) { symbol.style.backgroundImage = "url('images/Oko.png')" };
    if(payArray[i+j] == 9) { symbol.style.backgroundImage = "url('images/Tur.png')" };
    if(payArray[i+j] == 10) { symbol.style.backgroundImage = "url('images/Graj.png')" };
    if(payArray[i+j] == 11) { symbol.style.backgroundImage = "url('images/Wildx1.png')" };
    if(payArray[i+j] == 12) { symbol.style.backgroundImage = "url('images/Wildx2.png')" };
    if(payArray[i+j] == 13) { symbol.style.backgroundImage = "url('images/Wildx3.png')" };

    if(payArray[i+j] == 14) {
        scattersChecked++;
        symbol.style.backgroundImage = "url('images/Scatter.png')";
        symbol.style.border = '2px solid yellow';
    } else if(payArray[i+j] >= 11 && payArray[i+j] <= 13) {
        symbol.style.border = '2px solid blue';
    } else {
        symbol.style.border = '2px solid black';
    }

    symbol.style.visibility = 'visible';
}

let hiddenSymbol = (symbol) => {
    symbol.style.visibility = 'hidden';
}

let destroyGameAreaTurbo = async (payArray, scattersChecked) => {
    return new Promise(async resolve => {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 5; j++) {
                if(i == 0) {
                    hiddenSymbol(document.getElementById(i+j));
                    drawSymbol(document.getElementById(j+5), payArray, j, 0, scattersChecked);
                    drawSymbol(document.getElementById(j+10), payArray, j, 1, scattersChecked);
                } 
                else if(i == 1) {
                    hiddenSymbol(document.getElementById(j+5));
                    drawSymbol(document.getElementById(j+10), payArray, j, 0, scattersChecked);
                } 
                else if(i == 2) {
                    hiddenSymbol(document.getElementById(j+10));
                }
            }

            await sleep(75);
        }

        resolve('end');
    })
}

let drawGameAreaTurbo = async (payArray, scattersChecked, timeOfDraw) => {
    return new Promise(async resolve => {
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 5; j++) {
                if(i == 0) {
                    drawSymbol(document.getElementById(j), payArray, j, 10, scattersChecked);
                } 
                else if(i == 1) {
                    drawSymbol(document.getElementById(j), payArray, j, 5, scattersChecked);
                    drawSymbol(document.getElementById(j+5), payArray, j, 10, scattersChecked);
                } 
                else if(i == 2) {
                    drawSymbol(document.getElementById(j), payArray, j, 0, scattersChecked);
                    drawSymbol(document.getElementById(j+5), payArray, j, 5, scattersChecked);
                    drawSymbol(document.getElementById(j+10), payArray, j, 10, scattersChecked);
                }
            }

            // if(!cancelled) {
            //     await sleep(75);
            // }
        }

        spinSound.play();
        resolve('end');
    })
}

let drawSpin = async (isTurbo) => {
    let scattersChecked = 0;

    try {
        if(isTurbo) {
            let result = await destroyGameAreaTurbo(payArray, scattersChecked);
        } else {
            for(let i = 0; i < 5; i++) {
                let firstPoint = document.getElementById(i), secondPoint = document.getElementById(i+5), thirdPoint = document.getElementById(i+10);
    
                for(let j = 0; j < 3; j++) {
                    if(j == 0) {
                        hiddenSymbol(firstPoint);
                        drawSymbol(secondPoint, payArray, i, 0, scattersChecked);
                        drawSymbol(thirdPoint, payArray, i, 5, scattersChecked);
                    } else if(j == 1) {
                        hiddenSymbol(secondPoint);
                        drawSymbol(thirdPoint, payArray, i, 0, scattersChecked);
                    } else if(j == 2) {
                        hiddenSymbol(thirdPoint);
                    }
    
                    await sleep(75);
                }
            }
        }
    } catch {
        
    }

    payArrayIndex = 0;

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 5; j++) {
            payArray[payArrayIndex++] = gameArea[i][j];
        }
    }

    scattersChecked = 0;

    if(firstDraw) {
        for(let i = 0; i < 5; i++) {
            let gameareaCol = document.getElementById('gameareaCol' + i);
            let positionTop = -170;

            for(let j = 0; j < 11; j += 5) {
                let point = document.createElement('div');

                point.id = i + j;
                point.className = 'point';
                point.style.position = 'relative';
                point.style.top = (positionTop + 170) + 'px';
                point.style.backgroundImage = "url('images/Graj.png')";

                gameareaCol.appendChild(point);
                point.style.visibility = 'visible';
            }

            if(i+10 == 14) {
                firstDraw = false;
            }
        }
    } else {
        if(isTurbo) {
            let result = await drawGameAreaTurbo(payArray, scattersChecked);

            await sleep(501);
        } else {
            cancelled = false;
            
            for(let i = 0; i < 5; i++) {
                let timeOfDraw;
        
                if(scattersChecked >= 2) {
                    timeOfDraw = 500;
                } else {
                    timeOfDraw = 75;
                }
                
                let firstPoint = document.getElementById(i), secondPoint = document.getElementById(i+5), thirdPoint = document.getElementById(i+10);
    
                for(let j = 0; j < 3; j++) {
                    // if(cancelled) {
                    //     let result = await drawGameAreaTurbo(payArray, scattersChecked);
                    //     await sleep(501);

                    //     return;
                    // }

                    if(j == 0) {
                        drawSymbol(firstPoint, payArray, i, 10, scattersChecked);
                    } else if(j == 1) {
                        drawSymbol(firstPoint, payArray, i, 5, scattersChecked);
                        drawSymbol(secondPoint, payArray, i, 10, scattersChecked);
                    } else if(j == 2) {
                        drawSymbol(firstPoint, payArray, i, 0, scattersChecked);
                        drawSymbol(secondPoint, payArray, i, 5, scattersChecked);
                        drawSymbol(thirdPoint, payArray, i, 10, scattersChecked);
                    }
    
                    await sleep(timeOfDraw);
                }
        
                spinSound.play();
            }
        }
    }
}

spinButton.addEventListener('mouseleave', () => {
    continueSpin = false;
})

spinButton.addEventListener('pointerleave', () => {
    continueSpin = false;
})

spinButton.addEventListener('pointerup', () => {
    continueSpin = false;

    spinWithButton();
})

spinButton.addEventListener('mouseup', () => {
    continueSpin = false;

    spinWithButton();
})

spinButton.addEventListener('mousedown', () => {
    turboSpinWithButton();
})

spinButton.addEventListener('pointerdown', () => {
    turboSpinWithButton();
})

let spinWithButton = () => {
    if(isLocked == false) {
        spin();
    }
}

let turboSpinWithButton = () => {
    setTimeout(() => {
        if(isLocked == false) {
            continueSpin = true;
            
            let spinDelay = async () => {
                await turboSpin();

                if(continueSpin) {
                    setTimeout(spinDelay, 1);
                }
            }

            spinDelay();
        }
    }, 750)
}

let continueGame = () => {
    let bigWinBoard = document.querySelector('#bigWinBoard');
    bigWinBoard.style.visibility = "hidden";

    isLocked == false;
}

let continueStandartGame = () => {
    let bonusGameEnded = document.querySelector("#bonusGameEnded");
    let balanceArea = document.getElementById('balance');
    let bonusBackground = document.querySelector('body');
    bonusGameEnded.style.visibility = "hidden";
    balance += bonusGameWon;
    drawMoneyValue(balanceArea, balance);

    checkBonusBuy();
    bonusGameWon = 0;

    bonusMusic.pause();
    bonusBackground.style.backgroundImage = "url('images/Background.png')";
    slotMusic.play();

    isLocked == false;
}

let turboSpin = async () => {
    if(bonusGameStarted) {
        return;
    }

    isLocked = true;

    let bigWinBoard = document.querySelector('#bigWinBoard');
    let bigWinBoardValue = document.querySelector('#bigWinBoardValue');
    let bigWinBoardText = document.querySelector('#bigWinBoardText');
    let balanceArea = document.getElementById('balance');
    let spinButton = document.getElementById('spinButton');

    bigWinBoard.style.visibility = "hidden";
    spinButton.classList.add('spinButtonActive');

    touchSound.play();
    
    let substractBalance;

    if(goldenBet == true) {
        substractBalance = bet + bet / 2;
    } else {
        substractBalance = bet;
    }

    if(balance >= substractBalance) {
        balance -= substractBalance;
        drawMoneyValue(balanceArea, balance);

        checkBonusBuy();
        playSpin();
        await drawSpin(true);

        let wonArea = document.querySelector('#won');

        if(wonForSpin > 0) {
            if(wonForSpin/bet >= 30) {
                slotMusic.pause();
                bigWinSoundStart.play();
                await sleep(2000);

                bigWinSound.play();
                bigWinSound.currentTime = 0;
                drawMoneyValue(bigWinBoardValue, wonForSpin);
                bigWinBoard.style.visibility = "visible";

                if(wonForSpin/bet >= 30 && wonForSpin/bet < 50) { bigWinBoardText.innerHTML = "Великий виграш!"; }
                if(wonForSpin/bet >= 50 && wonForSpin/bet < 100) { bigWinBoardText.innerHTML = "Супер великий виграш!"; }
                if(wonForSpin/bet >= 100 && wonForSpin/bet < 200) { bigWinBoardText.innerHTML = "Мега великий виграш!"; }
                if(wonForSpin/bet >= 200) { bigWinBoardText.innerHTML = "Грандіозний виграш!"; }

                await outputNumber(wonForSpin, 'bigWinBoardValue', true);
                await sleep(1000);

                bigWinBoard.style.visibility = "hidden";
                slotMusic.play();
            }

            wonSound.play();

            balance += wonForSpin;
            drawMoneyValue(wonArea, wonForSpin);
            drawMoneyValue(balanceArea, balance);
            wonForSpin = 0;
        }

        if(payLinesIndex > 0) {
            await drawPlayedLines(true);
        }

        spinButton.classList.remove('spinButtonActive');

        if(bonusGameStarted == true) {
            let bonusArea = document.querySelector('#bonusGameBoard');
            let bonusGameBoardValue = document.querySelector('#bonusGameBoardValue');

            slotMusic.pause();
            bonusMusicStart.play();
            bonusMusicStart.currentTime = 0;

            bonusGameBoardValue.innerHTML = "Ви виграли " + bonusGameSpins + " безкоштовних обертань";
            bonusArea.style.visibility = "visible";
        } 

        if(bonusGameStarted == false && wonForSpin/bet < 30) {
            isLocked = false;
        }
    } else {
        stopAutoSpins();

        let valueWarningBlock = document.querySelector('#valueWarning');

        continueSpin = false;
        valueWarningBlock.style.visibility = 'visible';
        spinButton.classList.remove('spinButtonActive');
    }
}

let spin = async () => {
    isLocked = true;
    continueSpin = false;

    let bigWinBoard = document.querySelector('#bigWinBoard');
    let bigWinBoardValue = document.querySelector('#bigWinBoardValue');
    let bigWinBoardText = document.querySelector('#bigWinBoardText');
    let balanceArea = document.getElementById('balance');
    let spinButton = document.getElementById('spinButton');

    bigWinBoard.style.visibility = "hidden";
    spinButton.classList.add('spinButtonActive');

    touchSound.play();
    
    let substractBalance;

    if(goldenBet == true) {
        substractBalance = bet + bet / 2;
    } else {
        substractBalance = bet;
    }

    if(balance >= substractBalance) {
        balance -= substractBalance;
        drawMoneyValue(balanceArea, balance);

        checkBonusBuy();
        playSpin();
        await drawSpin(false);

        let wonArea = document.querySelector('#won');

        if(wonForSpin > 0) {
            if(wonForSpin/bet >= 30) {
                slotMusic.pause();
                bigWinSoundStart.play();
                await sleep(2000);

                bigWinSound.play();
                bigWinSound.currentTime = 0;
                drawMoneyValue(bigWinBoardValue, wonForSpin);
                bigWinBoard.style.visibility = "visible";

                if(wonForSpin/bet >= 30 && wonForSpin/bet < 50) { bigWinBoardText.innerHTML = "Великий виграш!"; }
                if(wonForSpin/bet >= 50 && wonForSpin/bet < 100) { bigWinBoardText.innerHTML = "Супер великий виграш!"; }
                if(wonForSpin/bet >= 100 && wonForSpin/bet < 200) { bigWinBoardText.innerHTML = "Мега великий виграш!"; }
                if(wonForSpin/bet >= 200) { bigWinBoardText.innerHTML = "Грандіозний виграш!"; }

                await outputNumber(wonForSpin, 'bigWinBoardValue', false);
                await sleep(1000);

                bigWinBoard.style.visibility = "hidden";
                slotMusic.play();
            }

            wonSound.play();

            balance += wonForSpin;
            drawMoneyValue(wonArea, wonForSpin);
            drawMoneyValue(balanceArea, balance);
            wonForSpin = 0;
        }

        if(payLinesIndex > 0) {
            await drawPlayedLines(false);
        }

        spinButton.classList.remove('spinButtonActive');

        if(bonusGameStarted == true) {
            let bonusArea = document.querySelector('#bonusGameBoard');
            let bonusGameBoardValue = document.querySelector('#bonusGameBoardValue');

            slotMusic.pause();
            bonusMusicStart.play();
            bonusMusicStart.currentTime = 0;

            bonusGameBoardValue.innerHTML = "Ви виграли " + bonusGameSpins + " безкоштовних обертань";
            bonusArea.style.visibility = "visible";
        } 

        if(bonusGameStarted == false && wonForSpin/bet < 30) {
            isLocked = false;
        }
    } else {
        stopAutoSpins();

        let valueWarningBlock = document.querySelector('#valueWarning');

        valueWarningBlock.style.visibility = 'visible';
        spinButton.classList.remove('spinButtonActive');
    }
}

let playBonusSpin = async () => {
    let bigWinBoard = document.querySelector('#bigWinBoard');
    let bigWinBoardValue = document.querySelector('#bigWinBoardValue');
    let bigWinBoardText = document.querySelector('#bigWinBoardText');
    let wonArea = document.querySelector('#won');
    bigWinBoard.style.visibility = "hidden";
    continueSpin = false;

    playSpin();
    await drawSpin(false);

    if(wonForSpin > 0) {
        if(wonForSpin/bet >= 30) {
            bonusMusic.pause();
            bigWinSoundStart.play();
            await sleep(2000);

            bigWinSound.play();
            bigWinSound.currentTime = 0;
            drawMoneyValue(bigWinBoardValue, wonForSpin);
            bigWinBoard.style.visibility = "visible";

            if(wonForSpin/bet >= 30 && wonForSpin/bet < 50) { bigWinBoardText.innerHTML = "Великий виграш!"; }
            if(wonForSpin/bet >= 50 && wonForSpin/bet < 100) { bigWinBoardText.innerHTML = "Супер великий виграш!"; }
            if(wonForSpin/bet >= 100 && wonForSpin/bet < 200) { bigWinBoardText.innerHTML = "Мега великий виграш!"; }
            if(wonForSpin/bet >= 200) { bigWinBoardText.innerHTML = "Грандіозний виграш!"; }

            await outputNumber(wonForSpin, 'bigWinBoardValue', false);
            await sleep(1500);

            bigWinBoard.style.visibility = "hidden";
            bonusMusic.play();
        }

        wonSound.play();

        wonForSpin = 0;
    }
    
    drawMoneyValue(wonArea, bonusGameWon);

    if(payLinesIndex > 0) {
        await drawPlayedLines(false);
    }

    await sleep(1000);
}

let playSpin = () => {
    generateGame();
    calculateWon();
}

let getRandomInt = (max) => {
    return Math.floor(Math.random() * max) + 1;
}

let getRandomIntDiapasone = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
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
    let chance = getRandomInt(2410); //3010 //2410

    if(chance >= 1 && chance <= 695) {
        let generatedWild, wild = getRandomInt(3);
        let wildPositionI = getRandomInt(3), wildPositionJ = getRandomInt(3);

        generatedWild = wild + 10; 

        if(gameArea[wildPositionI-1][wildPositionJ] < 11) {
            wildMemory[wildMemoryItems++] = [generatedWild, wildPositionI-1, wildPositionJ];
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

        if(gameArea[i][j-1] == 11 || gameArea[i][j-1] == 12 || gameArea[i][j-1] == 13) {
            symbol = generateSymbol(symbol);
        } else {
            fortune == 1 ? symbol = gameArea[i][j-1] : symbol = generateSymbol(symbol);
        }
    }

    return symbol;
}

let generateColumnPositions = (min, max, size) => {
    let result = [...Array(max - min + 1).keys()].map(i => i + min)
    .reduce((array, elt) => (array.splice(Math.random() * (array.length + 1), 0, elt), array), [])
    .slice(0, size);

    return result;
}

let generateBonusGame = () => {
    let bonusChance, scatters = 0; //173 //115

    if(goldenBet == true) {
        bonusChance = 115;
    } else {
        bonusChance = 173;
    }

    if(bonusBuyActive == true) {
        if(bonusBuySpins == 3) {
            let columnPositions = generateColumnPositions(0, 4, 3);

            for(let i = 0; i < 3; i++) {
                let randomPosition = getRandomInt(3);

                gameArea[randomPosition-1][columnPositions[i]] = 14;
                scatters++;
            }
        }

        if(bonusBuySpins == 4) {
            let columnPositions = generateColumnPositions(0, 4, 4);
            console.log(columnPositions);

            for(let i = 0; i < 4; i++) {
                let randomPosition = getRandomInt(3);

                gameArea[randomPosition-1][columnPositions[i]] = 14;
                scatters++;
            }
        }

        if(bonusBuySpins == 5) {
            for(let i = 0; i < 5; i++) {
                let randomPosition = getRandomInt(3);
                gameArea[randomPosition-1][i] = 14;
                scatters++;
            }
        }
    } else {
        for(let i = 0; i < 5; i++) {
            let scatterChance = getRandomInt(bonusChance);
        
            if(scatterChance >= 1 && scatterChance <= 10) {
                let randomPosition = getRandomInt(3);
                gameArea[randomPosition-1][i] = 14;
                scatters++;
            }
        }
    }

    if(scatters >= 3) {
        scatters == 3 ? bonusGameSpins = 10 : bonusGameSpins;
        scatters == 4 ? bonusGameSpins = 15 : bonusGameSpins;
        scatters == 5 ? bonusGameSpins = 20 : bonusGameSpins;

        bonusGameStarted = true;
    }

    bonusBuyActive = false;
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
    
    if(bonusGameStarted == true) {
        generateWilds();
    }

    if(bonusGameStarted == false) {
        generateBonusGame();
    }
}

let playBonuseGame = async () => {
    let bonusGame = document.querySelector("#bonusGameBoard");
    let bonusGameEnded = document.querySelector("#bonusGameEnded");
    let bonusGameEndedBoardValue = document.querySelector("#bonusGameEndedBoardValue");
    let freespinsArea = document.querySelector("#freespinsArea");
    let bonusBackground = document.querySelector('body');

    bonusBackground.style.backgroundImage = "url('images/BonusBackground.png')";
    bonusGame.style.visibility = "hidden";
    freespinsArea.style.visibility = "visible";
    bonusGameWon = 0;

    bonusMusicStart.pause();
    bonusMusic.play();

    for(let i = bonusGameSpins; i > 0; i--) {
        freespinsArea.innerHTML = 'Залишилося ' + (i-1) + ' з ' + bonusGameSpins + ' безкоштовних обертань';
        
        await playBonusSpin();

        let bigWinBoard = document.querySelector('#bigWinBoard');
        bigWinBoard.style.visibility = "hidden";

        if(bonusGameWon > bet * 5000) {
            bonusGameWon = bet * 5000;

            break;
        }
    }

    freespinsArea.style.visibility = "hidden";
    drawMoneyValue(bonusGameEndedBoardValue, bonusGameWon, 'Ви виграли ');
    bonusGameEndedBoardValue.innerHTML += ' в ' + bonusGameSpins + ' безкоштовних обертаннях';
    bonusGameEnded.style.visibility = "visible";

    bonusGameStarted = false;
    isLocked = false;
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

        preArray[preArrayIndex++] = line;

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

        if(paySymbol == 1) { lineWon = bet * payTable[0].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 2) { lineWon = bet * payTable[1].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 3) { lineWon = bet * payTable[2].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 4) { lineWon = bet * payTable[3].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 5) { lineWon = bet * payTable[4].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 6) { lineWon = bet * payTable[5].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 7) { lineWon = bet * payTable[6].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 8) { lineWon = bet * payTable[7].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 9) { lineWon = bet * payTable[8].pay[counter-1] * multiplyDetected; }
        if(paySymbol == 10) { lineWon = bet * payTable[9].pay[counter-1] * multiplyDetected; }

        totalWon += lineWon;
        wonForSpin = totalWon;
    }

    bonusGameWon += totalWon;
}