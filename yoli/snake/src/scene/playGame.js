/**
 * Created by Yoli on 15/11/10.
 */

var PlayGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.playelayer = new PlayGameLayer();
        this.addChild(this.playelayer);
        cc.director.pause();

        if(Variables.bFirst){
            this.tiplayer = new TipGameLayer();
            this.addChild(this.tiplayer,2);
        }else{
            Variables.canClick = true;
            cc.director.resume();

        }
        this.playelayer = new PlayGameLayer();


    }
});


