var socket = io.connect();
//cc _ cv

if ( ! Detector.webgl ) {

Detector.addGetWebGLMessage();
document.getElementById( 'container' ).innerHTML = "";

}

/*Var three js*/
var container, stats;

var camera, controls, scene, renderer;

var mesh, player, texture;

var worldWidth = 256, worldDepth = 256,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

/*Var cannon js*/

var world, solver, physicsMaterial;
var sphereShape, sphereBody, groundBody;


/*MAIN*/
function main() {

	init();
	animate();
}

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

	scene = new THREE.Scene();

	var worldx	= new THREEx.CannonWorld().start()
	worldx.world.defaultContactMaterial.friction = 0.005

	geometry = new THREE.PlaneGeometry( 2000, 2000, 2000, 50 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	material = new THREE.MeshLambertMaterial( { color: 0xdddddd } );
	mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add( mesh );

	geometry = new THREE.SphereGeometry( 50 );
	material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
	player = new THREE.Mesh( geometry, material );
	camera.position.z = 1000;
	player.add(camera);
	scene.add(player);

	controls = new THREE.FirstPersonControls( player );
	controls.movementSpeed = 1000;
	controls.lookSpeed = 0.1;


	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setClearColor( 0xbfd1e5 );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.innerHTML = "";

	container.appendChild( renderer.domElement );

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

/*Final functions*/

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();
}

var dt = 1/60;
function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	controls.update( clock.getDelta() );
	renderer.render( scene, camera );

}
