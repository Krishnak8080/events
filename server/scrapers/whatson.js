/**
 * What's On Sydney Scraper
 * Scrapes events from the City of Sydney's What's On page
 */
const axios = require('axios');
const cheerio = require('cheerio');
const Event = require('../models/Event');

const SOURCE_NAME = "What's On Sydney";
const SOURCE_URL = 'https://whatson.cityofsydney.nsw.gov.au/events';

/**
 * Scrape events from What's On Sydney
 * @returns {Array} Array of scraped event objects
 */
const scrapeWhatsOn = async () => {
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

        // What's On Sydney event card selectors
        $('.card, .event-card, [class*="EventCard"], article').each((i, el) => {
            const card = $(el);
            const title =
                card.find('h2, h3, .card-title, [class*="title"]').first().text().trim();
            const dateTime =
                card.find('time, .date, [class*="date"], .event-date').first().text().trim();
            const venue =
                card.find('.location, .venue, [class*="location"], [class*="venue"]').first().text().trim();
            const description =
                card.find('.summary, .description, p, [class*="description"]').first().text().trim();
            const imageUrl =
                card.find('img').first().attr('src') || card.find('[style*="background-image"]').first().attr('style')?.match(/url\(["']?(.+?)["']?\)/)?.[1] || '';
            let sourceUrl = card.find('a').first().attr('href') || '';
            const category =
                card.find('.category, .tag, [class*="category"]').first().text().trim() || 'City Event';

            if (title && sourceUrl) {
                events.push({
                    title,
                    dateTime: dateTime || 'TBA',
                    venueName: venue || 'Sydney',
                    venueAddress: '',
                    city: 'Sydney',
                    description: description || `Sydney Event: ${title}`,
                    category,
                    imageUrl: imageUrl.startsWith('http')
                        ? imageUrl
                        : imageUrl
                            ? `https://whatson.cityofsydney.nsw.gov.au${imageUrl}`
                            : '',
                    sourceName: SOURCE_NAME,
                    sourceUrl: sourceUrl.startsWith('http')
                        ? sourceUrl
                        : `https://whatson.cityofsydney.nsw.gov.au${sourceUrl}`,
                });
            }
        });

        console.log(`  ✅ Found ${events.length} events from ${SOURCE_NAME}`);
    } catch (error) {
        console.error(`  ❌ Error scraping ${SOURCE_NAME}: ${error.message}`);
    }

    return events;
};

module.exports = scrapeWhatsOn;
