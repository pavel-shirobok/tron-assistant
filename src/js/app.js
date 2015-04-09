angular
    .module('AssistApp', ['AssetsManager', 'DialogManager', 'ngAnimate'])
    .controller('MainCtrl', function($scope, AssetsManager, DialogManager){
        var STANDBY = 0x00FF00;
        var LOADING = 0x0000FF;

        AssetsManager
            .loadAll()
            .then(function(){
                var assist = new AssistAppScene();
                assist.create(AssetsManager);

                //assist.animate('standby', LOADING);


                DialogManager.animate = assist.animate.bind(assist);
                DialogManager.showImage = function(img){
                    $scope.$apply(function(){
                        $scope.showImgSrc = img;
                    })

                };
                //DialogManager.log = function()
                DialogManager.start();

                /*setTimeout(function(){
                    assist.animate('loading', 0xFF0000);
                    setTimeout(function(){
                        assist.animate('listen', 0xFF0000);
                        setTimeout(function(){
                            assist.animate('loading', 0xFF0000);
                            setTimeout(function(){
                                assist.animate('speaking', 0xFF0000);
                            }.bind(this), 5000)
                        }.bind(this), 5000)
                    }.bind(this), 5000)
                }.bind(this), 5000)*/
            });
    });






(function(){
    return;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    $(window).resize(function(){
        renderer.setSize( window.innerWidth, window.innerHeight );
    });

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.z = 5;
    var MODEL;
    var loader = new THREE.OBJLoader();
    loader.load(
        'models/bit-sphere.obj',
        function(obj){
            start()

            console.log(obj)

            //return;

            var model = obj.children[0];
            obj.remove(model);

            //model.material.color = 0xff0000;
            // model.material = new THREE.MeshLambertMaterial({color:0x00FF00});
            //model.setMaterialFaces(new THREE.MeshLambertMaterial({color:0xFF0000}))
            //model.material = new THREE.MeshLambertMaterial({color:0xFF0000});
            //model.material.needsUpdate();
            /*model = new THREE.Mesh(model.geometry, new THREE.MeshLambertMaterial({color:0xFF0000}));
             model.geometry.verticesNeedUpdate = true;
             model.geometry.normalsNeedUpdate = true;
             model.geometry.verticesNeedUpdate = true;
             model.geometry.computeBoundingBox();
             model.geometry.computeFaceNormals();*/
            model.position.x = 0;
            model.position.y = 0;
            model.position.z = 0;
            model.scale.x = model.scale.y = model.scale.z = (0.1);// (0.2)

            //console.log(arguments);

            scene.add(model);
            MODEL = model;
            //model.setMaterialFaces(new THREE.MeshLambertMaterial({color:0xFF0000}));
            //console.log(model.material);
            //model.material = new THREE.MeshLambertMaterial({color:0xFF0000});
            setInterval(function(){

                //console.log(model.material)
            })
        }
    );

    function start (){
        var uiBackground = new UIBackground();
        scene.add(uiBackground.create(30, 20, 30, 20, -5));
        var light = new THREE.SpotLight( 0xffffff );
        light.position.set( 10, 10, 20);
        //light.castShadow = true;
        scene.add(light);

        //var ambientLight = new THREE.AmbientLight(0x000044);
        //scene.add(ambientLight);

        var sphere = new THREE.SphereGeometry(1, 5, 5);
        var smaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000} );
        var sphereMesh = new THREE.Mesh(sphere, smaterial);

        //scene.add(sphereMesh)

        function render() {
            requestAnimationFrame( render );

            uiBackground.update();
            //sphereMesh.rotateY(0.01);
            /*sphere.rotation.x += 0.1;
             sphere.rotation.y += 0.1;*/

            if(MODEL){
                MODEL.rotateY(0.01);
                MODEL.geometry.verticesNeedUpdate = true;
                MODEL.geometry.normalsNeedUpdate = true;
                MODEL.geometry.verticesNeedUpdate = true;
                MODEL.geometry.computeBoundingBox();
                MODEL.geometry.computeFaceNormals();
            }


            renderer.render( scene, camera );
        }
        render();

    }

    /*
     * TODO
     *
     * 1. Сделать бита, с цветами и возможностью, анимации шипования и смены цвета
     * 2. сделать фон с относительно большими полигонами, чтобы мерцали
     * 3. соединить разговоры с битов
     * 4. ...
     * 5. ПРОФИТ!
     *
     * */
})()