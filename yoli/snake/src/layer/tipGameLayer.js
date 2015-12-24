/**
 * Created by Yoli on 15/11/12.
 */
var TipGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();

        Variables.canClick = false;
        this.tipyes = true;

        var bg = new cc.Sprite("res/"+game.language+"/newrider.png");
        this.addChild(bg);
        bg.setAnchorPoint(.5,.5);
        bg.setPosition(240,400);

        var _closeno = new cc.Sprite("res/closebt.png");
        var _closese = new cc.Sprite("res/closebt.png");
        _closese.setScale(.99);
        _closese.setAnchorPoint(0,1);

        var _yesno = new cc.Sprite("res/choose.png");
        var _yesse = new cc.Sprite("res/choose.png");
        _yesse.setScale(.99);
        _yesse.setAnchorPoint(0,1);

        var menuSprite1 = new cc.MenuItemSprite(_closeno,_closese,this.startGame,this);
        menuSprite1.setPosition(383,531);
        this.menuSprite2 = new cc.MenuItemSprite(_yesno,_yesse,this.startGame1,this);
        this.menuSprite2.setPosition(120,270);

        var menu = new cc.Menu(menuSprite1, this.menuSprite2);
        menu.setPosition(0,0);
        this.addChild(menu);
        return true;
    },
    startGame:function(){
        Variables.canClick = true;
        cc.director.resume();
        this.removeFromParent();
        if(this.tipyes){
            Variables.bFirst=false;
        }
    },
    startGame1: function () {
        if(this.tipyes){
            this.menuSprite2.opacity=0;
            this.tipyes = false;
            cc.log(this.tipyes);
        }else{
            this.menuSprite2.opacity=255;
            this.tipyes = true;
            cc.log(this.tipyes);
        }
    }
});