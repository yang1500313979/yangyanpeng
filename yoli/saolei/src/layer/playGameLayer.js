/**
 * Created by Yoli
 */
var PlayGameLayer = cc.Layer.extend({


    ctor:function (){
        this._super();
        this.map = [];
        this.aThunder=[];
        this.tipyes = true;

        this.XDIST = 40;
        this.YDIST = 150;
        this.isflaged = false;
        this.aRedpool = [];
        this.Time = 0;
        this.canClick = true;
        this.isOver = false;


        this._timer = true;
        this.aa = true;
        this.touchp = null;

        var bg = new cc.Sprite("res/bg.jpg");
        this.addChild(bg);
        bg.setPosition(240,400);
        bg.setAnchorPoint(.5,.5);

        this.fTipLayer();

        return true;
    },
    fTipLayer: function () {
         cc.director.pause();
         if(Constant.isfrist){
            this.tip = flax.assetsManager.createDisplay(res.Tip_plist,"tipLayer",{parent:this,x:240,y:420});
            this.tip.setAnchorPoint(.5,.5);
            flax.inputManager.addListener(this.tip.tipclose,this.tipcallBfun,null,this);
            flax.inputManager.addListener(this.tip.yes,this.callBfun,null,this);
         }else{
            this.tipcallBfun();
         }

    },
    tipcallBfun: function () {
        if(this.tip){
            this.tip.removeFromParent();
        }
        if(this.tipyes){
            Constant.isfrist=false;
        }

        this.sele = flax.assetsManager.createDisplay(res.Tip_plist,"seleLayer",{parent:this,x:240,y:420});
        this.sele.setAnchorPoint(.5,.5);
        flax.inputManager.addListener(this.sele.first,this.selecallBfun1,null,this);
        flax.inputManager.addListener(this.sele.sec,this.selecallBfun2,null,this);
        flax.inputManager.addListener(this.sele.tre,this.selecallBfun3,null,this);

    },
    callBfun: function () {

        if(this.tipyes){
            this.tip.yes.opacity=0;
            this.tipyes = false;
            cc.log(this.tipyes);
        }else{
            this.tip.yes.opacity=255;
            this.tipyes = true;
            cc.log(this.tipyes);
        }

    },

    selecallBfun1: function () {
        Constant.Level = 0;
        this.sele.removeFromParent();
        this.GamePlay();
    },
    selecallBfun2: function () {
        Constant.Level = 1;
        this.sele.removeFromParent();
        this.GamePlay();
    },
    selecallBfun3: function () {
        Constant.Level = 2;
        this.sele.removeFromParent();
        this.GamePlay();
    },

    GamePlay: function () {
        cc.director.resume();
        this.WIDTH = Constant.Levels[Constant.Level].WIDTH;
        this.HEGHT = Constant.Levels[Constant.Level].HEGHT;
        this.Thunders = Constant.Levels[Constant.Level].NUMS;
        this.haveleft = this.Thunders;
        this.schedule(function () {
            if(this.Time<999&&!this.isOver){
                this.Time ++;
            }
            if(this.Time<10){
                this.timelayer.setString("00"+this.Time.toString());
            }else if (this.Time >=10&&this.Time<100){
                this.timelayer.setString("0"+this.Time.toString());
            }else{
                this.timelayer.setString(this.Time.toString());
            }

        },1);
        this.scheduleUpdate();

        this.fInitUI();
        this.fInitBlock();
        this.fTouchListener();

    },

    fInitUI: function () {


        this.gamelayer = new cc.Layer();
        this.setAnchorPoint(0,0);
        this.addChild(this.gamelayer);

        var label = new cc.Sprite("#label.png");
        label.setAnchorPoint(0,1);
        label.setPosition(0,800);
        this.addChild(label,3);

        this.timelayer = new cc.LabelAtlas("000", res.Num1_png, 36, 45, "0");
        this.timelayer.setAnchorPoint(.5,.5);
        this.timelayer.setPosition(398,27);
        label.addChild(this.timelayer);

        this.thunderlabel = new cc.LabelAtlas(this.Thunders, res.Num1_png, 36, 45, "0");
        this.thunderlabel.setAnchorPoint(1,.5);
        this.thunderlabel.setPosition(175,27);
        label.addChild(this.thunderlabel);

        this.happy = new cc.Sprite("#happy.png");
        this.happy.setPosition(30,27);
        label.addChild(this.happy);

        if(game.language == "en"){
            this.mode = new cc.Sprite("#mode.png");
        }else{
            this.mode = new cc.Sprite("#chmode.png");

        }
        this.mode.setPosition(250,27);
        label.addChild(this.mode);

    },
    fInitBlock: function () {
        if(Constant.Level>0){
            this.XDIST = 25;
            this.YDIST = 25;
        }
        var batchNode = new cc.SpriteBatchNode(res.Play_png);
        this.gamelayer.addChild(batchNode);

        this.map.length = 0;
        for (var col = 0; col < this.WIDTH; col++) {
            var _row = [];
            for (var row = 0; row < this.HEGHT; row++) {
                var _block = [];
                _block._col = col;
                _block._row = row;
                _block._isthunder = false;
                _row.push(_block);
            }
            this.map.push(_row);
        }
        randPoint(this.map,this.aThunder,this.Thunders);

        for(var i in this.aThunder){
            var block = this.map[this.aThunder[i].col][this.aThunder[i].row];
            block._isthunder = true;
        }

        for (var col = 0; col < this.WIDTH; col++) {
            for (var row = 0; row < this.HEGHT; row++) {
                var block = this.map[col][row];
                if(!block._isthunder){
                    var num = this.fNums(block,this.aThunder);

                    var _block = new Block(num,col,row);
                    _block._isthunder = false;

                }else{
                    var _block = new cc.Sprite("#thunder.png");
                    _block._isthunder = true;

                }

                _block.setLocalZOrder(9);
                _block.x = 49 * col + this.XDIST;
                _block.y = 49 * row + this.YDIST;
                _block._isOpen = false;
                _block._isflag = false;
                _block._col = col;
                _block._row = row;
                batchNode.addChild(_block);
                this.map[col].splice(row,1,_block)
            }
        }
        this.fCreateBlock();
    },
    fNums: function (block,thunder) {
        var num = 0;
        for(var i in thunder){
            var colDist = Math.abs(thunder[i].col-block._col)*100;
            var rowDist = Math.abs(thunder[i].row-block._row);
            var dist = colDist+rowDist;
            if(dist==100||dist==101||dist==1){
                num++;
            }
        }
        return num;
    },
    fCreateBlock: function () {

        for (var col = 0; col < this.WIDTH; col++) {
            for (var row = 0; row < this.HEGHT; row++) {
                var block = this.map[col][row];
                block._air = new cc.Sprite("#air.png");
                block._air.setAnchorPoint(0,0);
                block._air._isflag = false;

                block._flag = new cc.Sprite("#flag.png");
                block._flag.setAnchorPoint(0,0);
                block._flag.setVisible(false);
                block._air.addChild(block._flag);
                block.addChild(block._air);
            }
        }
    },
    fTouchListener: function () {
        var self = this;
        var began;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan:function(touch,event){
                if(self.canClick){
                    self._timer = true;
                    began = touch.getLocation();
                    self.aa = true;
                    self.touchp = self.gamelayer.convertToNodeSpace(touch.getLocation());

                    //self.fIsVisiable(began,self.touchp);


                    if(began.y>750){
                        var happyBox = self.happy.getBoundingBox();
                        happyBox.y+=750;
                        if(cc.rectContainsPoint(happyBox,began)){
                            var _block = self.fTipGame();
                            if(_block){
                                var pool = [];
                                self.fOpeninked(_block,pool);
                                for(var z in pool){
                                    pool[z]._air.setVisible(false);
                                    pool[z]._isOpen = true;
                                }
                            }
                        }
                        var modebox = self.mode.getBoundingBox();
                        modebox.y+=750;
                        if(cc.rectContainsPoint(modebox,began)){
                            self.isflaged = !self.isflaged;
                            self.fOpenflaged(self.isflaged);
                        }
                        return false;
                    }
                    self.schedule(self.fFlag,.6);

                }


                return true;
            },
            onTouchMoved:function(touch,event){
                var delta = touch.getDelta();

                if((Math.abs(delta.x-began.x)>10||Math.abs(delta.y-began.y)>10)&&self.canClick){
                    self._timer = false;
                }
                if(Constant.Level>0){
                    self.fMovehessboard(self.gamelayer,delta,self);
                }
            },
            onTouchEnded:function(touch,event){
                if(self.canClick){
                    var end = touch.getLocation();
                    if(Math.abs((began.x-end.x))<10&&
                        Math.abs((began.y - end.y))<10
                    ){
                        var _touchp = self.gamelayer.convertToNodeSpace(touch.getLocation());
                        if(self.aa){
                            for (var i = 0; i < self.WIDTH; i++) {
                                for (var j = 0; j < self.HEGHT; j++) {

                                    var xDist = self.map[i][j].x - _touchp.x;
                                    var yDist = self.map[i][j].y - _touchp.y;
                                    var spDist = xDist * xDist + yDist * yDist;

                                    if (spDist < 25*25) {
                                        var _block = self.map[i][j];
                                        self.fClicleDeal(_block,self);
                                    }
                                }
                            }
                        }
                    }

                    self._timer = false;
                    self.unschedule(self.fFlag);

                }

            }
        },this);
    },
    fClicleDeal: function (_block,self) {
        //点击的方块处于没打开的状态
        if(_block._isOpen == false) {
            //如果是非标记模式
            if(!self.isflaged){
                if(_block._isthunder){
                    if(_block._isflag){
                    }else{
                        self.fGameOver(_block);
                    }
                }else{
                    if(!_block._isflag){
                        if(_block._type == 0){
                            var pool = [];
                            pool.length =0;
                            self.fOpeninked(_block,pool);
                            for(var z in pool){
                                pool[z]._air.setVisible(false);
                                pool[z]._isOpen = true;

                            }
                        }else{
                            _block._air.setVisible(false);
                            _block._isOpen = true;
                        }
                    }
                    //标错的雷
                    else{
                        cc.log("标错的雷");
                    }
                }
            }
            //标记模式
            else{
                self.fFlagRed(_block);
            }
        }
        //点击的方块已经处于点开的状态
        else{
            if(_block._type == 0){
                self.isflaged = !self.isflaged;
                self.fOpenflaged(self.isflaged);
            }else{
                var _flagnum = self.fNums(_block,self.aRedpool);
                if(_flagnum==_block._type&&!self.isflaged){
                    self.fOpenestBlock(_block);
                }
            }
        }
    },
    //移动棋盘
    fMovehessboard: function (layer,delta,self) {
        var pos_x = layer.getPosition().x + delta.x;
        if (pos_x > 49) {
            pos_x = 49;
        }
        if (pos_x < -((self.WIDTH-9)*49)) {
            pos_x = -((self.WIDTH-9)*49);
        }

        var pos_y = layer.getPosition().y + delta.y;
        if (pos_y > 49) {
            pos_y = 49;
        }
        if (pos_y < -((self.HEGHT-14)*49)) {
            pos_y = -((self.HEGHT-14)*49);
        }
        layer.setPosition(cc.p(pos_x, pos_y));
    },
    //递归实现空白位置的翻牌
    fOpeninked: function (aa,pool) {
        //aa._isflag为标错的雷,在这里不执行点开操作
        if(!aa._isflag){
            pool.push(aa);
            var col = aa._col;
            var row = aa._row;
            if(col+1<this.WIDTH){
                var _block = this.map[col+1][row];
                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
            if(col-1>=0){
                var _block = this.map[col-1][row];
                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }

            }
            if(row+1<this.HEGHT){
                var _block = this.map[col][row+1];
                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
            if(row-1>=0){
                var _block = this.map[col][row-1];

                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }

            if(col+1<this.WIDTH&&row+1<this.HEGHT){
                var _block = this.map[col+1][row+1];

                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
            if(col-1>=0&&row+1<this.HEGHT){
                var _block = this.map[col-1][row+1];

                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
            if(col+1<this.WIDTH&&row-1>=0){
                var _block = this.map[col+1][row-1];

                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
            if(col-1>=0&&row-1>=0){
                var _block = this.map[col-1][row-1];
                if(pool.indexOf(_block)<0&&!_block._isOpen){
                    if(_block._type == 0){
                        this.fOpeninked(_block,pool);
                    }else{
                        if(!_block._isflag) {
                            pool.push(_block);
                        }
                    }
                }
            }
        }


        return false;
    },
    //开启标旗模式
    fOpenflaged: function (aa) {
        for (var col = 0; col < this.WIDTH; col++) {
            for (var row = 0; row < this.HEGHT; row++) {
                var block = this.map[col][row];
                block._flag.setVisible(aa);
            }
        }
    },
    //在block的位置添加红旗标识
    fFlagRed: function (block) {

        if(!block._isflag){
            if(this.aRedpool.length<Constant.Levels[Constant.Level].NUMS){
                var red = new cc.Sprite("#red.png");
                this.gamelayer.addChild(red,46);
                red.x = block.x;
                red.y = block.y;
                red.col = block._col;
                red.row = block._row;
                this.aRedpool.push(red);
                block._isflag = !block._isflag;
                this.fChangeThunderNum(true);
            }

        }else{
            var _index = this.fRetrunIndexByBlock(block,this.aRedpool);
            this.aRedpool[_index].removeFromParent();
            this.aRedpool.splice(_index,1);
            block._isflag = !block._isflag;

            this.fChangeThunderNum(false);
        }
    },
    //返回block在pool中得位置
    fRetrunIndexByBlock: function (block,pool) {
        for(var i in pool){
            if(block.x == pool[i].x&&block.y == pool[i].y){
                return i ;
            }
        }
    },
    //初步智能提示
    fOpenestBlock: function (aa) {
        var col = aa._col;
        var row = aa._row;
        if(col+1<this.WIDTH){
            var _block = this.map[col+1][row];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(col-1>=0){
            var _block = this.map[col-1][row];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(row+1<this.HEGHT){
            var _block = this.map[col][row+1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(row-1>=0){
            var _block = this.map[col][row-1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(col+1<this.WIDTH&&row+1<this.HEGHT){
            var _block = this.map[col+1][row+1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(col-1>=0&&row+1<this.HEGHT){
            var _block = this.map[col-1][row+1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(col+1<this.WIDTH&&row-1>=0){
            var _block = this.map[col+1][row-1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
        if(col-1>=0&&row-1>=0){
            var _block = this.map[col-1][row-1];
            if(!_block._isOpen){
                this.fClicleDeal(_block,this);
            }
        }
    },
    fChangeThunderNum: function (num) {
          if(num){
              this.Thunders--;
          }else{
              this.Thunders++;
          }
        this.thunderlabel.setString(this.Thunders);
    },
    fTipGame: function () {
        for (var i = 0; i < this.WIDTH; i++) {
            for (var j = 0; j < this.HEGHT; j++) {

                var _block = this.map[i][j];
                if(!_block._isOpen&&_block._type == 0&&!_block._isthunder){
                    return _block;
                }
            }
        }
        return false;
    },

    fFlag: function () {
        if(this._timer){
            for (var i = 0; i < this.WIDTH; i++) {
                for (var j = 0; j < this.HEGHT; j++) {

                    var xDist = this.map[i][j].x - this.touchp.x;
                    var yDist = this.map[i][j].y - this.touchp.y;
                    var spDist = xDist * xDist + yDist * yDist;

                    if (spDist < 25*25) {
                        var _block = this.map[i][j];
                        if(!_block._isOpen){
                            this.fFlagRed(_block);
                            this.aa = false;
                        }
                    }
                }
            }
        }
    },
    fGameOver: function (block) {
        ggay();

        var died = new cc.Sprite("#died.png");
        died.setAnchorPoint(0,0);
        block.addChild(died,44);
        for (var col = 0; col < this.WIDTH; col++) {
            for (var row = 0; row < this.HEGHT; row++) {
                var block = this.map[col][row];
                if(block._isthunder){
                    block._air.setVisible(false);
                }

            }
        }
        for(var i in this.aRedpool){
            if(this.map[this.aRedpool[i].col][this.aRedpool[i].row]._isthunder){
                this.aRedpool[i].setVisible(false);
            }
        }
        this.canClick = false;
        this.isOver = true;
        this.defeat = flax.assetsManager.createDisplay(res.End_plist,"defeatLayer",{parent:this});
        this.defeat.setAnchorPoint(.5,.5);
        flax.inputManager.addListener(this.defeat.repeat,this.endcallBfun1,null,this);
        flax.inputManager.addListener(this.defeat.share,this.endcallBfun2,null,this);
        this.defeat.setPosition(240,1220);

        var nums = (Constant.Levels[Constant.Level].NUMS-this.haveleft);
        var label1 = new cc.LabelAtlas(nums, res.Num2_png, 24, 34, "0");
        label1.setAnchorPoint(.5,.5);
        label1.setPosition(240,260);
        this.defeat.addChild(label1);

        var label2 = new cc.LabelAtlas(this.Time, res.Num2_png, 24, 34, "0");
        label2.setAnchorPoint(.5,.5);
        label2.setPosition(240,190);
        this.defeat.addChild(label2);



        this.defeat.runAction(cc.moveTo(1,cc.p(240,420)));

    },
    update: function () {
        var win ;
        win = 0;
        for(var i in this.aThunder){
            var block = this.map[this.aThunder[i].col][this.aThunder[i].row];
            if(!block._isflag){
                win ++;
            }
        }
        this.haveleft =win;

        if(win==0&&!this.isOver){
            this.WinGame();
        }

    },
    WinGame: function () {

        ggay();
        this.unschedule(this.fFlag);
        this.canClick = false;
        this.isOver = true;
        this.win = flax.assetsManager.createDisplay(res.End_plist,"winLayer",{parent:this,x:240,y:1220});
        this.win.setAnchorPoint(.5,.5);
        flax.inputManager.addListener(this.win.winrepeat,this.endcallBfun1,null,this);
        flax.inputManager.addListener(this.win.winshare,this.endcallBfun2,null,this);
        var nums = (Constant.Levels[Constant.Level].NUMS-this.haveleft);
        var label1 = new cc.LabelAtlas(nums, res.Num2_png, 24, 34, "0");
        label1.setAnchorPoint(.5,.5);
        label1.setPosition(240,260);
        this.win.addChild(label1);

        var label2 = new cc.LabelAtlas(this.Time, res.Num2_png, 24, 34, "0");
        label2.setAnchorPoint(.5,.5);
        label2.setPosition(240,190);
        this.win.addChild(label2);

        var besttime;
        if(this.Time< Constant.Levels[Constant.Level].TIME){
            Constant.Levels[Constant.Level].TIME = this.Time;
        }
        besttime =  Constant.Levels[Constant.Level].TIME;

        var label3 = new cc.LabelAtlas(besttime, res.Num2_png, 24, 34, "0");
        label3.setAnchorPoint(.5,.5);
        label3.setPosition(240,110);
        this.win.addChild(label3);

        this.win.runAction(cc.moveTo(1,cc.p(240,420)));

    },
    endcallBfun1: function () {
        this.map.length = 0;
        this.aThunder.length = 0;

        this.isflaged = false;
        this.aRedpool.length = 0;
        this.canClick = true;
        this.unscheduleUpdate();

        flax.replaceScene("play");
    },
    endcallBfun2: function () {
        window.location.href = "/";
    }
    //fIsVisiable: function () {
    //
    //}
});
