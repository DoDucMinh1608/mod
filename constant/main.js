const square = screen_width / screen_height; // 1920 / 1080
const radar_radius = (90 / this.options.radar_zoom) / 2 * this.options.map_size;
const upgrades = [
  { id: "9", position: [25, 0, 20, 10], visible: true, clickable: true, shortcut: "9", components: [{ type: "box", position: [0, 0, 100, 100] }] },
  { id: "0", position: [45, 0, 20, 10], visible: true, clickable: true, shortcut: "0", components: [{ type: "box", position: [0, 0, 100, 100] }] }
];
const radar_radius = (map_size * 10) / radar_zoom;
game.modding.commands.command_name = function () { }