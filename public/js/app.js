var socket = io.connect();
//cc _ cv

if ( ! Detector.webgl ) {

	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";
}

var container, stats;

var camera, controls, scene, renderer;

// var mesh, texture;

// var worldWidth = 256, worldDepth = 256,
// worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

function main() {
	init();
	animate();
}

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

	scene = new THREE.Scene();

	controls = new THREE.FirstPersonControls( camera );
	controls.movementSpeed = 2000;
	controls.lookSpeed = 0.1;

/*TEST*/
	scene.add( new THREE.AmbientLight( 0x404040 ) );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 0 );
	scene.add( light );


	camera.position.x = 0;
	camera.position.y = 0;

	var texture = THREE.ImageUtils.loadTexture( '../img/tex_00.jpg' );
	var material = new THREE.MeshBasicMaterial( { map: texture } );
	var geometry = new THREE.BoxGeometry( 500, 500, 500 );

	for (var i = 0; i < 5; i++) {
		var box = new THREE.Mesh( geometry, material );
		box.position.x = Math.random() * 9000;
		box.position.y = Math.random() * 9000;
		box.position.z = Math.random() * 9000;
		scene.add ( box );
	}


	//AMMO

	// var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
	// var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	// var overlappingPairCache = new Ammo.btDbvtBroadphase();
	// var solver = new Ammo.btSequentialImpulseConstraintSolver();
	// scene.world = new Ammo.btDiscreteDynamicsWorld( dispatcher, overlappingPairCache, solver, collisionConfiguration );
	// scene.world.setGravity(new Ammo.btVector3(0, -12, 0));

	// var groundShape = new Ammo.btBoxShape(new Ammo.btVector3( 25, 1, 25 )); // Create block 50x2x50
	// var groundTransform = new Ammo.btTransform();
	// groundTransform.setIdentity();
	// groundTransform.setOrigin(new Ammo.btVector3( 0, -1, 0 )); // Set initial position

	// var groundMass = 0; // Mass of 0 means ground won't move from gravity or collisions
	// var localInertia = new Ammo.btVector3(0, 0, 0);
	// var motionState = new Ammo.btDefaultMotionState( groundTransform );
	// var rbInfo = new Ammo.btRigidBodyConstructionInfo( groundMass, motionState, groundShape, localInertia );
	// var groundAmmo = new Ammo.btRigidBody( rbInfo );
	// scene.world.addRigidBody( groundAmmo );

	// var mass = 3 * 3 * 3; // Matches box dimensions for simplicity
	// var startTransform = new Ammo.btTransform();
	// startTransform.setIdentity();
	// startTransform.setOrigin(new Ammo.btVector3( 0, 20, 0 )); // Set initial position

	// var localInertia = new Ammo.btVector3(0, 0, 0);

	// var boxShape = new Ammo.btBoxShape(new Ammo.btVector3( 1.5, 1.5, 1.5 )); // Box is 3x3x3
	// boxShape.calculateLocalInertia( mass, localInertia );

	// var motionState = new Ammo.btDefaultMotionState( startTransform );
	// var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, boxShape, localInertia );
	// var boxAmmo = new Ammo.btRigidBody( rbInfo );
	// scene.world.addRigidBody( boxAmmo );

	// boxAmmo.mesh = box; // Assign the Three.js mesh in `box`, this is used to update the model position later
	// // boxes.push( boxAmmo ); // Keep track of this box

	// updateBoxes = function() {
	// 	scene.world.stepSimulation( 1 / 60, 5 ); // Tells Ammo.js to apply physics for 1/60th of a second with a maximum of 5 steps
	// 	var i, transform = new Ammo.btTransform(), origin, rotation;

	// 	for ( i = 0; i < boxes.length; i++ ) {
	// 		boxes[i].getMotionState().getWorldTransform( transform ); // Retrieve box position & rotation from Ammo

	// 		// Update position
	// 		origin = transform.getOrigin();
	// 		boxes[i].mesh.position.x = origin.x();
	// 		boxes[i].mesh.position.y = origin.y();
	// 		boxes[i].mesh.position.z = origin.z();

	// 		// Update rotation
	// 		rotation = transform.getRotation();
	// 		boxes[i].mesh.quaternion.x = rotation.x();
	// 		boxes[i].mesh.quaternion.y = rotation.y();
	// 		boxes[i].mesh.quaternion.z = rotation.z();
	// 		boxes[i].mesh.quaternion.w = rotation.w();
	// 	};
	// };

	//!AMMO

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xADD8E6 );
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

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();

}

/* Original map generate

function generateHeight( width, height ) {

	var size = width * height, data = new Uint8Array( size ),
	perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

	for ( var j = 0; j < 4; j ++ ) {

		for ( var i = 0; i < size; i ++ ) {

			var x = i % width, y = ~~ ( i / width );
			data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

		}

		quality *= 5;

	}

	return data;

}

function generateTexture( data, width, height ) {

	var canvas, canvasScaled, context, image, imageData,
	level, diff, vector3, sun, shade;

	vector3 = new THREE.Vector3( 0, 0, 0 );

	sun = new THREE.Vector3( 1, 1, 1 );
	sun.normalize();

	canvas = document.createElement( 'canvas' );
	canvas.width = width;
	canvas.height = height;

	context = canvas.getContext( '2d' );
	context.fillStyle = '#000';
	context.fillRect( 0, 0, width, height );

	image = context.getImageData( 0, 0, canvas.width, canvas.height );
	imageData = image.data;

	for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

		vector3.x = data[ j - 2 ] - data[ j + 2 ];
		vector3.y = 2;
		vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
		vector3.normalize();

		shade = vector3.dot( sun );

		imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
		imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
	}

	context.putImageData( image, 0, 0 );

	// Scaled 4x

	canvasScaled = document.createElement( 'canvas' );
	canvasScaled.width = width * 4;
	canvasScaled.height = height * 4;

	context = canvasScaled.getContext( '2d' );
	context.scale( 4, 4 );
	context.drawImage( canvas, 0, 0 );

	image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
	imageData = image.data;

	for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

		var v = ~~ ( Math.random() * 5 );

		imageData[ i ] += v;
		imageData[ i + 1 ] += v;
		imageData[ i + 2 ] += v;

	}

	context.putImageData( image, 0, 0 );

	return canvasScaled;

}
*/
//

function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	controls.update( clock.getDelta() );
	renderer.render( scene, camera );

}
