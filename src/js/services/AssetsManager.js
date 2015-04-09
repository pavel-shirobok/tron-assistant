angular
    .module('AssetsManager', [])
    .service('AssetsManager', function($q, $timeout, $rootScope){
        var self = this;
        this.loadCounter = 0;

        this.loadAll = function() {
            return $q(function(resolve){

                self.loadObj('models/bit-hedra.obj', 'bit_hedra').then(checker);
                self.loadObj('models/bit-knot.obj', 'bit_knot').then(checker);
                self.loadObj('models/bit-pyramid.obj', 'bit_pyramid').then(checker);
                self.loadObj('models/bit-sphere.obj', 'bit_sphere').then(checker);
                self.loadObj('models/bit-star.obj', 'bit_star').then(checker);


                function checker(){
                    if(resolve && self.loadCounter == 0){
                        resolve();
                        resolve = undefined;
                    }
                }

            });
        }

        this.loadObj = function(path, name) {
            return $q(function(resolve) {
                self.loadCounter++;
                //console.log('>', self.loadCounter);
                setTimeout(function(){
                    var loader = new THREE.OBJLoader();
                    loader.load(path, function(obj){
                        var model = obj.children[0];
                        obj.remove(model);
                        self[name] = model;
                        self.loadCounter--;
                        console.log('<', self.loadCounter);
                        resolve(model);
                    });
                })

            });
        }
    });