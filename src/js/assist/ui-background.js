var UIBackground = function() {

};

UIBackground.prototype.create = function(width, height, xCount, yCount, z){
    var geometry = this.createGeometries(width, height, xCount, yCount, z);

    var material = new THREE.MeshLambertMaterial( { color: 0x51abd9 } );
    var mesh = new THREE.Mesh( geometry, material );
    this.geometry = geometry;
    return mesh;
};

UIBackground.prototype.createGeometries = function(width, height, xCount, yCount, z){
    var geometry = new THREE.Geometry();
    var yi, xi;
    for(yi = 0; yi < yCount; yi++){
        for(xi = 0; xi < xCount; xi++){
            var x = width / xCount * xi;
            var y = height / yCount * yi;
            var xRandom = -width/2  + (((Math.random()>0.5)?-1:1) * ( width  / xCount  / 3 ) * Math.random());
            var yRandom = -height/2 + (((Math.random()>0.5)?-1:1) * ( height / yCount / 6  )  * Math.random());
            var vert = new THREE.Vector3(x + xRandom, y + yRandom, z);
            vert.wave = {
                start : z,
                amplitude :0.1,
                freq : 1 + Math.random(),
                time : Math.random() * 5,
                timeStep : 0.01
            };
            geometry.vertices.push(vert);
        }
    }

    for(yi = 0; yi < yCount - 1; yi++){
        for(xi = 0; xi < xCount - 1; xi++){
            geometry.faces.push(
                new THREE.Face3(
                    toGlob(xi + 0, yi + 0),
                    toGlob(xi + 1, yi + 0),
                    toGlob(xi + 0, yi + 1)
                )
            );
            geometry.faces.push(
                new THREE.Face3(
                    toGlob(xi + 1, yi + 0),
                    toGlob(xi + 1, yi + 1),
                    toGlob(xi + 0, yi + 1)
                )
            )
        }
    }

    function toGlob(x, y) {
        return y * xCount + x;
    }

    geometry.verticesNeedUpdate = true;
    geometry.elementsNeedUpdate = true;
    geometry.computeBoundingBox();
    geometry.computeFaceNormals();

    return geometry;
};

UIBackground.prototype.update = function() {
    for(var i = 0; i < this.geometry.vertices.length; i++) {
        var vert = this.geometry.vertices[i];
        var wave = vert.wave;
        vert.z = wave.start + wave.amplitude * Math.sin(wave.freq * wave.time);
        wave.time += wave.timeStep;
    }

    this.geometry.normalsNeedUpdate = true;
    this.geometry.verticesNeedUpdate = true;
    //this.geometry.elementsNeedUpdate = true;
    this.geometry.computeBoundingBox();
    this.geometry.computeFaceNormals();
};