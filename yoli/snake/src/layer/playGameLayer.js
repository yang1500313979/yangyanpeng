/**
 * Created by Yoli
 */

var PlayGameLayer = cc.Layer.extend({
    ctor:function (){
        this._super();
        this.snakepool = [];
        this.nums = 0;
        this.dir = Constant.UP;
        this.Score = 0;
        this.fator = 6;

        this.fInitUi();
        this.fInitSnake();
        this.schedule(this.fMoveSnake,.06);
        this.fTouchFunc();
        this.food = flax.assetsManager.createDisplay(res.Anim_plist,"money");
        this.food.setAnchorPoint(.5,.5);
        this.food.play();
        this.addChild(this.food,2);
        this.fRandFood();

        return true;
    },
    fInitUi: function () {
        this.fInitBg();
        this.fInitScore();

    },
    fInitScore: function () {
        this.scorelayer = new cc.LabelAtlas("0", res.Num1_png, 52, 82, "0");
        this.scorelayer.setAnchorPoint(.5,.5);
        this.scorelayer.setPosition(240,700);
        this.addChild(this.scorelayer,1);
    },
    fInitBg: function () {
        var bg = new cc.Sprite("res/bg.jpg");
        bg.setAnchorPoint(0,0);
        bg.setPosition(0,0);
        this.addChild(bg);
    },
    fInitSnake: function () {
        var  head = cc.p(5,9);
        this.head = Body.create(1);
        this.head.setPosition(this.fGetPosition(head));
        this.head.col = head.x;
        this.head.row = head.y;
        this.addChild(this.head,2);
        this.snakepool.push(this.head);
        for(var i = 2;i<5;i++){
            var body = Body.create(i);
            body.setPosition(this.fGetPosition(cc.p(head.x,head.y-i+1)));
            body.col = head.x;
            body.row = head.y-i+1;
            this.addChild(body,2);
            this.snakepool.push(body);
        }
    },
    fGetPosition: function (point) {
        if(point.x!= null){
            return cc.p(point.x*Constant.SPRITE_WIDHT+Constant.SPRITE_WIDHT/2,
                point.y*Constant.SPRITE_HEIGH+Constant.SPRITE_HEIGH/2)
        }else{
            return cc.p(point.col*Constant.SPRITE_WIDHT+Constant.SPRITE_WIDHT/2,
                point.row*Constant.SPRITE_HEIGH+Constant.SPRITE_HEIGH/2)
        }

    },
    fMoveSnake: function () {
        if((this.nums%this.fator)==0){
            if(this.snakepool.length == 240){
                this.fDied();
            }
            cc.log(this.snakepool.length);
            if(this.snakepool.length != 0){
                var iseatFood = false;
                iseatFood = false;
                //蛇头
                var head = this.head;
                var Hcol = head.col;
                var Hrow = head.row;
                switch (this.dir){
                    case Constant.UP:
                        head.row++;
                        if(head.row == 20){
                            head.row =0;
                        }
                        break;
                    case Constant.DOWN:
                        head.row--;
                        if(head.row == -1){
                            head.row = 19;
                        }
                        break;
                    case Constant.LEFT:
                        head.col--;
                        if(head.col == -1){
                            head.col = 11;
                        }
                        break;
                    case Constant.RIGHT:
                        head.col++;
                        if(head.col == 12){
                            head.col = 0;
                        }
                        break;
                    default :break;
                }
                //判断是否吃到食物
                if(head.col == this.food.col&&head.row == this.food.row){
                    iseatFood = true;
                }
                if(this.fWasCollsion(this.snakepool,head)){
                    this.fDied();
                }

                head._status = this.dir;

                head.changestatus(head._status);
                head.setPosition(this.fGetPosition(cc.p(head.col,head.row)));

                var body = null;
                for(var i = this.snakepool.length-1;i>0;i--){
                    body  = this.snakepool[i];
                    switch (parseInt(body._type)){
                        case 5:
                            if(iseatFood&&(i == this.snakepool.length-2)){
                            }else{
                                body.col = this.snakepool[i-1].col;
                                body.row = this.snakepool[i-1].row;
                                body._status = this.snakepool[i-1]._status;
                            }
                            break;
                        case 4:
                            if(iseatFood){
                                this.addBody(this.snakepool[i-1].col,this.snakepool[i-1].row,this.snakepool[i-1]._status);
                            }else{
                                body.col = this.snakepool[i-1].col;
                                body.row = this.snakepool[i-1].row;
                                body._status = this.snakepool[i-1]._status;
                            }


                            break;
                        case 3:
                            body.col = this.snakepool[i-1].col;
                            body.row = this.snakepool[i-1].row;
                            body._status = this.snakepool[i-1]._status;

                            break;
                        case 2:
                            body.col = Hcol;
                            body.row = Hrow;
                            body._status =  this.dir;

                            break;

                        default:break;
                    }

                    body.changestatus(body._status);
                    body.setPosition(this.fGetPosition(cc.p(body.col,body.row)));
                }
                if(iseatFood){
                    this.fRandFood();
                }
            }
        }
        this.nums++;
        if(this.Score == 5){
            this.fator = 5;
        }
        if(this.Score == 10){
            this.fator = 4;
        }
        if(this.Score == 15){
            this.fator = 3;
        }
        if(this.Score == 45){
            this.fator = 2;
        }
        if(this.Score == 66){
            this.fator = 1;
        }
    },
    fTouchFunc: function () {
        var self = this;
        var began = null;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch,event){
                began = touch.getLocation();

                return true;
            },
            onTouchMoved:function(touch,event){

            },
            onTouchEnded:function(touch,event){
                var end = touch.getLocation();
                var xDist = end.x - began.x;
                var yDist = end.y - began.y;
                if(Math.abs(xDist)>10||Math.abs(yDist)>10){
                    //左右
                    if(Math.abs(xDist)>Math.abs(yDist)){
                        if(self.head._status!=Constant.LEFT&&self.head._status!=Constant.RIGHT){
                            if(xDist>0){
                                self.dir = Constant.RIGHT;
                            }else{
                                self.dir = Constant.LEFT;
                            }
                        }
                    }else{
                        if(self.head._status!=Constant.UP&&self.head._status!=Constant.DOWN) {
                            if(yDist>0){
                                self.dir = Constant.UP;
                            }else{
                                self.dir = Constant.DOWN;
                            }
                        }
                    }
                }
            }
        },this);
    },
    fRandFood: function () {
        var has = true;
        var a = [];

        while(has){
            a.col = parseInt(Math.random()*(Constant.MAP_WIDHT));
            a.row = parseInt(Math.random()*(Constant.MAP_HEIGH));
            if(!this.pointWasin(this.snakepool,a)){
                has = false;
            }
        }
        var food = this.food;
        food.col = a.col;
        food.row = a.row;
        food.setPosition(this.fGetPosition(a));


    },
    pointWasin : function (array,point) {
        for(var i in array){
            if(array[i].col == point.col && array[i].row==point.row){
                return i;
            }
        }
        return false;
    },
    addBody: function (col,row,status) {
        var body = Body.create(5);
        body.setPosition(this.fGetPosition(cc.p(col,row)));
        body._status = status;
        body.col = col;
        body.row = row;
        this.addChild(body,2);
        var length = this.snakepool.length;
        this.snakepool.splice(length-1,0,body);
        this.Score++;
        this.scorelayer.setString(this.Score.toString());

        cc.log("SNAKE LENGTH   "+this.snakepool.length);
    },
    fWasCollsion: function (pool,head) {
        for(var i = 1 ;i< pool.length-1;i++){
            if(pool[i].col==head.col&&pool[i].row == head.row){
                return true;
            }
        }
        return false;

    },
    fDied: function () {

        this.unschedule(this.fMoveSnake);
        this.schedule(function () {
            if(this.snakepool.length>0){
                var _bomb = flax.assetsManager.createDisplay(res.Anim_plist,"bomb", {parent: this});
                _bomb.setPosition(this.head.getPosition());
                _bomb.play();
                _bomb.autoDestroyWhenOver = true;
                this.head.removeFromParent();
                this.snakepool.splice(0,1);
                this.head = this.snakepool[0];
            }else{
                this.GameOver();
            }

        },.3);
    },
    GameOver: function () {
        Variables.nScore = this.Score;
        if(this.Score>Variables.nBestScore){
            Variables.nBestScore = this.Score;
        }
        flax.replaceScene("end");
    }
});
