/**
 * Eventbrite Sydney Scraper
 * Scrapes events from Eventbrite's Sydney events page
 */
const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

const SOURCE_NAME = 'Eventbrite';
const SOURCE_URL = 'https://www.eventbrite.com.au/d/australia--sydney/events/';

/**
 * Scrape events from Eventbrite Sydney
 * @returns {Array} Array of scraped event objects
 */
const scrapeEventbrite = async () => {
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

        // Eventbrite event cards — selectors may change over time
        $('[data-testid="event-card"], .discover-search-desktop-card, .eds-event-card-content__content').each(
            (i, el) => {
                const card = $(el);
                const title =
                    card.find('[data-testid="event-card-title"], .eds-event-card-content__primary-content a, h2, h3').first().text().trim();
                const dateTime =
                    card.find('[data-testid="event-card-date"], .eds-text-bs--fixed, p').first().text().trim();
                const venue =
                    card.find('[data-testid="event-card-location"], .card-text--truncated__one').first().text().trim();
                const description = card.find('.eds-text-bs, .event-card__description').first().text().trim();
                const imageUrl = card.find('img').first().attr('src') || '';
                const sourceUrl = card.find('a[href*="eventbrite"]').first().attr('href') || '';
                const category = card.find('.eds-text-color--ui-600, .tag').first().text().trim() || 'General';

                if (title && sourceUrl) {
                    events.push({
                        title,
                        dateTime: dateTime || 'TBA',
                        venueName: venue || 'TBA',
                        venueAddress: '',
                        city: 'Sydney',
                        description: description || `Event: ${title}`,
                        category,
                        imageUrl,
                        sourceName: SOURCE_NAME,
                        sourceUrl: sourceUrl.startsWith('http')
                            ? sourceUrl
                            : `https://www.eventbrite.com.au${sourceUrl}`,
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

module.exports = scrapeEventbrite;
