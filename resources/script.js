class LabyrinthGenerator {

    constructor(x, y, height, width) {
        console.log("LabyrintGenerator initialized.");
        this.left = 0;
        this.top = 0;
        this.row = x;
        this.col = y;
        this.height = height;
        this.width = width;
        this.wallRecords = {};

        this.generate(x, y);
    }

    generate() {
        this.placeBoxes();

        while (this.labyrinthProgress() === false) {
            this.createRoads(this.random(this.row), this.random(this.col));
        }

        this.createDoors();
    }

    createDoors() {
        let row = this.random(this.row), col = -1;

        if (row === 0 || row === (this.row - 1)) {
            col = this.random(this.col);
            (row === (this.row - 1)) ? this.removeWall(row, col, "down") : this.removeWall(row, col, "up");
        } else if (row > 0 && row < (this.row - 1)) {
            col = (this.random(2) === 0) ? 0 : (this.col - 1);
            (col === (this.col - 1)) ? this.removeWall(row, col, "right") : this.removeWall(row, col, "left");
        }

        let otherRow = this.randomDifferentFromIt(this.row, row);

        if (row === 0 && col <= this.col / 2) {
            this.openDoorForTopAndBot(row, "right", "down", left, this.row - 1, 0);
        } else if (row === 0 && col >= this.col / 2) {
            this.openDoorForTopAndBot(otherRow, "left", "down", "right", 0, this.col - 1);
        } else if (row === this.row - 1 && col <= this.col / 2) {
            this.openDoorForTopAndBot(otherRow, "left", "up", "right", 0, this.col - 1);
        } else if (row === this.row - 1 && col >= this.col / 2) {
            this.openDoorForTopAndBot(otherRow, "right", "up", "left", this.row - 1, 0);
        } else if (row <= this.row / 2 && col === 0) {
            this.openDoorForIntermediates(otherRow, "down", "up", "right", this.random(this.col), this.randomBiggerThan(this.col / 2),  this.col - 1);
        } else if (row <= this.row / 2 && col === this.row - 1) {
            this.openDoorForIntermediates(otherRow, "down", "up", "left", this.random(this.col), this.random(this.col / 2), 0);
        } else if (row >= this.row / 2 && col === 0) {
            this.openDoorForIntermediates(otherRow, "down", "up", "right", this.randomBiggerThan(this.col / 2), this.random(this.col), this.col - 1);
        } else if (row >= this.row / 2 && col == this.row - 1) {
            this.openDoorForIntermediates(otherRow, "down", "up", "left", this.random(this.col / 2), this.random(this.col), 0);
        }

    }

    randomBiggerThan(number) {
        return this.random(number) + number;
    }

    openDoorForTopAndBot(row, d1, d2, d3, c1, c2) {
        if (row < this.row / 2) {
            this.removeWall(row, c1, d1);
        } else if (row === this.row - 1) {
            this.removeWall(row, this.random(this.col), d2);
        } else {
            this.removeWall(row, c2, d3);
        }
    }

    openDoorForIntermediates(row, d1, d2, d3, c1, c2, c3) {
        if (row === this.row - 1) {
            this.removeWall(row, c1, d1);
        } else if (row === 0) {
            this.removeWall(row, c2, d2);
        } else {
            this.removeWall(row, c3, d3);
        }
    }

    randomDifferentFromIt(max, number) {
        let randomNumber = number;
        while (randomNumber === number) {
            randomNumber = this.random(max);
        }

        return randomNumber;
    }

    labyrinthProgress() {
        return (Object.keys(this.wallRecords).length === 1 &&
            this.wallRecords[Object.keys(this.wallRecords)[0]].length === (this.row * this.col) - 1)
    }

    random(max) {
        return Math.floor(Math.random() * max);
    }

    isNeighborAvailable(x, y, neighbor) {
        return (neighbor.isOk && neighbor.elements.length > 0 &&
            this.recordCheck(x, y, neighbor.elements[neighbor.selection].x, neighbor.elements[neighbor.selection].y));
    }

    createRoads(x, y) {
        let neighbors = this.getNeighbors(x, y);

        if (this.isNeighborAvailable(x, y, neighbors.vertical)) {
            this.adjacentCells(
                x,
                y,
                neighbors.vertical.elements[neighbors.vertical.selection].x,
                neighbors.vertical.elements[neighbors.vertical.selection].y,
                neighbors.vertical.elements[neighbors.vertical.selection].direction
            );

            this.addRecord(
                x,
                y,
                neighbors.vertical.elements[neighbors.vertical.selection].x,
                neighbors.vertical.elements[neighbors.vertical.selection].y
            );
        }

        if (this.isNeighborAvailable(x, y, neighbors.horizontal)) {
            this.adjacentCells(
                x,
                y,
                neighbors.horizontal.elements[neighbors.horizontal.selection].x,
                neighbors.horizontal.elements[neighbors.horizontal.selection].y,
                neighbors.horizontal.elements[neighbors.horizontal.selection].direction
            );

            this.addRecord(
                x,
                y,
                neighbors.horizontal.elements[neighbors.horizontal.selection].x,
                neighbors.horizontal.elements[neighbors.horizontal.selection].y
            );
        }
    }

    recordCheck(x, y, z, t) {
        if (this.wallRecords[`${x}:${y}`] != null || this.wallRecords[`${z}:${t}`] != null) {
            return false;
        }

        for (let key in this.wallRecords) {
            if (this.wallRecords[key].indexOf(`${x}:${y}`) > -1 && this.wallRecords[key].indexOf(`${z}:${t}`) > -1) {
                return false;
            }
        }
        return true;
    }

    addRecord(x, y, z, t) {
        let zt = { owner: null, state: false }, xy = { owner: null, state: false };;

        for (let key in this.wallRecords) {
            if (this.wallRecords[key].indexOf(`${x}:${y}`) > -1) {
                xy.state = true;
                xy.owner = key;
            }

            if (this.wallRecords[key].indexOf(`${z}:${t}`) > -1) {
                zt.state = true;
                zt.owner = key;
            }

            if (zt.state && xy.state) {
                break;
            }
        }

        if (xy.state === true && zt.state === true) {
            this.wallRecords[xy.owner] = this.wallRecords[xy.owner].concat(this.wallRecords[zt.owner]);
            this.wallRecords[xy.owner].push(zt.owner);

            delete this.wallRecords[zt.owner];
        } else if (xy.state === false && this.wallRecords[`${x}:${y}`] != null && zt.state === true) {
            this.wallRecords[`${x}:${y}`] = this.wallRecords[`${x}:${y}`].concat(this.wallRecords[zt.owner]);
            this.wallRecords[`${x}:${y}`].push(zt.owner);
            this.wallRecords[`${x}:${y}`] = this.wallRecords[`${x}:${y}`].filter((item, index) => {
                return this.wallRecords[`${x}:${y}`].indexOf(item) === index;
            });

            delete this.wallRecords[zt.owner];
        } else if (xy.state === false && zt.state === true) {
            this.wallRecords[zt.owner].push(`${x}:${y}`);
        } else if (zt.state === false && xy.state === true) {
            this.wallRecords[xy.owner].push(`${z}:${t}`);
        } else if (zt.state === false && xy.state === false && this.wallRecords[`${x}:${y}`] == null) {
            this.wallRecords[`${x}:${y}`] = new Array();
            this.wallRecords[`${x}:${y}`].push(`${z}:${t}`);
        }
    }

    getNeighbors(x, y) {
        let neighbors = {
            "horizontal": { "isOk": this.random(2), "selection": -1, "elements": [] },
            "vertical": { "isOk": this.random(2), "selection": -1, "elements": [] }
        };

        if (y - 1 > -1 && this.recordCheck(x, y, x, y - 1)) {
            neighbors.horizontal.elements.push({ "x": x, "y": y - 1, direction: "left" })
        }
        if (y + 1 < this.col && this.recordCheck(x, y, x, y + 1)) {
            neighbors.horizontal.elements.push({ "x": x, "y": y + 1, direction: "right" })
        }
        if (x + 1 < this.row && this.recordCheck(x, y, x + 1, y)) {
            neighbors.vertical.elements.push({ "x": x + 1, "y": y, direction: "down" })
        }
        if (x - 1 > -1 && this.recordCheck(x, y, x - 1, y)) {
            neighbors.vertical.elements.push({ "x": x - 1, "y": y, direction: "up" })
        }

        neighbors.horizontal.selection = this.random(neighbors.horizontal.elements.length);
        neighbors.vertical.selection = this.random(neighbors.vertical.elements.length);

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
            this.top += (this.height - this.width);
        }
    }

    createBox(id) {
        let box = document.createElement("div");
        box.style.position = "absolute";
        box.className = "box";
        box.id = id;
        return box;
    }

    adjacentCells(x, y, z, t, direction) {
        this.removeWall(x, y, direction);

        switch (direction) {
            case "up":
                this.removeWall(z, t, "down");
                break;
            case "down":
                this.removeWall(z, t, "up");
                break;
            case "left":
                this.removeWall(z, t, "right");
                break;
            case "right":
                this.removeWall(z, t, "left");
                break;
        }
    }

    removeWall(x, y, direction) {
        if (document.getElementById(`${x}x${y}y${direction}`) !== null) {
            document.getElementById(`${x}x${y}y${direction}`).remove();
        } else {
            console.log("Cell doesn't exist.");
            console.log(`(${x},${y}), ${direction}`);
        }
    }

    addWallsToBox(box, x, y) {
        //console.log(this.top + " " + this.left);
        for (let i = 0; i < 4; i++) {
            let div = document.createElement("div");
            div.style.position = "absolute";
            div.style.background = "black";
            switch (i) {
                case 0:
                    div.className = "wall-horizontal";
                    div.id = `${x}x${y}yup`;
                    div.style.top = this.top;
                    div.style.left = this.left;
                    div.style.height = this.width;
                    div.style.width = this.height;
                    break;
                case 1:
                    div.className = "wall-vertical";
                    div.id = `${x}x${y}yleft`;
                    div.style.top = this.top;
                    div.style.left = this.left;
                    div.style.height = this.height;
                    div.style.width = this.width;
                    break;
                case 2:
                    div.className = "wall-horizontal";
                    div.id = `${x}x${y}ydown`;
                    div.style.top = this.top + (this.height - this.width);
                    div.style.left = this.left;
                    div.style.height = this.width;
                    div.style.width = this.height;
                    break;
                case 3:
                    div.className = "wall-vertical";
                    div.id = `${x}x${y}yright`;
                    div.style.top = this.top;
                    div.style.left = this.left + (this.height - this.width);
                    div.style.height = this.height;
                    div.style.width = this.width;
                    break;
            }
            box.appendChild(div);
        }
        this.left += (this.height - this.width);
        return box;
    }
}

window.onload = function () {
    new LabyrinthGenerator(10, 10, 35, 4.9);
}
