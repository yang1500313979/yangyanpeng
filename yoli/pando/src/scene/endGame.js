/**
 * Created by Yoli on 15/11/12.
 */
var EndGameScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        var layer = new EndGameLayer();
        this.addChild(layer);

    }
});