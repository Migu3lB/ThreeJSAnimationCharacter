var escena, camara, renderer, controlCamara, controls, light, container;
var SCREEN_WIDTH;
var clock = new THREE.Clock();
var mixers = [];

function init() {
crearScena();
crearCamara();
crearRenderer();
crearControles();
crearLuz();
crearPiso();
crearCieloCuboGeometria();
crearModelo();
animate();
//crearAxisHelper();
}

function crearScena(){
	escena = new THREE.Scene();
}

function render() {
renderer.render(escena, camara);
}

function crearControles(){
	controls = new THREE.OrbitControls( camara, renderer.domElement );
}

function crearRenderer() {
	
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
}

function crearCamara() {
	SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camara = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	escena.add(camara);
	camara.position.set(0,-1200,800);
	camara.lookAt(escena.position);
}

function crearModelo () {
	var loader = new THREE.FBXLoader();
	loader.load( 'models/HumanWalkingMiguel.fbx', function ( object ) {

		object.mixer = new THREE.AnimationMixer( object );
		mixers.push( object.mixer );

		var action = object.mixer.clipAction( object.animations[ 0 ] );
		action.play();

		object.traverse( function ( child ) {

			if ( child.isMesh ) {

				child.castShadow = true;
				child.receiveShadow = true;

			}

		} );
		object.position.set(0,500,0);
		escena.add( object );

	} );
}

function crearAxisHelper () {
axis = THREE.AxisHelper(300);
axis.position.z = 300;
escena.add(axis);
}

function crearLuz() {
light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
light.position.set( 200, 1000, 10000 );
escena.add( light );

}

function crearPiso()
{
	var floorMaterial = new THREE.MeshBasicMaterial( {color:0xADADAD, side:THREE.DoubleSide} );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	//floor.position.y = -0.5;
	//floor.rotation.x = Math.PI / 2;
	escena.add(floor);
}

function crearCieloCuboGeometria()
{
	var skyBoxGeometry = new THREE.CubeGeometry( 20000, 20000, 20000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
	escena.add(skyBox);
}

function animate() 
{
    requestAnimationFrame( animate );
    if ( mixers.length > 0 ) {

					for ( var i = 0; i < mixers.length; i ++ ) {

						mixers[ i ].update( clock.getDelta() );

					}

				}
	render();
	controls.update();	
}
