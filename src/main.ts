import * as THREE from 'three';
import { FontLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js';

let scene: THREE.Scene 
let pointLight: THREE.PointLight
let pointLight2: THREE.PointLight

let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
    })
  }

init();

function init() {
    const colorLight = navigator.onLine ? 0x111122 : 0x221111

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 45, 30, 10 );
	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( colorLight, 5 ) );

    function createLight (color: number) {
        const light = new THREE.PointLight(color, 200, 20);

        light.castShadow = true;
        light.shadow.bias = -0.005
        light.shadow.mapSize.width = 128;
        light.shadow.radius = 10;

        let geometry = new THREE.SphereGeometry(.3, 12, 6)
        let material1 = new THREE.MeshBasicMaterial({color})
        material1.color.multiplyScalar(200)
        let sphere1 = new THREE.Mesh(geometry, material1)
        light.add(sphere1)

        const texture = new THREE.CanvasTexture(generateTexture())
        texture.magFilter = THREE.NearestFilter
        texture.wrapT = THREE.RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.set(1, 4.5)

        geometry = new THREE.SphereGeometry(2, 32, 8)
        const material2 = new THREE.MeshPhongMaterial({
            side: 2,
            alphaMap: texture,
            alphaTest: 0.5,
            
        })

        let sphere2 = new THREE.Mesh(geometry, material2)
        sphere2.castShadow = true;
        sphere2.receiveShadow = true;
        light.add( sphere2 );

        return light;
    }

    
    pointLight = createLight( 0x0088ff );
    scene.add( pointLight );

    pointLight2 = createLight( 0xff0088 );
    scene.add( pointLight2 );


    

    const geometry = new THREE.BoxGeometry( 30, 30, 30 );

    const material = new THREE.MeshPhongMaterial( {
        color: 0xa0adaf,
        shininess: 10,
        specular: 0x111111,
        side: THREE.BackSide
    } );

    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 10;
    mesh.receiveShadow = true;
    scene.add( mesh );

    create3DText(0, 15, 15)
    create3DText(0, 15, -15, Math.PI )
    create3DText(15, 15, 0, Math.PI / 2 )
    create3DText(-15, 15, 0, -(Math.PI / 2) )

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 10, 0 );
    //controls.rotateSpeed = -0.5;
    controls.update();


    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function generateTexture () {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2

    const context = canvas.getContext("2d") as CanvasRenderingContext2D
    context.fillStyle = "white"
    context.fillRect(0, 1, 2, 1)

    return canvas
}

function animate() {

    let time = performance.now() * 0.001;

    pointLight.position.x = Math.sin( time * 0.6 ) * 9;
    pointLight.position.y = Math.sin( time * 0.7 ) * 9 + 6;
    pointLight.position.z = Math.sin( time * 0.8 ) * 9;

    pointLight.rotation.x = time;
    pointLight.rotation.z = time;

    time += 20;

    pointLight2.position.x = Math.sin( time * 0.6 ) * 9;
    pointLight2.position.y = Math.sin( time * 0.7 ) * 9 + 6;
    pointLight2.position.z = Math.sin( time * 0.8 ) * 9;

    pointLight2.rotation.x = time;
    pointLight2.rotation.z = time;

    renderer.render( scene, camera );

}

function create3DText(x: number, y: number, z: number, rotate: number = 0) {
    const fontLoader = new FontLoader();

    fontLoader.load(
        '/no-internet-page/droid_sans_mono_regular.typeface.json',
        function (font) {

            const text = navigator.onLine ? 'Этот сайт работает \nбез интернета' : 'Интернета нет, \nно все работает'

            const textGeometry = new TextGeometry(text, {
                font,
                size: 1,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.05,
                depth: 0.1,
            });
            
            textGeometry.center();
            
            const textMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                shininess: 10,
                specular: 0x111111
            });
            
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            
            
            textMesh.position.set(x, y, z);
            textMesh.rotation.y = rotate;
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;

            
            scene.add(textMesh);
        }
    );
} 