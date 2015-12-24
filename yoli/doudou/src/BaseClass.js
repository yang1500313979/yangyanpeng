/**
 * Created by Yoli on 15/12/1.
 */
var Base = cc.Sprite.extend({
    _type:0,
    _col:0,
    _row:0,
    _status:Constant.STOP,

    ctor: function (type, status,col,row,speed) {
        this._super("res/enemy/enemy"+(type+1)+".png");
        this._status = status;
        this._col = col;
        this._row = row;
        this._speed = speed;
        this.setScale(.6);
    },
    ChangeStatus:function(status){
        if(status==Constant.STOP){
            if(this._status!=Constant.STOP){
                this.stopAllActions();
                this._status = Constant.STOP;
            }

        }
        if(status==Constant.RIGHT){
            if(this._status!=Constant.RIGHT) {
                this.stopAllActions();
                this.runAction(cc.moveBy(6,cc.p(this._speed*100,0)));
                this._status = Constant.RIGHT;
            }
        }
        if(status==Constant.UP){
            if(this._status!=Constant.UP) {
                this.stopAllActions();
                this.runAction(cc.moveBy(6,cc.p(0,this._speed*100)));
                this._status = Constant.UP;
            }
        }
        if(status==Constant.DOWN){
            if(this._status!=Constant.DOWN){
                this.stopAllActions();
                this.runAction(cc.moveBy(6,cc.p(0,-this._speed*100)));
                this._status = Constant.DOWN;
            }
        }
        if(status==Constant.LEFT){
            if(this._status!=Constant.LEFT){
                this.stopAllActions();
                this.runAction(cc.moveBy(6,cc.p(-this._speed*100,0)));
                this._status = Constant.LEFT;
            }
        }
    }
});

var Node =
{
    x : null,
    y : null,
    fa: null,
    F :0,
    misVisted:false
};