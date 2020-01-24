// import * as THREE from 'three';
import { 
	Color,
	Scene,
	WebGLRenderer,
	PCFSoftShadowMap,
	FogExp2,
	PerspectiveCamera,
	Mesh,
	Object3D,
	SphereBufferGeometry,
	BoxGeometry,
	SphereGeometry,
	MeshPhongMaterial,
	MeshBasicMaterial,
	BackSide,
	SpotLight,
	PointLight,
	HemisphereLight
		} from 'three';

window.addEventListener( 'resize', onWindowResize, false );

const neonGreen 	= new Color('#00ff9f');
const neonBlue 		= new Color('#00b8ff');
const neonPink 		= new Color('#d600ff');
const neonYellow 	= new Color('#F7DB15');
const coolPurple	= new Color('#5932E6');
const blackBlue		= new Color('#11042E');
const fadeBlack		= new Color('#2B2B36');
const thisIsBlue	= new Color('#0237B9');
const distantPurple	= new Color('#2A044A');
const fadeGreen		= new Color('#0D6759');

/* 	Add 'perlin-simplex' library to generate 2d perin noise.It's not the most 		efficient, will change it to shader to use GPU.
*/
	let Simplex = require('perlin-simplex');
	let simplex = new Simplex();

// Setting variables
let t = 0;
let container;
let renderer;
let scene;
let camera;

// Select canvas container
container = document.querySelector('.three');

// RENDERER
renderer = new WebGLRenderer({
	antialias: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
container.appendChild( renderer.domElement ); // add renderer to container

// SCENE
scene = new Scene();
scene.fog = new FogExp2( coolPurple , 0.00025 );

// CAMERA
camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1100 );
camera.position.set(3,10,17.5);

// ADD OBJECTS

	 // #BOUND BOX
	let boundinBoxG 	= new BoxGeometry(200,200,200);
	let boundingBoxM	= new MeshPhongMaterial({
		color: blackBlue,
		side: BackSide
	})
	let boundingBox		= new Mesh( boundinBoxG, boundingBoxM);
	boundingBox.position.set(0,100,0);
	scene.add( boundingBox);
	

	// # SPHERE - Main object, will be morphed
	let sphereGeometry	= new SphereGeometry(20,64,64);
	let sphereMaterial	= new MeshPhongMaterial({
		color: fadeBlack,
		shininess: 20,
		specular: 0xffffff
		//dithering: true
	});


	let sphere		= new Mesh( sphereGeometry, sphereMaterial );
	sphere.castShadow = true; //default is false
	sphere.position.set(12,10,-2);
	sphere.receiveShadow = false; //default
	scene.add( sphere );

	// # Object3d as pivot point and target
	let targetPivot = new Object3D();
	scene.add( targetPivot );
	// Position is always the same as the sphere
	targetPivot.position.set(
		sphere.position.x,
		sphere.position.y,
		sphere.position.z
	)



	// #1 LIGHT - Spotlight from above
	let spotLight1 = new SpotLight( thisIsBlue, 1.6 );
		spotLight1.position.set(0,100,0);
		spotLight1.angle = Math.PI / 8;
		spotLight1.penumbra = 0.5;
		spotLight1.decay = 2;
		spotLight1.distance = 300;
		spotLight1.castShadow = true;
		scene.add( spotLight1 );
		spotLight1.shadow.radius = 10;
		spotLight1.target = targetPivot;

	let spotLight2 = new SpotLight( neonPink, 1 );
		spotLight2.position.set(0,100,0);
		spotLight2.angle = Math.PI / 2;
		spotLight2.penumbra = 0.5;
		spotLight2.decay = 2;
		spotLight2.distance = 300;
		//spotLight2.castShadow = true;
		scene.add( spotLight2 );
		spotLight2.target = targetPivot;

	let spotLight3 = new SpotLight( neonBlue, 1 );
		spotLight3.position.set(0,100,0);
		spotLight3.angle = Math.PI / 8;
		spotLight3.penumbra = 0.5;
		spotLight3.decay = 2;
		spotLight3.distance = 300;
		//spotLight3.castShadow = true;
		//scene.add( spotLight3 );
		spotLight3.target = targetPivot;


	// #2 Hemisphere Light
	let hemiLight = new HemisphereLight( distantPurple, fadeGreen, 1.2 );
			scene.add( hemiLight );
	

	// #3 Pointlight orbiting around the sphere
	let bulb = new SphereBufferGeometry(.125, 16, 8);
	let color = [neonGreen,neonPink,neonYellow];
	let intensity = 0.5;
	let decay = 30;

		let light1 = new PointLight( color[0] , intensity , decay );
		light1.add( new Mesh( bulb, new MeshBasicMaterial( { color: color[0] } ) ) );
		scene.add( light1 );
	
		let light2 = new PointLight( color[1] , intensity , decay );
		light2.add( new Mesh( bulb, new MeshBasicMaterial( { color: color[1] } ) ) );
		scene.add( light2 );

		let light3 = new PointLight( color[2] , intensity , decay );
		light3.add( new Mesh( bulb, new MeshBasicMaterial( { color: color[2] } ) ) );
		scene.add( light3 );


		light1.position.set(6,0,0);
		light2.position.set(0,6,0);
		light3.position.set(0,0,6);



	var update = function() {
	// change '0.003' for more aggressive animation
	var time = performance.now() * 0.0009;
	//console.log(time)

	//go through vertices here and reposition them

	// change 'k' value for more spikes
	var k = 2;
	for (var i = 0; i < sphere.geometry.vertices.length; i++) {
		var p = sphere.geometry.vertices[i];
		p.normalize().multiplyScalar(5 + .5 * simplex.noise3d(p.x * k + time, p.y * k, p.z * k));
	}
	sphere.geometry.computeVertexNormals();
	sphere.geometry.normalsNeedUpdate = true;
	sphere.geometry.verticesNeedUpdate = true;
}


// parent
// let parent = new Object3D();
// parent.position.set()
// scene.add( parent );

// pivots
let pivot1 = new Object3D();
let pivot2 = new Object3D();
let pivot3 = new Object3D();


	pivot1.rotation.z = 0;
	pivot2.rotation.z = 2 * Math.PI / 3;
	pivot3.rotation.z = 4 * Math.PI / 3;


	targetPivot.add( pivot1 );
	targetPivot.add( pivot2 );
	targetPivot.add( pivot3 );


	pivot1.add( light1 );
	pivot2.add( light2 );
	pivot3.add( light3 );


var animate = function () 
{
	requestAnimationFrame( animate );

	t += 0.1;

	targetPivot.children[0].rotation.y += 0.005;
	targetPivot.children[1].rotation.z += 0.005;
	targetPivot.children[2].rotation.x += 0.005;

	pivot1.rotation.x += 0.04;
	pivot2.rotation.z += 0.03;
	pivot3.rotation.y += 0.02;



	update();

	renderer.render(scene, camera);
};

animate();

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	composer.setSize( window.innerWidth, window.innerHeight );

}



	/*

The function selects all vertices for the sphere and "morph" it by adding random perlin noise value. The function is called in the render function by clock speed ( 60 FPS ) and creates a continous morphing animation

*/

// let morphObject = sphereMesh.geometry
let morph = function()
	{

	let time = performance.now() * 0.0005;
	let k = 1.1;
	for (let i=0; i < morphObject.vertices.length;i++)
	{
		let p = morphObject.vertices;
		p[i].normalize().multiplyScalar
		(
		10 + 4 * simplex.noise3d
			(
			p.x * k + time + 2,
			p.y * k + time,
			p.z * k + time * 1.9
			)
		);
	}
	morphObject.computeVertexNormals();
	morphObject.normalsNeedUpdate = true;
	morphObject.verticesNeedUpdate = true;
	}



