// import {SVG} from '@svgdotjs/svg.js';


// const useSVG = (id) => {
//     let svg = document.createElementNS("http://www.w3.org/2000/svg", "use");
//     svg.setAttribute("href", id);
//     return svg;
// }

// let board = document.getElementById("game-container");
// // for (let i = 0; i < 7; i++) {
// //     for (let j = 0; j < 6; j++) {
// //         let chip = useSVG("#chip1");
// //         chip.setAttribute("x", String(i*100))
// //         chip.setAttribute("y", String(j*100))
// //         board.append(chip);
// //     }

// // }



let draw = SVG().addTo('#game-container')

let chipRed = draw.symbol();
chipRed.circle(85).fill('red').stroke({color: 'black', width: 1});

let chipRef = [];

for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let chip = draw.use(chipRed).move(i*100 + 3, j*100 + 3);
        chipRef.push(chip);
    }
}

console.log(chipRef);

let holeMask = draw.mask();
holeMask.add(draw.rect(700, 600).fill('white'));
for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let hole = draw.circle(90).move(i*100, j*100).fill('black')
        holeMask.add(hole);
    }
}


let chipBoard = draw.rect(700, 600).fill('grey').maskWith(holeMask);

