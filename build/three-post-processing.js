"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TPP =
/*#__PURE__*/
function () {
  function TPP(renderer, parameter) {
    var _this = this;

    _classCallCheck(this, TPP);

    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
    this.scene.add(this.screenMesh);
    this.initRenderTargets();
    parameter.forEach(function (param, i) {
      var mat = new THREE.ShaderMaterial({
        uniforms: param.uniforms,
        vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4( position, 1.0 ); } ",
        fragmentShader: param.fragmentShader
      });
      param.uniforms.backbuffer = {
        vlaue: null
      };
      var effectMaterial = {
        material: mat,
        uniforms: param.uniforms
      };

      if (!_this.effectMaterials) {
        _this.effectMaterials = [effectMaterial];
      }

      _this.effectMaterials.push(effectMaterial);
    });
  }

  _createClass(TPP, [{
    key: "initRenderTargets",
    value: function initRenderTargets() {
      var size = new THREE.Vector2();
      this.renderer.getSize(size);
      size.multiplyScalar(this.renderer.getPixelRatio());
      console.log(this.renderer);
      this.readBuffer = new THREE.WebGLRenderTarget(size.x, size.y);
      this.writeBuffer = new THREE.WebGLRenderTarget(size.x, size.y);
    }
  }, {
    key: "swapBuffers",
    value: function swapBuffers() {
      var tmp = this.readBuffer;
      this.readBuffer = this.writeBuffer;
      this.writeBuffer = tmp;
    }
  }, {
    key: "render",
    value: function render(scene, camera) {
      var _this2 = this;

      this.renderer.setRenderTarget(this.readBuffer);
      this.renderer.render(scene, camera);
      this.effectMaterials.forEach(function (mat, i) {
        _this2.screenMesh.material = mat.material;
        mat.uniforms["backbuffer"].value = _this2.readBuffer.texture;

        if (i < _this2.effectMaterials.length - 1) {
          _this2.renderer.setRenderTarget(_this2.writeBuffer);
        } else {
          _this2.renderer.setRenderTarget(null);
        }

        _this2.renderer.render(_this2.scene, _this2.camera);

        _this2.swapBuffers();
      });
    }
  }]);

  return TPP;
}();
