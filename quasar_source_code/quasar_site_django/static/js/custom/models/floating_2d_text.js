function Floating2DText(w, h, text) {
    this.__init__(w, h, text)
}

Floating2DText.prototype = {
    text: null,
    width: null,
    height: null,
    material: null,
    dynamic_texture: null,

    object3d: null,

    // States.
    being_looked_at: null,
    being_engaged_with: null,

    __init__: function(w, h, text) {
        this.width              = w
        this.height             = h

        this.text               = text

        this.being_looked_at    = false
        this.being_engaged_with = false
    },

    disengage: function() {
        this.being_engaged_with = false
    },

    is_engaged: function() {
        return this.being_engaged_with
    },

    engage: function() {
        this.being_engaged_with = true
    },

    update_text: function(text) {
        if (this.current_text !== text) {
            this.dynamic_texture.clear().drawText(text, 0, 20, 'black')
            this.current_text = text
            this.dynamic_texture.needsUpdate = true
        }
    },

    create: function(scene) {
        this.object3d = new THREE.Object3D()
        // PlaneGeometry takes in a width, height, optionalWidthSegments (default 1), optionalHeightSegments (default 1)
        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.dynamic_texture = new THREEx.DynamicTexture(this.width * 2, this.height * 2)
        //this.dynamic_texture.context.font = 'Bold 20px Arial'
        this.dynamic_texture.context.font = '16px Arial'
        //this.dynamic_texture.texture.anisotropy = renderer_api.renderer.capabilities.getMaxAnisotropy()
        this.update_text(this.text)
        this.material = new THREE.MeshBasicMaterial({
            map	: this.dynamic_texture.texture
        })
        this.material.transparent = true
        // TODO : Make this only 1 sided
        this.material.side = THREE.DoubleSide

        // Adds the edge colorings.
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        var geo = new THREE.EdgesGeometry( this.mesh.geometry ) // or WireframeGeometry
        var mat = new THREE.LineBasicMaterial( { color: 0xFFC0CB, linewidth: 3 } )
        var wireframe = new THREE.LineSegments( geo, mat )
        this.mesh.add(wireframe)

        this.object3d.add(this.mesh)

        scene.add(this.object3d)
    },

    update_position_and_look_at: function(position_vector, look_at_position) {
        this.object3d.position.x = position_vector.x
        this.object3d.position.y = position_vector.y
        this.object3d.position.z = position_vector.z
        this.object3d.lookAt(look_at_position)
    },

    add_character: function(character) {
        this.text = this.text + character
        this.update_text(this.text)
    },

    pop_character: function() {
        this.text = this.text.slice(0, -1)
        this.update_text(this.text)
    },

    parse_keycode: function(event) {
        var keycode = event.keyCode

        if (keycode == 8) {
            if (this.text.length > 0) {
                this.pop_character()
            }
        } else if (keycode > 47 && keycode < 58) {
            // numbers
            this.add_character('#')
        }

        var valid = (keycode > 47 && keycode < 58) || // number keys
        keycode == 32                    || // spacebar
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223)   // [\]' (in order)

        console.log('The keycode entered is :')
        console.log(keycode)
        console.log(event)
        console.log('    ')
    }

}
