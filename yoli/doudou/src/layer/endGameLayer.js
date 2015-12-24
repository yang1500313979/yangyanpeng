/**
 * Created by Yoli
 */

var WinGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();

        var _win = flax.assetsManager.createDisplay(res.End_plist,"winLayer",{parent:this});
        _win.setPosition(240,400);
        _win.setAnchorPoint(.5,.5);
        flax.inputManager.addListener(_win.winshare,this.callBfun1,null,this);
        flax.inputManager.addListener(_win.nextpass,this.callBfun2,null,this);


    },
    callBfun1: function () {
        window.location.href = "/";

    },
    callBfun2: function () {
        Variables.level++;
        if(Variables.level>3){
            Variables.level = 0;
        }

        flax.replaceScene("play");
    }
});

var DefeatGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();

        var _defeat = flax.assetsManager.createDisplay(res.End_plist,"defeatLayer",{parent:this});
        _defeat.setPosition(240,400);
        _defeat.setAnchorPoint(.5,.5);
        flax.inputManager.addListener(_defeat.repeat,this.callBfun1,null,this);
        flax.inputManager.addListener(_defeat.share,this.callBfun2,null,this);


    },
    callBfun1: function () {
        flax.replaceScene("play");

    },
    callBfun2: function () {
        window.location.href = "/";
    }
});