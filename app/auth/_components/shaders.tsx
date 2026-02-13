'use client'

import { ShaderGradient,ShaderGradientCanvas } from '@shadergradient/react'
import React from 'react'
const Shaders = () => {
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ShaderGradientCanvas
      className={`absolute inset-0 z-0 transition-opacity duration-1000 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <ShaderGradient
        animate="on"
        brightness={1.1}
        cAzimuthAngle={180}
        cDistance={3.9}
        cPolarAngle={115}
        cameraZoom={1}
        color1="#1447e6"
        color2="#000083"
        color3="#000041"
        envPreset="city"
        grain="off"
        lightType="3d"
        shader="defaults"
        type="waterPlane"
        uAmplitude={0}
        uDensity={1.1}
        uFrequency={5.5}
        uSpeed={0.1}
        uStrength={2.4}
        uTime={0.2}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}

export default Shaders