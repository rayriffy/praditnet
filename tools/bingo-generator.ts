import fs from 'fs'
import path from 'path'

import puppeteer from 'puppeteer'

import { TaskQueue } from 'cwait'

const renderQueue = new TaskQueue(Promise, 6)

/**
 * Usage:
 * node -r @swc-node/register tools/bingo-generator.ts <eventId> <gameId> <amount>
 */

const [amount, gameId, eventId] = process.argv.reverse()
const screenshotDirectory = path.join(
  __dirname,
  '../dist/bingo',
  eventId,
  gameId
)

if (!fs.existsSync(screenshotDirectory)) {
  fs.mkdirSync(screenshotDirectory, {
    recursive: true,
  })
}

;(async () => {
  console.log('launching puppeteer')
  // launch puppeteer
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 2000,
      height: 2000,
    },
  })

  // generate by order
  await Promise.all(
    Array.from({ length: Number(amount) }).map(
      renderQueue.wrap(async (_, i) => {
        console.log(`rendering bingo #${i + 1}`)

        const page = await browser.newPage()
        await page.goto(
          `http://localhost:3000/event/${eventId}/internal/bingo/${gameId}`,
          {
            waitUntil: 'networkidle0',
          }
        )

        const screenshot = await page.screenshot({
          type: 'png',
        })
        await fs.promises.writeFile(
          path.join(screenshotDirectory, `${i + 1}.png`),
          screenshot
        )
      })
    )
  )

  // cleanup
  await browser.close()
  console.log('done')
})()
