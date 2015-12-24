/**
 * Created by Yoli
 */

var EndGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
        ggay();
        this.fInitUi();

        return true;
    },
    fInitUi: function () {
        this.fInitBg();
        this.fInitMenu();
        this.fInitNumbers();
    },
    fInitBg: function () {
        var bg = new cc.Sprite(res.EndBg_png);
        this.addChild(bg);
        bg.setAnchorPoint(.5,.5);
        bg.setPosition(240,400);
    },
    fInitMenu: function () {
        var btnurl1 = "res/overshare.png";
        var btnurl2 = "res/overagain.png";

        var _closeno = new cc.Sprite(btnurl1);
        var _closese = new cc.Sprite(btnurl1);
        _closese.setScale(.99);
        _closese.setAnchorPoint(0,1);

        var _yesno = new cc.Sprite(btnurl2);
        var _yesse = new cc.Sprite(btnurl2);
        _yesse.setScale(.99);
        _yesse.setAnchorPoint(0,1);

        var menuSprite1 = new cc.MenuItemSprite(_closeno,_closese,this.callback1,this);
        menuSprite1.setAnchorPoint(.5,.5);
        menuSprite1.setPosition(120,160);

        var menuSprite2 = new cc.MenuItemSprite(_yesno,_yesse,this.callback2,this);
        menuSprite2.setAnchorPoint(.5,.5);

        menuSprite2.setPosition(360,160);

        var menu = new cc.Menu(menuSprite1, menuSprite2);
        menu.setPosition(0,0);
        this.addChild(menu);
    },
    callback1:function(){
        window.location.href = "/";
    },
    callback2: function () {
        flax.replaceScene("play")
    },
    fInitNumbers: function () {
        var scorenum =  new cc.LabelAtlas(Variables.nScore.toString(), res.Num2_png, 26, 46, "0");
        scorenum.setPosition(100,380);
        scorenum.setAnchorPoint(0,.5);
        this.addChild(scorenum);

        var scorenum2 =  new cc.LabelAtlas(Variables.nBestScore.toString(), res.Num2_png, 26, 46, "0");
        scorenum2.setPosition(100,280);
        scorenum2.setAnchorPoint(0,.5);
        this.addChild(scorenum2);

    }
});