export const clickElement = async (page, selector) => {
    const element = await page.waitForSelector(selector)
    if (element) {
        element.click()
    }
}