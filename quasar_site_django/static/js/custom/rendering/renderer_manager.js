'use strict';

function RendererManager(current_client) {
    this.__init__(current_client);
}

RendererManager.prototype = {
    field_of_view   : null,
    window_width    : null,
    window_height   : null,
    aspect_ratio    : null,
    near_clipping   : null,
    far_clipping    : null,
    renderer        : null,
    webgl_enabled   : null,
    warning_message : null,

    camera          : null,

    __init__: function(current_client) {
        this.current_client = current_client;
        this.webgl_enabled = !!Detector.webgl;
        if (this.webgl_enabled === false) {
            this.warning_message = Detector.getWebGLErrorMessage();
            raise_exception_with_full_logging('WebGL is not enabled! Error message{' + this.get_warning_message() + ')');
        } else {
            this.renderer_initialize();
        }
    },

    renderer_initialize: function() {

        // Since WebGL is enabled we can proceed.
        this.field_of_view = 70;
        this.get_window_properties();
        this.near_clipping = 1.0;
        this.far_clipping  = 20000.0;

        // TODO : Test setting alpha to false?
        //this.renderer      = new THREE.WebGLRenderer({antialias: false, alpha: true});
        this.renderer      = new THREE.WebGLRenderer({antialias: false, alpha: false});

        // Give the canvas an ID.
        this.renderer.domElement.id = 'canvas_id';

        //this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.window_width, this.window_height);
        //this.renderer.setClearColor(0x000000, 1);

        this.camera = new THREE.PerspectiveCamera(this.field_of_view, this.aspect_ratio, this.near_clipping, this.far_clipping);

        this.camera_transition = new THREE.PerspectiveCamera(this.field_of_view, this.aspect_ratio, this.near_clipping, this.far_clipping);

        //this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.zIndex = 5;

        document.body.appendChild(this.renderer.domElement);

        // CSS3DRenderer.
        this.css_renderer = new THREE.CSS3DRenderer();
        this.css_renderer.setSize(this.window_width, this.window_height);
        this.css_renderer.domElement.style.position = 'absolute';
        this.css_renderer.domElement.style.top = 0;
        // TEMP
        this.css_renderer.domElement.zIndex = 999;
        //
        document.body.appendChild(this.css_renderer.domElement);

        //this.renderer.domElement.style.top = 0;

        window.addEventListener('resize', this.on_window_resize.bind(this), false);

        this.currently_fullscreen = false;

        this.current_resize = 0;

        // Inherit.
        WorldTransition.call(this);
    },

    // TEMPORARY
    login_world_created: function() {

        this.load_transition();

        this.effect_composer = new THREE.EffectComposer(this.renderer);
        this.render_pass = new THREE.RenderPass(MANAGER_WORLD.world_login.scene, this.camera);
        this.effect_composer.addPass(this.render_pass);

        this.outline_pass = new THREE.OutlinePass(new THREE.Vector2(this.window_width, this.window_height), MANAGER_WORLD.world_login.scene, this.camera);
        this.effect_composer.addPass(this.outline_pass);

        if (!this.current_client.is_mobile) {
            // THREE.FilmPass = function ( noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale ) {
            this.effect_film = new THREE.FilmPass(0.45, 0, 0, false);
            this.effect_composer.addPass(this.effect_film);

            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
            this.effect_FXAA.renderToScreen = true;
            this.effect_composer.addPass(this.effect_FXAA);
        }
        this.outline_glow = new OutlineGlow(this.outline_pass);
        if (this.current_client.is_mobile) {

            //this.copy_pass = new THREE.ShaderPass( THREE.CopyShader );
            //this.copy_pass.renderToScreen = true;
            //this.effect_composer.addPass(this.copy_pass);

            this.effect_FXAA = new THREE.ShaderPass(THREE.FXAAShader);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
            this.effect_FXAA.renderToScreen = true;
            this.effect_composer.addPass(this.effect_FXAA);
        }
    },

    render: function(delta) {
        if (this.in_transition) {
            this.transition_render(delta);
        } else {
            this.effect_composer.render(delta);
        }

        if (is_defined(this.css_renderer)) {
            if (is_defined(MANAGER_WORLD.current_world.css_scene)) {
                this.css_renderer.render(MANAGER_WORLD.current_world.css_scene, this.camera);
            }
        }
    },

    get_window_properties: function() {
        this.window_width  = window.innerWidth;
        this.window_height = window.innerHeight;
        this.aspect_ratio  = this.window_width / this.window_height;
    },

    on_window_resize: function() {
        this.current_resize += 1;

        this.get_window_properties();
        this.camera.aspect = this.aspect_ratio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.window_width, this.window_height);

        if (is_defined(this.css_renderer)) {
            this.css_renderer.setSize(this.window_width, this.window_height);
        }

        //this.outline_glow.outline_pass.setSize(this.window_width, this.window_height);
        if (!this.current_client.is_mobile) {
            this.effect_composer.setSize(this.window_width, this.window_height);
            this.effect_FXAA.uniforms['resolution'].value.set(1 / this.window_width, 1 / this.window_height);
        } else {
            //this.current_client.mobile_resize(this.window_width, this.window_height);
            MANAGER_INPUT.mobile_resize(this.window_width, this.window_height);
        }

        CURRENT_CLIENT.height_resized(this.window_height);
    },

    is_webgl_enabled: function() {
        return this.webgl_enabled;
    },

    get_warning_message: function () {
        return this.warning_message;
    },

    toggle_fullscreen: function() {
        if (!this.currently_fullscreen) {
            THREEx.FullScreen.request();
            MANAGER_RENDERER.on_window_resize();
        } else {
            THREEx.FullScreen.cancel();
        }
        this.currently_fullscreen = !this.currently_fullscreen;
    }
};