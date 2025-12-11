
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Geometries = () => {
    return (
        <group>
            <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
                <mesh position={[1, -0.5, 1]} scale={0.6}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        meshPhysicalMaterial={false}
                        transmissionSampler={false}
                        backside={false}
                        samples={4}
                        resolution={512}
                        thickness={1.5}
                        roughness={0.2}
                        anisotropy={1}
                        chromaticAberration={0.15}
                        color="#a5b4fc"
                    />
                </mesh>
            </Float>

            <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                <mesh position={[-1.5, 1, -1]} scale={0.5}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        meshPhysicalMaterial={false}
                        transmissionSampler={false}
                        backside={false}
                        samples={4}
                        resolution={512}
                        thickness={1.5}
                        roughness={0.2}
                        anisotropy={1}
                        chromaticAberration={0.15}
                        color="#67e8f9"
                    />
                </mesh>
            </Float>

            <Float speed={1} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[2, 1.5, -2]} scale={0.4}>
                    <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />
                    <MeshTransmissionMaterial
                        meshPhysicalMaterial={false}
                        transmissionSampler={false}
                        backside={false}
                        samples={4}
                        resolution={512}
                        thickness={1.5}
                        roughness={0.2}
                        anisotropy={1}
                        chromaticAberration={0.15}
                        color="#38bdf8"
                    />
                </mesh>
            </Float>
        </group>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 transition-colors duration-300">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 1.5]}>
                <Geometries />
                <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
