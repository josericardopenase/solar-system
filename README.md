# Sistema Planetario - Documentación Técnica

### Descripción:
Este sistema es un modelo interactivo de un sistema planetario creado con *Three.js* y *JavaScript*, donde el usuario puede explorar diferentes planetas, su rotación, sus satélites, y controlar una nave espacial. El proyecto utiliza una arquitectura modular orientada a objetos que permite una extensibilidad flexible y organiza de forma clara las funcionalidades en clases específicas para planetas, física orbital y visualización. La iluminación se configura mediante un material *Phong*, simulando texturas realistas con efectos de sombra y especularidad.

### Objetivos:
- Simular de manera realista el movimiento de los planetas y sus órbitas, incluyendo sus inclinaciones y velocidad de rotación.
- Permitir al usuario una interacción intuitiva con el sistema mediante una interfaz visual.
- Incluir una nave espacial que el usuario puede controlar, simulando exploración espacial.
- Implementar una estructura modular que permita agregar y modificar componentes fácilmente.

---

### Funcionalidades Implementadas:
1. **Rotación y movimiento orbital de los planetas**: Cada planeta tiene una órbita y rotación propia, configuradas mediante una clase de física específica, que simula la inclinación y el color de la órbita.
2. **Materiales Phong y mapas de texturas**: Utilizamos *MeshPhongMaterial* para crear materiales avanzados en los planetas, aplicando mapas de relieve, especulares y de nubes, dando un aspecto tridimensional detallado.
3. **Luces puntuales y ambientales**: La iluminación es gestionada por la clase `Sun`, que usa una luz puntual y ambiental para emular la iluminación solar.
4. **Interfaz intuitiva**: La interfaz permite al usuario cambiar de perspectiva entre planetas, activar el control de la nave y visualizar o eliminar planetas.
5. **Control de la nave espacial**: La nave es manipulable mediante teclas (W, A, S, D), permitiendo una exploración dinámica del espacio.

---

### Documentación:

#### 1. **Main**
   En el archivo `main.ts`, se configura la escena principal y se integran todos los objetos del sistema.

   ```typescript
   const scene = new THREE.Scene();
   scene.background = new TextureLoader().load("./public/bg.jpg");
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer();
   setupRenderer(renderer);
   ```

   Aquí, la escena y la cámara principal se inicializan, configurándose la cámara con una perspectiva de 75 grados. Se utiliza un `TextureLoader` para añadir una textura de fondo espacial, y la cámara está anclada a un `cameraPivot` que permite cambiar su orientación fácilmente.

#### 2. **Planetas**
   Los planetas heredan de la clase `Planet`, la cual permite crear cualquier objeto esférico con texturas avanzadas. La clase `Planet` soporta texturas para mapas de relieve, especulares y de nubes.

   ```typescript
   export class Earth extends Planet {
       constructor() {
           super(5, "./public/earth.jpg", {
               bumpMapUrl: "./public/earth_bump.jpg",
               bumpScale: 0.1,
               specularMapUrl: "./public/earth_specular.jpg",
               specularColor: new THREE.Color("blue"),
               shininess: 50,
               cloudMapUrl: "./public/earth_clouds.jpg",
               cloudAlphaMapUrl: "./public/earth_clouds_alpha.jpg",
               cloudOpacity: 0.3,
           });
       }
   }
   ```

   Esta clase define un planeta con un radio y texturas configuradas. Earth, por ejemplo, usa un mapa especular para simular reflejos y un mapa de nubes con opacidad ajustada. La clase `Planet` ofrece un método `addToScene()` que permite añadir el planeta a la escena de manera directa y modular.

#### 3. **Movimiento de los Planetas**
   El movimiento orbital se maneja en la clase `PlanetPhysics`, que configura parámetros como la velocidad de rotación y la inclinación.

   ```typescript
   export class PlanetPhysics {
       private params: PhysicsParams;
       constructor(mesh: THREE.Mesh, params: PhysicsParams) {
           this.ownMesh = mesh;
           this.params = params;
           this.createOrbitPath();
       }
       updatePosition(dt: number) {
           const x = this.params.radius * Math.sin(this.t * this.params.rotationVelocity) + this.params.rotationCenter.x;
           const z = this.params.radius * Math.cos(this.t * this.params.rotationVelocity) + this.params.rotationCenter.z;
           this.ownMesh.position.set(x, 0, z);
           this.ownMesh.rotation.y += this.params.selfRotationVelocity * dt;
       }
   }
   ```

   `PlanetPhysics` permite a cada planeta tener su propia velocidad de rotación y traslación. Se crean órbitas visuales, y el método `updatePosition()` ajusta su posición en función de `t`, simulando el movimiento en el espacio tridimensional.

#### 4. **Satélites**
   La clase `Moon`, derivada de `Planet`, se utiliza para añadir lunas en ciertos planetas. 

   ```typescript
   const moon = new Moon();
   earth.mesh().add(moon.mesh());
   ```

   Esto crea una luna que orbita a la Tierra, conectada directamente al objeto de la Tierra para que herede sus transformaciones, lo cual es fundamental para movimientos coordinados en las órbitas.

#### 5. **Interfaz JavaScript**
   La interfaz permite cambiar entre planetas y controlar la visualización de los mismos.

   ```typescript
   function renderButtonsList(list: {name: string, mesh ?: PlanetPhysics}[]) {
       const uiButtons = list.map((x) => `<div>${x.name}</div>`);
       // Eventos para cada botón de planeta
   }
   ```

   `renderButtonsList()` genera botones dinámicos para cada planeta y permite alternar la vista de cámara entre planetas, usando `resetCamera()` para volver a la vista inicial.

#### 6. **Movimiento de la Nave**
   La nave es un modelo `GLTF` cargado dinámicamente y controlado mediante eventos de teclado.

   ```typescript
   let spaceShip = null;
   loader.load('./public/ship.gltf', (gltf) => {
       spaceShip = gltf.scene;
       scene.add(spaceShip);
   });

   function moveAndRotateSpaceShip() {
       if (moveForward) spaceShip.position.add(new THREE.Vector3(0, 0, 0.3));
       if (rotateLeft) spaceShip.rotation.y += 0.005;
   }
   ```

   La nave es un objeto completamente interactivo, cuya posición y rotación se ajustan en base a los eventos de teclado. El método `moveAndRotateSpaceShip()` permite que el usuario controle su posición en el espacio 3D.

### Aprendizajes:
Este proyecto facilitó una comprensión profunda de la orientación a objetos aplicada en `Three.js` y la creación de sistemas modulares y extensibles en gráficos 3D. Además, se aprendió sobre materiales avanzados y manejo de texturas para simular planetas realistas y sobre cómo integrar controles de usuario efectivos en una interfaz intuitiva.

### Conclusiones:
Este sistema planetario interactivo no solo permite explorar el movimiento y composición visual de los cuerpos celestes sino también experimentar con una estructura de código modular y escalable. La implementación de controles avanzados y un sistema de iluminación realista enriquece la experiencia del usuario, y la arquitectura orientada a objetos facilita futuras ampliaciones.
