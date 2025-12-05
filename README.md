# 🎼 Full Score - Web's Native Performance

<br />
<br />
<img width="1920" height="1080" alt="Full Score - OpenGraph" src="https://fullscore.org/wp-content/uploads/Full-Score-README.png" />
<br />
<br />

## Preface: When Will the Next Web Technology Appear?

Web technology today faces a paradox. Tools get heavier while insights diminish. Data explodes while privacy regulations tighten. AI claims to understand everything, yet data remains in forms AI struggles to read.

Web technology has been a history of addition. More features, more data, more layers of saturation. The result? We load megabytes of analytics and security scripts, manage dozens of servers, and battle endlessly expanding complexity.

Full Score takes a different approach. Instead of piling on more features, it keeps only what matters with 3KB (min+gzip) of code that proposes a new direction for analytics.

- **Serverless Analytics** with No API Endpoints & 90% Cost Reduction
- **Complete Cross-tab User Journey** Without Session Replay
- **Bot Security & Human Personalization** via Real-time Event Layer
- **BEAT Flows into AI Insights** as Linear Strings, No Semantic Parsing
- **GDPR-Conscious Architecture** with Zero Direct Identifiers

All of this is achieved by turning browsers into decentralized auxiliary databases.

```
Traditional Analytics: Browser → API → Raw Database → Queue (Kafka) → Processing (Spark) → Processed Database → Archive
⛔ 7 Steps, $1,000 – $5,000/month

Full Score: Browser ~ Edge → Archive
✅ 2 Steps, $50 – $500/month

// No API endpoints needed
// No Queue & Processing needed
// No Origin access required
```

If the technical explanations ever feel too heavy, skipping ahead to the Fifth Movement is perfectly fine. That section shows how everything comes together.

For a quick overview, check out the live demo: [https://fullscore.org](https://fullscore.org)

To see Full Score performing, follow along with the video on the Aidgn YouTube channel: [https://www.youtube.com/@aidgn](https://www.youtube.com/@aidgn)

<br />

## First Movement: Web Interactions Become Music

### Events on a Timeline

Web interactions are essentially an Air on the G String. Each user action, from page arrival through browsing and clicking to departure, unfolds along a timeline. This mirrors how musical notes are placed on a timeline.

The name Full Score symbolizes a musical score or composition. Just as a full score captures every moment of a performance, Full Score captures all Web interactions in one system.

At the core of Full Score is BEAT, introduced below. This project exists to demonstrate the concept and practical value of the Semantic Raw Format (SRF).

### Three Independent Yet Harmonious Technologies

Full Score consists of three independent technologies. Each is useful alone, yet more powerful together.

**TEMPO (Tap Event Method Performance Optimizer)** is a 50-line snippet that improves tap event speed and accuracy. Like an orchestra conductor synchronizing different instruments' tempos, it harmonizes mobile and desktop interactions. Without offbeats, every touch and click completes as a single note. While it provides immediate improvements standalone, when used with RHYTHM, it becomes a gateway for collecting user interaction data.

**RHYTHM (Real-time Hybrid Traffic History Monitor)** is a client-side engine that leverages users' browsers as auxiliary databases. Unlike traditional approaches which send, store, and process data on servers, RHYTHM embeds functionality directly in the browser. As a result, real-time analysis and immediate response occur at the browser and Edge layers without reaching the origin server. With BEAT at its core, this architecture reduces data transfer, server operation, and processing costs.

**BEAT (Behavioral Event Analytics Transform)** is a core structure for multi-dimensional event data, including the space where events occur, the time when actions occur, and the depth of each action, in linear sequences. These sequences express meaning without parsing (Semantic), preserve information in their original state (Raw), and maintain a fully organized structure (Format). Therefore, BEAT is the Semantic Raw Format (SRF) standard.

These three technologies are like a jazz trio where each solo performance is excellent, but together they create true harmony. Add Edge computing, and the quartet performs at its full potential.

<br />

## Second Movement: TEMPO - The Piano Tuner's Gift

### Two Different Instruments

Desktop clicks are like playing an electric piano. Press a key, sound comes instantly. Electrical signals travel to speakers without delay, and performers experience their intentions becoming music directly.

```
User click → mousedown → mouseup → click
```

Mobile touches are like playing a grand piano. Press a key and the hammers move, the strings are struck, and the dampers open. It’s a complex mechanical process. The system must interpret the touch’s intent. Was it a light tap? A scroll attempt? A zoom gesture? That takes time to determine.

```
User touch → touchstart → [touchmove]* → touchend → [event loop] → click
```

### Accumulation of Micro-Delays

The notorious 300ms delay in mobile browsers gradually disappeared in 2013. But micro-delays from event loops persist. Sometimes touches feel imprecise.

```javascript
// At touch end
touchend fires (T+0ms)
    ↓
// Added to event queue  
Click event added to task queue (T+1ms estimate)
    ↓
// Wait for current code to complete
JavaScript execution stack must clear (T+5ms estimate)
    ↓
// Next event loop turn
Event loop pulls click event from queue (T+15ms estimate)
    ↓
// Click handler executes
finally, click event processed (T+16ms estimate)
```

16ms seems small, but it's one frame at 60fps. Like a sixteenth note arriving late in music. One or two go unnoticed, but rapid sequences break the rhythm.

WebView environments are more complex. In-app browsers like Instagram or X pass through additional layers.

```
Native app layer
    ↓ (bridge communication ?ms)
WebView layer
    ↓ (event conversion ?ms)
JavaScript layer
    ↓ (event loop ?ms)
Final click processing
```

Through these complex layers, touch responsiveness degrades further. As touches accumulate, erroneous events can pile up. In severe cases, touches become completely unresponsive, like piano keys on a humid day that won't press or won't return.

### TEMPO's Tuning

TEMPO, like a piano tuner, standardizes every key's depth and response. It strives to create beautifully matched tempo across both desktop and mobile.

```javascript
// Traditional: Asynchronous chain
touchend → [queue] → [loop] → [wait] → click

// TEMPO: Direct execution
touchend → el.click()  // Synchronous immediate execution!
```

This simple tuning creates meaningful effects. Touches now bypass the event loop and execute immediately. Complex event handling logic becomes unnecessary.

Even when DOM changes rapidly with ad banners or lazy-loading UIs, post-touch delays disappear, improving accuracy.

But browsers still generate native clicks at their own tempo. TEMPO handles this offbeat elegantly.

```javascript
let once = true;
const block = (ev) => {
    if (once && ev.isTrusted) {								// Real browser-generated event
        ev.preventDefault();								// Block default action
        ev.stopImmediatePropagation();						// Stop propagation
        once = false;										// Block only once
        document.removeEventListener("click", block, true);	// Remove listener
        pending.delete(block);								// Remove from Set
    }
};
```

Like pressing the damper pedal at the perfect moment to eliminate unwanted resonance, TEMPO silently absorbs duplicate clicks.

### A 50-Line Score

TEMPO's entire code fits within 50 lines. Like Bach's Inventions, it creates music with minimal notes.

```javascript
function tempo(rhythm) { // Tap Event Method Performance Optimizer
	if (document.tempo) return;
	document.tempo = true;
	if ("ontouchstart" in window || navigator.maxTouchPoints > 0) { // Mobile environment detection
		const pending = new Set(); // Track pending native click blockers
		let moved = false;
		document.addEventListener("touchstart", () => {
			moved = false; for (const b of pending) document.removeEventListener("click", b, true); pending.clear(); // Reset moved
		}, {capture: true, passive: true});
		document.addEventListener("touchmove", () => moved = true, {capture: true, passive: true}); // Mark as moved
		document.addEventListener("touchcancel", () => moved = true, {capture: true, passive: true}); // Mark as cancelled
		document.addEventListener("touchend", (e) => {
			if (moved || !e.changedTouches?.[0]) return; // Skip if moved or no touch
			let once = true;
			const block = (ev) => { // Block native click once
				if (once && ev.isTrusted) {
					ev.preventDefault();
					ev.stopImmediatePropagation();
					once = false;
					document.removeEventListener("click", block, true);
					pending.delete(block);
				}
			};
			pending.add(block);
			document.addEventListener("click", block, {capture: true}); // Register blocker
			let el = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY); // Get target at touch point
			const label = el?.closest('label');
			el = label?.control || label?.querySelector('input,textarea,select,button') || el; // Get real target from label
			rhythm && rhythm.click(el); // Mobile RHYTHM integration
			if (el) for (let i = 0; i < 8; i++) { // Find clickable parent, max 8 levels
				if (typeof el.click === "function") {el.click(); break;} // Native click method
				if (el.onclick) {el.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true})); break;} // Onclick handler
				if (!(el = el.parentElement)) break; // Move to parent or exit
			}
		}, {capture: true, passive: true});
	} else { // Desktop environment detection
		let used = false; // Gesture already used
		document.addEventListener("mousedown", () => used = false, {capture: true}); // Reset on mouse down
		document.addEventListener("keydown", e => !e.repeat && (e.key === "Enter" || e.key === " ") && (used = false), {capture: true}); // Reset on Enter/Space
		document.addEventListener("click", e => {
			if (used) return; // Skip if already used
			used = true;
			rhythm && rhythm.click(e.target.closest('label')?.control || e.target); // Desktop RHYTHM integration
		}, {capture: true});
	}
}
tempo(); // Uncomment for standalone use
```

Each line performs a precise role. At touch or click start, it clears echoes from previous performances. It detects movement to distinguish scrolls from taps. At the end, it finds the exact element and executes the click. Special handling for Label elements adds accessibility harmony, and the 8-level fallback ensures the performance continues in any situation.

These 50 lines synchronize tempo across all devices. Like a perfectly tuned concert grand.

<br />

## Third Movement: RHYTHM - Music in the Browser

### The Browser Stage

Traditional Web analytics is complex like a massive symphony. Instruments for collecting data, transmitting data, storing data, and processing data all play separately. Each part operates independently, requiring enormous time and cost just to tune them.

RHYTHM is like a singer-songwriter's creative process. Starting the composition in a quiet room, building rhythms note by note on staff paper to complete a Full Score. Then taking that score to the streets to perform freely. The browser becomes the chosen stage, without interruptions.

Browsers have various storage options. sessionStorage is intimate like a small live venue but only open for one session. localStorage is accessible like a music hall but often faces entry restrictions. IndexedDB is massive like a stadium concert but requires professional sound engineers and stage crew.

The first-party cookie RHYTHM chose is like a singer-songwriter's street performance. All you need is one small stage. No fancy lights or sound equipment required. But there's one crucial feature: whenever you want, you can livestream your performance in real-time. Your reliable friend and manager, Edge computing, helps with the livestreaming.

```javascript
document.cookie = `rhythm_1=${data}; Max-Age=259200; Path=/`;
// Max-Age=259200 = Auto-delete after 3 days (actual RHYTHM.AGE value in code)
```

Like busking that leaves no trace when finished, cookies delete themselves after a few days. No performance permits needed, no teardown requests. Like the city's rhythm, it naturally begins and ends.

### RHYTHM Created by Data

RHYTHM stores session data like a rhythm composed of notes on a staff. Each note carries unique meaning.

```javascript
const rhythm_1 = {
	echo: 0,					// Performance status (0=performing, 1=storing, 2=archiving)
	time: 1735680000,			// Stage start time (synchronization reference for all tabs)
	hash: 'x7n4kb2p',			// Stage name (random string for data integrity)
	device: 1,					// Instrument type (0=desktop, 1=mobile, 2=tablet)
	referrer: 3,				// Performance spot (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
	scrolls: 23,				// Scroll gestures (passersby who stopped)
	clicks: 15,					// Click actions (audience engagement)
	duration: 300,				// Performance duration
	beat: "!home~10*button~"	// Performance record (BEAT format)
}
```

When stored in cookies, this data becomes a single line of sheet music separated by underscores (_).

```
// Private Mode (no direct identifiers)
"0_1735680000_x7n4kb2p_1_3_23_15_300_!home~10*button~"

// Full Private Mode (no direct/indirect identifiers)
"0___1_3_23_15_300_!home~10*button~"
```

A single line expresses an entire session. If JSON is conducting each orchestra section, RHYTHM is as concise as playing guitar tabs.

A singer-songwriter can manage multiple sessions simultaneously. For smooth performances, we recommend limiting to rhythm_1 through rhythm_7. New sessions are created when cookies fill up or when switching browser tabs. Limiting to 7 sessions prevents audience confusion from constantly changing setlists during one performance. Exceeding this number suggests noise pollution rather than pure busking, likely a bot signal.

Edge also has limits. Famous CDN/Edge networks typically set header size limits at 8-32 KB. While sufficient for streaming 4 KB cookie sessions, too many sessions risk disconnection. When performances run too long, livestreaming stops at the singer-songwriter's signal (echo=2). The performance data archives privately, then new streaming begins. This circular structure enables practically unlimited performances.

For its efforts, Edge only asks for coffee money, but may grumble if livestreaming restarts too frequently.

### Movement Orchestration

The movement cookie represents the overarching flow of the performance, guiding the entire browsing journey.

```javascript
movement=0000000000_1735680000_x7n4kb2p___1~2~1~3~2

// 0000000000  = Security/Personalization flags (first digit: bot level, rest: event flags)
// 1735680000  = Stage start time (synchronization reference for all tabs)
// x7n4kb2p    = Stage hash (random string for data integrity)
// 1~2~1~3~2   = Tab chain (also embedded in BEAT as addon: @---N)
```

This movement acts as the reference point for every performance (rhythm session). The first digit indicates bot dissonance levels, while the remaining nine digits serve as independent human harmony signals. Edge analyzes BEAT patterns to update these notes in real-time, introducing a new event analytics and security layer.

Each tab represents a different performance (rhythm session) on the same stage. All performances share the same stage time. When the singer-songwriter begins a new stage, all ongoing performances reset to that new time. This cookie-based synchronization keeps all separate performances as part of the same stage.

The tab chain (1~2~1~3~2) records the sequence as users switch between tabs. This also appears in BEAT strings as (@---N), precisely tracking tab movements. Full Score captures a single user's complete browsing journey, including all cross-tab flows.

### Livestreaming with Edge Computing

Edge is the singer-songwriter's reliable companion, an indispensable friend. When the singer-songwriter performs their RHYTHM, Edge livestreams it to nearby listeners.

The (/rhythm/) path is an internal signal route where Edge observes cookie headers, not an API endpoint for uploading data. You can also configure Full Score to send data directly to external endpoints if needed.

```javascript
// Live streaming handler - watches /rhythm/ path for real-time cookie resonance
if (url.pathname === "/rhythm" && url.searchParams.has("livestreaming")) {
    const match = scan(cookies); // Parse movement & rhythm cookies
    
    // Bot Security
    if (match.bot) {
        movement[0] = Math.min(+movement[0] + 1, 2);
        console.log('⛔ Bot: MachineGun:12 (level 3)');
    }
    
    // Human Personalization
    if (match.human) {
        movement[match.human] = '1';
        console.log('✅ Human: 0100000000 (flag 1 activated)');
    }
    
    // Only update cookie when values change (reduces network overhead)
    if (movement !== original) {
        return new Response(null, {
            status: 204,
            headers: {'Set-Cookie': `movement=${movement}; Path=/; Secure`}
        });
    }
}

// Batch archiving handler - collects completed performances
if (url.pathname === "/rhythm/echo" && request.method === "POST") {
    const sessions = await request.text(); // rhythm_1=2_time_hash_device...
    
    // Optional AI analysis of complete user journey
    if (ARCHIVING.AI && env.AI) {
        const analysis = await analyzeJourney(sessions);
        console.log('♪ Performance archived:', analysis);
    }
    
    return new Response('OK');
}
```

Edge analyzes every performance in real-time. The (/rhythm/?livestreaming) path monitors cookie resonance through HEAD requests, while (/rhythm/echo) archives completed performances. Bot patterns like MachineGun (rapid clicks), Metronome (exact intervals), or Surface (shallow DOM) trigger security flags. Human patterns activate event flags for personalization. If someone hesitates before purchasing, you could show them a coupon.

No API endpoints required. No separate analytics servers or central database queries needed. No Origin access required. The performance completes through the natural resonance between browser and Edge, fast and vivid. Processing delays are imperceptibly low.

A traditional concert hall would be different. Without complex broadcast equipment, without separate studios, street music spreads worldwide.

### Performance Techniques

RHYTHM first-party cookies are set to the root path (/) but are also accessible from the (/rhythm/) path. Leveraging this cookie characteristic, Edge resonates exclusively at the (/rhythm/) path. If Edge had resonated with the root path (/), it would suffer from all manner of noise. But at the (/rhythm/) path, it can enjoy RHYTHM's performance quietly and clearly.

An alternative variant of Full Score uses localStorage instead of cookies. This approach offers immediate data updates and generous capacity. However, since localStorage doesn't naturally resonate through HTTP headers as cookies do, it requires a semi-automatic trigger to create resonance for delta data at the (/rhythm/) path. The absence of auto-expiration and narrower browser support led to the cookie-based model becoming the primary release for its simplicity and universal compatibility.

RHYTHM uses the browser's cookies as small personal storage. With 100 million users, it's like having 100 million auxiliary databases. Each browser provides its own isolated execution environment, operating directly on devices without perceptible delay. For performance enhancement, HTTP/2 or HTTP/3 environments are recommended. Compression tables help cookies travel lighter.

The Full Score code contains playful techniques. The cookie-based lock mechanism uses leader-like coordination, a lightweight browser-local pattern inspired by distributed systems. The AbortController + keepalive:true combination reduces handling overhead and wait time while keeping performance stable and in resonance. The visibilitychange + blur + pagehide logic triggers batching only once upon browser exit, achieving extreme efficiency across both desktop and mobile.

Please explore the code comments for these implementation details.

<br />

## Fourth Movement: BEAT - Actions Become Performance

### Format for Recording Actions

BEAT expresses actions as a performance, letting them flow into rhythm.

```
!home~300*3input1~1200!1~50*buy
```

Listen to the story this short performance tells. A user takes the homepage (!home) stage, searches for products after 30 seconds of silence (*3input1). After enjoying content for 120 seconds, they modulate to the first mapped page (!1). Then in 5 seconds, they reach the climax with the purchase button (*buy).

### The Flow of Notation

BEAT records performance order as follows. Symbol assignments are customizable using any Printable ASCII (0x21 to 0x7E) characters. It is an expression system that represents the 5W1H structure through the space where events occur, the time when actions occur, and the depth of each action.

The notation below describes the official Web domain implementation. The BEAT (SRF) standard itself is domain-agnostic and can be applied to Finance, Game, Healthcare, IoT, Logistics, and other event-driven environments. Domains may adjust symbol assignments as long as they preserve the space where events occur, the time when actions occur, and the depth of each action. See Applications Across Domains in the Sixth Movement for examples.

**[ ! ] - Contextual Space (who)**
- !home: Overture (homepage reserved word)
- !a1b, !a1b2c: Songs designated by 3-5 character auto-generated hashes
- !en, !product: Other songs directly chosen by performer (user-mapped pages)

**[ ~ ] - Time Flow (when)**
- ~10: 1 second of breath
- ~250: 25 seconds of silence
- ~10/20/30: Repeated events compressed via Method (/)

**[ ^ ] - Position (where)**

**[ * ] - Action (what)**
- *3nav1: Plucking guitar's third string with first stroke (DOM depth + element type + index)
- *6button2: Plucking guitar's sixth string with second stroke
- *close, *modal: Special chords designated by composer (user-mapped elements)

**[ / ] - Method (how)**

**[ : ] - Value (why)**

BEAT delivers binary-level (1-byte scan) performance while preserving the human readability of a text sequence. BEAT defines six core tokens within an eight-state semantic layout, conceptually equivalent to a 3-bit encoding. Aligned with 5W1H, they fully capture the intent of human-designed systems while leaving two states for domain-specific extensions.

The underscore (_) is one example of an extension token used for serialization and to express meta fields, such as `_device:phone_beat:!page~10*button:small~15*menu`. These meta fields annotate BEAT sequences without altering their core grammar and preserve 1-byte scan performance.

In Web domains such as Full Score, the at sign (@) is used as an extension token. It links multiple BEAT sequences, including cross-tab transitions. Extension tokens can be used in a similar way for app instances, device clusters, or any other parallel sequences in other domains.

Hyphens (-) are not part of the extension states but can be used freely as flexible bind markers.

### Automatic Hash Generation and Mapping

Pre-mapping every page is difficult. BEAT generates automatic hashes using a lightweight hash algorithm (DJB2).

```javascript
function hashPage(pathname) {
    if (pathname === '/') return '!home';  // Homepage reserved word
    
    let hash = 5381;  // DJB2 algorithm
    for (let i = 0; i < pathname.length; i++) {
        hash = ((hash << 5) + hash) + pathname.charCodeAt(i);
    }
    
    // Dynamic hash length based on URL length
    const limit = pathname.length <= 7 ? 3 : pathname.length <= 14 ? 4 : 5;
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '', n = Math.abs(hash);
    
    // Base36 encoding
    for (let j = 0; j < limit; j++) {
        result += chars[n % 36];
        n = Math.floor(n / 36);
    }
    
    return '!' + result;
}
```

Examples:
- `/about` → `!a1b` (3-character hash)
- `/products` → `!a1b2` (4-character hash)
- `/products/laptop` → `!a1b2c` (5-character hash)

Users can compress BEAT further by mapping frequently visited pages and important elements.

```javascript
MAP: {				// Manual mapping (default: automatic)
	S: {					// Space map
		'/': 'home', 					// Homepage reserved word (result: !home)
		'/en/': 'home-en', 				// Multilingual homepage (result: !home-en)
		'/product/001': 'product-1',	// Product post (result: !product-1)
	},
	A: {					// Action map
		'#close-button': 'close',		// #id selector (result: *close)
		'.open-modal': 'm',				// .class selector (result: *m)
		'https://ex.com/': 'ex',		// Absolute URL in <a href> (result: *ex)
		'/english/': 'en',				// Relative URL in <a href> (result: *en)
		'*10div1': 'auto',				// BEAT auto-generated selector remap (result: *auto)
	}
}
```

Mapping effects:
- `/products/laptop/model-001` → `!plm1` (26 chars → 5 chars)
- `.product-grid > button.add-to-cart` → `*add` (34 chars → 4 chars)

### Aesthetics of Compression and Harmonics of Depth

BEAT's compression is like musical abbreviation. Repeated themes are written once with variations noted.

```javascript
// Regular
~100*button~150*button~200*button

// BEAT abbreviation
~100/150/200*button
```

This compression reduces hour-long sessions to about 1–3 KB of sheet music. If JSON is classical notation that requires understanding complex tonal relationships, BEAT is tab notation that embraces simple flow. It can be extended in various ways.

```javascript
// Default
!home~300*3input1~1200!page~50*buy

// Example 1: Token change only
@home>300#3input1>1200@page>50#buy

// Example 2: Add scroll events (^ records scroll position - can be enabled in BEAT)
!home^1200~300*3input1~1200!page^2400~50*buy

// Example 3: Shorter abbreviation (1-second units, minimized action symbols, precise mapping)
!~30*2~120!1~5*1
```

Despite these variations, the default form remains the ideal one. Here's why:

### Interpreting the Performance

BEAT transforms multi-dimensional event data of space, time, and action with depth into linear sequences. It compresses multidimensional logs into single strings that can be directly input into sequence models.

```
rhythm_1 = !home~300*3input1~1200!product~50*buy

Human interpretation:
"Let's see... homepage to product page, took about 3 minutes total."

AI interpretation:
User arrived at homepage and searched for products after 30 seconds.
Spent 2 minutes reviewing search results before navigating to the product
detail page. Made a purchase decision in just 5 seconds after arriving.
This shows a purposeful buyer who knew exactly what they wanted.
```

Traditional data formats, including JSON, are like dots. They're great for organizing and separating individual events, but understanding what story they tell requires parsing and interpretation.

BEAT is like a line. It's the same raw data level as JSON, but because user journey flows like music, the story becomes clear right away.

BEAT uses only Printable ASCII (0x21 to 0x7E) characters that pass smoothly through Edge and other security layers. No separate encoding or decoding is required, and because it's light enough to reside in the browser's native storage, it allows real-time analysis without delay in both browsers and Edge.

So BEAT is raw data, but it's also self-contained. No semantic parsing needed. This sounds grand, but it's really not. The BEAT expressive system is inspired by the most common data format in the world. The oldest data format in human history. Natural language.

And AI is the expert at understanding natural language.

### AI Insights

```
rhythm_1=2___1_5_32_8_12047_!home~237*nav-2~1908*nav-3~375/123*help~1128*more-1~43!prod~1034*button-12~1050*p1@---2~54*mycart@---3
rhythm_2=2___1_1_24_7_11993_!p1~2403*img-1~1194*buy-1~13/8/8*buy-1-up~532*review~14!review~1923*nav-1@---1
rhythm_3=2___1_1_0_0_12052_!cart
```

At the Edge, BEAT sequences can be serialized as NDJSON so each journey stays on a single line. This keeps logs compact, makes querying simple, and improves AI processing efficiency. Across Web, Mobile, IoT, Game, Finance and other event-driven systems, BEAT's semantically complete structure allows fast merging and easy compatibility with their respective formats.

Of course, NDJSON serialization is not required. The same data can be expressed in a simplified BEAT format while preserving its 1-byte scan performance, such as: `_device:1_referrer:5_scrolls:56_clicks:15_duration:1205.2_beat:...`

The purpose of this serialization is to respect JSON as an existing standard and the systems built around it (such as BigQuery), while allowing BEAT to evolve alongside JSON in a complementary rather than replacement role.

```
{"device":1,"referrer":5,"scrolls":56,"clicks":15,"duration":1205.2,"beat":"!home ~23.7 *nav-2 ~190.8 *nav-3 ~37.5/12.3 *help ~112.8 *more-1 ~4.3 !prod ~103.4 *button-12 ~105.0 *p1 @---2 !p1 ~240.3 *img-1 ~119.4 *buy-1 ~1.3/0.8/0.8 *buy-1-up ~53.2 *review ~14 !review ~192.3 *nav-1 @---1 ~5.4 *mycart @---3 !cart"}

AI interpretation:
[CONTEXT] Mobile user, Mapped(5) visit, 56 scrolls, 15 clicks, 1205.2 seconds
[SUMMARY] Confused behavior. Landed on homepage, hesitated in help section with repeated clicks at 37 and 12 second intervals. Moved to product page, opened details in a new tab, viewed images for about 240 seconds. Tapped buy button three times at 1.3, 0.8, and 0.8 second intervals. Returned to the first tab and opened cart shortly after, but didn’t proceed to checkout.
[ISSUE] Cart reached but purchase not completed. Repeated buy actions may reflect either intentional multi-item additions or friction in option selection. Long delay before checkout suggests uncertainty.
[ACTION] Evaluate if repeated buy or cart actions represent deliberate comparison behavior or checkout friction. If friction is likely, simplify option handling and highlight key product details earlier in the flow.
```

Data resonating from Full Score to Edge becomes real-time insight reports through lightweight AI (e.g., GPT OSS 20B-class models). These reports are then archived to storage platforms such as GitHub, organized by date.

All this accumulated data flows to your AI assistant. This creates an AI-to-AI collaboration system where lightweight AI creates reports for each run or session and advanced AI synthesizes comprehensive insights from all reports. Dashboards are optional, and humans are not required to manually analyze them. Over time, models may become strong enough that this entire flow finishes in one pass, with no explicit AI-to-AI collaboration step at all. As AI evolves, systems built on BEAT evolve with it.

Start a conversation.

"Which user journey patterns are driving conversions?"

"Any notable ISSUEs today?"

"Can you suggest UX improvements?"

<br />

## Fifth Movement: System Integration and Practice

### The Singer-Songwriter's Creative Process

Full Score's three elements are like a singer-songwriter building skill, composing original music, and performing for people.

```javascript
// Singer-songwriter's creative process
Touch/Click → Consistent skill anywhere through steady practice (TEMPO)
    ↓
rhythm.click() → Recording and experience of composed music (RHYTHM)
    ↓
BEAT encoding → Real-time performance on stage (BEAT)
    ↓
Cookie creation → Recording performance session in browser
    ↓
Edge observation → Livestreaming to audience
```

### Scenario 1: Daily Busking

**7:00 PM - First Visit (Taking the Stage)**

A user arrives at the site for the first time. The browser is like a singer-songwriter's stage just preparing to perform.

First, the browser checks for any echo=2 cookies from yesterday's completed performances and processes them for archival. It then confirms no active performances (echo=0) or stored sessions (echo=1) are present.

Creating new rhythm_1 with echo=0. The singer-songwriter has taken the stage. Edge detects echo=0 and immediately begins livestreaming. This stage's first song opens with the signature !home.

```javascript
rhythm_1 = "0_1735714800_x7n4kb2p_1_0_0_0_0_!home"
```

**7:30 PM - Day One Performance Begins (First Recording)**

Thirty minutes of passionate performance unfold. The user explores 5 pages (performs 5 songs), executes 23 clicks (plucks guitar strings) and 50 scrolls (prompts engagement). Edge captures every moment through its livestream.

```javascript
rhythm_1 = "0_1735714800_x7n4kb2p_1_0_50_23_18000_!home~102*3nav1~13*3nav2~8!prod~52*1~198*2~27*15img1~97*12a3~12!x3n~187*12div3~42*7a1~7!x4m..."
```

**8:00 PM - Performance Change (Additional Session from Tab Switch)**

The singer-songwriter changes sessions mid-performance at audience request. Existing rhythm_1 remains while rhythm_2 is created. Edge records all changes seamlessly through its livestream. The rhythm_1 session can return anytime.

**10:00 PM - Catching Breath (Additional Session from Capacity Overflow)**

After 2 hours, rhythm_2 exceeds 3.5 KB. The overflowing performance automatically shifts to echo=1 for storage, then rhythm_3 begins fresh. Rhythm_1 maintains echo=0 state while Edge continues streaming all transitions.

```javascript
rhythm_1 = "0_1735714800_x7n4kb2p_1_0_80_40_36000_!home~102*3nav1~13*3nav2~8!prod~52*1~198*2~27*15img1~97*12a3~12!x3n~187*12div3~42*7a1~7!x4m~248/231*7div2..."
rhythm_2 = "1_1735714800_x7n4kb2p_1_1_220_100_108000_!x3n~143*8div1~352*3span1~78/82/271*4~198*7a2~8!prod~412*9button2~37*11button1~14!cart..."  // Shifted to echo=1 for storage
rhythm_3 = "0_1735714800_x7n4kb2p_1_1_0_0_108005_!prod"
```

**11:00 PM - Day One Performance Ends (Browser Close)**

Time to wrap up busking. All rhythm performances transition to echo=2 for batch archival, whether they were actively playing (echo=0) or stored (echo=1). Edge detects this final state and prepares the collection. Today's performance archives privately, recording nothing but pure rhythm without IP addresses or names, remaining only briefly in memory.

```javascript
rhythm_1 = "2_1735714800_x7n4kb2p_1_0_80_40_36000_..."
rhythm_2 = "2_1735714800_x7n4kb2p_1_1_220_100_108000_..."
rhythm_3 = "2_1735714800_x7n4kb2p_1_1_60_25_144000_..."
```

**Next Day 7:00 PM - Day Two Performance Begins (Second Recording)**

A new day's performance begins. When echo=2 cookies are found, the browser processes them through batch archival, clearing yesterday's stage. After processing all echo=2 cookies, new rhythm_1 begins today's performance. Today also opens with the signature song !home.

```javascript
rhythm_1 = "0_1735801200_y8m5lc3q_1_0_0_0_0_!home"
```

### Scenario 2: Encore on a Rainy Day

**8:30 PM - Passionate Performance (First Recording)**

The performance reaches its peak. The audience is completely captivated by rhythms flowing from the singer-songwriter's hands. Clicks and scrolls follow the rhythm, BEAT draws complex yet beautiful patterns. Edge streams every moment without missing anything.

```javascript
rhythm_1 = "0_1735720800_x7n4kb2p_1_0_220_100_108000_!home~32*3nav1~148*3nav2~7!prod~51*1~19*2~21*3~298*7a1~12!x3n~182*15div4..."
rhythm_2 = "0_1735720800_x7n4kb2p_1_1_215_95_216000_!x3n~26*6div3~198*6div4~8!prod~102/98*4~352*4a2~7!x4m~48*8span2..."
rhythm_3 = "0_1735720800_x7n4kb2p_1_1_45_23_234000_!prod~79*12button1~52*5a1~14!home~148*5..."
```

**8:35 PM - Performance Interrupted by Downpour (Browser Crash)**

Wind and rain strike without warning, the browser freezes. The performance cannot continue, but cookies remain in the browser at echo=0 state. The audience watching the performance endures the storm, staying in place. Edge cannot record new interactions but maintains the resonance.

```javascript
rhythm_1 = "0_1735720800_x7n4kb2p_1_0_220_100_108000_!home~32*3nav1~148*3nav2~7!prod~51*1~19*2~21*3~298*7a1~12!x3n~182*15div4..."
rhythm_2 = "0_1735720800_x7n4kb2p_1_1_215_95_216000_!x3n~26*6div3~198*6div4~8!prod~102/98*4~352*4a2~7!x4m~48*8span2..."
rhythm_3 = "0_1735720800_x7n4kb2p_1_1_52_27_240000_!prod~79*12button1~52*5a1~14!home~148*5~203*8a2~8!x3n~31*8..."
// Remains in cookies at echo=0 - time frozen by crash
```

**8:40 PM - Stage After Rain Clears (Reconnection)**

The user reopens the browser. Finding cookies with echo=0, these interrupted performances are still waiting. The singer-songwriter sees the audience who stayed through the rain. Moved, the singer-songwriter decides to preserve the existing performances and prepare a special encore for them.

The interrupted rhythms shift to echo=1 for safekeeping. Edge detects this change and pauses the existing livestream. A fresh livestream immediately begins for the encore. The stage keeps its original time and hash.

```javascript
// Recovery process - interrupted performances stored
rhythm_1 = "1_1735720800_x7n4kb2p_1_0_220_100_108000_..." // echo 0→1 (stored)
rhythm_2 = "1_1735720800_x7n4kb2p_1_1_215_95_216000_..." // echo 0→1 (stored)
rhythm_3 = "1_1735720800_x7n4kb2p_1_1_52_27_240000_..." // echo 0→1 (stored)
// New encore performance begins (continuing the same stage)
rhythm_4 = "0_1735720800_x7n4kb2p_1_0_0_0_243000_!home"
```

**8:50 PM - Encore Performance (Second Recording)**

The singer-songwriter who experienced interruption performs more passionately. Short but dense interactions follow. Faster tempo, deeper clicks, exploring more pages than before. Edge records this special encore with continued streaming.

```javascript
// Fast tempo (~21, ~9) rushing clicks → Performance responding to audience cheers
rhythm_4 = "0_1735720800_x7n4kb2p_1_0_89_45_249000_!home~21*1~9/12*2~31*7button1~8!prod~52*15button1~98*8a2~7!x3n~79*3~21*4..."
```

**9:00 PM - Memorable Performance (Browser Close)**

The encore performance ends. The singer-songwriter takes a final bow and leaves the stage. All performances transition to echo=2 for batch archival. Today saw four performances: three interrupted ones preserved through the storm, one short but perfect encore. Edge captures every performance in its records.

```javascript
// All performances move to echo=2 for batch archival
rhythm_1 = "2_1735720800_x7n4kb2p_1_0_220_100_108000_..." // echo 1→2
rhythm_2 = "2_1735720800_x7n4kb2p_1_1_215_95_216000_..." // echo 1→2
rhythm_3 = "2_1735720800_x7n4kb2p_1_1_52_27_240000_..." // echo 1→2
rhythm_4 = "2_1735720800_x7n4kb2p_1_0_126_81_249000_..." // echo 0→2
```

Today's performances, recording nothing but pure rhythm without IP or names, each carrying their own stories, archive privately or disappear as special experiences remaining only briefly in people's memories.

<br />

## Sixth Movement: Actual Performance and Value

### The Principle of Resonating Strings

Inside a piano lie over 230 strings. Strike one, and others with the same frequency resonate naturally. This is sympathetic resonance.

Web browsers resonate too. With every page request, HTTP headers echo automatically. No developer instructions needed, no API endpoint required. This Web resonance phenomenon has continued since 1994.

Traditional analytics tools ignored this natural resonance to build separate synthesizers. They collect data with scripts, transmit via APIs, process on servers.

Full Score tunes this resonance. TEMPO aligns the beat of touches and clicks, RHYTHM records event sequences in the browser, BEAT encodes it into sheet music. The resulting music resonates naturally through the browser soundboard of cookies and localStorage, with Edge immediately interpreting this resonance.

Data isn't collected. It's music already playing in the air.

```javascript
// Concert Hall - Traditional Analytics
tag('event', 'click', {...}); // Active "transmission"

// Street Busking - Full Score  
// Self-ping only, Web's Native "resonance"
// Just listen to the music
```

### A Perfect Duet Transcending Time

Major concert hall performances require dozens of performers. Each with their instruments, sheet music, conductor, stage equipment, sound systems. But street busking is different. One guitar, one voice is enough.

Traditional analytics is a concert hall performance. Collection servers, processing servers, storage servers, analytics servers each play their parts. Selling tickets, arranging seats, printing programs. Full Score is busking. Compose your own music directly, just need free RHYTHM. The rest was already on the street. The browser stage, HTTP street resonance, Edge's natural and endless amplification.

Cookies were originally made to remember state, Edge was originally made to respond quickly from nearby, browsers could always store data. Full Score just created a stage for them to sing together.

The long-forgotten essence of the Web, rediscovered through the metaphor of music in the AI era. Past simplicity and future possibility meet in the present, creating beautiful harmony.

### Time Compression, Event Language in RHYTHM

BEAT transforms time into music. This short score `!home~300*3input1~1200!page~50*buy` captures an hour's journey. 30 seconds of decision is short like staccato, 120 seconds of exploration flows like legato, 5 seconds of clicking is intense like an accent.

This is not simple compression. Like haiku capturing the universe in 17 syllables, BEAT captures human intent with minimal symbols. Infinite variations of time and action, depth and pattern.

AI likes this score, immediately answering "a typical purposeful buyer pattern." With JSON it would first need to open a dictionary, but BEAT reads naturally like music crossing borders.

### Bots and Humans, Metronome and Rubato

Bot clicks are metronomes:
```
Bot: *1a1~10*1a2~10*1a3~10*1a4 (Metronome)
```
Exactly 1 second, exactly same depth. Perfect but dead.

Human clicks are rubato:
```
Human: !home~37/3*5nav1~218*12button1~1847*review (Rubato)
```
3.7 seconds of curiosity, 0.3 seconds of mistake, 21.8 seconds of exploration, 3 minutes of hesitation. Imperfect but alive, like music.

DOM depth also layers like musical harmony. Real buttons usually hide 8 layers deep. From bass lows to violin highs, web pages create different timbres by depth. Bots play only monophony. The shallowest layer, monotonous rhythm. No harmony, no counterpoint, just mechanical repetition.

AI connected with Edge immediately knows the difference. Average depth below 3 means bot, click interval standard deviation near 0 means bot, no hesitation means bot. Without complex algorithms, just simple rhythm distinguishes authenticity. Like perfect pitch instantly identifying D, AI distinguishes humans and bots through BEAT patterns. Musical intuition reborn as data analysis.

WAF doesn't ignore noisy sounds echoing from BEAT but executes summary judgment. The resonance between Full Score and Edge has sufficient value as a security layer as well.

### Applications Across Domains

The following examples present representative applications of BEAT grammar across different domains while preserving its sequential, semantic structure. They do not limit or narrow the scope of BEAT. BEAT is considered compatible even if symbols or parser implementations differ, as long as event data is serialized into a sequential event format that preserves the space where events occur, the time when actions occur, and the depth of each action, producing an essentially identical semantic stream regardless of storage medium or platform. For full details, refer to the Compatibility section in the root README.

**Finance domain example** `*action:price:quantity`
```
trader_1=!open~182*nvda!orderbook-NVDA~941*buy-NVDA:188:40
trader_2=!open~1*nvda!orderbook-NVDA~1*buy-NVDA:market:5000

// Adaptive execution and relay routing for HFT and MEV patterns
```

**Game domain example** `~time^distance`
```
player_1=!online~34^231~121^972*move~5/1/1/1/1/1/1*shoot-auto~251^1682*move~11*shoot-single:1-kill
player_2=!online~1^3215*move!ban

// 1 second travel 3215, clear speedhack spike, instant ban
```

**Healthcare domain example** `*status:heartrate:bloodoxygen`
```
wearable_1=!normal~60*good:HR-80:SpO2-98~60*good:HR-82:SpO2-97~60*good:HR-81:SpO2-98
wearable_2=!normal~60*good:HR-82:SpO2-96~60*caution:HR-95:SpO2-92!priority-high~10*caution:HR-104:SpO2-88~10*danger:HR-110:SpO2-85!emergency

// Monitoring interval tightened from 60s to 10s upon risk escalation
```

**IoT domain example** `*status:value`
```
sensor_1=!start~100/100/100/100/100/100/100/100/100*temp:23.5
sensor_2=!start~100/100/100*temp:23.5~86*temp:24.1~37*temp:26.4*alert:overheat!emergency~10!recovery~613!restart~100/100/100

// AI detected abnormal state and executed emergency recovery and restart
```

**Logistics domain example** `*action:reason`
```
flight_1=!JFK~2112*load~912*depart~486*climb~8640*cruise!MEM~2514*unload~1896*sort~3798*depart~522*climb~32472*cruise!CDG~3138*unload
flight_2=!JFK~2046*load~864*depart~462*climb~8424*cruise!MEM~872*ramp-hold:ground-capacity~6514*unload

// Abnormal flight operations captured via real-time monitoring and logging
```

Here’s a more intuitive way to see BEAT’s benefits in the logistics domain.

BEAT can stream the entire daily schedule of a single aircraft in about 1KB of data. There are roughly 30,000 commercial aircraft in operation worldwide. Archived for one year, all of that can fit on a 10GB USB drive.

On that drive, all key flight operations from the first takeoff to the final landing of each aircraft are preserved in a form that requires no semantic parsing. It also makes visible delay reasons and operational patterns that traditional systems often hide across separate logs.

For additional detail, BEAT can be extended with value parameters like `!JFK:pilot-LIC12345` or `*depart:fuel-42350L`, maintaining readability while adding precision.

### Applications Across Platforms

BEAT can also be processed natively on AI Accelerators (xPU). As a pre-tokenized and strictly structured sequence format, BEAT is inherently optimized for massive parallel processing and large-scale AI training. Below is an example Triton kernel that encodes BEAT tokens directly in xPU memory.

**xPU platform example** `1-byte scan`
```python
s = token == ord('!') # Contextual Space (who)
t = token == ord('~') # Time Flow (when)
p = token == ord('^') # Position (where)
a = token == ord('*') # Action (what)
m = token == ord('/') # Method (how)
v = token == ord(':') # Value (why)

# Binary-level BEAT scanning on xPU
```

xPU can scan BEAT sequences directly without any additional preprocessing. The rest is just address arithmetic to load and store tokens. In short, it delivers binary-level performance while preserving the human readability of a text sequence.

This makes BEAT a natural fit for AI-driven analysis of large-scale event streams in domains such as robotics and autonomous driving. In these environments, its ability to be scanned at binary speed while still remaining directly readable to both engineers and AI models stands out as a clear advantage.

Humans learn the meaning of their actions as they acquire language. AI, by contrast, excels at generating language but struggles to autonomously structure and interpret the full contextual fabric (5W1H) of its own actions. BEAT enables an AI system to record its behavior as sequences that read like natural language and to analyze that flow in real time (1-byte scan), providing the foundation for feedback loops through which it can monitor its own errors and improve its outcomes.

### Silent Security, Value of Nothingness

Before music begins, the breathless moment as the audience awaits the performer's first note is most important. Full Score is the same.

Only simple patterns are recorded, not sensitive personal information (PII), eliminating data leakage risks. As resonance occurs directly between browser and Edge without origin server involvement, interception becomes significantly more difficult. As long as the site itself has not been compromised by XSS or similar injection attacks, exfiltrating Full Score’s decentralized data at scale would require attacking users’ browsers individually, an attack vector that is realistically very difficult to execute.

This is because Full Score is designed not around traditional transmission, where data ownership is fully transferred, but around a structure in which data ownership remains with the user (browser) while resonance occurs at the Edge.

Faster page loads are just the beginning. The real key is that without configuring API endpoints, Edge completes real-time analysis just by listening to RHYTHM already flowing in the air. While traditional tools prepare numerous instruments for collection, transmission, processing, and storage, Full Score quickly begins the next performance.

Full Score uses first-party cookies that automatically disappear after a few days. GDPR risk is designed to be lower than that of UX analytics tools such as session replay. Like street music scattering in the wind, data naturally dissipates over time. Free because it doesn't promise eternity.

For more about resonance, GDPR, and related topics, see the FAQ on the demo site: [fullscore.org](https://fullscore.org/#faq)

<br />

## Final Movement: Return of the Singer-Songwriter

### The Musician Returns to the Streets

The major agency told the singer-songwriter: "We have a bigger stage prepared for you. The best sound system, dazzling lights, tens of thousands in the audience. With us, you'll be incredibly successful."

But the free-spirited singer-songwriter picked up their guitar and returned to the streets. Finding a corner of the sunlit square, opening the guitar case, tuning the worn guitar. As the first song begins, one or two people stop. The sound of fountain droplets falling. Someone's applause. A child's laughter.

And realized. People genuinely enjoy the performance. What matters isn't the size of the stage but the distance between music and people.

The browser stage was already perfect. No additional installation needed, no complex setup required. HTTP's street resonance never stopped for 30 years, and Edge has been waiting in the same place like a quiet best friend.

### Three Chords, One Song

The singer-songwriter needed just three chords rather than a bigger, fancier stage.

**C Chord - TEMPO**
```javascript
touchend → el.click()  // Instantly responsive fingertips
```

**G Chord - RHYTHM**  
```javascript
document.cookie = `rhythm=${beat}`  // Rhythm the browser remembers
```

**Am Chord - BEAT**
```javascript
"!home~30*3nav1~120!1~5*1"  // Story carved in time
```

These three chords were enough. And just as countless hits were created riding the rhythm of C-G-Am and F, Full Score meeting Edge discovered infinite possibilities in simplicity.

**Perfect Harmony, F Chord - Edge**
```javascript
const rhythm = request.headers.get('Rhythm') // Beautifully resonating harmony
```

### Music Made with the Audience

The most beautiful moment in a singer-songwriter's performance is when the audience sings along. Full Score also makes music with users.

Every time users click and scroll, BEAT records it. This is music the singer-songwriter cannot make alone. Like how audience response, applause, and singing together complete a real live performance, user interactions complete Full Score.

Now every browser serves like an auxiliary database containing its own music. With each person's rhythm, each person's tempo, each person's story performed.

<br />
<br />
<img width="1920" height="1080" alt="Full Score - Web's Native Performance" src="https://fullscore.org/wp-content/uploads/Full-Score-README-2.jpg" />
<br />
<br />

### The Singer-Songwriter's Final Realization

"When will the next Web technology appear?"

The singer-songwriter paused mid-performance. A grandma passing by smiled warmly and said, "Someone played guitar in this same spot when I was young. The music was just as beautiful back then as it is now."

In that moment, realization came.

The guitar in hand was made in 1989. Steel strings were invented centuries ago. Chord progressions have existed since Bach's time. But today, on this street, the music created in this moment is completely new.

```javascript
// past + present = ∞
browser.meet(edge) // Harmony transcending spacetime
```

The browser was the eternal stage that was always there. Cookies were the music of all musicians who performed on this street. Edge became the channel connecting that music to nearby listeners in real time. AI heard the BEAT created by every user click and scroll, immediately understanding the pattern drawn by human behavior.

The singer-songwriter finally realized. New Web technology doesn’t suddenly appear on some future day. When cookies and Edge meet in the AI era, like Bach’s fugue meeting jazz swing, harmony transcending time resonates. We just hadn’t realized. Perfection was always there.

<br />

## And the Harmony Begins

The singer-songwriter strikes a new chord.
The result of practice's TEMPO, composition's RHYTHM, performance's BEAT.

The choice to eliminate rather than add complexity.
The approach to create analytics without servers.
The method to understand users without personal information.

Everything is contained within this small Full Score.

**Will you join the performance? 🎵**

<br />
<br />
<br />
<br />
<br />

---

<br />
<br />
<br />
<br />
<br />

## Usage

Full Score is a lightweight library with zero-dependency orchestration. Simply place it directly in your website's footer, where it will have minimal impact on loading times. It's designed for easy customization. Please refer to the code comments for details.

While real-time analytics and security layers based on event sequences can be implemented directly on the client side, deploying to Edge maximizes Full Score's capabilities with features like WAF blocking, personalized functionality, AI analysis, and log pushing to cloud storage. **Resonator** is the official reference implementation for interpreting BEAT and is licensed under the SSPL.

For a quick overview, check out the live demo: [https://fullscore.org](https://fullscore.org)

<br />

## Quick Start

```
<script src="https://cdn.jsdelivr.net/gh/aidgncom/fullscore@main/fullscore.basic.min.js"></script>
// Basic (2.69KB gzip): BEAT + RHYTHM

<script src="https://cdn.jsdelivr.net/gh/aidgncom/fullscore@main/fullscore.standard.min.js"></script>
// Standard (3.13KB gzip): TEMPO + BEAT + RHYTHM

<script src="https://cdn.jsdelivr.net/gh/aidgncom/fullscore@main/fullscore.extended.min.js"></script>
// Extended (3.30KB gzip): TEMPO + BEAT + RHYTHM (+ADDON)
```

The Basic version is recommended for most sites. This version includes only BEAT (core) and RHYTHM (engine), without TEMPO (auxiliary module). It operates without issues on most sites.

If clicks or taps register incorrectly when testing the Basic version, this typically indicates problems with your site’s event handling or coordinate setup. The Standard version includes TEMPO, which resolves these issues elegantly.

For Power Mode activation or scroll depth tracking, consider the Extended version with add-on features. Most sites won’t need this. Use it only when your specific situation requires these features.

The script runs smoothly even when placed in your site’s footer. If you want to change the default settings, you can customize them as shown below.

```
<script src="https://cdn.jsdelivr.net/gh/aidgncom/fullscore@main/fullscore.basic.min.js"></script>

<script>

// ----- START: BEAT CUSTOMIZATION -----

// 🚨 Important: Full Score is designed for easy customization
// For detailed instructions, see the Quick Start section in the README
BEAT.TIC = 100;						// Tick (default: 100ms)
BEAT.TOK = {						// Token mapping
	S: '!',							// Contextual Space (who)
	T: '~',							// Time Flow (when)
	P: '^',							// Position (where)
	A: '*',							// Action (what)
	M: '/',							// Method (how)
	V: ':',							// Value (why)
};
BEAT.MAP.S = {						// Space map
	'/': 'home', 					// Homepage reserved word (result: !home)
	'/en/': 'home-en', 				// Multilingual homepage (result: !home-en)
	'/product/001': 'product-1',	// Product post (result: !product-1)
};
BEAT.MAP.A = {						// Action map
	'#close-button': 'close',		// #id selector (result: *close)
	'.open-modal': 'm',				// .class selector (result: *m)
	'https://ex.com/': 'ex',		// Absolute URL in <a href> (result: *ex)
	'/english/': 'en',				// Relative URL in <a href> (result: *en)
	'*10div1': 'auto',				// BEAT auto-generated selector remap (result: *auto)
};

// ----- END: BEAT CUSTOMIZATION -----

// ----- START: RHYTHM CUSTOMIZATION -----

RHYTHM.HIT = '/rhythm'; 			// Session activation and cookie resonance path (default: '/rhythm')
									// Edge observes real-time cookie resonance without endpoints
									// Edge monitors only this path for analytics
RHYTHM.ECO = [						// Session endpoint and batch signal (default: '/rhythm/echo')
	'/rhythm/echo',					// Should use same path prefix as HIT for cookie consistency
									// Sends completion signal only, no need to specify exact endpoint paths
									// You can replace or add custom endpoints for direct data: 'https://service.yoursite.com/webhook/yourcode'
									// Custom endpoints expose public URLs. Use IP whitelist or reverse proxy for security
];
RHYTHM.TIC = 100;					// Tick (default: 100ms)
RHYTHM.TAP = 3;						// Session refresh cycle (default: 3 clicks)
RHYTHM.THR = 1;						// Session refresh throttle (default: 1 ms)
RHYTHM.AGE = '259200';				// Session retention period (default: 3 days)
									// Leave empty '' for session cookies
RHYTHM.MAX = 7;						// Maximum session count (default: 7 slots)
RHYTHM.CAP = 3500;					// Maximum session capacity (default: 3500 bytes)
RHYTHM.DEL = 1;						// Session deletion threshold (default: 1 click)
									// 1 means 0-click sessions are deleted before the batch
									// 0 means all sessions proceed to the batch
RHYTHM.REF = {						// Referrer mapping (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
	'google.com': 3,
	'youtube.com': 4,
	'cloudflare.com': 5,
	'claude.ai': 6,
	'chatgpt.com': 7,
	'meta.com': 8,
};
RHYTHM.ADD = {						// Addon features, available only in Extended version
	TAB: true,						// BEAT Cross-tab tracking addon (default: true)
									// In Basic and Standard, TAB is always enabled by default and not configurable
	SCR: false,						// BEAT Scroll position tracking addon (default: false)
	SPA: false,						// Single Page Application addon (default: false)
	POW: false,						// Power Mode for immediate batch on visibility change (default: false)
									// To explain the default mode POW=false first,
									// Full Score resonates the complete browsing journey including cross-tab only once.
									// High accuracy is expected on both mobile and desktop, but some environments may delay or lose data.
									// Delayed data will be re-batched and resonated when the user visits the website next time.
									// Consider Power Mode when total data volume matters more than journey completeness.
									// When setting POW=true, immediate batch triggers even on page refreshes or tab switches.
									// Unfortunately, immediate batch nature prevents cross-tab journey recording, so the feature is disabled.
									// However, these fragmented batches are all bound by the same time and key,
									// allowing the entire journey to be reconstructed into a single flow by considering batch order.
};

// 🚨 Important: Personalization is an advanced feature that resonates with Edge
// Security and personalization function without Edge, but BEAT patterns must be detected in the browser
// For detailed instructions, see Aidgn’s YouTube channel
RHYTHM.HUM = { // Update movement personalization field [1-9]
	1: (rhythm) => {
		console.log('HumanExample'); // Use personalization field position 1 (XOXXXXXXXX)
		document.cookie = 'movement=' + (rhythm.movement = rhythm.movement[0] + '2' + rhythm.movement.substring(2)) + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // Mark [1] as completed (set to 2)
	},
	// 2: (rhythm) => // Use personalization field position 2 (XXOXXXXXXX)
	// 3: (rhythm) => // Use personalization field position 3 (XXXOXXXXXX)
	// 4: (rhythm) => // Use personalization field position 4 (XXXXOXXXXX)
	// 5: (rhythm) => // Use personalization field position 5 (XXXXXOXXXX)
	// 6: (rhythm) => // Use personalization field position 6 (XXXXXXOXXX)
	// 7: (rhythm) => // Use personalization field position 7 (XXXXXXXOXX)
	// 8: (rhythm) => // Use personalization field position 8 (XXXXXXXXOX)
	// 9: (rhythm) => // Use personalization field position 9 (XXXXXXXXXO)
};

// ----- END: RHYTHM CUSTOMIZATION -----

</script>
```

### Standalone (Basic)
For client-side performance only, you can configure direct endpoint transmission instead of resonance.

**nginx example**:
```nginx
location /rhythm {
    return 204;
}
```

**Custom endpoint example**:
```javascript
RHYTHM.ECO = [
	'/rhythm/echo',
	'https://service.yoursite.com/webhook/yourcode',
    // Multiple endpoints allowed, data POSTed via sendBeacon
]
```

**Security Note**: Place the (/rhythm/) endpoint behind a reverse proxy with rate limiting, as it may receive periodic HEAD requests for header-based state synchronization when Edge livestreaming is enabled.

### Edge Setup (Recommended)

Edge transforms Full Score into a real-time analytics layer with no API endpoints required. Resonator is the official BEAT interpreter. The setup is straightforward, and you can easily follow along with the video on the Aidgn YouTube channel: [https://www.youtube.com/@aidgn](https://www.youtube.com/@aidgn)

<br />

<img width="1200" height="630" alt="Full Score - Edge example 01" src="https://fullscore.org/wp-content/uploads/Full-Score-Edge-example-01.jpg" />

<br />

<img width="1200" height="630" alt="Full Score - Github example 01" src="https://fullscore.org/wp-content/uploads/Full-Score-Github-example-01.jpg" />

<br />

<img width="1200" height="630" alt="Full Score - Github example 02" src="https://fullscore.org/wp-content/uploads/Full-Score-Github-example-02.jpg" />

<br />

<img width="1200" height="630" alt="Full Score - AI assistant example 01" src="https://fullscore.org/wp-content/uploads/Full-Score-AI-assistant-example-01.jpg" />

<br />

<img width="1200" height="630" alt="Full Score - AI assistant example 02" src="https://fullscore.org/wp-content/uploads/Full-Score-AI-assistant-example-02.jpg" />

<br />

## License

Full Score: AGPL-3.0-or-later with component licenses:
- TEMPO: MIT License
- RHYTHM: GPL-3.0-or-later License
- BEAT: AGPL-3.0-or-later License

Resonator: SSPL-1.0 License

**Important**: BEAT is the Semantic Raw Format (SRF) standard. BEAT sequences can be directly interpreted by both humans and AI without parsing (Semantic), preserve information in their original state (Raw), and maintain a fully organized structure (Format). Offering BEAT as a service to others or modifications to this format specification must comply with AGPL-3.0-or-later terms.

Resonator is the official reference implementation for interpreting BEAT and is licensed under the SSPL. This license applies across Web, Mobile, IoT, Game, Finance and other environments, and internal use is unrestricted. However, if BEAT-based functionality, as defined and implemented in this project, is provided to third parties as a service, the SSPL source disclosure requirements apply.

BEAT is defined as an expressive system, not a generic logging idea. Consistent interpretation of BEAT across different environments is also important to maintain semantic compatibility. Therefore, alternative implementations that claim equivalence are expected to use the Compatibility criteria provided below to verify interpretation consistency.

**Compatibility**: BEAT is considered compatible even if the symbols vary within Printable ASCII (0x21 to 0x7E) or the parser implementation differs, as long as event data is serialized into a sequential event format that preserves the space where events occur, the time when actions occur, and the depth of each action, producing an essentially identical semantic stream regardless of storage medium or platform. Semantic compatibility is determined by the meaning of event sequences and their structural interpretation within BEAT’s eight-state semantic layout, conceptually equivalent to a 3-bit encoding, irrespective of token choice, token order, token subsets, or storage representation. Any such compatible implementation constitutes a derivative work under copyright law and must comply with AGPL-3.0-or-later terms.

See individual source files for detailed license information.

<br />

## Resources

If you would like to get in touch, feel free to reach out via email or DM on X. Thank you.

- **Email**: [info@aidgn.com](mailto:info@aidgn.com)
- **X**: [https://x.com/aidgncom](https://x.com/aidgncom)
- **YouTube**: [https://www.youtube.com/@aidgn](https://www.youtube.com/@aidgn)
- **Full Score**: [https://github.com/aidgncom/fullscore](https://github.com/aidgncom/fullscore)
- **Resonator**: [https://github.com/aidgncom/resonator](https://github.com/aidgncom/resonator)

<br />
