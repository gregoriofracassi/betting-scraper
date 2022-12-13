import { CommonUtils } from "../../utils/common.js"

// odds param example [
//     {one: Number, provider: String},
//     {x: Number, provider: String},
//     {two: Number, provider: String},
// ]
const calculateArb = (odds) => {
    const possibility = odds.reduce((acc, val, ind) => acc + 1 / val[CommonUtils.odds_keys[ind]], 0)
    if (possibility < 1) {
        const win_percentage = 100 / possibility - 100
        const one = odds.find((line) => line.one)
        const x = odds.find((line) => line.x)
        const two = odds.find((line) => line.two)
        return {
            one: {
                value: one.one,
                provider: one.provider
            },
            x: {
                value: x.x,
                provider: x.provider
            },
            two: {
                value: two.two,
                provider: two.provider
            },
            win_percentage,
        }
    } else {
        return false
    }
}

const findGameArbs = async (arr) => {
    const result = []
    const final_result = []
    const addElement = (solution) => {
        if (solution.length > 2) {
          result.push(solution)
          return
        }
        arr.forEach((el) => {
            addElement([...solution, el])
        }) 
    }
    addElement([])
    
    result.forEach((arr) => {
        const betting_line = arr.map((el, ind) => {
            const obj = {
                provider: el.provider
            }
            obj[CommonUtils.odds_keys[ind]] = el[CommonUtils.odds_keys[ind]]
            return obj
        })
        const arb = calculateArb(betting_line)
        if (arb) {
            final_result.push(arb)
        }
    })
    return final_result
}

export const ArbService = {
    findGameArbs
}