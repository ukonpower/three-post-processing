# three-post-processing
multi pass post processing on [three.js](https://github.com/mrdoob/three.js).

## Usage
### Get Library
#### link script
Download the [library](https://raw.githubusercontent.com/ukonpower/three-post-processing/master/build/three-post-processing.js) and include in your HTML.

```html
<script src="three-post-processing.js"></script>
```

#### npm
or you can get from [npm](https://www.npmjs.com/package/three-post-processing).

```bash
$ npm i three-post-processing
```

##### Import

```javascript
import TPP from 'three-post-processing';
```

#### Create Post Processing
```javascript
this.uniforms = {
  time:{
    value: 0
  }
}

let pp1 = {
  fragmentShader: require('./post-processing1.glsl'),
  uniforms:this.uniforms
};

let pp2 = {
  fragmentShader: require('./post-processing2.glsl'),
  uniforms:this.uniforms,
}

this.pp_params = [pp1,pp2];

this.tpp = new TPP(this.renderer,this.pp_params);
```

#### Render Post Processing
```javascript
//update post-processing uniforms
this.uniforms.time.value += 0.01;

//render scene with post-processing
this.tpp.render(this.scene,this.camera);
```
