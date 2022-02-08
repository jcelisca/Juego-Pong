
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

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){return bar;});
            elements.push(this.ball);
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
                this.check_collisions();
                this.board.ball.move();
                this.board.ball.speedBall();
                this.board.ball.outBall();
            }else if(this.board.game_over){
                this.gameOver();
            }else this.pause();
        },

        /**
         * Al persionar la tecla espaciadora playing cambia de valor booleano permitiendo poner pausa al juego
         */
        pause: function(){
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");
            let image = document.getElementById('imagen1');

            ctx.drawImage(image, 220, 120, 60, 60);
        },

        /**
         * Muestra mensaje de game over si la pelota sale del tablero
         */
        gameOver: function(){
            let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");
            let image = document.getElementById('imagen2');

            ctx.drawImage(image, 220, 120, 60, 60);
        },

        /**
         * Revisa si la pelota choca con las barras o los lados horizontales del tablero
         */
        check_collisions: function(){
            for (var i = this.board.bars.length -1; i >= 0; i--){
                var bar = this.board.bars[i];
                if(hitBar(bar, this.board.ball)){
                    this.board.ball.collisionBar(bar);
                    this.board.count += 1;
                }
            };
            if(hitEdge(this.board.ball)){
                this.board.ball.collisionEdge();
                this.board.count += 1;
            }   
        }  
    }
     /**
      * Función que valida si la pelota choca con las barras
      * @param {*} a objeto Bar
      * @param {*} b objeto Ball
      * @returns devuelve true si la pelota choca las barras
      */
    function hitBar(a, b){
        var hit = false;
        //coliisiones horizontales
        if(b.x + b.width >= a.x + (a.width/2) && (b.x-b.radius)  < a.x + a.width){
            //colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        };
        return hit;
    }

    /**
     * Función que valida si la pelota choca con los lados horizontales del tablero
     * @param {*} b objeto Ball
     * @returns devuelve true si la pelota choca uno de los lados horizontales del tablero
     */
    function hitEdge(b){
        var hit = false;
        if(b.y + b.radius > this.board.height || b.y + b.radius < b.height){
            hit = true;
        }
        return hit;
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

        /**
         * Indica las coordenadas en X y Y de la trayectoria de la pelota
         */
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },

        /**
         * Aumenta la velocidad de la pelota cada 6 choques
         */
        speedBall: function(){
            if(this.board.count > 5){
                this.speed += 1;
                this.board.count = 0;
            }
        },
        get width(){
            return this.radius * 2;
        },

        get height(){
            return this.radius * 2;
        },

        /**
         * Asigna la nueva trayectoria en X y Y cuando la pelota choca con un de las barras
         * @param {*} bar Objeto Bar que se cruza con las coordenadas de la pelota
         */
        collisionBar: function(bar){
            var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        },

        /**
         * Cambia la dirección en el eje Y cuando la pelota choca con un de los lados horizontales del tablero
         */
        collisionEdge: function(){
            this.speed_y = -this.speed_y;
        },

        /**
         * Función que revisa si la pelota salió del tablero
         */
        outBall: function(){
            if((this.x + this.width*2 < this.width) || this.x -this.width > this.board.width){
                this.board.playing = false;
                this.board.game_over = true;
            }
        }
    }

})();

var board = new Board(500,300);
var bar = new Bar(20, 100, 15, 90, board);
var bar2 = new Bar(465, 100, 15, 90, board);
var ball = new Ball(350, 100, 10, board);
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