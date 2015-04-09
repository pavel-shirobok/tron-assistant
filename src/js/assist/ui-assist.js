function UIAssist(){}

UIAssist.prototype.create = function(scene, assets) {


    this.standby = new UIAssistState(scene, assets.bit_hedra, function(model){ defaultConfigure(model, 0.1); });
    this.speaking = new UIAssistState(scene, assets.bit_star, function(model){ defaultConfigure(model, 0.1); });
    this.listen = new UIAssistState(scene, assets.bit_pyramid, function(model){ defaultConfigure(model, 0.1); });
    this.loading = new UIAssistState(scene, assets.bit_knot, function(model){ defaultConfigure(model, 0.1); });

    this.listen.hide();
    this.loading.hide();
    this.speaking.hide();
    this.standby.hide();

    function defaultConfigure(model, scale){
        model.position.set(0, 0, 0);
        model.scale.set(scale, scale, scale)
    }
};

UIAssist.prototype.update = function(time) {
    this.standby.update(time);
    this.speaking.update(time);
    this.listen.update(time);
    this.loading.update(time);
};

UIAssist.prototype.animate = function(type, color) {
    if(this[type]){
        var current = this.current;
        var next = this[type];
        if(current == next)return;

        if(current)current.hide();
        next.show(color);

        this.current = next;
    }
};

function UIAssistState(scene, model, configure) {
    this.scene = scene;
    this.model = model;
    this.state = 'show';
    configure && configure(model);
    scene.add(model);
}
UIAssistState.prototype.show = function(color){

    if(this.state == 'hide') {

        //stop hide animation
        if(this.hideAnimation) {
            this.hideAnimation.stop();
            this.hideAnimation = undefined;
        }

        if(color)this.model.material = new THREE.MeshLambertMaterial({color : color});

        //start show animation
        var start  = { x :.001, y:.001, z :.001 };
        var target = { x : 0.1, y: 0.1, z : 0.1 };

        this.showAnimation = new TWEEN.Tween(start)
            .to(target, 1000)
            .easing( TWEEN.Easing.Elastic.Out )

            .onUpdate(function(){
                this.model.scale.set(start.x, start.y, start.z);
            }.bind(this))

            .onComplete(function(){
                this.createCommon && this.createCommon();
            }.bind(this))

            .start();

        console.log('start');
        // + start common animation
        this.state = 'show';
    }else {
        //ignore
    }
};
UIAssistState.prototype.hide = function(){
    if(this.state == 'show') {
        //stop show animation
        if(this.showAnimation){
            this.showAnimation.stop();
            this.showAnimation = undefined;
        }
        //stop common animation
        this.destroyCommon && this.destroyCommon();

        //start hide animation

        var start  = { x :.1, y:.1, z :.1 };
        var target = { x : 0.001, y: 0.001, z : 0.001 };
        this.hideAnimation = new TWEEN.Tween(start)
            .to(target, 500)
            .easing( TWEEN.Easing.Elastic.In )

            .onUpdate(function(){
                this.model.scale.set(start.x, start.y, start.z);
            }.bind(this))

            .start();

        this.state = 'hide';
    }
};
UIAssistState.prototype.update = function(time){
    if(this.showAnimation){
        this.showAnimation.update(time);
    }

    if(this.hideAnimation){
        this.hideAnimation.update(time);
    }

    this.updateCommon && this.updateCommon(time);
};

UIAssistState.prototype.createCommon = function() {
    if(this.common) return;

    this.common = new TWEEN.Tween(this.model.position)
        .to({y : 0.05}, 500)
        .repeat(Infinity)
        .yoyo(true)
        .easing( TWEEN.Easing.Sinusoidal.InOut )
        .start();

    this.common2 = new TWEEN.Tween(this.model.rotation)
        .to({y : 359 * Math.PI / 180, x : 359 * Math.PI / 180, z : 359 * Math.PI / 180}, 5000)
        .repeat(Infinity).yoyo(true)
        .easing( TWEEN.Easing.Sinusoidal.InOut )
        .start();
};

UIAssistState.prototype.destroyCommon = function() {
    if(this.common){
        this.common.stop();
        this.common2.stop();
        this.common = undefined;
    }
};
UIAssistState.prototype.updateCommon = function(time) {
    if(this.common){
        this.common.update(time);
        this.common2.update(time);
    }
};
