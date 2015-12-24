/**
 * Created by Yoli on 15/11/10.
 */
var StartGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
        ggax();

        var bg = new cc.Sprite("res/"+game.language+"/startbg.jpg");
        this.addChild(bg);
        bg.setAnchorPoint(.5,.5);
        bg.setPosition(240,400);

        var _startno = new cc.Sprite("res/startbt.png");
        var _startse = new cc.Sprite("res/startbt.png");
        _startse.setScale(.99);
        _startse.setAnchorPoint(0,1);

        var menuSprite = new cc.MenuItemSprite(_startno,_startse,this.startGame,this);
        var menu = new cc.Menu(menuSprite);
        menu.setPosition(240,200);
        this.addChild(menu);
        return true;
    },
    startGame:function(){
        cc.log("start Game");
        flax.replaceScene("play");
    }
});