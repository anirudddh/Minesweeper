document.querySelector('body').onload = function() {
    var i = 0;
    var txt = 'Minesweeper';
    var speed = 100;

    function typeWriter() {
        if (i < txt.length) {
            document.querySelector('.textBox').innerHTML += txt.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

var i = 0;
var timeout;
var timer = document.querySelector('.timer');
var counting = function() {
    i++;
    timer.innerHTML = i+'<span style="font-size: 60%;"> seconds</span>';
    timeout = setTimeout(counting, 1000);
}

var container = document.querySelector('.container');

var toArray = function(obj) {
    var array = [];
    for (var i=0; i<obj.length; i++) { 
      array[i] = obj[i];
    }
    return array;
}

var ranNums = function(lim, number) {
    var ar = new Array(number);

    for (var i=0; i<number; i++) {
        ar[i] = new Array(number);
    }

    for (var i=0; i<number; i++) {
        for (var j=0; j<number; j++) {
            var obj = {a:0, b:0};
            obj.a = Math.ceil(Math.random()*lim);
            obj.b = Math.ceil(Math.random()*lim);
            ar[i][j] = obj;
        }
    }
    return ar;
}

var blocks;
var createMaze=function(n) {
    blocks = [n];
    for (var i=0; i<n; i++) {
        blocks[i] = new Array(n);
    }

    var checkForBomb = function(i, j) {
        try {
            if (toArray(blocks[i][j].classList).includes('bomb'))
            return true;
        }
        catch (e) {
            //return false;
        }
    }
    
    //getting random number array;
    var twoD = ranNums(n-1, n/2);

    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            blocks[i][j] = document.createElement('div');
            blocks[i][j].classList.add('block');
            //container.appendChild(blocks[i][j]);
        }
    }

    //assigning BOMBs
    for (var i=0; i<n/2; i++) {
        for (var j=0; j<n/2; j++) {
            blocks[twoD[i][j].a][twoD[i][j].b].classList.add('bomb');            
        }
    }

    //putting numbers in place
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            var count = 0;
            if (checkForBomb(i,j)) {
                continue;
            }
            else {
                if (checkForBomb(i-1,j-1)) count++;
                if (checkForBomb(i-1,j)) count++;
                if (checkForBomb(i-1,j+1)) count++;
                if (checkForBomb(i,j-1)) count++;
                if (checkForBomb(i,j+1)) count++;
                if (checkForBomb(i+1,j-1)) count++;
                if (checkForBomb(i+1,j)) count++;
                if (checkForBomb(i+1,j+1)) count++;
                if (count!=0) {
                    blocks[i][j].textContent = count;
                }
            }
        }
    }

    coverBlocks(n);

    //appending all blocks
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            container.appendChild(blocks[i][j]);
        }
    }
}

var coverBlocks = function(n) {
    for (var i=0; i<n; i++) {
        for (var j=0; j<n; j++) {
            var temp = document.createElement('div');
            temp.classList.add('blockLayer')
            blocks[i][j].appendChild(temp);
            
            var checkCount = 0;

            temp.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                if (!(toArray(e.target.classList).includes('flag'))) {
                    e.target.classList.add('flag');
                }
                else {
                    e.target.classList.remove('flag');
                }
                //document.querySelector('.open').play();
                if (checkCount==0) {
                    counting();
                    checkCount++;
                }
            })
            
            temp.addEventListener('click', function(e) {
                if (toArray(e.target.parentNode.classList).includes('bomb') && !toArray(e.target.classList).includes('flag')) {
                    e.target.style.display = 'none';
                    setTimeout(gameOver, 400);
                    console.log('GAME_OVER');
                }
                else if (!toArray(e.target.classList).includes('flag')) {
                    e.target.classList.remove('blockLayer');
                }
                //document.querySelector('.flagAudio').play();
                if (checkCount == 0) {
                    counting();
                    checkCount++;
                }
            })
        }
    }
}

var gameOver = function() {
    var blocks = document.querySelectorAll('.block');
    toArray(blocks).forEach(function(elem) {
        elem.style.display = 'none';
    });
    document.querySelector('.gameOver').style.display = 'flex';
    document.querySelector('.gOver').play();
    document.querySelector('.rest').style.display = 'none';
    clearTimeout(timeout);
}

var restart = function() {
    location.reload();
}

createMaze(8);
