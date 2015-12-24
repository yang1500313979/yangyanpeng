/**
 * Created by Yoli
 */
var PlayGameLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.map = [];

        this.canClick = true;
        this.setppool = [];
        this.willmove = null;
        this.beganed = null;
        this.lasted = null;
        this.seleType = 0;
        this.bobmpool = [];
        this.isHasbobm = false;
        this.level = Constant.level;
        this.iscteateBobm = false;

        this.Score = 0;
        this.Step = Constant.levels[Constant.level].limitStep;

        this.fInitUi();
        this.fInitAnimal();

        //划线
        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode, 2);

        if(Constant.isfrist){
            this.canClick = false
            this._tipLayer = flax.assetsManager.createDisplay(res.Tip_plist,"tipLayer");
            this.addChild(this._tipLayer,99);
            this._tipLayer.tip.play();
            flax.inputManager.addListener(this._tipLayer.close,this.tipcallBfun,null,this);

        }

        //触摸事件
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {

                var _col = null;
                var _row = null;
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 8; j++) {
                        var xDist = self.map[i][j].x - touch.getLocationX();
                        var yDist = self.map[i][j].y - touch.getLocationY();
                        var spDist = xDist * xDist + yDist * yDist;
                        if (spDist < 740) {
                            _col = i;
                            _row = j;
                        }
                    }
                }
                if (_col == null || _row == null) {
                    return false;
                }

                if (!self.canClick) {
                    return false;
                }
                self.canClick = false;

                self.seleType = self.map[_col][_row]._type;
                self.map[_col][_row]._selected = true;
                var aa = [];
                aa.col = _col;
                aa.row = _row;
                self.setppool.push(aa);
                self.beganed = self.map[_col][_row];
                self.lasted = self.beganed;
                self.beganed.num.setString("1");

                self.refresh();

                return true;
            },
            onTouchMoved: function (touch, event) {

                var col = null;
                var row = null;
                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 8; j++) {
                        var xDist = self.map[i][j].x - touch.getLocationX();
                        var yDist = self.map[i][j].y - touch.getLocationY();
                        var spDist = xDist * xDist + yDist * yDist;
                        if (spDist < 740) {
                            col = i;
                            row = j;
                        }
                    }
                }
                if (col == null || row == null) {
                    return false;
                }

                self.willmove = self.map[col][row];

                if (self.willmove._type === self.seleType &&
                    Math.abs(self.willmove._column - self.lasted._column) <= 1 &&
                    Math.abs(self.willmove._row - self.lasted._row) <= 1
                ) {
                    //长度为1，将要到达的点不是起始点
                    if (self.setppool.length == 1 && !(self.willmove._column == self.beganed._column &&
                        self.willmove._row == self.beganed._row)) {
                        self.lasted = self.willmove;
                        self.lasted._selected = true;
                        var aa = [];
                        aa.col = self.lasted._column;
                        aa.row = self.lasted._row;

                        self.setppool.push(aa);
                        self.refresh();
                    }
                    //长度为2时候，将要到达的点是起始点，做回退
                    else if (self.setppool.length == 2 && self.willmove._column == self.beganed._column &&
                        self.willmove._row == self.beganed._row) {
                        self.lasted._selected = false;
                        self.lasted = self.willmove;
                        self.setppool.length = 1;
                        self.refresh();
                    }
                    //长度大于2，将要到达的点为最后一个点的上个点，做回退
                    else if (self.setppool.length > 2
                        && self.willmove._column == self.setppool[self.setppool.length - 2].col
                        && self.willmove._row == self.setppool[self.setppool.length - 2].row
                    ) {
                        self.map[self.setppool[self.setppool.length - 1].col][self.setppool[self.setppool.length - 1].row]._selected = false;
                        self.setppool.length = self.setppool.length - 1;
                        self.lasted = self.map[self.setppool[self.setppool.length - 1].col][self.setppool[self.setppool.length - 1].row];
                        self.refresh();
                    }
                    //其他时候为增加长度
                    else {
                        self._isin = false;
                        for (var i in self.setppool) {
                            if ((self.setppool[i].col == col) && (self.setppool[i].row == row)) {
                                self._isin = true;
                            }
                        }
                        if (self._isin === false) {
                            self.lasted = self.willmove;
                            self.lasted._selected = true;
                            var aa = [];
                            aa.col = self.lasted._column;
                            aa.row = self.lasted._row;
                            self.setppool.push(aa);
                            self.refresh();
                        }
                    }
                }
            },
            onTouchEnded: function (touch, event) {
                self.triple();
            }
        }, this);

        return true;
    },
    tipcallBfun: function () {
        this._tipLayer.removeFromParent();
        Constant.isfrist = false;
        this.canClick = true;
    },
    fInitUi: function () {
        this._play = flax.assetsManager.createDisplay(res.Play_plist, "playLayer", {parent: this});
        this._play.star1.setVisible(false);
        this._play.star2.setVisible(false);
        this._play.star3.setVisible(false);

        this._scorelabel = new cc.LabelAtlas(this.Score.toString(), res.Num_png, 28, 40, "0");
        this._scorelabel.setPosition(cc.p(470, 715));
        this._scorelabel.setAnchorPoint(1, .5);
        this.addChild(this._scorelabel, 10);

        this._targetlabel = new cc.LabelAtlas(Constant.levels[Constant.level].targetScore, res.Num_png, 28, 40, "0");
        this._targetlabel.setPosition(cc.p(10, 755));
        this._targetlabel.setAnchorPoint(0, .5);
        this._targetlabel.setScale(.6);
        this.addChild(this._targetlabel, 10);

        this._limitlabel = new cc.LabelAtlas(Constant.levels[Constant.level].limitStep, res.Num2_png, 13, 20, "0");
        this._limitlabel.setPosition(cc.p(240, 755));
        this._limitlabel.setAnchorPoint(0.5, .5);
        this.addChild(this._limitlabel, 10);
    },
    createRandomAnimal: function (type, col, row) {
        var sp = type + 1;
        var _bird;
        if (sp <= 6) {
            _bird = flax.assetsManager.createDisplay(res.Play_plist, "animal" + sp);
            _bird.isBo = false;
            _bird._open = flax.assetsManager.createDisplay(res.Play_plist, "open" + sp);
            _bird._open.y = 52;
            _bird._open.setVisible(false);
            _bird.addChild(_bird._open);
            _bird._type = type;

        } else {
            var bo = sp - 6;
            _bird = flax.assetsManager.createDisplay(res.Play_plist, "bomb" + bo);
            _bird.isBo = true;
            _bird._type = type - 6;
        }
        _bird._column = col;
        _bird._row = row;
        _bird._selected = false;
        _bird.setAnchorPoint(.5, .5);

        _bird.num = new cc.LabelAtlas("1", res.Num2_png, 13, 20, "0");
        _bird.num.setVisible(false);
        _bird.num.setPosition(cc.p(25, 25));
        _bird.num.setAnchorPoint(cc.p(.5, .5));

        _bird.addChild(_bird.num, 2);
        return _bird;
    },
    fInitAnimal: function () {
        this.map.length = 0;
        for (var col = 0; col < 8; col++) {
            var _row = [];
            for (var row = 0; row < 8; row++) {
                var _candy = this.createRandomAnimal((parseInt(Math.random() * 6)), col, row);
                _candy.setLocalZOrder(9);
                _candy.x = 57 * col + 40;
                _candy.y = 57 * row + 207;
                this.addChild(_candy);
                _row.push(_candy);
            }
            this.map.push(_row);
        }
    },
    refresh: function () {
        this.drawNode.clear();
        for (var i in this.setppool) {
            if (i > 0) {
                var _fruit = this.map[this.setppool[i].col][this.setppool[i].row];
                var _fruit2 = this.map[this.setppool[i - 1].col][this.setppool[i - 1].row];
                this.drawNode.drawSegment(cc.p(_fruit.x, _fruit.y), cc.p(_fruit2.x, _fruit2.y), 5, Constant.color[this.seleType]);
                var j = i;
                j++;
                _fruit.num.setString(j.toString());
            }
        }
        for (var col = 0; col < 8; col++) {
            for (var row = 0; row < 8; row++) {
                if (this.map[col][row] != null) {
                    if (this.map[col][row]._selected) {
                        var action2 = cc.scaleTo(.8, 1, 1);
                        var action1 = cc.scaleTo(.8, 0.9, 0.9);
                        var sequence = cc.sequence(action1, action2);
                        var repeat = cc.repeatForever(sequence);
                        this.map[col][row].runAction(repeat);
                        this.map[col][row].num.setVisible(true);
                        if (!this.map[col][row].isBo) {
                            this.map[col][row]._open.setVisible(true);
                            this.map[col][row].opacity = 0;
                        }
                    } else {
                        this.map[col][row].setScale(1);
                        this.map[col][row].num.setVisible(false);
                        this.map[col][row].stopAllActions();
                        if (!this.map[col][row].isBo) {
                            this.map[col][row]._open.setVisible(false);
                            this.map[col][row].opacity = 255;
                        }
                    }
                }
            }
        }
    },
    triple: function () {
        if (this.setppool.length >= 3) {
            //消除连接的水果
            for (var i in this.setppool) {
                var _fruit = this.map[this.setppool[i].col][this.setppool[i].row];
                if (_fruit.isBo) {
                    this.isHasbobm = true;
                }
                var boom = flax.assetsManager.createDisplay(res.Anim_plist, "boll", {parent: this});
                boom.autoDestroyWhenOver = true;
                boom.x = _fruit.x - 25;
                boom.y = _fruit.y + 25;
                boom.play();

                var add = i;
                add++;
                var sp = add * 100;
                var score = new cc.LabelTTF("+" + sp.toString(), "Arial", 22);
                this.Score = this.Score + sp;
                this._scorelabel.setString(this.Score.toString());
                this.starfun();

                score.x = 53;
                score.y = 58;
                score.runAction(cc.spawn(cc.moveBy(2, cc.p(0, 100)), cc.fadeOut(2)));
                boom.setLocalZOrder(44);
                boom.addChild(score);

                _fruit.removeFromParent();
                this.drawNode.clear();

                this.map[this.setppool[i].col][this.setppool[i].row] = null;
            }
            if (this.isHasbobm) {
                this.tripleBomb(this.seleType);
            }
            this.Step--;
            this._limitlabel.setString(this.Step.toString());

            if (this.setppool.length > 4) {
                this.iscteateBobm = true;
            }

            this.createnewanimal();
            this.bobmpool.length = 0;
            this.setppool.length = 0;
        } else {
            for (var i in this.setppool) {
                this.map[this.setppool[i].col][this.setppool[i].row]._selected = false;
            }
            this.refresh();
            this.canClick = true;
            this.setppool.length = 0;
            this.drawNode.clear();
        }
    },
    tripleBomb: function (type) {
        for (var col = 0; col < 8; col++) {
            for (var row = 0; row < 8; row++) {
                if (this.map[col][row] != null && this.map[col][row]._type == type) {

                    var aa = [];
                    aa.col = col;
                    aa.row = row;
                    this.bobmpool.push(aa);
                }
            }
        }

        //消除炸弹类型的动物
        for (var i in this.bobmpool) {
            var _fruit = this.map[this.bobmpool[i].col][this.bobmpool[i].row];

            var boom = flax.assetsManager.createDisplay(res.Anim_plist, "boll", {parent: this});
            boom.autoDestroyWhenOver = true;
            boom.x = _fruit.x - 25;
            boom.y = _fruit.y + 25;
            boom.play();

            var score = new cc.LabelTTF("+300", "Arial", 22);
            score.x = 53;
            score.y = 58;
            score.runAction(cc.spawn(cc.moveBy(2, cc.p(0, 100)), cc.fadeOut(2)));
            boom.setLocalZOrder(44);
            boom.addChild(score);
            this.Score = this.Score + 300;
            this._scorelabel.setString(this.Score.toString());
            _fruit.removeFromParent();
            this.starfun();

            this.map[this.bobmpool[i].col][this.bobmpool[i].row] = null;
        }

    },
    starfun: function () {

        if(this.Score>=(Constant.levels[this.level].targetScore)*.5){
            this._play.star1.setVisible(true);
        }
        if(this.Score>=((Constant.levels[this.level].targetScore)*0.75)){
            this._play.star2.setVisible(true);
        }
        if(this.Score>=Constant.levels[this.level].targetScore){
            this._play.star3.setVisible(true);
        }
    },
    createnewanimal: function () {
        var maxTime = 0;
        for (var i = 0; i < 8; i++) {
            var missCount = 0;
            for (var j = 0; j < this.map[i].length; j++) {
                var candy = this.map[i][j];
                if (!candy) {
                    if (this.iscteateBobm) {
                        var sp = parseInt(Math.random() * 7);
                    } else {
                        var sp = parseInt(Math.random() * 6);
                    }
                    if (sp < 6) {
                        var candy = this.createRandomAnimal(sp, i, 8 + missCount);
                        candy.setAnchorPoint(cc.p(.5, .5));
                        candy.setLocalZOrder(9);
                        this.addChild(candy);
                        candy.x = candy._column * 57 + 40;
                        candy.y = candy._row * 57 + 207;

                        this.map[i][candy._row] = candy;
                        missCount++;
                    } else {
                        var bo = this.seleType + 6;
                        if (this.seleType == 5) {
                            bo = 5;
                        }
                        var candy = this.createRandomAnimal(bo, i, 8 + missCount);
                        candy.setAnchorPoint(cc.p(.5, .5));
                        candy.setLocalZOrder(9);
                        this.addChild(candy);
                        candy.x = candy._column * 57 + 40;
                        candy.y = candy._row * 57 + 207;

                        this.map[i][candy._row] = candy;
                        missCount++;
                    }
                } else {
                    var fallLength = missCount;
                    if (fallLength > 0) {
                        var extra = 0;
                        if (j >= 8) {
                            extra = 200;
                        }
                        var duration = Math.sqrt((2 * fallLength) / 10);
                        if (duration > maxTime) {
                            maxTime = duration;
                        }
                        var move = cc.moveTo(duration, candy.x, candy.y - 57 * fallLength).easing(cc.easeIn(2));
                        candy.runAction(move);
                        candy._row = candy._row - fallLength;
                        this.map[i][j] = null;
                        this.map[i][candy._row] = candy;
                    }
                }
            }

            for (var j = this.map[i].length; j >= 8; j--) {
                this.map[i].splice(j, 1);
                cc.log(j);
            }
        }
        this.scheduleOnce(this._finishCandyFalls.bind(this), maxTime + 0.1, "a");
    },
    _finishCandyFalls: function () {
        this.iscteateBobm = false;
        this.isHasbobm = false;

        this.canClick = true;

        if(this.Score>=Constant.levels[this.level].targetScore){
            this.win();
        }else if(this.Step == 0) {
            this.defeat();
        }
    },
    win: function () {
        this.canClick = false;

        var winlayer = flax.assetsManager.createDisplay(res.End_plist, "winLayer", {parent: this});
        winlayer.setAnchorPoint(.5,.5);
        winlayer.setPosition(cc.p(240,400));
        winlayer.setLocalZOrder(88);
        flax.inputManager.addListener(winlayer.nextpass,this.nextcallBfun,null,this);
        flax.inputManager.addListener(winlayer.winshare,this.sharecallBfun,null,this);
        var _scorelabel = new cc.LabelAtlas(this.Score.toString(), res.Num_png, 28, 40, "0");
        _scorelabel.setPosition(cc.p(180, 260));
        _scorelabel.setAnchorPoint(0, .5);
        _scorelabel.setScale(.6)
        winlayer.addChild(_scorelabel, 10);

        var _bestscorelabel = new cc.LabelAtlas(this.Score.toString(), res.Num_png, 28, 40, "0");
        _bestscorelabel.setPosition(cc.p(180, 205));
        _bestscorelabel.setAnchorPoint(0, .5);
        _bestscorelabel.setScale(.6)
        winlayer.addChild(_bestscorelabel, 10);

    },
    defeat: function () {

        this.canClick = false;
        ggay();

        var defeat = flax.assetsManager.createDisplay(res.End_plist, "defeatLayer", {parent: this});
        defeat.setPosition(cc.p(240,400));
        defeat.setAnchorPoint(.5,.5);
        defeat.setLocalZOrder(66);
        flax.inputManager.addListener(defeat.repeat,this.repeatcallBfun,null,this);
        flax.inputManager.addListener(defeat.share,this.sharecallBfun,null,this);

        var _scorelabel = new cc.LabelAtlas(this.Score.toString(), res.Num_png, 28, 40, "0");
        _scorelabel.setPosition(cc.p(180, 260));
        _scorelabel.setAnchorPoint(0, .5);
        _scorelabel.setScale(.6)
        defeat.addChild(_scorelabel, 10);

        Constant.Score = this.Score;
        if(Constant.Score>=Constant.levels[Constant.level].bestScore){
            Constant.levels[Constant.level].bestScore = Constant.Score;
        }
        var _bestscorelabel = new cc.LabelAtlas(Constant.levels[Constant.level].bestScore, res.Num_png, 28, 40, "0");
        _bestscorelabel.setPosition(cc.p(180, 205));
        _bestscorelabel.setAnchorPoint(0, .5);
        _bestscorelabel.setScale(.6)
        defeat.addChild(_bestscorelabel, 10);


    },
    nextcallBfun: function () {
        Constant.level++;
        flax.replaceScene("play");
    },
    repeatcallBfun: function () {
        flax.replaceScene("play");
    },
    sharecallBfun: function () {
        window.location.href = "/";
    }

});
