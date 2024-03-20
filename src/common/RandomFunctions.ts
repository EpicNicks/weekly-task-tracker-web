import { match } from 'ts-pattern'

export function randomInt(min: number, max: number, inclusive: boolean = true) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled + (inclusive ? 1 : 0)) + minCeiled)
}

const randomRgbaPart = () => randomInt(0, 255)
const randomHexPart = () => randomInt(0, 255).toString(16).padEnd(2, '0')

export function randomRgbColor(style: 'rgb' | 'hex' | 'hsl' = 'hex') {
    return match(style)
        .with('hex', () => `#${randomHexPart()}${randomHexPart()}${randomHexPart()}`)
        .with('rgb', () => `rgb(${randomRgbaPart()}, ${randomRgbaPart()}, ${randomRgbaPart()})`)
        .with('hsl', () => `hsl(${randomInt(1, 360)}, ${randomInt(0, 100)}%, ${randomInt(0, 100)}%)`)
        .exhaustive()
}

export function randomRgbaColor(style: 'rgb' | 'hex' | 'hsl' = 'hex') {
    return match(style)
        .with('hex', () => `#${randomHexPart()}${randomHexPart()}${randomHexPart()}${randomHexPart()}`)
        .with('rgb', () => `rgb(${randomRgbaPart()}, ${randomRgbaPart()}, ${randomRgbaPart()}, ${randomRgbaPart()})`)
        .with('hsl', () => `hsl(${randomInt(1, 360)}, ${randomInt(0, 100)}%, ${randomInt(0, 100)}%, ${Math.random()})`)
        .exhaustive()
}