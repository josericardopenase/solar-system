# Sistema Planetario - Documentación Técnica y Comentarios

### Descripción:
Este proyecto simula un sistema planetario en un entorno 3D usando *Three.js*, en el cual se pueden observar los planetas orbitando alrededor del Sol, una nave espacial controlable, y una interfaz que permite alternar entre diferentes vistas. La estructura del proyecto sigue principios de programación orientada a objetos (POO) y está diseñada de manera modular, facilitando la extensibilidad y organización del código.

---

### Objetivos:
- Recrear el Sistema Solar a escala con simulación de movimiento orbital y rotación de los planetas.
- Aplicar texturas y materiales realistas mediante *MeshPhongMaterial*.
- Desarrollar una interfaz intuitiva para visualizar, añadir y eliminar planetas.
- Integrar una nave espacial manipulable y controlar la cámara para explorar el sistema planetario.

### Funcionalidades:
1. **Sistema Solar Completo**: Modelado con planetas desde Mercurio hasta Neptuno, y lunas como el satélite terrestre.
2. **Materiales Phong y texturas avanzadas**: Usamos `MeshPhongMaterial` para lograr detalles en relieve y reflejos, configurando los materiales y texturas de cada planeta.
3. **Iluminación Puntual y Ambiental**: El Sol emite luz ambiental y puntual, iluminando las superficies de los planetas y simulando una iluminación realista.
4. **Controles y vista modular**: La interfaz permite alternar entre planetas, activar una nave espacial y eliminar planetas.

---

### Documentación detallada del código:

#### 1. **Main**

El archivo `main.ts` es el núcleo de configuración del sistema, donde se inicializan la escena principal, la cámara, el renderizador, y se gestiona la lógica de actualización. Este archivo define las bases del sistema planetario y carga los recursos necesarios, como el fondo y los controles de cámara.

```typescript
import * as THREE from 'three';
const scene = new THREE.Scene();
scene.background = new TextureLoader().load("./public/bg.jpg"); // Añade un fondo espacial al sistema.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
setupRenderer(renderer); // Configura el renderizador y activa las sombras suaves.
```

En esta sección:

1. **Configuración de la Escena**: La escena `scene` se inicializa como el contenedor principal de todos los objetos del sistema planetario. Se añade un fondo espacial usando `TextureLoader`, simulando un ambiente realista del cosmos.

2. **Cámara en Perspectiva**: La cámara `camera` se establece con un ángulo de 75 grados y aspecto ajustado a la ventana, con un rango de visión que abarca desde 0.1 hasta 1000 unidades. Este tipo de cámara otorga una vista profunda y permite observar el sistema completo.

3. **Renderizador WebGL**: El renderizador `renderer` utiliza WebGL para desplegar gráficos en 3D, y `setupRenderer(renderer)` configura propiedades avanzadas del renderizador, como el uso de sombras suaves para mejorar el realismo visual.

Además, se configura el sistema de controles de cámara y animación:

```typescript
const controls = setupCameraControls(camera, renderer); // Control de cámara para mover la vista
const cameraPivot = new THREE.Object3D();
scene.add(cameraPivot); 
cameraPivot.add(camera); // Ancla la cámara a un pivote para cambiar la orientación fácilmente
```

- **Controles de Cámara**: `setupCameraControls` permite al usuario mover la vista, acercarse y alejarse, y rotar la cámara alrededor de los objetos en el sistema. Estos controles ofrecen una exploración libre y versátil.
- **Pivote de Cámara**: `cameraPivot` actúa como punto de referencia para la cámara, facilitando la orientación y el cambio de posición con suavidad en toda la escena.

La lógica de actualización en `animate()` es clave para el movimiento continuo:

```typescript
function animate() {
    sun.mesh().rotateY(dt); // Rotación del Sol
    planets.forEach(x => x.mesh.updatePosition(0.01)); // Actualiza posiciones de los planetas
    requestAnimationFrame(animate); // Ciclo de renderizado continuo
    renderer.render(scene, camera); // Renderiza la escena en cada fotograma
}
animate();
```

- **Lógica de Animación**: `animate()` ejecuta la rotación del Sol y actualiza las posiciones de los planetas en cada cuadro, llamando a `requestAnimationFrame` para un ciclo de renderizado fluido.

#### 2. **Clase Base `Planet` y Subclases de Planetas**

La clase `Planet` es la base de la cual derivan todos los planetas del sistema. Su diseño modular permite que cada planeta tenga propiedades personalizables como radio, textura, mapas de relieve y, opcionalmente, mapas de nubes. Esta estructura también facilita añadir nuevos planetas con configuraciones individuales.

```typescript
export class Planet {
   private planetMesh: THREE.Mesh;
   private cloudsMesh?: THREE.Mesh;

   constructor(
       radius: number, 
       mapUrl: string, 
       options: { 
           bumpMapUrl?: string; 
           bumpScale?: number; 
           specularMapUrl?: string; 
           specularColor?: THREE.Color; 
           shininess?: number; 
           cloudMapUrl?: string; 
           cloudAlphaMapUrl?: string; 
           cloudOpacity?: number; 
       } = {}
   ) {
       // Geometría y material principal del planeta
       const geometry = new THREE.SphereGeometry(radius, 20, 20);
       const material = new THREE.MeshPhongMaterial({
           map: new TextureLoader().load(mapUrl), // Textura principal
           bumpMap: options.bumpMapUrl ? new TextureLoader().load(options.bumpMapUrl) : undefined, // Relieve opcional
           bumpScale: options.bumpScale ?? 1, // Intensidad del relieve
           specularMap: options.specularMapUrl ? new TextureLoader().load(options.specularMapUrl) : undefined, // Textura especular opcional
           specular: options.specularColor ?? new THREE.Color('grey'), // Color especular predeterminado
           shininess: options.shininess ?? 30 // Brillo predeterminado
       });

       this.planetMesh = new THREE.Mesh(geometry, material); // Crea la malla principal del planeta

       // Opcional: añadir nubes si se han especificado
       if (options.cloudMapUrl && options.cloudAlphaMapUrl) {
           const cloudMaterial = new THREE.MeshPhongMaterial({
               map: new TextureLoader().load(options.cloudMapUrl),
               alphaMap: new TextureLoader().load(options.cloudAlphaMapUrl), // Mapa de transparencia de las nubes
               transparent: true, // Permitir transparencia
               opacity: options.cloudOpacity ?? 0.1, // Opacidad de las nubes
               side: THREE.DoubleSide // Mapa visible desde ambos lados
           });
           this.cloudsMesh = new THREE.Mesh(
               new THREE.SphereGeometry(radius * 1.05, 20, 20), 
               cloudMaterial
           );
           this.planetMesh.add(this.cloudsMesh); // Añade la malla de nubes sobre el planeta
       }
   }

   // Método para agregar el planeta a la escena
   addToScene(scene: THREE.Scene) {
       scene.add(this.planetMesh); 
   }

   // Método para obtener la malla del planeta
   mesh(): THREE.Mesh {
       return this.planetMesh;
   }
}
```

- **Geometría**: Cada planeta se representa como una esfera (`SphereGeometry`) con un radio definido.
- **Materiales**: `MeshPhongMaterial` permite aplicar mapas de textura básicos y avanzados (como mapas de relieve y especulares), que controlan los detalles de la superficie, brillo y sombras del planeta.
- **Mapas de Nubes**: Los planetas como la Tierra tienen capas adicionales de nubes, utilizando un segundo material transparente.

---

Al extender la clase `Planet`, podemos definir propiedades específicas para cada planeta, como en la clase `Earth`:

```typescript
export class Earth extends Planet {
   constructor() {
       super(5, "./public/earth.jpg", {
           bumpMapUrl: "./public/earth_bump.jpg", // Mapa de relieve de la Tierra
           bumpScale: 0.1, // Suavidad del relieve
           specularMapUrl: "./public/earth_specular.jpg", // Mapa especular para reflejos
           specularColor: new THREE.Color("blue"), // Reflejos en tonos azules
           shininess: 50, // Brillo alto para reflejos sobre el agua
           cloudMapUrl: "./public/earth_clouds.jpg", // Mapa de nubes
           cloudAlphaMapUrl: "./public/earth_clouds_alpha.jpg", // Mapa de transparencia para las nubes
           cloudOpacity: 0.3, // Opacidad de las nubes
       });
   }
}
```

En esta configuración para `Earth`:
- **Texturas específicas**: Se carga una textura detallada de la Tierra (`earth.jpg`) junto con un mapa de relieve para simular irregularidades del terreno (`earth_bump.jpg`).
- **Especularidad y Brillo**: Un mapa especular (`earth_specular.jpg`) simula reflejos en los océanos, y `shininess` ajusta el brillo.
- **Nubes y transparencia**: La textura de nubes (`earth_clouds.jpg`) y su transparencia (`earth_clouds_alpha.jpg`) proporcionan una capa de atmósfera.

Con esta estructura modular, la creación de otros planetas es sencilla y permite una personalización completa.

#### 3. **Clase `PlanetPhysics` para Movimiento Orbital**
   `PlanetPhysics` es una clase que define la física y el movimiento de los planetas en sus órbitas. 

   ```typescript
   export class PlanetPhysics {
       constructor(mesh: THREE.Mesh, params: PhysicsParams) {
           this.ownMesh = mesh;
           this.params = params;
           this.createOrbitPath();
       }

       updatePosition(dt: number) {
           const x = this.params.radius * Math.sin(this.t * this.params.rotationVelocity) + this.params.rotationCenter.x;
           const z = this.params.radius * Math.cos(this.t * this.params.rotationVelocity) + this.params.rotationCenter.z;
           this.ownMesh.position.set(x, 0, z); // Actualiza posición según los parámetros
           this.ownMesh.rotation.y += this.params.selfRotationVelocity * dt; // Rotación propia del planeta
       }
   }
   ```

   `PlanetPhysics` actualiza la posición del planeta en función de parámetros como el radio de la órbita y velocidad de rotación. Cada planeta tiene su propia instancia de esta clase que se encarga de su movimiento orbital y su rotación.

#### 4. **Clase Base `Star` y Subclase `Sun`**
   `Sun` extiende de `Star` y representa al Sol en el sistema, emitiendo tanto luz ambiental como una luz puntual que ilumina los planetas.

   ```typescript
   export class Star {
       protected starMesh: THREE.Mesh;
       protected pointLight: THREE.PointLight;
       protected ambientLight: THREE.AmbientLight;

       constructor(radius: number, mapUrl: string, pointLightIntensity: number = 2, ambientLightIntensity: number = 0.5) {
           // Crea la geometría y el material del Sol
           const geometry = new THREE.SphereGeometry(radius, 32, 32);
           const material = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(mapUrl) });

           this.starMesh = new THREE.Mesh(geometry, material);
           this.pointLight = new THREE.PointLight(0xffffff, pointLightIntensity, 10000);
           this.ambientLight = new THREE.AmbientLight(0xffffff, ambientLightIntensity);
       }

       addToScene(scene: THREE.Scene) {
           scene.add(this.starMesh);
           scene.add(this.ambientLight);
       }
   }
   ```

   En `Sun`, ajustamos el tamaño de la malla y configuramos luces para que los planetas tengan sombras y reflejos realistas. El Sol sirve de fuente de luz central, siendo una luz clave para el ambiente del sistema planetario.

   
#### 5. **Interfaz de Usuario y Selección de Planetas**
   La interfaz permite seleccionar cada planeta, activar la nave o eliminar planetas, generando botones dinámicos que permiten interactuar con cada objeto del sistema.

   ```typescript
   function renderButtonsList(list: { name: string, mesh?: PlanetPhysics }[]) {
       const uiButtons = list.map((x) =>
           `
               <div class="${currentPlanet == x.mesh && "!bg-blue-100 !text-blue-500 !border-blue-500"} 
                           text-gray-800 p-3 hover:bg-gray-200 border-2 cursor-pointer 
                           bg-gray-100 rounded-xl text-center font-semibold">
                   ${x.name}
               </div>
           `
       );
       
       const getHtmlButtonList = document.getElementById("camera-positions");
       getHtmlButtonList.innerHTML = "";

       const resetButton = document.createElement("div");
       resetButton.innerHTML = `
           <div class="${currentPlanet == null && "!bg-blue-100 !text-blue-500 !border-blue-500"} 
                       text-gray-800 p-3 hover:bg-gray-200 border-2 cursor-pointer 
                       bg-gray-100 rounded-xl text-center font-semibold">
               Vista libre
           </div>`;
       resetButton.onclick = function () {
           currentPlanet = null;
           resetCamera();
           renderButtonsList(list);
       };
       getHtmlButtonList.appendChild(resetButton);

       const spacialButton = document.createElement("div");
       spacialButton.innerHTML = `
           <div class="${currentPlanet?.spacial && "!bg-blue-100 !text-blue-500 !border-blue-500"} 
                       text-gray-800 p-3 hover:bg-gray-200 border-2 cursor-pointer 
                       bg-gray-100 rounded-xl text-center font-semibold">
               Nave espacial
           </div>`;
       spacialButton.onclick = function () {
           currentPlanet = {
               mesh: null,
               spacial: true
           };
           resetCamera();
           renderButtonsList(list);
       };
       getHtmlButtonList.appendChild(spacialButton);

       uiButtons.forEach((item, i) => {
           const button = document.createElement("div");
           button.innerHTML = item;
           button.onclick = () => {
               if (currentPlanet == list[i].mesh) {
                   currentPlanet = null;
                   resetCamera();
                   renderButtonsList(list);
               } else {
                   resetCamera();
                   currentPlanet = list[i].mesh;
               }
               renderButtonsList(list);
           };
           getHtmlButtonList?.appendChild(button);
       });
   }
   ```

   `renderButtonsList` genera botones dinámicos para cada planeta en `list`, permitiendo:
   - **Vista Libre**: Resetea la vista a una perspectiva general del sistema.
   - **Nave Espacial**: Activa el modo de control de la nave espacial.
   - **Selección de Planeta**: Los botones de cada planeta actualizan la cámara para centrarse en el objeto correspondiente.
  
   Cada botón cambia visualmente cuando está seleccionado mediante clases dinámicas que aplican estilo según el objeto `currentPlanet`.
#### 6. **Control de la Nave Espacial**

La nave espacial en el sistema planetario se carga desde un modelo `GLTF` y se controla mediante eventos de teclado. Se configura para moverse y rotar en el espacio en respuesta a las teclas de dirección. El modelo y su control están en el archivo `main.ts`:

```typescript
const loader = new GLTFLoader();
let spaceShip = null;
loader.load(
    './public/ship.gltf', // Ruta del modelo de la nave
    (gltf) => {
        const m = gltf.scene;
        scene.add(m); // Añade la nave a la escena
        spaceShip = m;
        m.position.set(20, 0, -500); // Posición inicial de la nave
        m.scale.set(2, 2, 2); // Escala de la nave
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded'); // Feedback de carga en consola
    },
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);
```

El modelo de la nave se carga y se añade a la escena con un escalado y posición inicial. A continuación, se configuran eventos de teclado para detectar las teclas de movimiento: 

```typescript
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;

window.addEventListener("keydown", (event) => {
    if (currentPlanet?.spacial && spaceShip) {
        switch (event.key.toLowerCase()) {
            case "w":
                moveForward = true;
                break;
            case "s":
                moveBackward = true;
                break;
            case "a":
                rotateLeft = true;
                break;
            case "d":
                rotateRight = true;
                break;
        }
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key.toLowerCase()) {
        case "w":
            moveForward = false;
            break;
        case "s":
            moveBackward = false;
            break;
        case "a":
            rotateLeft = false;
            break;
        case "d":
            rotateRight = false;
            break;
    }
});
```

Aquí, `keydown` y `keyup` detectan las teclas `W`, `S`, `A` y `D` para avanzar, retroceder y rotar la nave. Las variables `moveForward`, `moveBackward`, `rotateLeft` y `rotateRight` controlan el estado del movimiento.

Finalmente, el movimiento y la rotación de la nave espacial se gestionan en la función `moveAndRotateSpaceShip()`, que ajusta la posición y rotación en función de las teclas presionadas:

```typescript
function moveAndRotateSpaceShip() {
    if (spaceShip) {
        const direction = new THREE.Vector3();
        spaceShip.getWorldDirection(direction);

        const tiltAngle = 0.4;
        const forwardTiltAngle = 0.2;
        const tiltSpeed = 0.03;

        // Control de avance y retroceso
        spaceShip.position.add(direction.multiplyScalar(0.3));

        if (moveBackward) {
            spaceShip.rotation.x = THREE.MathUtils.lerp(spaceShip.rotation.x, forwardTiltAngle, tiltSpeed);
        } else if (moveForward) {
            spaceShip.rotation.x = THREE.MathUtils.lerp(spaceShip.rotation.x, -forwardTiltAngle, tiltSpeed);
        } else {
            spaceShip.rotation.x = THREE.MathUtils.lerp(spaceShip.rotation.x, 0, tiltSpeed);
        }

        // Control de rotación lateral
        if (rotateLeft) {
            spaceShip.rotation.y += 0.005;
            cameraPivot.rotation.y += 0.005;
            spaceShip.rotation.z = THREE.MathUtils.lerp(spaceShip.rotation.z, -tiltAngle, tiltSpeed);
        } else if (rotateRight) {
            spaceShip.rotation.y -= 0.005;
            cameraPivot.rotation.y -= 0.005;
            spaceShip.rotation.z = THREE.MathUtils.lerp(spaceShip.rotation.z, tiltAngle, tiltSpeed);
        } else {
            spaceShip.rotation.z = THREE.MathUtils.lerp(spaceShip.rotation.z, 0, tiltSpeed);
        }

        // La cámara sigue la nave
        cameraPivot.position.copy(spaceShip.position);
    }
}
```

La función `moveAndRotateSpaceShip()` ajusta la posición y la rotación de la nave, proporcionando control fluido:

- **Avance y retroceso**: Si `moveForward` o `moveBackward` están activados, la nave se mueve en la dirección calculada por `getWorldDirection`.
- **Rotación lateral**: `rotateLeft` y `rotateRight` ajustan la rotación en el eje `y` y el ángulo de inclinación lateral (`z`), creando un efecto de giro suave.
- **Sincronización con la cámara**: `cameraPivot.position.copy(spaceShip.position);` mantiene la cámara centrada en la nave, para que la vista siga su movimiento.

---

Esta implementación proporciona un control interactivo en tiempo real, lo que permite que la nave se mueva por el sistema planetario de forma intuitiva y realista.


### Resumen:
El proyecto Sistema Planetario abarca el diseño de un sistema modular con principios de POO aplicados a gráficos 3D. Cada clase está orientada a facilitar el realismo y la interactividad de los planetas, su movimiento y la exploración mediante una interfaz. Se emplean materiales avanzados y una iluminación precisa para conseguir un sistema que refleja fielmente los movimientos del sistema solar en un entorno tridimensional interactivo.
