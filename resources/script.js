let row = 0, col = 0, height = 0, width = 0, leftSpace = 0, topSpace = 0, wallRecords = {},
    map = [], doors = [], lastDot = null;

function generate(x, y, h, w) {
    row = x;
    col = y;
    height = h;
    width = w;
    leftSpace = 0;
    topSpace = 0;
    wallRecords = {};
    map = [];
    doors = [];
    lastDot = null;

    placeBoxes();

    while (labyrinthProgress() === false) {
        createRoads(random(row), random(col));
    }

    createDoors();
}

function createDoors() {
    let r1 = random(row), c1 = -1;

    if (r1 === 0 || r1 === (row - 1)) {
        c1 = random(col);
        if (r1 === (row - 1)) {
            addToDoors(r1, c1, "down");
        } else {
            addToDoors(r1, c1, "up");
        }
    } else if (r1 > 0 && r1 < (row - 1)) {
        c1 = (random(2) === 0) ? 0 : (col - 1);

        if (c1 === (col - 1)) {
            addToDoors(r1, c1, "right");
        } else {
            addToDoors(r1, c1, "left");
        }
    }

    let r2 = randomDifferentFromIt(row, r1);
    
    if (r1 === 0 && c1 <= col / 2) {
        openDoorForTopAndBot(r1, "right", "down", "left", row - 1, 0);
    } else if (r1 === 0 && c1 >= col / 2) {
        openDoorForTopAndBot(r2, "left", "down", "right", 0, col - 1);
    } else if (r1 === row - 1 && c1 <= col / 2) {
        openDoorForTopAndBot(r2, "left", "up", "right", 0, col - 1);
    } else if (r1 === row - 1 && c1 >= col / 2) {
        openDoorForTopAndBot(r2, "right", "up", "left", col - 1, 0);
    } else if (r1 <= row / 2 && c1 === 0) {
        openDoorForIntermediates(r2, "down", "up", "right", random(col), randomBiggerThan(col / 2), col - 1);
    } else if (r1 <= row / 2 && c1 === row - 1) {
        openDoorForIntermediates(r2, "down", "up", "left", random(col), random(col / 2), 0);
    } else if (r1 >= row / 2 && c1 === 0) {
        openDoorForIntermediates(r2, "down", "up", "right", randomBiggerThan(col / 2), random(col), col - 1);
    } else if (r1 >= row / 2 && c1 == row - 1) {
        openDoorForIntermediates(r2, "down", "up", "left", random(col / 2), random(col), 0);
    } else {
        openDoorForIntermediates(r2, "down", "up", "left", col - 1, random(col / 2), 0);
    }
}

function openDoorForTopAndBot(r, d1, d2, d3, c1, c2) {
    if (r < row / 2) {
        addToDoors(r, c1, d1);
    } else if (r === row - 1) {
        addToDoors(r, random(col), d2);
    } else {
        addToDoors(r, c2, d3);
    }
}

function openDoorForIntermediates(r, d1, d2, d3, c1, c2, c3) {
    if (r === row - 1) {
        addToDoors(r, c1, d1);
    } else if (r === 0) {
        addToDoors(r, c2, d2);
    } else {
        addToDoors(r, c3, d3);
    }
}

function createView() {
    for (let path of map) {
        adjacentCells(path.x, path.y, path.z, path.t, path.direction);
    }

    for (let door of doors) {
        removeWall(door.x, door.y, door.direction);
    }
}

function randomBiggerThan(number) {
    return random(number) + number;
}

function addToDoors(x, y, direction) {
    doors.push({ x, y, direction });
}

function randomDifferentFromIt(max, number) {
    let randomNumber = number;
    while (randomNumber === number) {
        randomNumber = random(max);
    }

    return randomNumber;
}

function labyrinthProgress() {
    return (Object.keys(wallRecords).length === 1 &&
        wallRecords[Object.keys(wallRecords)[0]].length === (row * col) - 1)
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function isNeighborAvailable(x, y, neighbor) {
    return (neighbor.isOk && neighbor.elements.length > 0 &&
        recordCheck(x, y, neighbor.elements[neighbor.selection].x, neighbor.elements[neighbor.selection].y));
}

function createRoads(x, y) {
    let neighbors = getNeighbors(x, y);

    if (isNeighborAvailable(x, y, neighbors.vertical)) {
        addToMap(
            x,
            y,
            neighbors.vertical.elements[neighbors.vertical.selection].x,
            neighbors.vertical.elements[neighbors.vertical.selection].y,
            neighbors.vertical.elements[neighbors.vertical.selection].direction
        );

        addRecord(
            x,
            y,
            neighbors.vertical.elements[neighbors.vertical.selection].x,
            neighbors.vertical.elements[neighbors.vertical.selection].y
        );
    }

    if (isNeighborAvailable(x, y, neighbors.horizontal)) {
        addToMap(
            x,
            y,
            neighbors.horizontal.elements[neighbors.horizontal.selection].x,
            neighbors.horizontal.elements[neighbors.horizontal.selection].y,
            neighbors.horizontal.elements[neighbors.horizontal.selection].direction
        );

        addRecord(
            x,
            y,
            neighbors.horizontal.elements[neighbors.horizontal.selection].x,
            neighbors.horizontal.elements[neighbors.horizontal.selection].y
        );
    }
}

function addToMap(x, y, z, t, direction) {
    map.push({ x, y, z, t, direction });
}

function recordCheck(x, y, z, t) {
    if (wallRecords[`${x}:${y}`] != null || wallRecords[`${z}:${t}`] != null) {
        return false;
    }

    for (let key in wallRecords) {
        if (wallRecords[key].indexOf(`${x}:${y}`) > -1 && wallRecords[key].indexOf(`${z}:${t}`) > -1) {
            return false;
        }
    }
    return true;
}

function addRecord(x, y, z, t) {
    let zt = { owner: null, state: false }, xy = { owner: null, state: false };;

    for (let key in wallRecords) {
        if (wallRecords[key].indexOf(`${x}:${y}`) > -1) {
            xy.state = true;
            xy.owner = key;
        }

        if (wallRecords[key].indexOf(`${z}:${t}`) > -1) {
            zt.state = true;
            zt.owner = key;
        }

        if (zt.state && xy.state) {
            break;
        }
    }

    if (xy.state === true && zt.state === true) {
        wallRecords[xy.owner] = wallRecords[xy.owner].concat(wallRecords[zt.owner]);
        wallRecords[xy.owner].push(zt.owner);

        delete wallRecords[zt.owner];
    } else if (xy.state === false && wallRecords[`${x}:${y}`] != null && zt.state === true) {
        wallRecords[`${x}:${y}`] = wallRecords[`${x}:${y}`].concat(wallRecords[zt.owner]);
        wallRecords[`${x}:${y}`].push(zt.owner);
        wallRecords[`${x}:${y}`] = wallRecords[`${x}:${y}`].filter((item, index) => {
            return wallRecords[`${x}:${y}`].indexOf(item) === index;
        });

        delete wallRecords[zt.owner];
    } else if (xy.state === false && zt.state === true) {
        wallRecords[zt.owner].push(`${x}:${y}`);
    } else if (zt.state === false && xy.state === true) {
        wallRecords[xy.owner].push(`${z}:${t}`);
    } else if (zt.state === false && xy.state === false && wallRecords[`${x}:${y}`] == null) {
        wallRecords[`${x}:${y}`] = new Array();
        wallRecords[`${x}:${y}`].push(`${z}:${t}`);
    }
}

function getNeighbors(x, y) {
    let neighbors = {
        "horizontal": { "isOk": random(2), "selection": -1, "elements": [] },
        "vertical": { "isOk": random(2), "selection": -1, "elements": [] }
    };

    if (y - 1 > -1 && recordCheck(x, y, x, y - 1)) {
        neighbors.horizontal.elements.push({ "x": x, "y": y - 1, direction: "left" })
    }
    if (y + 1 < col && recordCheck(x, y, x, y + 1)) {
        neighbors.horizontal.elements.push({ "x": x, "y": y + 1, direction: "right" })
    }
    if (x + 1 < row && recordCheck(x, y, x + 1, y)) {
        neighbors.vertical.elements.push({ "x": x + 1, "y": y, direction: "down" })
    }
    if (x - 1 > -1 && recordCheck(x, y, x - 1, y)) {
        neighbors.vertical.elements.push({ "x": x - 1, "y": y, direction: "up" })
    }

    neighbors.horizontal.selection = random(neighbors.horizontal.elements.length);
    neighbors.vertical.selection = random(neighbors.vertical.elements.length);

    return neighbors;
}

function placeBoxes() {
    let area = document.createElement("div");
    area.id = "area";
    for (let x = 0; x < row; x++) {
        leftSpace = 0;
        for (let y = 0; y < col; y++) {
            let box = createBox(x, y);
            box = addWallsToBox(box, x, y);
            area.appendChild(box);
        }
        topSpace += (height - width);
    }
    document.body.appendChild(area);
}

function createBox(x, y) {
    let box = document.createElement("div");
    box.style.position = "absolute";
    box.style.top = height + x * (height - width);
    box.style.left = height + y * (height - width);
    box.className = "box";
    box.id = `${x}${y}`;
    box.style.width = height;
    box.style.height = height;
    return box;
}

function adjacentCells(x, y, z, t, direction) {
    removeWall(x, y, direction);

    switch (direction) {
        case "up":
            removeWall(z, t, "down");
            break;
        case "down":
            removeWall(z, t, "up");
            break;
        case "left":
            removeWall(z, t, "right");
            break;
        case "right":
            removeWall(z, t, "left");
            break;
    }
}

function removeWall(x, y, direction) {
    if (document.getElementById(`${x}x${y}y${direction}`) !== null) {
        document.getElementById(`${x}x${y}y${direction}`).remove();
    } else {
        console.log("Cell doesn't exist.");
        console.log(`(${x},${y}), ${direction}`);
    }
}

function addWallsToBox(box, x, y) {
    for (let i = 0; i < 4; i++) {
        let div = document.createElement("div");
        div.style.position = "fixed";
        div.style.background = "black";
        switch (i) {
            case 0:
                div.className = "wall-horizontal";
                div.id = `${x}x${y}yup`;
                div.style.top = height + topSpace;
                div.style.left = height + leftSpace;
                div.style.height = width;
                div.style.width = height;
                break;
            case 1:
                div.className = "wall-vertical";
                div.id = `${x}x${y}yleft`;
                div.style.top = height + topSpace;
                div.style.left = height + leftSpace;
                div.style.height = height;
                div.style.width = width;
                break;
            case 2:
                div.className = "wall-horizontal";
                div.id = `${x}x${y}ydown`;
                div.style.top = height + topSpace + (height - width);
                div.style.left = height + leftSpace;
                div.style.height = width;
                div.style.width = height;
                break;
            case 3:
                div.className = "wall-vertical";
                div.id = `${x}x${y}yright`;
                div.style.top = height + topSpace;
                div.style.left = height + leftSpace + (height - width);
                div.style.height = height;
                div.style.width = width;
                break;
        }
        box.appendChild(div);
    }
    leftSpace += (height - width);
    return box;
}

function dot(direction) {

    if (lastDot === null) {
        lastDot = { x: doors[0].x, y: doors[0].y };
    } else if (direction === "right" && checkIsCoordinateAvailable(lastDot.x, lastDot.y + 1)) {
        if (document.getElementById(`${lastDot.x}x${lastDot.y}yright`) === null
            && document.getElementById(`${lastDot.x}${lastDot.y + 1}`).style.background == "") {
            lastDot.y += 1;
        }
    } else if (direction === "left" && checkIsCoordinateAvailable(lastDot.x, lastDot.y - 1)) {
        if (document.getElementById(`${lastDot.x}x${lastDot.y}yleft`) === null
            && document.getElementById(`${lastDot.x}${lastDot.y - 1}`).style.background == "") {
            lastDot.y -= 1;
        }
    } else if (direction === "down" && checkIsCoordinateAvailable(lastDot.x + 1, lastDot.y)) {
        if (document.getElementById(`${lastDot.x}x${lastDot.y}ydown`) === null
            && document.getElementById(`${lastDot.x + 1}${lastDot.y}`).style.background == "") {
            lastDot.x += 1;
        }
    } else if (direction === "up" && checkIsCoordinateAvailable(lastDot.x - 1, lastDot.y)) {
        if (document.getElementById(`${lastDot.x}x${lastDot.y}yup`) === null
            && document.getElementById(`${lastDot.x - 1}${lastDot.y}`).style.background == "") {
            lastDot.x -= 1;
        }
    }

    if (checkIsCoordinateAvailable(lastDot.x, lastDot.y)) {
        document.getElementById(`${lastDot.x}${lastDot.y}`).style.background = "#e2f442";
    }
}

function checkIsCoordinateAvailable(x, y) {
    return x > -1 && x < row && y > -1 && y < col;
}

// Width must be 14% of height
window.onload = function () {
    generate(10, 20, 35, 4.9);
    createView();

    dot();
    document.onkeypress = function (e) {
        if (e.key === "w") {
            dot("up");
        } else if (e.key === "a") {
            dot("left");
        } else if (e.key === "d") {
            dot("right");
        } else if (e.key === "s") {
            dot("down");
        }
    }
};

function generateClick() {
    if(document.getElementById("area") !== null) {
        document.getElementById("area").remove();

        generate(document.getElementById("row").value, document.getElementById("col").value, 35, 4.9);
        createView();
        dot();
    }
}