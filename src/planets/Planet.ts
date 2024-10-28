import * as THREE from "three";
import { TextureLoader } from "three";

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
            refractionRatio?: number;
            cloudMapUrl?: string;
            cloudAlphaMapUrl?: string;
            cloudOpacity?: number;
        } = {}
    ) {
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

    addToScene(scene: THREE.Scene) {
        scene.add(this.planetMesh);
    }

    mesh(): THREE.Mesh {
        return this.planetMesh;
    }
}

export class Mercury extends Planet {
    constructor() {
        super(2, "http://127.0.0.1:3000/mercury.jpg");
    }
}

export class Venus extends Planet {
    constructor() {
        super(4.5, "http://127.0.0.1:3000/venus.jpg");
    }
}

export class Earth extends Planet {
    constructor() {
        super(5, "http://127.0.0.1:3000/earth.jpg", {
            bumpMapUrl: "http://127.0.0.1:3000/earth_bump.jpg",
            bumpScale: 0.1,
            specularMapUrl: "http://127.0.0.1:3000/earth_specular.jpg",
            specularColor: new THREE.Color("blue"),
            shininess: 50,
            cloudMapUrl: "http://127.0.0.1:3000/earth_clouds.jpg",
            cloudAlphaMapUrl: "http://127.0.0.1:3000/earth_clouds_alpha.jpg",
            cloudOpacity: 0.3,
        });
    }
}

export class Mars extends Planet {
    constructor() {
        super(3.5, "http://127.0.0.1:3000/mars.jpg");
    }
}

export class Jupiter extends Planet {
    constructor() {
        super(10, "http://127.0.0.1:3000/jupiter.jpg");
    }
}

export class Saturn extends Planet {
    constructor() {
        super(9, "http://127.0.0.1:3000/saturn.jpg");
    }
}

export class Uranus extends Planet {
    constructor() {
        super(7, "http://127.0.0.1:3000/uranus.jpg");
    }
}

export class Neptune extends Planet {
    constructor() {
        super(7, "http://127.0.0.1:3000/neptune.jpg");
    }
}