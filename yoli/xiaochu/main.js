cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    //初始化引擎
    flax.init(cc.ResolutionPolicy.SHOW_ALL);

    //注册场景（参数：场景名字，场景，所需素材）
    flax.registerScene("start", StartGameScene, res_startScene);
    flax.registerScene("play",PlayGameScene,res_playScene);
    flax.registerScene("end",EndGameScene,res_endScene);
    flax.replaceScene("start");

    //if(window.location.href.indexOf("ookor")==-1)
    //{
    //    window.location.href = "http://www.ookor.com";
    //}

};
cc.game.run();