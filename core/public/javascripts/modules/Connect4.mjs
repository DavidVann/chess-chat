// import {SVG} from '@svgdotjs/svg.js';

const gameBox = document.querySelector('#game-container');

function getMouseCoords(event) {
    let box = event.target.getBoundingClientRect();
    let cursorX = event.clientX - box.left;
    let cursorY = event.clientY - box.top;

    return [cursorX, cursorY, box.width]
}

function cursorMove(event) {
    if (!this.disabled) {
        if (event.touches) {
            event = event.touches[0];
        }
    
        let [x, y, width] = getMouseCoords(event);
        this.cursorX = x;
        this.cursorY = y;
        this.width = width;
        this.setTemplateChipPos();
    }
}

function cursorClick(event) {
    if (!this.disabled) {
        if (event.touches) {
            event = event.touches[0];
        }
        this.game.attemptMove(this.templateCol);
    }
}


class Connect4 {
    rows = 6;
    cols = 7;
    constructor(client) {
        this.client = client;
        this.grid = [...Array(this.rows)].map( () => Array(this.cols).fill(0) )
        this.ui = new Connect4Interface(client, this);
    }

    attemptMove(col) {
        /**
         * Finds a valid position for a move according to the client's current grid and sends it to the server for confirmation.
         */
        let emptyRow = this.findEmptyRow(col);
        if (emptyRow != -1) {
            this.client.send("move", [emptyRow, col]);
            this.grid[emptyRow][col] = this.player;
            this.ui.disabled = true;
        } else {
            console.log("invalid move");
        }
    }

    confirmMove(packet) {
        /**
         * Called upon receiving a message back from the server confirming that the move was received.
         * 
         * Updates the client's logical grid and updates UI to show where the chip was placed.
         */
        let player = packet["player"];
        let row = packet["row:col"][0];
        let col = packet["row:col"][1];

        this.grid[row][col] = player;
        this.ui.confirmMove(row, col, player);

        if (this.checkVictory(row, col)) {
            console.log(`Player ${player} won!`)
        }

        else if (player != this.client.player) {
            this.ui.disabled = false;
        }
    }

    findEmptyRow(col) {
        let emptyRow = -1;
        for (let row = 0; row < this.rows; row++) {
            if (this.grid[row][col] === 0) {
                emptyRow = row;
            }
        }
        return emptyRow;
    }

    checkVictory(row, col) {
        let horizVict = this.count(row, col, 'horiz') === 4;
        let vertiVict = this.count(row, col, 'verti') === 4;
        let fdiagVict = this.count(row, col, 'fdiag') === 4;
        let bdiagVict = this.count(row, col, 'bdiag') === 4;

        return horizVict || vertiVict || fdiagVict || bdiagVict;
    }

    countCoord(row, col, dx, dy) {
        /**
         * Counts contiguous chips using starting position and a direction to count in.
         */
        let count = 0;
        let y = row;
        let x = col;
        y += dy;
        x += dx;
        while (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            let val = this.grid[y][x]
            console.log(`Check row ${y}, col ${x}: ${val}`);
            if (this.grid[y][x] === this.client.player) {
                count++;
            } else {
                break;
            }
            y += dy;
            x += dx;
        }
        return count;
    }

    count(row, col, type) {
        let countInitialChip = (this.grid[row][col] === this.client.player) ? 1 : 0;

        switch (type) {
            case 'horiz':
                return this.countCoord(row, col, -1, 0) + countInitialChip + this.countCoord(row, col, 1, 0);
                break;
            case 'verti':
                return this.countCoord(row, col, 0, -1) + countInitialChip + this.countCoord(row, col, 0, 1);
                break;
            case 'fdiag':
                return this.countCoord(row, col, 1, -1) + countInitialChip + this.countCoord(row, col, -1, 1);
                break;
            case 'bdiag':
                return this.countCoord(row, col, -1, -1) + countInitialChip + this.countCoord(row, col, 1, 1);
                break;
        }
    }


    // readMove(packet) {
    //     let col = packet.column;
    //     this.dropChip(col, packet.player);
    // }

}

class Connect4Interface {
    rows = 6;
    cols = 7;
    cursorX = null;
    cursorY = null;
    templateChip = null;
    templateCol = null;

    chipSpacing = 100;
    chipOffset = 8;
    width = null;

    disabled = false;

    constructor(client, game) {
        this.client = client;
        this.game = game;

        this.draw = SVG().addTo('#game-container')

        let chipDiam = 84
        this.chip1 = this.draw.symbol();
        this.chip1.circle(chipDiam).fill('red').stroke({color: 'black', width: 1});

        this.chip2 = this.draw.symbol();
        this.chip2.circle(chipDiam).fill('blue').stroke({color: 'black', width: 1});

        this.chipRef1 = [];
        this.chipRef2 = [];

        this.initialize();
    }

    async initialize() {
        let chipsPerPlayer = (this.rows * this.cols) / 2;

        // Draw chips first so they render below the grid.
        for (let player = 0; player < 2; player++) {
            for (let chipID = 0; chipID < chipsPerPlayer; chipID++) {
                if (player === 0) {
                    let chip = this.draw.use(this.chip1).x(-100);
                    this.chipRef1.push(chip);
                } else {
                    let chip = this.draw.use(this.chip2).x(-100);
                    this.chipRef2.push(chip);
                }
            }
        }

        console.log(this.client.player);

        // Draw a template chip that's used for showing where a chip will be dropped based on the mouse.
        if (this.client.player === 1) {
            this.templateChip = this.draw.use(this.chip1).move(this.chipOffset, this.chipOffset);
        } else {
            this.templateChip = this.draw.use(this.chip2).move(this.chipOffset, this.chipOffset);
        }

        // Draw board and add holes using masking
        let maskOffset = 5;
        let holeMask = this.draw.mask();
        holeMask.add(this.draw.rect(700, 600).fill('white'));
        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 6; y++) {
                let hole = this.draw.circle(90).move(x*this.chipSpacing + maskOffset, y*this.chipSpacing  + maskOffset).fill('black')
                holeMask.add(hole);
            }
        }

        let chipBoard = this.draw.rect(700, 600).fill('grey').maskWith(holeMask);


        gameBox.firstChild.addEventListener('mousemove', cursorMove.bind(this));
        gameBox.firstChild.addEventListener('touchstart', cursorMove.bind(this));
        gameBox.firstChild.addEventListener('touchmove', cursorMove.bind(this));

        gameBox.firstChild.addEventListener('mousedown', cursorClick.bind(this));
        gameBox.firstChild.addEventListener('touchend', cursorClick.bind(this));



    }

    confirmMove(row, col, player) {
        let chip;
        if (player === 1) {
            chip = this.chipRef1.pop()
        } else {
            chip = this.chipRef2.pop()
        }

        chip.move(col*100+8);
        chip.animate(500).ease('<').move(col*100 + 8, row*100 + 8)
    }

    setTemplateChipPos() {
        this.templateCol = Math.floor(this.cursorX / (this.width / 7));
        this.templateChip.x(this.templateCol*100 + 8)
    }

}

export default Connect4;




