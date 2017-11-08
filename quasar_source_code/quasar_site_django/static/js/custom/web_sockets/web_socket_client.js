'use strict'


function WebSocketClient() {
    this.__init__()
}

WebSocketClient.prototype = {

    _id       : null,
    connected : null,
    socket    : null,
    _world    : null,

    player_id : null,

    __init__: function() {
        //this._world    = world_object

        // TODO : REMOVE THIS, now just the player name can be used
        // From https://gist.github.com/gordonbrander/2230317
        //this._id       = '_' + Math.random().toString(36).substr(2, 9)
        //this._full_id  = '[user] ' + this._id



        this.connected = false

        //this.connect()
    },

    send_chat_message: function(chat_message) {
        if (this.connected) {
            this.socket.send(this.player_id + '|M|' + chat_message)
        }
    },

    send_data: function(data) {
        if (this.connected === true) {
            this.socket.send(this.player_id + '|' + data)
        }
    },

    connect: function (player_id) {

        this.player_id = player_id

        this.socket    = new WebSocket('ws://' + window.location.host + '/users/')
        this.connected = true

        this.socket.onmessage = function(e) {
            l('Just got the message : ' + e.data)

            var split = (e.data).split('|')
            var user = split[0]
            var command = split[1]
            var data = split[2]

            if (command === 'M') {
                //MANAGER_WORLD.player.send_chat_message(user + ' : ' + data)
                GUI_TYPING_INTERFACE.add_chat_message(user + ' : ' + data)
            }

            //var data = e.data.split('|')
            //self._world.update_player(data[0], data[1], data[2], data[3], data[4], data[5], data[6])
        }

        this.socket.onopen = function open() {
            l('WebSockets connection created.')
            //self._world.add_player(self._full_id)
            l('Adding player{' + this.player_id + '} to the world!')
            this.connected = true
        }.bind(this)

        if (this.socket.readyState == WebSocket.OPEN) {
            this.socket.onopen()
        }
    }
}

/*


function World(scene) {
    this.__init__(scene)
}


function Player(unique_id, scene) {
    this.__init__(unique_id, scene)
}

function CubeModel() {
    this.__init__()
}


CubeModel.prototype = {

    model   : null,
    geometry: null,
    material: null,

    __init__: function () {
        this.geometry = new THREE.BoxGeometry(6, 6, 6)
        this.material = new THREE.MeshLambertMaterial({color: 0x00ff00})
        this.model = new THREE.Mesh(this.geometry, this.material)
    }

}


Player.prototype = {

    unique_id: null,
    x_position: null,
    y_position: null,
    z_position: null,
    cube_model: null,

    __init__: function(unique_id, scene) {
        this.unique_id = unique_id
        this.cube_model = new CubeModel()
        scene.add(this.cube_model.model)
    },

    update: function(x_position, y_position, z_position, rx, ry, rz) {
        this.x_position = x_position
        this.y_position = y_position
        this.z_position = z_position

        this.cube_model.model.position.x = x_position
        this.cube_model.model.position.y = y_position
        this.cube_model.model.position.z = z_position

        this.half_pie = Math.PI / 2
        this.max_view_angle = this.half_pie * 0.9

        this.cube_model.model.rotation.x = rx
        this.cube_model.model.rotation.y = ry
        this.cube_model.model.rotation.z = rz

        //this.cube_model.model.position.set(this.x_position, 10, this.z_position)
    }

}


World.prototype = {

    players: null,
    scene  : null,

    __init__: function(scene) {
        this.players = []
        this.scene = scene
    },

    update_player: function(player_id, x_position, y_position, z_position, rx, ry, rz) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].unique_id === player_id) {
                this.players[i].update(x_position, y_position, z_position, rx, ry, rz)
                return
            }
        }
        // If the code reached this point that means the character was not found. So create it!
        this.add_player(player_id)
        this.update_player(player_id, x_position, y_position, z_position, rx, ry, rz)
    },

    add_player: function(unique_id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].unique_id === unique_id) {
                return
            }
        }
        // The player was not found so add the player.
        this.players.push(new Player(unique_id, this.scene))
    }

    // TODO : Remove player

}





*/
