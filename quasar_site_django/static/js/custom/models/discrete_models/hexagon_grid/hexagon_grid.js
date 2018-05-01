'use strict';

function HexagonGrid(number_of_layers) {
    this.__init__(number_of_layers);
}

HexagonGrid.prototype = {

    __init__: function(number_of_layers) {
        this.number_of_layers = number_of_layers;

        this.h = 55.42562484741211;
        this.w_distance = Math.sqrt(3 * this.h * this.h);

        this._create_cache();
    },

    create: function() {
        this.single_geometry = new THREE.Geometry();
        this.materails = [];

        this._create_tile(0, 0, 0);
        let tile = 1;

        let layer;
        for (layer = 1; layer < this.number_of_layers; layer++) {
            let number_of_tiles = layer * 6;

            let gap = layer - 1;
            let direction = 1;
            let filled = gap;

            let offset_x = this._get_x_offset(direction) * gap;
            let offset_y = this._get_y_offset(direction) * gap;

            let i = 1;
            while (i < number_of_tiles + 1) {
                offset_x += this._get_x_offset(direction);
                offset_y += this._get_y_offset(direction);

                this._create_tile(offset_x, offset_y, tile);
                tile += 1;

                if (filled === gap) {
                    direction += 1;
                    filled = 0;
                    if (direction > 7) {
                        direction = 1;
                    }
                } else {
                    filled += 1;
                }
                i += 1;
            }
        }

        this.object3D = new THREE.Object3D();

        this.single_geometry.computeFaceNormals();
        this.single_geometry.computeVertexNormals();

        this.single_mesh = new THREE.Mesh(this.single_geometry, this.materails);

        this.object3D.add(this.single_mesh);

        this.object3D.lookAt(0, 1, 0);

        this.object3D.scale.set(3, 3, 3);
        this.object3D.matrixAutoUpdate = false;
    },

    _create_cache: function() {

    },

    _create_tile: function(x_offset, y_offset, material_offset) {
        let tile = new THREE.Geometry();

        let v0 = new THREE.Vector3(0, 0, 0);
        let v1 = new THREE.Vector3(64, 0, 0);
        let v2 = new THREE.Vector3(32, 55.42562484741211, 0);
        let v3 = new THREE.Vector3(-32, 55.42562484741211, 0);
        let v4 = new THREE.Vector3(-64, 0, 0);
        let v5 = new THREE.Vector3(-32, -55.42562484741211, 0);
        let v6 = new THREE.Vector3(32, -55.42562484741211, 0);

        tile.vertices.push(v0);
        tile.vertices.push(v1);
        tile.vertices.push(v2);
        tile.vertices.push(v3);
        tile.vertices.push(v4);
        tile.vertices.push(v5);
        tile.vertices.push(v6);

        tile.faces.push(new THREE.Face3(1, 2, 0));
        tile.faces.push(new THREE.Face3(2, 3, 0));
        tile.faces.push(new THREE.Face3(3, 4, 0));
        tile.faces.push(new THREE.Face3(4, 5, 0));
        tile.faces.push(new THREE.Face3(5, 6, 0));
        tile.faces.push(new THREE.Face3(6, 1, 0));

        let c = new THREE.MeshPhongMaterial({color: this._get_random_grey()});
        c.needsUpdate = true;
        this.materails.push(c);

        let m = new THREE.Matrix4();
        m.makeTranslation(x_offset, y_offset, 0);

        this.single_geometry.merge(tile, m, material_offset);

        tile.dispose();
        tile = null;
    },

    _get_random_grey: function() {
        let v =  Math.floor(Math.random() * 10);
        return 'rgb(' + parseInt(20 + v) + ',' + parseInt(20 + v) + ',' + parseInt(20 + v) + ')';
    },

    _get_x_offset: function(d) {
        switch(d) {
        case 1:
            return 0;
        case 2:
            return -this.w_distance;
        case 3:
            return 0;
        case 4:
            return this.w_distance;
        case 5:
            return this.w_distance;
        case 6:
            return 0;
        case 7:
            return -this.w_distance;
        }
    },

    _get_y_offset: function(d) {
        switch(d) {
        case 1:
            return this.h * 2;
        case 2:
            return -this.h;
        case 3:
            return -this.h * 2;
        case 4:
            return -this.h;
        case 5:
            return this.h;
        case 6:
            return this.h * 2;
        case 7:
            return this.h;
        }
    },

};
