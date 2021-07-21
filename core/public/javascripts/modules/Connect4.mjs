// import {SVG} from '@svgdotjs/svg.js';


class Connect4 {
    rows = 6;
    cols = 7;
    constructor(connection) {
        this.connection = connection;
        this.grid = [...Array(this.rows)].map( () => Array(this.cols).fill(0) )
        this.ui = new Connect4Interface();
    }

    dropChip(col, player) {
        let emptyRow = this.findEmptyRow(col);
        if (emptyRow != -1) {
            if (player === 1) {
                this.grid[emptyRow][col] = 1;
                this.connection.send("move", col);
            } else {
                this.grid[emptyRow][col] = 2;
            }

            this.ui.dropChip(emptyRow, col, player);
        }

        return this.checkVictory(emptyRow, col);
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
            if (this.grid[y][x] === 1) {
                count++;
            }
            y += dy;
            x += dx;
        }
        return count;
    }

    count(row, col, type) {
        switch (type) {
            case 'horiz':
                return this.countCoord(row, col, -1, 0) + 1 + this.countCoord(row, col, 1, 0);
                break;
            case 'verti':
                return this.countCoord(row, col, 0, -1) + 1 + this.countCoord(row, col, 0, 1);
                break;
            case 'fdiag':
                return this.countCoord(row, col, 1, -1) + 1 + this.countCoord(row, col, -1, 1);
                break;
            case 'bdiag':
                return this.countCoord(row, col, -1, -1) + 1 + this.countCoord(row, col, 1, 1);
                break;
        }
    }


    readMove(packet) {
        let col = packet.column;
        this.dropChip(col, 2);
    }

}

class Connect4Interface {
    rows = 6;
    cols = 7;
    constructor() {
        this.draw = SVG().addTo('#game-container')

        let chipDiam = 84
        this.chip1 = this.draw.symbol();
        this.chip1.circle(chipDiam).fill('red').stroke({color: 'black', width: 1});

        this.chip2 = this.draw.symbol();
        this.chip2.circle(chipDiam).fill('blue').stroke({color: 'black', width: 1});

        this.chipRef1 = [];
        this.chipRef2 = [];
    }

    initialize() {
        let chipsPerPlayer = (this.rows * this.cols) / 2
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


        let maskOffset = 5;
        let holeMask = this.draw.mask();
        holeMask.add(this.draw.rect(700, 600).fill('white'));
        for (let x = 0; x < 7; x++) {
            for (let y = 0; y < 6; y++) {
                let hole = this.draw.circle(90).move(x*100 + maskOffset, y*100 + maskOffset).fill('black')
                holeMask.add(hole);
            }
        }

        let chipBoard = this.draw.rect(700, 600).fill('grey').maskWith(holeMask);
    }

    dropChip(row, col, player) {
        let chip;
        if (player === 1) {
            chip = this.chipRef1.pop()
        } else {
            chip = this.chipRef2.pop()
        }

        chip.move(col*100);
        chip.animate(500).ease('<').move(col*100 + 8, row*100 + 8)
    }

}

export default Connect4;




