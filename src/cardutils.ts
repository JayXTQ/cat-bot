import cards from './jsons/cards.json'
import sharp from 'sharp'
import { getBuffer } from "./utils";
import { createCanvas } from 'canvas'

export function getCard() {
    const card = cards[Math.floor(Math.random() * cards.length)]

    return {
        ...card,
        index: cards.indexOf(card)
    }
}

export function getCardByIndex(index: number) {
    return cards[index]
}

export type Cards = {
    index: number
    origin: string
    name: string
    text: string
    image_url: string
    quality: number
}[]


export function get3Cards() {
    const cards_: Cards = []
    for(let i = 0; i < 3; i++) {
        const card = {
            ...getCard(),
            quality: Math.floor(Math.random() * 5) + 1
        }
        if(cards_.find(c => c.index === card.index)) i--
        else cards_.push(card)
    }
    return cards_
}

async function createTextBuffer(text: string, width: number, height: number) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.font = '30px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    context.fillText(text, width / 2, height / 2);

    return canvas.toBuffer();
}

export async function generateCard(card: Cards[0]) {
    const image = sharp(await getBuffer(card.image_url))
        .resize({
            width: 400,
            height: 600,
            fit: "cover",
            withoutEnlargement: true,
        })
    const metadata = await image.metadata()

    const topText = await createTextBuffer(card.name, metadata.width!, 50)
    const bottomText = await createTextBuffer(card.text, metadata.width!, 50)

    return await image.composite([
        {
            input: topText,
            top: 0,
            left: 0,
        },
        {
            input: bottomText,
            top: metadata.height! - 50,
            left: 0,
        }
    ]).extend({
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        }).toBuffer()
}

export async function cardGrid(cards: Cards) {
    const area = sharp({
        create: {
            width: 1500,
            height: 1000,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })

    const cards_ = await Promise.all(cards.map(async (card) => {
        return await generateCard(card)
    }))

    return await area.composite(cards_.map((card, index) => ({
        input: card,
        top: 200,
        left: (index % 3) * 400
    }))).toBuffer()
}