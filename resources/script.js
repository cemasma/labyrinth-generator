class LabyrinthGenerator {

    constructor(x, y) {
        console.log("LabyrintGenerator initialized.");
        this.generate(x, y);
    }

    generate(row = 0, col = 0) {
        for(let x = 0; x < row; x++) {
            for(let y = 0; y < col; y++) {
                let divElement = document.createElement("div");
                divElement.innerText = "test";
                divElement.id = `${x}${y}`;
                document.body.appendChild(divElement);
            }
        }
    }
}

window.onload = function() {
    new LabyrinthGenerator(5, 5);
}
