/**
 * Created by Yoli
 */

var PlayGameLayer = cc.Layer.extend({
    map : null,
    ctor:function (){
        this._super();
        this.map = [];
        this.Score = 0;
        this.canClick = true;
        this.WIDTH = Constant.MAP_WIDHT;
        this.HEGHT = Constant.MAP_HEIGH;

        this.fInitUi();
        this.fTouchFunc();
        return true;
    },
    fInitUi: function () {
        this.fInitBg();
        this.fInitColors();
        //this.fInitScore();

    },
    fInitScore: function () {
        this.scorelayer = new cc.LabelAtlas("0", res.Num1_png, 52, 82, "0");
        this.scorelayer.setAnchorPoint(.5,.5);
        this.scorelayer.setPosition(240,700);
        this.addChild(this.scorelayer,1);
    },
    fInitBg: function () {
        var bg = new cc.Sprite("res/"+game.language+"/bg.jpg");
        this.addChild(bg);
        bg.setAnchorPoint(.5,.5);
        bg.setPosition(240,400);
    },
    fGetPositon: function (col, row) {
        return cc.p(col * 45 + 15 + 45/2,row * 45 + 15 + 45/2)
    },
    fGetColAndRow: function (point) {
        if(point.x<15||point.x>465||point.y<15||point.y>645){
            return false;
        }else{
            var a = [];
            a.col = parseInt((point.x-15)/45);
            a.row = parseInt((point.y-15)/45);

            return a;
        }
    },
    fInitColors: function () {
        for(var i =0;i<Constant.MAP_WIDHT;i++){
            var colpool = [];
            for(var j = 0;j<Constant.MAP_HEIGH;j++){
                var color = Color.RandomType(i,j);
                this.addChild(color);
                color.setPosition(this.fGetPositon(i,j));
                colpool.push(color);
            }
            this.map.push(colpool);
        }
    },
    fTouchFunc: function () {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch,event){
                if(self.canClick){
                    var a = self.fGetColAndRow(cc.p(touch.getLocation()));
                    if(a){
                        cc.log(a.col);
                        cc.log(a.row);
                        var pool = [];
                        var color = self.map[a.col][a.row];
                        if(color){
                            self.fPopColor(color,pool,color._type);
                        }
                        cc.log(pool.length);
                        if(pool.length>1){
                            self.fRemoveColor(pool);
                        }

                    }
                }
                return true;
            },
            onTouchMoved:function(touch,event){

            },
            onTouchEnded:function(touch,event){

            }
        },this);
    },

    fPopColor: function (aa,pool,type) {
        if(aa._type == type){
            pool.push(aa);
            var col = aa._col;
            var row = aa._row;

            if(col+1<this.WIDTH){
                var color = this.map[col+1][row];
                if(color){
                    if(pool.indexOf(color)<0&&color._type == type){
                        this.fPopColor(color,pool,type);
                    }
                }
            }
            if(col-1>=0){
                var color = this.map[col-1][row];
                if(color){
                    if(pool.indexOf(color)<0&&color._type == type){
                        this.fPopColor(color,pool,type);
                    }
                }
            }
            if(row+1<this.HEGHT){
                var color = this.map[col][row+1];
                if(color){
                    if(pool.indexOf(color)<0&&color._type == type){
                        this.fPopColor(color,pool,type);
                    }
                }
            }
            if(row-1>=0){
                var color = this.map[col][row-1];
                if(color){
                    if(pool.indexOf(color)<0&&color._type == type){
                        this.fPopColor(color,pool,type);
                    }
                }
            }
        }
    },
    fRemoveColor: function (pool) {
        for(var i in pool){
            var color = pool[i];
            color.removeFromParent();
            this.map[color._col][color._row] = null;
            var bomb = flax.assetsManager.createDisplay(res.Anim_plist,"bomb2");
            bomb.setAnchorPoint(.5,.5);
            bomb.play();
            bomb.autoDestroyWhenOver = true;
            bomb.x = color.x;
            bomb.y = color.y;
            this.addChild(bomb,2);
        }
        this.fFallColor();
    },
    fFallColor: function () {
        this.canClick = false;

        var maxTime = 0;
        for(var i = 0;i<this.WIDTH;i++){
            var missCount = 0;
            for(var j =0 ;j<this.map[i].length;j++){
                var color = this.map[i][j];
                if(!color){
                    missCount++;
                }else{
                    var fallLength = missCount;
                    if(fallLength>0){
                        var duration = Math.sqrt(2*fallLength/30);
                        if(duration>maxTime){
                            maxTime = duration;
                        }
                        var move = cc.moveTo(duration,color.x,color.y-Constant.SPRITE_HEIGH*fallLength).easing(cc.easeIn(2));
                        color.runAction(move);
                        color._row -= fallLength;
                        this.map[i][j] = null;
                        this.map[i][color._row] = color;
                    }
                }
            }
        }
        this.scheduleOnce(this.fCheckCol.bind(this),maxTime);
    },
    fCheckCol: function () {
        var maxTime = 0;
        var missCount = 0;
        for(var i = 0;i<this.map.length;i++){
            var pool = this.map[i];
            if(this.fPoolIs(pool)){
                missCount++;
            }else{
                var fallLength = missCount;
                if(fallLength>0){
                    var duration = Math.sqrt(2*fallLength/30);
                    if(duration>maxTime){
                        maxTime = duration;
                    }
                    for(var j in pool){
                        var color = pool[j];
                        if(color){
                            var move = cc.moveBy(duration,-Constant.SPRITE_HEIGH*fallLength,0).easing(cc.easeIn(2));
                            color.runAction(move);
                            color._col -= fallLength;
                            this.map[i][j] = null;
                            this.map[color._col][j] = color;
                        }

                    }
                }
            }
        }
        this.scheduleOnce(this._funishColorFalls.bind(this),maxTime);
    },
    _funishColorFalls: function () {
        this.canClick = true;
    },
    fPoolIs: function (pool) {
        var is = true;
        for(var i in pool){
            if(pool[i]){
                is = false;
            }
        }
        return is;
    },
    GameOver: function () {
        Variables.nScore = this.Score;
        if(this.Score>Variables.nBestScore){
            Variables.nBestScore = this.Score;
        }
        flax.replaceScene("end");
    }
});
