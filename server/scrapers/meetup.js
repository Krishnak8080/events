/**
 * Meetup Sydney Scraper
 * Scrapes events from Meetup's Sydney events page
 */
const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

const SOURCE_NAME = 'Meetup';
const SOURCE_URL = 'https://www.meetup.com/find/?location=au--Sydney&source=EVENTS';

/**
 * Scrape events from Meetup Sydney
 * @returns {Array} Array of scraped event objects
 */
const scrapeMeetup = async () => {
    console.log(`🔍 Scraping ${SOURCE_NAME}...`);
    const events = [];

    try {
        const { data: html } = await axios.get(SOURCE_URL, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            timeout: 15000,
        });

        const $ = cheerio.load(html);

        // Meetup event card selectors
        $('[data-testid="categoryResults-eventCard"], .eventCard, [id*="event-card"]').each(
            (i, el) => {
                const card = $(el);
                const title =
                    card.find('[data-testid="event-card-title"], h2, h3, .eventCardHead--title').first().text().trim();
                const dateTime =
                    card.find('time, [datetime], .eventTimeDisplay, .text--secondary').first().text().trim();
                const venue =
                    card.find('[data-testid="venue-name"], .venueDisplay, .text--small').first().text().trim();
                const description = card.find('.description, p').first().text().trim();
                const imageUrl = card.find('img').first().attr('src') || '';
                let sourceUrl = card.find('a[href*="meetup.com"]').first().attr('href') || '';
                const category = card.find('.groupTopic, .tag, .badge').first().text().trim() || 'Community';

                if (title && sourceUrl) {
                    events.push({
                        title,
                        dateTime: dateTime || 'TBA',
                        venueName: venue || 'Online / TBA',
                        venueAddress: '',
                        city: 'Sydney',
                        description: description || `Meetup: ${title}`,
                        category,
                        imageUrl,
                        sourceName: SOURCE_NAME,
                        sourceUrl: sourceUrl.startsWith('http')
                            ? sourceUrl
                            : `https://www.meetup.com${sourceUrl}`,
                    });
                }
            }
        );

        console.log(`  ✅ Found ${events.length} events from ${SOURCE_NAME}`);
    } catch (error) {
        console.error(`  ❌ Error scraping ${SOURCE_NAME}: ${error.message}`);
    }

    return events;
};

module.exports = scrapeMeetup;
