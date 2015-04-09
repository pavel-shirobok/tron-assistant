function AssistAppScene() {

}

AssistAppScene.prototype.create = function(assets) {

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer();

    function updateRendererSize(){
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    updateRendererSize();
    $(window).resize(updateRendererSize);
    $('#canvas-container').append(renderer.domElement);


    var light = new THREE.SpotLight( 0xffffff );
    light.position.set( 10, 10, 20);
    light.castShadow = true;
    scene.add(light);

    this.background = new UIBackground();
    this.assist = new UIAssist();

    scene.add(this.background.create(30, 20, 30, 20, -5));

    this.assist.create(scene, assets);

    var self = this;
    function render(time) {
        requestAnimationFrame( render );

        self.background.update();
        self.assist.update(time);

        renderer.render( scene, camera );
    }
    render(0);
};

AssistAppScene.prototype.animate = function(name, color) {
    this.assist.animate(name, color);
}