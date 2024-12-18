import * as THREE from "three";
import { TextureLoader } from "three";
export class Planet {
    constructor(radius, mapUrl, options = {}) {
        Object.defineProperty(this, "planetMesh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cloudsMesh", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        const geometry = new THREE.SphereGeometry(radius, 20, 20);
        const material = new THREE.MeshPhongMaterial({
            map: new TextureLoader().load(mapUrl),
            bumpMap: options.bumpMapUrl ? new TextureLoader().load(options.bumpMapUrl) : undefined,
            bumpScale: options.bumpScale ?? 1,
            specularMap: options.specularMapUrl ? new TextureLoader().load(options.specularMapUrl) : undefined,
            specular: options.specularColor ?? new THREE.Color('grey'),
            shininess: options.shininess ?? 30,
            refractionRatio: options.refractionRatio ?? 1,
            normalMapType: THREE.TangentSpaceNormalMap,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.planetMesh = new THREE.Mesh(geometry, material);
        if (options.cloudMapUrl && options.cloudAlphaMapUrl) {
            const cloudGeometry = new THREE.SphereGeometry(radius * 1.05, 20, 20);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                map: new TextureLoader().load(options.cloudMapUrl),
                alphaMap: new TextureLoader().load(options.cloudAlphaMapUrl),
                transparent: true,
                opacity: options.cloudOpacity ?? 0.1,
                side: THREE.DoubleSide,
            });
            this.cloudsMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
            this.planetMesh.add(this.cloudsMesh);
        }
    }
    addToScene(scene) {
        scene.add(this.planetMesh);
    }
    mesh() {
        return this.planetMesh;
    }
}
export class Mercury extends Planet {
    constructor() {
        super(2, "/assets/mercury.jpg");
    }
}
export class Venus extends Planet {
    constructor() {
        super(4.5, "/assets/venus.jpg");
    }
}
export class Earth extends Planet {
    constructor() {
        super(5, "/assets/earth.jpg", {
            bumpMapUrl: "/assets/earth_bump.jpg",
            bumpScale: 0.1,
            specularMapUrl: "/assets/earth_specular.jpg",
            specularColor: new THREE.Color("blue"),
            shininess: 50,
            cloudMapUrl: "/assets/earth_clouds.jpg",
            cloudAlphaMapUrl: "/assets/earth_clouds_alpha.jpg",
            cloudOpacity: 0.3,
        });
    }
}
export class Mars extends Planet {
    constructor() {
        super(3.5, "/assets/mars.jpg");
    }
}
export class Jupiter extends Planet {
    constructor() {
        super(10, "/assets/jupiter.jpg");
    }
}
export class Saturn extends Planet {
    constructor() {
        super(9, "/assets/saturn.jpg");
    }
}
export class Uranus extends Planet {
    constructor() {
        super(7, "/assets/uranus.jpg");
    }
}
export class Neptune extends Planet {
    constructor() {
        super(7, "/assets/neptune.jpg");
    }
}
