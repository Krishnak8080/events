/**
 * Cron Scheduler — Automated Event Scraping
 * Runs all scrapers on a configurable schedule using node-cron
 */
const cron = require('node-cron');
const Event = require('../models/Event');
const scrapeEventbrite = require('../scrapers/eventbrite');
const scrapeMeetup = require('../scrapers/meetup');
const scrapeWhatsOn = require('../scrapers/whatson');

/**
 * Process scraped events: upsert into MongoDB with status tracking
 * - New events → status: "new"
 * - Changed events → status: "updated"
 * - Missing events → status: "inactive"
 */
const processScrapedEvents = async (scrapedEvents, sourceName) => {
    const now = new Date();
    const scrapedUrls = new Set();
    let newCount = 0;
    let updatedCount = 0;

    for (const event of scrapedEvents) {
        scrapedUrls.add(event.sourceUrl);

        try {
            const existing = await Event.findOne({ sourceUrl: event.sourceUrl });

            if (!existing) {
                // ── New event: insert with status "new" ──
                await Event.create({
                    ...event,
                    status: 'new',
                    lastScraped: now,
                });
                newCount++;
            } else {
                // ── Existing event: compare key fields for changes ──
                const hasChanged =
                    existing.title !== event.title ||
                    existing.dateTime !== event.dateTime ||
                    existing.venueName !== event.venueName ||
                    existing.description !== event.description;

                if (hasChanged) {
                    await Event.findByIdAndUpdate(existing._id, {
                        ...event,
                        status: 'updated',
                        lastScraped: now,
                    });
                    updatedCount++;
                } else {
                    // Just update the lastScraped timestamp
                    await Event.findByIdAndUpdate(existing._id, { lastScraped: now });
                }
            }
        } catch (error) {
            // Skip duplicates from race conditions
            if (error.code !== 11000) {
                console.error(`  ⚠️ Error processing event: ${event.title} — ${error.message}`);
            }
        }
    }

    // ── Mark events no longer found on source as "inactive" ──
    const inactiveResult = await Event.updateMany(
        {
            sourceName,
            sourceUrl: { $nin: Array.from(scrapedUrls) },
            status: { $nin: ['inactive', 'imported'] }, // Don't overwrite imported status
        },
        { status: 'inactive' }
    );

    console.log(
        `  📊 ${sourceName}: ${newCount} new, ${updatedCount} updated, ${inactiveResult.modifiedCount} inactive`
    );
};

/**
 * Run all scrapers and process results
 */
const runAllScrapers = async () => {
    console.log('\n═══════════════════════════════════════');
    console.log('🚀 Starting scheduled scrape run...');
    console.log(`⏰ ${new Date().toISOString()}`);
    console.log('═══════════════════════════════════════');

    try {
        // Run all scrapers in parallel
        const [eventbriteEvents, meetupEvents, whatsOnEvents] = await Promise.all([
            scrapeEventbrite(),
            scrapeMeetup(),
            scrapeWhatsOn(),
        ]);

        // Process results sequentially to avoid race conditions
        await processScrapedEvents(eventbriteEvents, 'Eventbrite');
        await processScrapedEvents(meetupEvents, 'Meetup');
        await processScrapedEvents(whatsOnEvents, "What's On Sydney");

        const totalEvents = await Event.countDocuments();
        console.log(`\n✅ Scrape complete. Total events in database: ${totalEvents}`);
    } catch (error) {
        console.error(`❌ Scrape run failed: ${error.message}`);
    }
};

/**
 * Start the cron job scheduler
 * @param {string} schedule - Cron expression (default: every 6 hours)
 */
const startScheduler = (schedule = '0 */6 * * *') => {
    console.log(`📅 Cron scheduler started: "${schedule}"`);

    cron.schedule(schedule, () => {
        runAllScrapers();
    });

    // Also run immediately on startup
    console.log('🔄 Running initial scrape...');
    runAllScrapers();
};

module.exports = { startScheduler, runAllScrapers };
