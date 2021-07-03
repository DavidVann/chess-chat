// import {SVG} from '@svgdotjs/svg.js';


class Connect4 {
    rows = 6;
    cols = 7;
    constructor() {
        this.grid = [...Array(this.rows)].map( () => Array(this.cols).fill(0) )
    }

    dropChip(col) {
        // for (let row = 0; row < this.rows; row++) {
        //     if (this.grid[row][col] != 0) {
        //         this.grid[row - 1][col] = 1;
        //     }

        //     else if (row === this.rows - 1) {
        //         this.grid[row][col] = 1;
        //     }
        // }

        let empty = this.findEmpty(col);
        console.log(empty);
        if (empty != -1) {
            this.grid[empty][col] = 1;
        }
    }

    findEmpty(col) {
        let emptyRow = -1;
        for (let row = 0; row < this.rows; row++) {
            if (this.grid[row][col] === 0) {
                emptyRow = row;
            }
        }
        return emptyRow;
    }


    readState() {

    }

    packageState() {

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




