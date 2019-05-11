uniform sampler2D backbuffer;
uniform float time;
varying vec2 vUv;

void main(){
	vec3 c = texture2D(backbuffer,vUv).xyz;
	c += sin(vUv.x * 100.0) * 0.3;
	gl_FragColor = vec4(c,1.0);
}