import cards from './jsons/cards.json'

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
        if(cards_.find(c => c.index === card.index)) {
            i--
            continue
        } else cards_.push(card)
    }
    return cards_
}