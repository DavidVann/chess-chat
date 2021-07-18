// import {SVG} from '@svgdotjs/svg.js';


class Connect4 {
    rows = 6;
    cols = 7;
    constructor() {
        this.grid = [...Array(this.rows)].map( () => Array(this.cols).fill(0) )
    }

    dropChip(col, player) {
        let emptyRow = this.findEmptyRow(col);
        if (emptyRow != -1) {
            this.grid[emptyRow][col] = 1;
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
            case 'verti':
                return this.countCoord(row, col, 0, -1) + 1 + this.countCoord(row, col, 0, 1);
            case 'fdiag':
                return this.countCoord(row, col, 1, -1) + 1 + this.countCoord(row, col, -1, 1);
            case 'bdiag':
                return this.countCoord(row, col, -1, -1) + 1 + this.countCoord(row, col, 1, 1);
        }
    }


    readMove() {

    }

    packageMove(col) {
        let packet = {
            "type": "move",
            "column": col
        }
    }
}

class Connect4Interface {
    constructor() {
        this.draw = SVG().addTo('#gameContainer')
    }

    dropChip() {
        this.draw.rect();
    }

}

export default Connect4;

// class Player {
    
// }

// let c = new Connect4();


// let draw = SVG().addTo('#game-container')

// let chipRed = draw.symbol();
// chipRed.circle(85).fill('red').stroke({color: 'black', width: 1});

// let chipRef = [];

// for (let i = 0; i < 7; i++) {
//     for (let j = 0; j < 6; j++) {
//         let chip = draw.use(chipRed).move(i*100 + 3, j*100 + 3);
//         chipRef.push(chip);
//     }
// }

// let holeMask = draw.mask();
// holeMask.add(draw.rect(700, 600).fill('white'));
// for (let i = 0; i < 7; i++) {
//     for (let j = 0; j < 6; j++) {
//         let hole = draw.circle(90).move(i*100, j*100).fill('black')
//         holeMask.add(hole);
//     }
// }


// let chipBoard = draw.rect(700, 600).fill('grey').maskWith(holeMask);




