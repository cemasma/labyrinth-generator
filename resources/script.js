class LabyrinthGenerator {

    constructor(x, y) {
        console.log("LabyrintGenerator initialized.");
        this.left = 0;
        this.top = 0;
        this.generate(x, y);
    }

    generate(row = 0, col = 0) {
        for (let x = 0; x < row; x++) {
            this.left = 0;
            for (let y = 0; y < col; y++) {
                let box = this.createBox(`${x}${y}`);
                box = this.addWallsToBox(box);
                document.body.appendChild(box);
            }
            this.top += 43;
        }
    }

    createBox(id) {
        let box = document.createElement("div");
        box.className = "box"
        box.id = id
        return box;
    }

    addWallsToBox(box) {
        console.log(this.top + " " + this.left);
        
        for (let i = 0; i < 4; i++) {
            let div = document.createElement("div");
            switch (i) {
                case 0:
                    div.className = "wall-horizontal";
                    div.style.top = this.top;
                    div.style.left = this.left;
                    break;
                case 1:
                    div.className = "wall-vertical";
                    div.style.top = this.top;
                    div.style.left= this.left; 
                    break;
                case 2:
                    div.className = "wall-horizontal";
                    div.style.top = this.top + 43;
                    div.style.left = this.left;
                    break;
                case 3:
                    div.className = "wall-vertical";
                    div.style.top = this.top;
                    div.style.left = this.left + 43;
                    break;
            }
            div.id = `${box.id}${i}`;
            box.appendChild(div);
        }
        this.left += 43;
        return box;
    }
}

window.onload = function () {
    new LabyrinthGenerator(10, 10);
}
