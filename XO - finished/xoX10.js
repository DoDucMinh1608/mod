this.options = {
  max_players: 2,
  custom_map: "",
  friendly_colors: 2,
  map_name: "XO",
};
const square = 0.5625;
const winning = 3;
// board
const numberBoxes = 3;
const boardWidth = 90;
// pixel
const PieceSize = boardWidth / numberBoxes - 1;

function Pieces(pos) {
  this.display = {
    id: pos,
    position: [
      23.5 + pos[1] * (PieceSize + 1) * square,
      3.95 + pos[0] * (PieceSize + 1),
      PieceSize * square,
      PieceSize,
    ],
    clickable: true,
    visible: true,
    components: [{ type: "box", position: [0, 0, 100, 100], fill: "#4C4C4C" }],
  };
  this.isClick = function () {
    Object.assign(this.display, { clickable: false, components: [{ type: "text", position: [0, 0, 100, 100], value: this.side },], });
  };
}

let board = {
  id: "board",
  position: [23, 3, boardWidth * square, boardWidth],
  visible: true,
  clickable: false,
  components: [{ type: "box", position: [0, 0, 100, 100], fill: "#4C4C4C", width: 100 / numberBoxes, stroke: "#25bdb1", },],
};
for (let i = 1; i <= numberBoxes - 1; i++) {
  board.components.push({ type: "box", position: [0, 0 + i * (100 / numberBoxes), 100, 1], fill: "#25bdb1", });
  board.components.push({ type: "box", position: [0 + i * (100 / numberBoxes), 0, 1, 100], fill: "#25bdb1", });
}
function setup(boxes) {
  let result = [];
  for (let i = 0; i < boxes; i++)
    result.push(Array(boxes).fill(i).map((i, r) => new Pieces([i, r])));
  return result;
}
let round = {
  moves: 0,
  rounds: 0,
  board: setup(numberBoxes),
  isWin: function (pos) {
    let [y, x] = pos;
    let side = this.board[y][x].side;
    let [horizontal, vertical] = [0, 0];
    for (let i = 0; i < numberBoxes; i++) {
      if (this.board[y][i].side == side) horizontal++;
      else horizontal = 0;
      if (this.board[i][x].side == side) vertical++;
      else vertical = 0;
      if (horizontal == winning || vertical == winning) {
        this.end = true;
        return true;
      }
    }
    let [right, left] = [[side], [side]];
    for (let i = 1; i < numberBoxes; i++) {
      !(y + i > numberBoxes - 1 || x + i > numberBoxes - 1) &&
        right.push(this.board[y + i][x + i].side);
      !(y - i < 0 || x - i < 0) && right.unshift(this.board[y - i][x - i].side);
      !(y - i < 0 || x + i > numberBoxes - 1) &&
        left.push(this.board[y - i][x + i].side);
      !(x - i < 0 || y + i > numberBoxes - 1) &&
        left.unshift(this.board[y + i][x - i].side);
    }
    for (let i of [right, left]) {
      let result = 0;
      for (let b = 0; b < i.length; b++) {
        if (i[b] == side) result++;
        else result = 0;
        if (result == winning) {
          this.end = true;
          return true;
        }
      }
    }
  },
  end: false,
};
this.tick = function (game) {
  if (game.step % 30 == 0) {
    for (let ship of game.ships) {
      for (let box of round.board.flat()) ship.setUIComponent(box.display);
      if (!ship.custom.init) {
        ship.setUIComponent(board);
        ship.custom.init = true;
        round.board = setup(numberBoxes);
      }
      if (round.end) {
        if (ship.custom.win) ship.gameover({ "You win": ":D" });
        else ship.gameover({ "You lose": ":(" });
      }
    }
  }
};
this.event = function (event, game) {
  switch (event.name) {
    case "ui_component_clicked":
      let [y, x] = event.id;
      if (round.moves % 2 == event.ship.team) {
        round.moves++;
        round.board[y][x].side = event.ship.team ? "X" : "O";
        round.board[y][x].isClick();
        if (round.moves >= winning * 2 - 1)
          event.ship.custom.win = round.isWin(event.id);
      }
      break;
    case "ship_spawned":
      round.board = setup(numberBoxes);
      round.end = false;
      break;
  }
};
