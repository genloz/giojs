<html>
    <head>
		<!-- A-Frame -->
		<script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
		<!-- ar.js for A-Frame -->
		<script src="https://jeromeetienne.github.io/AR.js/aframe/build/aframe-ar.js"></script>
		<!-- Gio.js and Three.js (3d library) -->
        <script src="three.min.js"></script>
        <script src="gio.min.js"></script> 
		<!-- include jsartookit -->
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/jsartoolkit5/artoolkit.min.js"></script>
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/jsartoolkit5/artoolkit.api.js"></script>
		<!-- include threex.artoolkit -->
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/threex/threex-artoolkitsource.js"></script>
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/threex/threex-artoolkitcontext.js"></script>
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/threex/threex-arbasecontrols.js"></script>
		<script src="https://raw.githubusercontent.com/stemkoski/AR-Examples/master/threex/threex-armarkercontrols.js"></script>
    </head>
    <body style='margin : 0px; overflow: hidden; font-family: Monospace;' id="body">
        <div id="globeArea" style="width: 600px; height: 600px"></div>
        <script>
		var markerRoot1;
				//var container = document.getElementById("globeArea");
				var container = document.getElementById("body");
                // configuration is taken from the first example in playground
                var controller = new GIO.Controller(container, { "control": { "stats": false, "disableUnmentioned": true, "lightenMentioned": false, "inOnly": false, "outOnly": false, "initCountry": "AT", "halo": true, "transparentBackground": true, "autoRotation": true, "rotationRatio": 1 }, "color": { "surface": 1744048, "selected": 2141154, "out": 16777215, "in": 2141154, "halo": 2141154, "background": null }, "brightness": { "ocean": 1.0, "mentioned": 0.0, "related": 0.0 } });
                var data = [
                    {
                        "e": "AR", //Argentina
                        "i": "AT",
                        "v": 72000
                    },
                    {
                        "e": "BB", //Barbados
                        "i": "AT", 
                        "v": 408000
                    },
					{
                        "e": "BR", //Brazil
                        "i": "AT", 
                        "v": 324000
                    },
					{
                        "e": "CA", //Canada
                        "i": "AT", 
                        "v": 960000
                    },
					{
                        "e": "FR", //France
                        "i": "AT", 
                        "v": 72000
                    },
					{
                        "e": "DE", //Germany
                        "i": "AT", 
                        "v": 60000
                    },
					{
                        "e": "IN", //India
                        "i": "AT", 
                        "v": 24000
                    },
					{
                        "e": "ID", //Indonesia
                        "i": "AT", 
                        "v": 420000
                    },
					{
                        "e": "IE", //Ireland
                        "i": "AT", 
                        "v": 708000
                    },
					{
                        "e": "NZ", //New Zealand
                        "i": "AT", 
                        "v": 456000
                    },
					{
                        "e": "NO", //Norway
                        "i": "AT", 
                        "v": 24000
                    },
					{
                        "e": "ZA", //South Africa
                        "i": "AT", 
                        "v": 493000
                    },
					{
                        "e": "SE", //Sweden
                        "i": "AT", 
                        "v": 144000
                    }
                ];

		
var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
//var markerRoot1;
var mesh1;
var gioscene;
var universe;
initialize();
animate();
function initialize()
{
	scene = new THREE.Scene();
	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.5 );
	scene.add( ambientLight );
				
	camera = new THREE.Camera();
	scene.add(camera);
	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});
	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize( 640, 480 );
	renderer.domElement.style.position = 'absolute'
	renderer.domElement.style.top = '0px'
	renderer.domElement.style.left = '0px'
	document.body.appendChild( renderer.domElement );
	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;
	

	
	
	////////////////////////////////////////////////////////////
	// setup arToolkitSource
	////////////////////////////////////////////////////////////
	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});
	function onResize()
	{
		arToolkitSource.onResize()	
		arToolkitSource.copySizeTo(renderer.domElement)	
		if ( arToolkitContext.arController !== null )
		{
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
		}	
	}
	arToolkitSource.init(function onReady(){
		onResize()
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize()
	});
	
	////////////////////////////////////////////////////////////
	// setup arToolkitContext
	////////////////////////////////////////////////////////////	
	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'camera_para.dat',
		detectionMode: 'mono'
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init( function onCompleted(){
		camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
	});
	////////////////////////////////////////////////////////////
	// setup markerRoots
	////////////////////////////////////////////////////////////
	// build markerControls
	markerRoot1 = new THREE.Group();
	scene.add(markerRoot1);
	let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
		type: 'pattern', patternUrl: "hiro.patt",
	})
	let geometry1	= new THREE.CubeGeometry(1,1,1);
	let material1	= new THREE.MeshNormalMaterial({
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide
	}); 
	
	mesh1 = new THREE.Mesh( geometry1, material1 );
	mesh1.position.y = 0.5;
	
	// Gio.js
	controller.addData(data);
    controller.init();
	gioscene = controller.getScene();
	universe = createUniverse();
	
	// add universe to the scene
	gioscene.add(universe);
	
	markerRoot1.add(universe );
	
	//markerRoot1.add( mesh1 );
}

// this function create a universe object (a three.js object)
function createUniverse() {
        var universeMesh = new THREE.Mesh();
        universeMesh.geometry = new THREE.SphereGeometry(500, 128, 128);
        universeMesh.material = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(
                        'images/galaxy.png'
                ),
                side: THREE.BackSide
        });

        return universeMesh;
}

function update()
{
	// update artoolkit on every frame
	if ( arToolkitSource.ready !== false )
		arToolkitContext.update( arToolkitSource.domElement );
}
function render()
{
	renderer.render( scene, camera );

}
function animate()
{
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update();
	render();
}
		
		
		
		
                
                
        </script> 
    </body>
</html>
