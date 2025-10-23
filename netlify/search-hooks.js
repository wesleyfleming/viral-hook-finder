// Netlify serverless function to search for viral hooks
const SAMPLE_HOOKS_DB = {
    "fitness": [
        {
            "platform": "instagram",
            "url": "https://instagram.com/reel/example1",
            "views": 450000,
            "likes": 35000,
            "comments": 890,
            "engagement_rate": 7.97,
            "date": "2024-10-15",
            "caption": "What if I told you this one exercise burns more fat than running?",
            "owner": "fitness_expert",
            "hook_transcript": "What if I told you this one exercise burns more fat than running?",
            "patterns": ["question", "curiosity_gap", "shocking_stat"],
            "emotional_trigger": "curiosity",
            "urgency_score": 2,
            "curiosity_score": 8
        },
        {
            "platform": "tiktok",
            "url": "https://tiktok.com/@user/video/123",
            "views": 780000,
            "likes": 95000,
            "comments": 2100,
            "engagement_rate": 12.44,
            "date": "2024-10-18",
            "caption": "Stop wasting money on supplements",
            "owner": "fitcoach_official",
            "hook_transcript": "Stop wasting money on supplements. Here's what actually works",
            "patterns": ["urgency", "problem_agitation", "curiosity_gap"],
            "emotional_trigger": "frustration",
            "urgency_score": 9,
            "curiosity_score": 7
        }
    ],
    "marketing": [
        {
            "platform": "instagram",
            "url": "https://instagram.com/reel/marketing1",
            "views": 385000,
            "likes": 31000,
            "comments": 920,
            "engagement_rate": 8.29,
            "date": "2024-10-16",
            "caption": "The email marketing mistake costing you thousands",
            "owner": "marketing_pro",
            "hook_transcript": "The email marketing mistake that's costing you thousands every month",
            "patterns": ["problem_agitation", "shocking_stat", "curiosity_gap"],
            "emotional_trigger": "fear",
            "urgency_score": 8,
            "curiosity_score": 9
        }
    ]
};

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const params = event.queryStringParameters || {};
        const niche = (params.niche || 'fitness').toLowerCase();
        const platform = (params.platform || 'all').toLowerCase();
        const minViews = parseInt(params.minViews) || 0;
        
        console.log('Search request:', { niche, platform, minViews });

        let hooks = SAMPLE_HOOKS_DB[niche] || SAMPLE_HOOKS_DB['fitness'];

        if (platform !== 'all') {
            hooks = hooks.filter(h => h.platform.toLowerCase() === platform);
        }

        hooks = hooks.filter(h => h.views >= minViews);
        hooks.sort((a, b) => b.views - a.views);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                niche: niche,
                platform: platform,
                count: hooks.length,
                hooks: hooks,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
