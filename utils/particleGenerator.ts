export interface ParticleTrack {
  name: string
  symbol: string
  particleType: string
  charge: number
  momentum: number
  origin: { x: number; y: number }
  type: 'straight' | 'curved' | 'spiral'
  color: string
  width: number
  radius?: number
  angle?: number
  length?: number
  turns?: number
  // Optional flag for spirals that should shrink inward (outer radius at start,
  // center at end), used e.g. for e⁺e⁻ from π⁰ decay
  shrinkSpiral?: boolean
  decayPoint?: { x: number; y: number }
  decayProducts?: Array<{
    color: string
    width: number
    angle: number
    length: number
    radius?: number
    decayPoint?: { x: number; y: number }
    leptonAngle?: number
    muonCharge?: number
    muonMomentum?: number
    pionNeutrinoAngle?: number
    muonNeutrino1Angle?: number
    muonNeutrino2Angle?: number
  }>
  description?: string
  trackNumber?: number // Número asignado para identificación por estudiantes
}

const PARTICLE_TYPES = {
  muon: {
    name: 'Muón (μ⁻)',
    symbol: 'μ⁻',
    particleType: 'Muón',
    charge: -1,
    color: '#4dabf7',
    width: 2,
    description: 'Leptón pesado, interacción mínima, trayectoria curva larga',
  },
  muonPlus: {
    name: 'Muón (μ⁺)',
    symbol: 'μ⁺',
    particleType: 'Muón',
    charge: 1,
    color: '#4dabf7',
    width: 2,
    description: 'Leptón pesado, interacción mínima, trayectoria curva larga',
  },
  pionMinus: {
    name: 'Pión (π⁻)',
    symbol: 'π⁻',
    particleType: 'Pión',
    charge: -1,
    color: '#51cf66',
    width: 2.5,
    description: 'Mesón ligero, puede decaer en muón y neutrino',
  },
  pionPlus: {
    name: 'Pión (π⁺)',
    symbol: 'π⁺',
    particleType: 'Pión',
    charge: 1,
    color: '#51cf66',
    width: 2.5,
    description: 'Mesón ligero, puede decaer en muón y neutrino',
  },
  electron: {
    name: 'Electrón (e⁻)',
    symbol: 'e⁻',
    particleType: 'Electrón',
    charge: -1,
    color: '#ffd43b',
    width: 1.5,
    description: 'Leptón ligero, pierde energía rápidamente, forma espiral cerrada',
  },
  positron: {
    name: 'Positrón (e⁺)',
    symbol: 'e⁺',
    particleType: 'Positrón',
    charge: 1,
    color: '#ff8787',
    width: 1.5,
    description: 'Antipartícula del electrón, forma espiral cerrada',
  },
  proton: {
    name: 'Protón (p)',
    symbol: 'p',
    particleType: 'Protón',
    charge: 1,
    color: '#845ef7',
    width: 3,
    description: 'Barión pesado, trayectoria corta y gruesa, alto momento',
  },
  pionZero: {
    name: 'Pión (π⁰)',
    symbol: 'π⁰',
    particleType: 'Pión',
    charge: 0,
    color: '#94d2ff',
    width: 2,
    description: 'Pión neutro, decae casi inmediatamente',
  },
  gamma: {
    name: 'Fotón (γ)',
    symbol: 'γ',
    particleType: 'Gamma',
    charge: 0,
    color: '#cccccc',
    width: 1,
    description: 'Fotón del decaimiento de π⁰',
  },
  kaon: {
    name: 'Kaon (K⁻)',
    symbol: 'K⁻',
    particleType: 'Kaon',
    charge: -1,
    color: '#ff922b',
    width: 2.5,
    description: 'Strange meson, may decay with visible kink',
  },
}

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateTrack(
  particleKey: keyof typeof PARTICLE_TYPES,
  origin: { x: number; y: number }
): ParticleTrack {
  const particle = PARTICLE_TYPES[particleKey]
  const momentum = randomBetween(0.5, 50)

  let type: 'straight' | 'curved' | 'spiral'
  let radius: number | undefined
  let angle: number | undefined
  let length: number | undefined
  let turns: number | undefined
  let decayPoint: { x: number; y: number } | undefined
  let decayProducts: ParticleTrack['decayProducts']

  // High momentum particles are straighter
  if (momentum > 30) {
    type = 'straight'
    angle = randomBetween(0, Math.PI * 2)
    length = randomBetween(0.3, 0.6)
  } else if (particleKey === 'electron' || particleKey === 'positron') {
    // Electrons/positrons form spirals
    type = 'spiral'
    radius = randomBetween(0.05, 0.15)
    turns = randomBetween(2, 5)
  } else {
    // Other particles form curved tracks
    type = 'curved'
    radius = randomBetween(0.1, 0.4) * (50 / momentum) // Higher momentum = larger radius
    angle = randomBetween(0, Math.PI * 2)
    length = randomBetween(0.2, 0.5)
  }

  // Some particles may decay
  if (
    (particleKey === 'pionMinus' || particleKey === 'pionPlus' || particleKey === 'kaon') &&
    Math.random() > 0.6
  ) {
    const decayDistance = randomBetween(0.2, 0.6)
    decayPoint = {
      x: origin.x + Math.cos(angle || 0) * decayDistance * 0.3,
      y: origin.y + Math.sin(angle || 0) * decayDistance * 0.3,
    }

    // Generate decay products
    decayProducts = [
      {
        color: '#4dabf7',
        width: 2,
        angle: (angle || 0) + randomBetween(-0.5, 0.5),
        length: randomBetween(0.2, 0.4),
      },
      {
        color: '#888',
        width: 1,
        angle: (angle || 0) + Math.PI + randomBetween(-0.3, 0.3),
        length: randomBetween(0.1, 0.3),
      },
    ]
  }

  return {
    name: particle.name,
    symbol: particle.symbol,
    particleType: particle.particleType,
    charge: particle.charge,
    momentum,
    origin,
    type,
    color: particle.color,
    width: particle.width,
    radius,
    angle,
    length,
    turns,
    decayPoint,
    decayProducts,
    description: particle.description,
  }
}

export function generateParticleTracks(): ParticleTrack[] {
  const tracks: ParticleTrack[] = []
  let trackCounter = 1 // Contador para numerar las partículas

  // Collision point (center of chamber)
  const collisionPoint = {
    x: 0.5,
    y: 0.5,
  }

  // Incoming proton from the left border
  const incomingProtonOrigin = {
    x: 0.0, // Start from left border
    y: collisionPoint.y, // Aligned with center
  }

  // Create incoming proton track (straight, high momentum)
  const incomingProton = {
    ...PARTICLE_TYPES.proton,
    momentum: randomBetween(40, 60), // High momentum
    origin: incomingProtonOrigin,
    type: 'straight' as const,
    angle: Math.atan2(
      collisionPoint.y - incomingProtonOrigin.y,
      collisionPoint.x - incomingProtonOrigin.x
    ),
    length: Math.sqrt(
      Math.pow(collisionPoint.x - incomingProtonOrigin.x, 2) +
      Math.pow(collisionPoint.y - incomingProtonOrigin.y, 2)
    ),
    radius: undefined,
    turns: undefined,
    decayPoint: undefined,
    decayProducts: undefined,
    description: 'Incoming proton from left',
    trackNumber: trackCounter++,
  }
  tracks.push(incomingProton)

  // Momentum conservation in the final state:
  // one incoming proton (along +x) → two outgoing protons + π⁺ + π⁻,
  // all moving roughly forward (px > 0), with transverse momenta canceling in pairs.
  const totalIncomingMomentum = incomingProton.momentum
  const baseAngle = incomingProton.angle // ~0, along +x

  // Choose how much of the incoming momentum goes into protons vs pions
  const fractionToProtons = randomBetween(0.4, 0.7)
  const fractionToPions = 1 - fractionToProtons

  // Small scattering angles so everything goes forward and mostly horizontal
  const protonScatter = randomBetween(Math.PI / 18, Math.PI / 12) // 10°–15°

  // Decide how many π⁺π⁻ pairs to produce:
  // 1 pair (2 piones) with 100%, 2 pairs (4 piones) with 0% (disabled but code kept), 3 pairs (6 piones) with 0% (disabled but code kept).
  const pionPairRand = Math.random()
  let numPionPairs: number
  if (pionPairRand < 1.0) {
    numPionPairs = 1 // 100% probability
  } else if (pionPairRand < 0.8) {
    // This condition is impossible (pionPairRand >= 1.0 && pionPairRand < 0.8)
    // Code kept but never executed - 2 pairs (4 piones) probability is 0%
    numPionPairs = 2
  } else {
    // This condition is impossible (pionPairRand >= 1.0)
    // Code kept but never executed - 3 pairs (6 piones) probability is 0%
    numPionPairs = 3
  }
  const numPions = numPionPairs * 2

  // Shared x-momentum for each outgoing proton (two) and for each pion
  const protonPxEach = (fractionToProtons * totalIncomingMomentum) / 2
  const pionPxEach = (fractionToPions * totalIncomingMomentum) / numPions

  // Outgoing proton angles (symmetric around beam direction)
  const proton1Angle = baseAngle + protonScatter
  const proton2Angle = baseAngle - protonScatter

  // Convert required x-momentum to full momentum magnitude using p_x = p cos(theta)
  const proton1Momentum = protonPxEach / Math.cos(proton1Angle)
  const proton2Momentum = protonPxEach / Math.cos(proton2Angle)

  // Helper to create outgoing proton tracks (drawn as straight tracks to make
  // the post-collision momentum directions visually clear)
  const makeOutgoingProton = (
    momentum: number,
    angle: number,
    label: string,
    trackNumber: number
  ): ParticleTrack => {
    const radius = randomBetween(0.25, 0.45) * (50 / momentum)
    const length = randomBetween(0.25, 0.45)
    return {
      name: label === 'scattered' ? 'Protón Dispersado (p)' : 'Protón Objetivo (p)',
      symbol: 'p',
      particleType: 'Protón',
      charge: 1,
      momentum,
      origin: collisionPoint,
      type: 'straight',
      color: PARTICLE_TYPES.proton.color,
      width: PARTICLE_TYPES.proton.width,
      radius: undefined,
      angle,
      length,
      turns: undefined,
      decayPoint: undefined,
      decayProducts: undefined,
      description:
        label === 'scattered'
          ? 'Protón saliente después de la colisión'
          : 'Protón objetivo expulsado de la colisión',
      trackNumber,
    }
  }

  const scatteredProton = makeOutgoingProton(proton1Momentum, proton1Angle, 'scattered', trackCounter++)
  const targetProton = makeOutgoingProton(proton2Momentum, proton2Angle, 'target', trackCounter++)
  tracks.push(scatteredProton, targetProton)

  // Generate π⁺π⁻ pairs from the collision with forward-going momenta.
  const pionConfigs: Array<{
    type: 'pionPlus' | 'pionMinus'
    angle: number
    momentum: number
  }> = []

  // Base scattering for pions; each successive pair can be a bit wider
  const basePionScatter = randomBetween(Math.PI / 8, Math.PI / 4) // 22.5°–45°

  for (let i = 0; i < numPionPairs; i++) {
    const scale = 1 + i * 0.3 // spread outer pairs a bit more
    const scatter = basePionScatter * scale

    // Choose angles so that initial tangents for both charges
    // point predominantly in the +x direction given our arc convention:
    // - π⁺ (positive, counterclockwise) needs a small negative start angle
    // - π⁻ (negative, clockwise) needs a small positive start angle
    const pionPlusAngle = baseAngle - scatter
    const pionMinusAngle = baseAngle + scatter

    const pionPlusMomentum = pionPxEach / Math.cos(pionPlusAngle)
    const pionMinusMomentum = pionPxEach / Math.cos(pionMinusAngle)

    pionConfigs.push(
      { type: 'pionPlus', angle: pionPlusAngle, momentum: pionPlusMomentum },
      { type: 'pionMinus', angle: pionMinusAngle, momentum: pionMinusMomentum }
    )
  }

  for (const config of pionConfigs) {
    const pionType = config.type
    const particle = PARTICLE_TYPES[pionType]
    const momentum = config.momentum

    // Pion emission angle from collision point
    const angle = config.angle
    
    // Curved track for pions
    // More pions sharing the available energy ⇒ each has lower momentum and
    // should describe a smaller arc (tighter curvature / shorter visible path).
    // We approximate this by shrinking both radius and arc length as the number
    // of pion pairs increases.
    const baseRadius = randomBetween(0.15, 0.35) * (10 / momentum)
    const radiusScale = 1 / numPionPairs
    const radius = baseRadius * radiusScale
    const baseLength = randomBetween(0.3, 0.6)
    const length = baseLength * radiusScale

    // All pions decay into muons
    let decayPoint: { x: number; y: number } | undefined
    let decayProducts: ParticleTrack['decayProducts']
    
    // Calculate decay point at the end of the curved pion track
    // The track is a curved arc, so we need to find where it ends
    const startX = collisionPoint.x
    const startY = collisionPoint.y
    // Radius is normalized (0-1 range)
    const trackRadius = radius
    const trackLength = length
    const trackAngle = angle
    
    // Arc center (for curved tracks, center is offset from start)
    const centerX = startX - Math.cos(trackAngle) * trackRadius
    const centerY = startY - Math.sin(trackAngle) * trackRadius
    
    // End angle of the arc
    const endAngle = trackAngle + trackLength * Math.PI * 2
    
    // Decay point is at the end of the track
    decayPoint = {
      x: centerX + Math.cos(endAngle) * trackRadius,
      y: centerY + Math.sin(endAngle) * trackRadius,
    }

    // Generate muon decay products with momentum conservation
    // Pion decays: π⁻ → μ⁻ + ν̄μ or π⁺ → μ⁺ + νμ
    // Momentum conservation: p_π = p_μ + p_ν
    
    // Pion momentum vector direction (tangent to the track at decay point)
    // The arc center is at: centerX = startX - cos(angle) * radius
    // At the end point: position = centerX + cos(endAngle) * radius
    // The radius vector from center to end has direction = endAngle
    // The tangent (velocity) is perpendicular to the radius
    // For counterclockwise arc (charge >= 0, counterclockwise=true): tangent = endAngle + π/2
    // For clockwise arc (charge < 0, counterclockwise=false): tangent = endAngle - π/2
    // The sign convention: positive charge → counterclockwise → add π/2
    //                      negative charge → clockwise → subtract π/2
    const chargeSign = particle.charge < 0 ? -1 : 1  // Correct sign: negative = clockwise = subtract
    const pionDirection = endAngle + (chargeSign * Math.PI / 2)
    const pionMomentumX = momentum * Math.cos(pionDirection)
    const pionMomentumY = momentum * Math.sin(pionDirection)
    
    // Muon momentum (typically 30-50% of pion momentum in rest frame, but in lab frame can vary)
    // For simplicity, use 40-80% of pion momentum
    const muonMomentum = momentum * randomBetween(0.4, 0.8)
    
    // Muon direction: mostly forward along pion direction with small angular spread
    // This allows for realistic decay kinematics while keeping momentum conservation
    // Small variation (±0.1 radians ≈ ±6°) ensures neutrino goes in reasonable direction
    const muonAngle = pionDirection + randomBetween(-0.1, 0.1)
    const muonMomentumX = muonMomentum * Math.cos(muonAngle)
    const muonMomentumY = muonMomentum * Math.sin(muonAngle)
    
    // Calculate neutrino momentum to conserve momentum: p_ν = p_π - p_μ
    // This ensures exact momentum conservation: p_π = p_μ + p_ν
    const neutrinoMomentumX = pionMomentumX - muonMomentumX
    const neutrinoMomentumY = pionMomentumY - muonMomentumY
    const neutrinoMomentum = Math.sqrt(
      neutrinoMomentumX * neutrinoMomentumX + neutrinoMomentumY * neutrinoMomentumY
    )
    // Neutrino angle is the direction of the neutrino momentum vector
    // This is calculated from momentum conservation, so it's guaranteed to conserve momentum
    const pionNeutrinoAngle = Math.atan2(neutrinoMomentumY, neutrinoMomentumX)
    
    // Verify momentum conservation (for debugging - can remove later)
    // const totalPx = muonMomentumX + neutrinoMomentumX
    // const totalPy = muonMomentumY + neutrinoMomentumY
    // console.log(`Pion decay momentum check: p_π=(${pionMomentumX.toFixed(2)}, ${pionMomentumY.toFixed(2)}), p_μ+p_ν=(${totalPx.toFixed(2)}, ${totalPy.toFixed(2)})`)
    
    // Create muon track that will decay into electron/positron
    const muonLength = randomBetween(0.3, 0.5)
    const muonRadius = randomBetween(0.1, 0.25) * (15 / muonMomentum)
    
    // Calculate muon track end point for decay
    const muonEndAngle = muonAngle + muonLength * Math.PI * 2
    const muonCenterX = decayPoint.x - Math.cos(muonAngle) * muonRadius
    const muonCenterY = decayPoint.y - Math.sin(muonAngle) * muonRadius
    const muonDecayPoint = {
      x: muonCenterX + Math.cos(muonEndAngle) * muonRadius,
      y: muonCenterY + Math.sin(muonEndAngle) * muonRadius,
    }
    
    // Muon decays: μ⁻ → e⁻ + ν̄e + νμ or μ⁺ → e⁺ + νe + ν̄μ
    // Create electron/positron decay product based on muon charge
    const leptonAngle = muonEndAngle + randomBetween(0.3, 0.7)
    // From muon decay: two neutrinos (νe/ν̄e and νμ/ν̄μ)
    const muonNeutrino1Angle = muonEndAngle - randomBetween(0.3, 0.7)
    const muonNeutrino2Angle = muonEndAngle + Math.PI + randomBetween(-0.3, 0.3)
    
    decayProducts = [
      {
        color: '#4dabf7', // Muon color
        width: 2,
        angle: muonAngle,
        length: muonLength,
        radius: muonRadius,
        decayPoint: muonDecayPoint,
        leptonAngle: leptonAngle, // Electron or positron angle
        muonCharge: particle.charge, // Charge determines if it's e⁻ or e⁺
        muonMomentum: muonMomentum, // Store muon momentum for label info
        pionNeutrinoAngle: pionNeutrinoAngle, // Neutrino from pion decay
        muonNeutrino1Angle: muonNeutrino1Angle, // First neutrino from muon decay
        muonNeutrino2Angle: muonNeutrino2Angle, // Second neutrino from muon decay
      },
    ]

    const pionTrack: ParticleTrack = {
      name: particle.name,
      symbol: particle.symbol,
      particleType: particle.particleType,
      charge: particle.charge,
      momentum,
      origin: collisionPoint,
      type: 'curved',
      color: particle.color,
      width: particle.width,
      radius,
      angle,
      length,
      turns: undefined,
      decayPoint,
      decayProducts,
      description: particle.description,
      trackNumber: trackCounter++,
    }

    tracks.push(pionTrack)
  }

  // Add one neutral pion π⁰ that decays almost instantly into γ + e⁺ + e⁻
  // with 80% probability
  if (Math.random() < 0.8) {
    const pi0Momentum = totalIncomingMomentum * 0.1
    const pi0Angle = baseAngle + randomBetween(-Math.PI / 12, Math.PI / 12)
    // Slightly longer so decay is visually separated from vertex
    const pi0Length = 0.08 // Still short, but not on top of the collision point

    const pi0DecayPoint = {
      x: collisionPoint.x + Math.cos(pi0Angle) * pi0Length,
      y: collisionPoint.y + Math.sin(pi0Angle) * pi0Length,
    }

    const pi0Track: ParticleTrack = {
      name: PARTICLE_TYPES.pionZero.name,
      symbol: PARTICLE_TYPES.pionZero.symbol,
      particleType: PARTICLE_TYPES.pionZero.particleType,
      charge: 0,
      momentum: pi0Momentum,
      origin: collisionPoint,
      type: 'straight',
      color: PARTICLE_TYPES.pionZero.color,
      width: PARTICLE_TYPES.pionZero.width,
      radius: undefined,
      angle: pi0Angle,
      length: pi0Length,
      turns: undefined,
      decayPoint: pi0DecayPoint,
      decayProducts: undefined,
      description: PARTICLE_TYPES.pionZero.description,
      trackNumber: trackCounter++,
    }
    tracks.push(pi0Track)

    // Photon (γ) from π⁰ decay - subtle straight track
    const gammaAngle = pi0Angle + randomBetween(-Math.PI / 8, Math.PI / 8)
    const gammaLength = 0.25
    const gammaTrack: ParticleTrack = {
      name: PARTICLE_TYPES.gamma.name,
      symbol: PARTICLE_TYPES.gamma.symbol,
      particleType: PARTICLE_TYPES.gamma.particleType,
      charge: 0,
      momentum: pi0Momentum * 0.3,
      origin: pi0DecayPoint,
      type: 'straight',
      color: PARTICLE_TYPES.gamma.color,
      width: PARTICLE_TYPES.gamma.width,
      radius: undefined,
      angle: gammaAngle,
      length: gammaLength,
      turns: undefined,
      decayPoint: undefined,
      decayProducts: undefined,
      description: PARTICLE_TYPES.gamma.description,
    }
    tracks.push(gammaTrack)

    // e⁻ and e⁺ pair from photon conversion / π⁰ decay, starting near the π⁰ decay point
    const pairSeparation = 0.015
    const pairOrigin = {
      x: pi0DecayPoint.x + Math.cos(gammaAngle) * pairSeparation,
      y: pi0DecayPoint.y + Math.sin(gammaAngle) * pairSeparation,
    }

    const electronMomentum = pi0Momentum * 0.25
    const positronMomentum = pi0Momentum * 0.25
    const electronRadius = randomBetween(0.05, 0.09)
    const positronRadius = randomBetween(0.05, 0.09)

    // Desired initial directions (tangents) for e⁻ and e⁺, roughly along
    // the photon direction but opening in opposite directions
    const eMinusDir = gammaAngle - Math.PI / 3
    const ePlusDir = gammaAngle + Math.PI / 3

    // For shrinking spirals, the baseAngle in drawSpiral controls the radius
    // vector; the tangent (initial momentum) is perpendicular to that.
    // For handedness = (charge<0 ? -1 : 1):
    //   tangentDir = baseAngle + handedness * π/2
    // so baseAngle = desiredDir - handedness * π/2.
    const eMinusHandedness = -1 // charge < 0
    const ePlusHandedness = 1   // charge > 0
    const eMinusBaseAngle = eMinusDir - eMinusHandedness * (Math.PI / 2)
    const ePlusBaseAngle = ePlusDir - ePlusHandedness * (Math.PI / 2)

    const eMinusTrack: ParticleTrack = {
      name: PARTICLE_TYPES.electron.name,
      symbol: PARTICLE_TYPES.electron.symbol,
      particleType: PARTICLE_TYPES.electron.particleType,
      charge: PARTICLE_TYPES.electron.charge,
      momentum: electronMomentum,
      origin: pairOrigin,
      type: 'spiral',
      color: PARTICLE_TYPES.electron.color,
      width: PARTICLE_TYPES.electron.width,
      radius: electronRadius,
      // Base angle chosen so that the *tangent* at the decay point matches
      // the desired kick direction (eMinusDir). Spiral then shrinks inward.
      angle: eMinusBaseAngle,
      shrinkSpiral: true,
      length: undefined,
      turns: 3,
      decayPoint: undefined,
      decayProducts: undefined,
      description: PARTICLE_TYPES.electron.description,
      trackNumber: trackCounter++,
    }

    const ePlusTrack: ParticleTrack = {
      name: PARTICLE_TYPES.positron.name,
      symbol: PARTICLE_TYPES.positron.symbol,
      particleType: PARTICLE_TYPES.positron.particleType,
      charge: PARTICLE_TYPES.positron.charge,
      momentum: positronMomentum,
      origin: pairOrigin,
      type: 'spiral',
      color: PARTICLE_TYPES.positron.color,
      width: PARTICLE_TYPES.positron.width,
      radius: positronRadius,
      // Tangent at the decay point matches ePlusDir
      angle: ePlusBaseAngle,
      shrinkSpiral: true,
      length: undefined,
      turns: 3,
      decayPoint: undefined,
      decayProducts: undefined,
      description: PARTICLE_TYPES.positron.description,
      trackNumber: trackCounter++,
    }

    tracks.push(eMinusTrack, ePlusTrack)
  }

  return tracks
}

