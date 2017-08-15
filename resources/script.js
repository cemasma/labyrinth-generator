// 35 - 4.9 yataylar için yükseklik - genişlik, dikeyler için genişlik - yüksekliktir
// bu işlem bize yukarıdan ve yanlardan divlerin pozisyonunu ayarlamamızı sağlar

class LabyrinthGenerator {

    constructor(x, y) {
        console.log("LabyrintGenerator initialized.");
        this.left = 0;
        this.top = 0;
        this.row = x;
        this.col = y;
        this.wallRecords = {};
        this.generate(x, y);
    }

    generate() {
        this.placeBoxes();
        this.createRoads(0, 0);
    }

    createRoads(x, y) {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                let neighbors = this.getNeighbors(i, j);
                let vertHori = { "vertical": [], "horizontal": [] };

                for (let nei of neighbors) {

                    if (nei.x > i) {
                        vertHori["vertical"].push({ "value": nei.x, "direction": "up" });
                    }

                    if (nei.x < i) {
                        vertHori["vertical"].push({ "value": nei.x, "direction": "down" });
                    }

                    if (nei.y > j) {
                        vertHori["horizontal"].push({ "value": nei.y, "direction": "right" });
                    }

                    if (nei.y < j) {
                        vertHori["horizontal"].push({ "value": nei.y, "direction": "left" });
                    }
                }

                let randomIndices = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];

                if (randomIndices[0] < vertHori.horizontal.length) {
                    let elem = vertHori.horizontal[randomIndices[0]];
                    this.removeWall(i, j, i, elem.value, elem.direction);

                    this.addRecord(i, j, i, elem.value);

                }

                if (randomIndices[0] < vertHori.vertical.length) {
                    let elem = vertHori.vertical[randomIndices[0]];
                    this.removeWall(i, j, elem.value, j, elem.direction);

                    this.addRecord(i, j, elem.value, j);
                }
            }
        }
    }

    recordCheck(x, y, z, t) {
        if (this.wallRecords[`${x}:${y}`] != null || this.wallRecords[`${z}:${t}`] != null) {
            return false;
        }
        return true;
    }

    addRecord(x, y, z, t) {
        if (this.wallRecords[`${x}:${y}`] == null) {
            this.wallRecords[`${x}:${y}`] = new Array();
        }
        this.wallRecords[`${x}:${y}`].push(`${z}:${t}`);
    }

    getNeighbors(x, y) {
        let neighbors = [];
        if (y - 1 > -1 && this.recordCheck(x, y, x, y - 1)) {
            neighbors.push({ "x": x, "y": y - 1 });
        }
        if (y + 1 < this.col && this.recordCheck(x, y, x, y + 1)) {
            neighbors.push({ "x": x, "y": y + 1 });
        }
        if (x + 1 < this.row && this.recordCheck(x, y, x + 1, y)) {
            neighbors.push({ "x": x + 1, "y": y });
        }
        if (x - 1 > -1 && this.recordCheck(x, y, x - 1, y)) {
            neighbors.push({ "x": x - 1, "y": y });
        }

        return neighbors;
    }

    placeBoxes() {
        for (let x = 0; x < this.row; x++) {
            this.left = 0;
            for (let y = 0; y < this.col; y++) {
                let box = this.createBox(`${x}${y}`);
                box = this.addWallsToBox(box, x, y);
                document.body.appendChild(box);
            }
            this.top += (35 - 4.9);
        }
    }

    createBox(id) {
        let box = document.createElement("div");
        box.className = "box";
        box.id = id;
        return box;
    }

    removeWall(x, y, z, t, direction) {
        switch (direction) {
            case "up":
                document.getElementById(`${x}x${y}y2`).remove();
                document.getElementById(`${z}x${t}y0`).remove();
                break;
            case "down":
                document.getElementById(`${x}x${y}y0`).remove();
                document.getElementById(`${z}x${t}y2`).remove();
                break;
            case "left":
                document.getElementById(`${x}x${y}y1`).remove();
                document.getElementById(`${z}x${t}y3`).remove();
                break;
            case "right":
                document.getElementById(`${x}x${y}y3`).remove();
                document.getElementById(`${z}x${t}y1`).remove();
                break;
        }
    }

    addWallsToBox(box, x, y) {
        //console.log(this.top + " " + this.left);
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
                    div.style.left = this.left;
                    break;
                case 2:
                    div.className = "wall-horizontal";
                    div.style.top = this.top + (35 - 4.9);
                    div.style.left = this.left;
                    break;
                case 3:
                    div.className = "wall-vertical";
                    div.style.top = this.top;
                    div.style.left = this.left + (35 - 4.9);
                    break;
            }
            div.id = `${x}x${y}y${i}`;
            box.appendChild(div);
        }
        this.left += (35 - 4.9);
        return box;
    }
}

window.onload = function () {
    new LabyrinthGenerator(10, 10);
}
