/**
 * Created by Yoli on 15/11/12.
 */
var TipGameLayer = cc.Layer.extend({
    ctor:function() {
        this._super();


        var _tip = flax.assetsManager.createDisplay(res.Tip_plist,"tipLayer",{parent:this});
        flax.inputManager.addListener(_tip.tipclose,this.startGame,null,this);

        return true;
    },
    startGame:function(){
        cc.log("start Game");
        flax.replaceScene("play");
    }
});