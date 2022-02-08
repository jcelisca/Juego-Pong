
(function(){
    /**
     * Función que permite crear un objeto Board, dentro del cual se dibujara la pelota y las barras
     * @param {*} width define el ancho del tablero
     * @param {*} height define el alto del tablero
     */
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = true;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.count = 0;
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            //elements.push(this.ball);
            return elements;
        }
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

    self.BoardView.prototype = {
        /**
         * Limpia la pantalla agregando un rectangulo del tamaño del tablero
         */
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height)
        },

        /**
         * Dibuja todos los elementos del tablero recorriendo el array que almacena los objetos Ball y Bar 
         */
        draw: function(){
            for (var i = this.board.elements.length -1; i >= 0;i--){
                var el = this.board.elements[i];
                draw(this.ctx, el)
            }
        },

        /**
         * Valida si el juego esta en pausa o no, o si el jugador perdió
         */
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                /*this.check_collisions();
                this.board.ball.move();
                this.board.ball.speedBall();
                this.board.ball.outBall();*/
            }/*else if(this.board.game_over){
                this.gameOver();
            }else this.pause();*/
        }
    }

    /**
     * Dibuja los objetos Ball o Bar validando el parámetro enviado a la función
     * @param {*} ctx contiene el contexto de dibujo para el canvas
     * @param {*} element indica si el objeto a dibujar es un rectangulo o un círcullo
     */
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height)
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
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
        /**
         * Mover la barra hacia arriba
         */
        down: function(){
            if(this.y + this.height < this.board.height){
                this.y += this.speed;
            }
            
        },

        /**
         * Mover la barra hacia abajo
         */
        up: function(){
            if(this.y + this.height > this.height){
                this.y -= this.speed;
            }
        }
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

var board = new Board(500,300);
var bar = new Bar(20, 100, 15, 90, board);
var bar2 = new Bar(460, 100, 15, 90, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas,board);
board_view.draw();
window.requestAnimationFrame(controller);


document.addEventListener("keydown", function(ev){
    
    if(ev.keyCode == 38){
        ev.preventDefault();
        bar2.up();
    }else if(ev.keyCode == 40){
        ev.preventDefault();
        bar2.down();
    }else if(ev.keyCode === 87){
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode === 83){
        ev.preventDefault();
        bar.down();
    }else if(ev.keyCode === 32){
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

function  controller(){  
    board_view.play();
    window.requestAnimationFrame(controller)
}