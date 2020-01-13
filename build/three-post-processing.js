"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var THREE = _interopRequireWildcard(require("three"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PostProcessing =
/*#__PURE__*/
function () {
  function PostProcessing(renderer, parameter, resolutionRatio) {
    var _this = this;

    _classCallCheck(this, PostProcessing);

    this.renderer = renderer;
    this.resolutionRatio = resolutionRatio ? resolutionRatio : 1.0;
    this.resolution = new THREE.Vector2();
    this.renderer.getSize(this.resolution);
    this.resolution.multiplyScalar(this.renderer.getPixelRatio() * (this.resolutionRatio ? this.resolutionRatio : 1.0));
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.screenMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.scene.add(this.screenMesh);
    this.initRenderTargets();
    parameter.forEach(function (param) {
      if (!param.uniforms) param.uniforms = {};

      if (!param.uniforms.backbuffer) {
        param.uniforms.backbuffer = {
          value: null
        };
      }

      if (!param.uniforms.resolution) {
        param.uniforms.resolution = {
          value: _this.resolution
        };
      }

      var mat = new THREE.ShaderMaterial({
        defines: param.defines || null,
        linewidth: param.linewidth || null,
        wireframe: param.wireframe || null,
        wireframeLinewidth: param.wireframeLinewidth || null,
        lights: param.lights || null,
        clipping: param.clipping || null,
        skinning: param.skinning || null,
        morphTargets: param.morphTargets || null,
        morphNormals: param.morphNormals || null,
        uniforms: param.uniforms || null,
        vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4( position, 1.0 ); } ",
        fragmentShader: param.fragmentShader || null,
        depthTest: false,
        depthFunc: THREE.NeverDepth,
        transparent: param.transparent || false,
        blending: param.blending || THREE.NormalBlending
      });
      var effectMaterial = {
        material: mat,
        uniforms: param.uniforms
      };

      if (!_this.effectMaterials) {
        _this.effectMaterials = [effectMaterial];
      } else {
        _this.effectMaterials.push(effectMaterial);
      }
    });
  }

  _createClass(PostProcessing, [{
    key: "initRenderTargets",
    value: function initRenderTargets() {
      this.readBuffer = this.createRenderTarget();
      this.writeBuffer = this.createRenderTarget();
    }
  }, {
    key: "createRenderTarget",
    value: function createRenderTarget() {
      return new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y);
    }
  }, {
    key: "swapBuffers",
    value: function swapBuffers() {
      var tmp = this.writeBuffer;
      this.writeBuffer = this.readBuffer;
      this.readBuffer = tmp;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var scene_srcTexture_offScreen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var camera_offScreenRendering = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var offScreenRendering = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isOffscreen = false;
      var skipSetBackBuffer = false;

      if (scene_srcTexture_offScreen.type == 'Scene') {
        this.renderer.setRenderTarget(this.readBuffer);
        this.renderer.clear();
        this.renderer.render(scene_srcTexture_offScreen, camera_offScreenRendering);
        isOffscreen = offScreenRendering;
      } else {
        if (typeof scene_srcTexture_offScreen == 'boolean') {
          isOffscreen = scene_srcTexture_offScreen;
        } else {
          this.effectMaterials[0].uniforms.backbuffer.value = scene_srcTexture_offScreen;
          skipSetBackBuffer = true;
          isOffscreen = camera_offScreenRendering;
        }
      }

      this.effectMaterials.forEach(function (mat, i) {
        _this2.screenMesh.material = mat.material;

        if (!skipSetBackBuffer || i > 0) {
          mat.uniforms["backbuffer"].value = _this2.readBuffer.texture;
        }

        if (i < _this2.effectMaterials.length - 1 || isOffscreen) {
          _this2.renderer.setRenderTarget(_this2.writeBuffer);
        } else {
          _this2.renderer.setRenderTarget(null);
        }

        _this2.renderer.render(_this2.scene, _this2.camera);

        _this2.swapBuffers();
      });
      this.resultBuffer = isOffscreen ? this.readBuffer : null;
    }
  }, {
    key: "getResultTexture",
    value: function getResultTexture() {
      return this.resultBuffer ? this.resultBuffer.texture : null;
    }
  }, {
    key: "resize",
    value: function resize(windowPixelSize) {
      var res = windowPixelSize.clone().multiplyScalar(this.resolutionRatio);
      this.resolution.set(res.x, res.y);
      this.readBuffer.setSize(res.x, res.y);
      this.writeBuffer.setSize(res.x, res.y);
    }
  }]);

  return PostProcessing;
}();

exports["default"] = PostProcessing;
