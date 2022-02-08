
(function(){
    /**
     * Función que permite crear un objeto Board, dentro del cual se dibujara la pelota y las barras
     * @param {*} width define el ancho del tablero
     * @param {*} height define el alto del tablero
     */
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.count = 0;
    }

    self.board.prototype = {

    }

})();


(function(){
    /**
     * Función que permite incrustar dentro del tablero los elementos como la pelota y las barras
     * @param {*} canvas parámetro que trae el canvas creado en el HTML
     * @param {*} board trae el objeto Board ya creado para obener sus dimensiones 
     */
    self.BoardView = function(canvas,board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.board_view.prototype = {

    }

    function draw(ctx, element){

    }

})();


(function(){
    /**
     * Función que permite crear un objeto Ball, la pelota que se movera por el tablero
     * @param {*} x representa la ubicacion en el eje x de la pelota dentro del tablero 
     * @param {*} y representa la ubicacion en el eje y de la pelota dentro del tablero
     * @param {*} radius el radio que tendrá la pelota dentro del tablero
     * @param {*} board Board o tablero creado donde se ubicara la pelota
     */
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 2;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 2;
        this.speed = 2;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {

    }

})();


(function(){
    /**
     * Función que permite crear un objeto Bar o barra dentro del tablero
     * @param {*} x posición en el eje x dentro del tablero donde estará la barra
     * @param {*} y posición en el eje y dentro del tablero donde estará la barra
     * @param {*} width ancho que tendrá la barra
     * @param {*} height alto que tendrá la barra
     * @param {*} board tablero dentro del cual se dibujaran las barras
     */
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 30;
    }

    self.Bar.prototype = {

    }
})();

var board = new Board(700,400);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas,board);