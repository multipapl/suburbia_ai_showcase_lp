/**
 * Cloudinary Asset Sync Script
 * 
 * Fetches assets from Cloudinary folders (Stage_1 to Stage_7) and updates
 * workflowConfig.json with the corresponding media URLs.
 * 
 * Usage: node scripts/sync-cloudinary.js
 */

import 'dotenv/config';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Folder mapping: Cloudinary folder path -> Stage ID or SubStage ID
// Only Scenario A folders are defined here - Scenario B (_B suffix) is auto-detected
const FOLDER_MAPPING = {
    'samples/SubAIShowcase/Stage_1': { stageId: 1 },
    'samples/SubAIShowcase/Stage_2': { stageId: 2 },
    'samples/SubAIShowcase/Stage_3': { stageId: 3 },
    'samples/SubAIShowcase/Stage_3_1': { stageId: 3, subStageId: '3.1' },
    'samples/SubAIShowcase/Stage_3_2': { stageId: 3, subStageId: '3.2' },
    'samples/SubAIShowcase/Stage_4': { stageId: 4 },
    'samples/SubAIShowcase/Stage_5': { stageId: 5 },
    'samples/SubAIShowcase/Stage_6': { stageId: 6 },
    'samples/SubAIShowcase/Stage_7': { stageId: 7 }
};

// Base path for Cloudinary folders
const CLOUDINARY_BASE_PATH = 'samples/SubAIShowcase';

// Video file extensions
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

/**
 * Fetch all assets from a Cloudinary folder
 */
async function fetchFolderAssets(folderName) {
    try {
        const results = [];
        let nextCursor = null;

        do {
            const response = await cloudinary.v2.search
                .expression(`folder:${folderName}`)
                .sort_by('public_id', 'asc')
                .max_results(100)
                .next_cursor(nextCursor)
                .execute();

            results.push(...response.resources);
            nextCursor = response.next_cursor;
        } while (nextCursor);

        return results;
    } catch (error) {
        console.error(`Error fetching folder ${folderName}:`, error.message);
        return [];
    }
}

/**
 * Get base secure URL (without transformations - SmartMedia handles those)
 */
function getBaseUrl(resource) {
    // Use secure_url as base, SmartMedia will apply transformations
    return resource.secure_url;
}

/**
 * Check if asset is a video
 */
function isVideoAsset(resource) {
    const url = resource.secure_url.toLowerCase();
    return VIDEO_EXTENSIONS.some(ext => url.includes(ext)) || resource.resource_type === 'video';
}

/**
 * Main sync function
 */
async function syncCloudinaryAssets() {
    console.log('🚀 Starting Cloudinary Asset Sync...\n');
    console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log('─'.repeat(50));

    // Read current config
    const configPath = path.resolve(__dirname, '../src/data/workflowConfig.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const summary = [];

    // ============================================
    // Process each folder (A and auto-detect B)
    // ============================================

    for (const [folderName, mapping] of Object.entries(FOLDER_MAPPING)) {
        const { stageId, subStageId } = mapping;

        // Derive the _B folder name from the A folder
        const folderBaseName = folderName.split('/').pop(); // e.g., "Stage_3_1"
        const folderBName = `${CLOUDINARY_BASE_PATH}/${folderBaseName}_B`;

        console.log(`\n📁 Processing ${folderBaseName}...`);

        // ---- Fetch Scenario A assets ----
        const assetsA = await fetchFolderAssets(folderName);
        const imagesA = assetsA.filter(a => !isVideoAsset(a));
        const videosA = assetsA.filter(a => isVideoAsset(a));
        // Combine: images first, then videos at the end
        const mediaUrlsA = [...imagesA.map(getBaseUrl), ...videosA.map(getBaseUrl)];

        // ---- Fetch Scenario B assets (auto-detect _B folder) ----
        const assetsB = await fetchFolderAssets(folderBName);
        const imagesB = assetsB.filter(a => !isVideoAsset(a));
        const videosB = assetsB.filter(a => isVideoAsset(a));
        // Combine: images first, then videos at the end
        let mediaUrlsB = [...imagesB.map(getBaseUrl), ...videosB.map(getBaseUrl)];

        // Fallback: if B folder is empty, use A data
        const useFallback = assetsB.length === 0 && assetsA.length > 0;
        if (useFallback) {
            mediaUrlsB = [...mediaUrlsA];
        }

        // ---- Log results ----
        if (assetsA.length === 0) {
            console.log(`   ⚠️  Scenario A: No assets found`);
        } else {
            console.log(`   ✅ Scenario A: ${imagesA.length} images, ${videosA.length} videos`);
        }

        if (assetsB.length > 0) {
            console.log(`   ✅ Scenario B: ${imagesB.length} images, ${videosB.length} videos`);
        } else if (useFallback) {
            console.log(`   ⚡ Scenario B: Using fallback from A`);
        } else {
            console.log(`   ⚠️  Scenario B: No assets (no fallback available)`);
        }

        // ---- Update config ----
        const stage = config.stages.find(s => s.id === stageId);

        if (stage) {
            if (subStageId) {
                // Update scenarioA subStage
                if (stage.scenarioA && stage.scenarioA.subStages) {
                    const subStageA = stage.scenarioA.subStages.find(ss => ss.id === subStageId);
                    if (subStageA && mediaUrlsA.length > 0) {
                        subStageA.mediaUrls = mediaUrlsA;
                        subStageA.mediaUrl = mediaUrlsA[0];
                    }
                }
                // Update scenarioB subStage
                if (stage.scenarioB && stage.scenarioB.subStages) {
                    const subStageB = stage.scenarioB.subStages.find(ss => ss.id === subStageId);
                    if (subStageB && mediaUrlsB.length > 0) {
                        subStageB.mediaUrls = mediaUrlsB;
                        subStageB.mediaUrl = mediaUrlsB[0];
                    }
                }
            } else {
                // Update main stage mediaUrls (Scenario A)
                // Videos are included at the end of mediaUrls
                if (mediaUrlsA.length > 0) {
                    stage.mediaUrls = mediaUrlsA;
                    stage.mediaUrl = mediaUrlsA[0];
                }

                // For Stage 3 (Fork), also update headerMediaUrls in scenarioA/B
                if (stage.isFork) {
                    if (stage.scenarioA && mediaUrlsA.length > 0) {
                        stage.scenarioA.headerMediaUrls = mediaUrlsA;
                        stage.scenarioA.headerMediaUrl = mediaUrlsA[0];
                    }
                    if (stage.scenarioB && mediaUrlsB.length > 0) {
                        stage.scenarioB.headerMediaUrls = mediaUrlsB;
                        stage.scenarioB.headerMediaUrl = mediaUrlsB[0];
                    }
                }

                // For Stage 6 (Animation), mark as animated if has videos
                if (stageId === 6 && videosA.length > 0) {
                    stage.isAnimated = true;
                    // Use first image as poster if available
                    if (imagesA.length > 0) {
                        stage.posterUrl = getBaseUrl(imagesA[0]);
                    }
                }
            }
        }

        // ---- Summary entries ----
        summary.push({
            folder: folderBaseName,
            stageId,
            subStageId: subStageId || null,
            scenario: 'A',
            count: assetsA.length,
            images: imagesA.length,
            videos: videosA.length,
            fallback: false
        });

        summary.push({
            folder: `${folderBaseName}_B`,
            stageId,
            subStageId: subStageId || null,
            scenario: 'B',
            count: useFallback ? mediaUrlsB.length : assetsB.length,
            images: useFallback ? imagesA.length : imagesB.length,
            videos: useFallback ? videosA.length : videosB.length,
            fallback: useFallback
        });
    }

    // Write updated config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log('\n' + '─'.repeat(50));
    console.log('✅ workflowConfig.json updated successfully!\n');

    // Print summary
    console.log('📊 SYNC SUMMARY:');
    console.log('─'.repeat(70));
    console.log('Stage | Scenario | SubStage | Images | Videos | Fallback');
    console.log('─'.repeat(70));

    let totalAssets = 0;
    summary.forEach(s => {
        const images = s.images || 0;
        const videos = s.videos || 0;
        const subStage = s.subStageId || '  -  ';
        const fallback = s.fallback ? '  ✓  ' : '  -  ';
        console.log(`  ${s.stageId}   |    ${s.scenario}     |  ${subStage}   |   ${String(images).padStart(3)}  |   ${String(videos).padStart(3)}  | ${fallback}`);
        totalAssets += s.count;
    });

    console.log('─'.repeat(70));
    console.log(`Total assets synced: ${totalAssets}`);
    console.log('\n🎉 Done!\n');
}

// Run sync
syncCloudinaryAssets().catch(console.error);
