uniform sampler2D backbuffer;
uniform float time;
varying vec2 vUv;

void main(){
	vec3 c = texture2D(backbuffer,vUv).xyz;
	c = vec3(c.x);
	gl_FragColor = vec4(c,1.0);
}