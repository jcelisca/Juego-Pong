
(function(){
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