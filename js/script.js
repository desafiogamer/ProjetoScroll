import * as THREE from '../build/three.module.js';
import Stats from '../jsm/stats.module.js'
import { OrbitControls } from '../jsm/OrbitControls.js';
import { GLTFLoader } from '../jsm/GLTFLoader.js';
import { RGBELoader } from '../jsm/RGBELoader.js'

let camera,
    renderer


const containerDesabilitar = document.querySelector('.desabilitar')
const containerHabilitar = document.querySelector('.habilitar')
const remover = document.getElementById('remover')
const habilitar = document.getElementById('adicionar')
const services = document.getElementById('services')
const inicial = document.getElementById('inicio')
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header')
const scene = new THREE.Scene()

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

//ambient = new THREE.AmbientLight(0x555555);
//scene.add(ambient);

//let directionalLight = new THREE.DirectionalLight(0xffeedd);
//directionalLight.position.set(0, 0, 1);
//scene.add(directionalLight);

renderer = new THREE.WebGLRenderer();
scene.fog = new THREE.FogExp2(0x0c0c0c, 0.002);
renderer.setClearColor(scene.fog.color);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var container = document.getElementById('inicio')

var loader = new GLTFLoader();
loader.load('./models/frank.glb', function (gltf) {
    scene.add(gltf.scene);
    remover.addEventListener('click', ()=>{
        scene.remove(gltf.scene)
        containerDesabilitar.style.display = 'none'
        containerHabilitar.style.display ='flex'
        services.classList.add('ativo')
        inicial.classList.add('ativo')
    })
    habilitar.addEventListener('click', ()=>{
        scene.add(gltf.scene)
        containerDesabilitar.style.display = 'flex'
        containerHabilitar.style.display ='none'
        services.classList.remove('ativo')
        inicial.classList.remove('ativo')
    })
})

new RGBELoader()
        .setPath('./')
        .load('moonlit_golf_2k.hdr', function(texture){
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = texture
        })

/* Liner Interpolation
 * lerp(min, max, ratio)
 * eg,
 * lerp(20, 60, .5)) = 40
 * lerp(-20, 60, .5)) = 20
 * lerp(20, 60, .75)) = 50
 * lerp(-20, -10, .1)) = -.19
 */
function lerp(x, y, a){
    return (1 - a) * x + a * y
}

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

const animationScripts = []

animationScripts.push({
    start: 0,
    end: 40,
    func: () => {
        camera.lookAt(scene.position)
        camera.position.set(0, 0.5, 2)
        scene.rotation.y = lerp(0, Math.PI, scalePercent(0, 50))
        //console.log(scene.rotation.y)
    },
})

animationScripts.push({
    start: 40,
    end: 60,
    func: () => {
        camera.lookAt(scene.position)
        camera.position.set(0, 0.5, 2)
        scene.rotation.y = lerp(2.51, Math.PI, scalePercent(40, 50))
        //console.log(scene.rotation.y)
    },
})

animationScripts.push({
    start: 60,
    end: 80,
    func: () => {
        camera.lookAt(scene.position)
        camera.position.set(0, 0.5, 2)
        scene.rotation.y = lerp(3.76, Math.PI, scalePercent(60, 50))
        //console.log(scene.rotation.y)
    },
})

animationScripts.push({
    start: 80,
    end: 100,
    func: () => {
        camera.lookAt(scene.position)
        camera.position.set(0, 0.5, 2)
        scene.rotation.y = lerp(4.99, Math.PI, scalePercent(80, 50))
    },
})

function playScrollAnimations() {
    animationScripts.forEach((a) => {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func()
        }
    })
}

let scrollPercent = 0

document.body.onscroll = () => {
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollTop ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100
        ;
        sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(Links => {
                Links.classList.remove('ativo');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('ativo');
            });
            document.querySelector('header').classList.add('ativo');
        }

        if(top <= offset && top <= offset + height){
            document.querySelector('header').classList.remove('ativo');
        }
    }); //(document.getElementById('scrollProgress')).innerText =
            //'Scroll Progress : ' + scrollPercent.toFixed(2)
}

const btnAnimar = document.getElementById('btn-menu');
btnAnimar.addEventListener('click', animarMenu)
function animarMenu(){
    btnAnimar.classList.toggle('ativar')
}

const config =document.querySelector('.arrumarConfig')
const openConfig = document.querySelector('.config')

config.addEventListener('click', ()=>{
    openConfig.classList.toggle('ativo')
})

//const stats = new Stats()
//document.body.appendChild(stats.dom)

function animate() {

    requestAnimationFrame(animate)
    playScrollAnimations()
    render()

    camera.position.y = -0.01

    //stats.update()
    container.appendChild(renderer.domElement)
}

function render() {
    renderer.render(scene, camera)
}

window.scrollTo({ top: 0, behavior: 'smooth' })
animate()