# 🎼 Full Score - Web's Native Performance

<br />
<br />
<img width="1920" height="1080" alt="Photo by Rocco Dipoppa on Unsplash" src="https://github.com/user-attachments/assets/bd3787fa-ab00-45cc-88ae-081ffb5e9dc5" />
<br />
<br />

## Preface: When Will the Next Web Technology Appear?

Web technology today faces a paradox. Tools get heavier while insights diminish. Data explodes while privacy regulations tighten. AI claims to understand everything, yet data remains in forms AI struggles to read.

Web technology has been a history of addition. More features, more data, more layers of saturation. The result? We load megabytes of analytics and security scripts, manage dozens of servers, and battle endlessly expanding complexity.

Full Score takes a different approach. Instead of piling on more features, it keeps only what matters with 3KB (min+gzip) of code that proposes a new direction for analytics.

- **Serverless Analytics** with No API Endpoints & 90% Cost Reduction
- **Complete Cross-tab User Journey** Without Session Replay
- **Bot Detection & Human Personalization** via Real-time Behavioral Layer
- **Human & AI-Readable Format** as Linear Strings, No Parsing
- **GDPR-Conscious Architecture** with Zero Direct Identifiers

All while achieving a decentralized paradigm using browsers like auxiliary databases.

```
Traditional Analytics: Browser → API → Raw Database → Queue(Kafka) → Processing(Spark) → Processed Database → Archive
// ⛔ 7 Steps, $1,000+/month

Full Score:  Browser ~ Edge → Archive
// ✅ 2 Steps, $50/month
// No API endpoints needed
// No Queue & Processing needed
```

I've tried to keep the technical explanations from being too dry, but if you find yourself losing steam, feel free to skip to the Fifth Movement to see how everything comes together.

For a quick overview, check out the live demo: [fullscore.org](https://fullscore.org/)

<br />

## First Movement: Web Interactions Become Music

### Events on a Timeline

Web interactions are essentially an Aria on the G String. Each user action, from page arrival through browsing and clicking to departure, unfolds along a timeline. This mirrors exactly how musical notes are placed on a timeline.

The name Full Score symbolizes a musical score or composition. Just as a full score captures every moment of a performance, Full Score captures all web interactions in one system.

### Three Independent Yet Harmonious Technologies

Full Score consists of three independent technologies. Each is useful alone, yet more powerful together.

**TEMPO (Tap Event Method Performance Optimizer)** is a 50-line snippet that improves tap event speed and accuracy. Like an orchestra conductor synchronizing different instruments' tempos, it harmonizes mobile and desktop interactions. Without offbeats, every touch and click completes as a single note. While it provides immediate improvements standalone, when used with RHYTHM, it becomes a gateway for collecting user interaction data.

**RHYTHM (Real-time Hybrid Traffic History Monitor)** is a client-side engine that leverages users' browsers like auxiliary databases. Unlike traditional approaches that send, store, and process data on servers, it embeds core functionality in the browser. Connected with Edge Computing, it enables real-time analysis and immediate response without server intervention. It proposes a new paradigm with minimal data transfer, server operation, and processing costs.

**BEAT (Behavioral Event Analytics Transform)** is a domain-specific language (DSL) that transforms multi-dimensional behavioral data into linear sequences. It captures when actions occur (time), where users navigate (space), and what they do (actions with depth). This compression transforms complex user journeys into single strings that both humans and AI can read. While serving as RHYTHM's core data format, BEAT maintains versatility for use in other systems.

These three technologies are like a jazz trio where each solo performance is excellent, but together they create true harmony. Add Edge computing, and the quartet performs at its full potential.

<br />

## Second Movement: TEMPO - The Piano Tuner's Gift

### Two Different Instruments

Desktop clicks are like playing an electric piano. Press a key, sound comes instantly. Electrical signals travel to speakers without delay, and performers experience their intentions becoming music directly.

```
User click → mousedown → mouseup → click
```

Mobile touches are like playing a grand piano. Press a key, and hammers move, strike strings, dampers open—a complex mechanical process. The system must interpret the touch's intent. Was it a light tap? A scroll attempt? A zoom gesture? Time is needed to determine.

```
User touch → touchstart → [touchmove]* → touchend → [event loop] → click
```

### Accumulation of Micro-Delays

The notorious 300 ms delay in mobile browsers gradually disappeared in 2013. But micro-delays from event loops persist. Sometimes touches feel imprecise.

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
// The Phantom of the Opera trap
let once = true;
const block = (ev) => {
    if (once && ev.isTrusted) {          // Real browser-generated event
        ev.preventDefault();              // Block default action
        ev.stopImmediatePropagation();   // Stop propagation
        once = false;                    // Block only once
        document.removeEventListener("click", block, true);  // Remove listener
        pending.delete(block);            // Remove from Set
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
			while (el && el.namespaceURI === 'http://www.w3.org/2000/svg') el = el.parentElement; // Get real target from SVG
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
			let el = e.target.closest('label')?.control || e.target; // Get real target from label
			while (el && el.namespaceURI === 'http://www.w3.org/2000/svg') el = el.parentElement; // Get real target from SVG
			rhythm && rhythm.click(el); // desktop RHYTHM integration
		}, {capture: true});
	}
}
// tempo(); // Uncomment for standalone use
```

Each line performs a precise role. At touch or click start, it clears echoes from previous performances. It detects movement to distinguish scrolls from taps. At the end, it finds the exact element and executes the click. Special handling for Label elements adds accessibility harmony, and the 8-level fallback ensures the performance continues in any situation.

These 50 lines synchronize tempo across all devices. Like a perfectly tuned concert grand.

<br />

## Third Movement: RHYTHM - Music in the Browser

### A Paradigm Shift

Traditional web analytics is complex like a massive symphony. Instruments for collecting data, transmitting data, storing data, and processing data all play separately. Each part operates independently, requiring enormous time and cost just to tune them.

RHYTHM is like a singer-songwriter's creative process. Starting composition in a quiet room, building rhythms note by note on staff paper to complete a Full Score. Then taking that score to the streets to perform freely. The browser becomes the chosen stage, without interruptions.

### The Browser and Cookie Stage

Browsers have various storage options. SessionStorage is intimate like a live house but only open for a day. LocalStorage is accessible like a music hall but often faces entry restrictions. IndexedDB is massive like a stadium concert but requires professional sound engineers and stage crew.

The first-party cookie RHYTHM chose is like a singer-songwriter's street performance. All you need is one small stage. No fancy lights or sound equipment required. But there's one crucial feature: whenever you want, you can livestream your performance in real-time. Your reliable friend and manager, Edge Computing, helps with the livestreaming.

```javascript
document.cookie = `rhythm_1=${data}; Max-Age=259200; Path=/`;
// Max-Age=259200 = Auto-delete after 3 days (actual RHYTHM.AGE value in code)
```

Like busking that leaves no trace when finished, cookies delete themselves after a few days. No performance permits needed, no teardown requests. Like the city's rhythm, it naturally begins and ends.

### RHYTHM Created by Data

RHYTHM stores session data like a rhythm composed of notes on a staff. Each note carries unique meaning.

```javascript
const rhythm_1 = {
	echo: 0,            // Performance status (0=performing, 1=storing, 2=archiving)
	time: 1735680000,   // Stage start time (synchronization reference for all tabs)
	hash: 'x7n4kb2p',    // Stage name (random string for data integrity)
	device: 1,          // Instrument type (0=desktop, 1=mobile, 2=tablet)
	referrer: 3,        // Performance spot (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
	scrolls: 23,        // Scroll gestures (passersby who stopped)
	clicks: 45,         // Click actions (audience engagement)
	duration: 300,      // Performance duration
	beat: "!home~10*1~" // Performance record (BEAT format)
}
```

When stored in cookies, this data becomes a single line of sheet music separated by underscores (_).

```
// Private Mode (no direct identifiers)
"0_1735680000_x7n4kb2p_1_3_23_45_300_!home~10*1~"

// Full Private Mode (no direct/indirect identifiers)
"0___1_3_23_45_300_!home~10*1~"
```

A single line expresses an entire session. If JSON is conducting each orchestra section, RHYTHM is as concise as playing guitar tabs.

A singer-songwriter can manage multiple sessions simultaneously. For smooth performances, we recommend limiting to rhythm_1 through rhythm_7. New sessions are created when cookies fill up or when switching browser tabs. Limiting to 7 sessions prevents audience confusion from constantly changing setlists during one performance. Exceeding this number suggests noise pollution rather than pure busking, likely a bot signal.

Edge also has limits. Famous CDN/Edge networks typically set header size limits at 8~32 KB. While sufficient for streaming 4 KB cookie sessions, too many sessions risk disconnection. When performances run too long, livestreaming stops at the singer-songwriter's signal (echo=2). The performance data archives privately, then new streaming begins. This circular structure enables practically unlimited performances.

For its efforts, Edge only asks for coffee money, but may grumble if livestreaming restarts too frequently.

### Score Orchestration

The score cookie serves as a musical score tracking the entire browsing journey.

```javascript
score=0000000000_1735680000_x7n4kb2p___1~2~1~3~2

// 0000000000  = Bot/Human flags (first digit: bot level, rest: behavior flags)
// 1735680000  = Stage start time (synchronization reference for all tabs)
// x7n4kb2p    = Stage hash (random string for data integrity)
// 1~2~1~3~2   = Tab chain (also embedded in BEAT as addon: ___N)
```

This score acts as the reference point for every performance (rhythm session). The first digit indicates bot dissonance levels, while the remaining nine digits serve as independent human harmony signals. Edge analyzes BEAT patterns to update these notes in real-time, introducing a new behavioral analytics and security layer.

Each tab represents a different performance (rhythm session) on the same stage. All performances share the same stage time. When the singer-songwriter begins a new stage, all ongoing performances reset to that new time. This cookie-based synchronization keeps all separate performances as part of the same stage.

The tab chain (1~2~1~3~2) records the sequence as users switch between tabs. This also appears in BEAT strings as (___N), precisely tracking tab movements. Full Score captures a single user's complete browsing journey, including all cross-tab flows.

### Livestreaming with Edge Computing

Edge is the singer-songwriter's reliable companion, an indispensable friend. When the singer-songwriter performs their RHYTHM, Edge livestreams it to the world.

The `/rhythm` path is an internal signal route where Edge observes cookie headers, not an API endpoint for uploading data. You can also configure Full Score to send data directly to external endpoints if needed.

```javascript
// Live streaming handler - watches /rhythm path for real-time cookie resonance
if (url.pathname === "/rhythm" && url.searchParams.has("livestreaming")) {
    const match = scan(cookies); // Parse score & rhythm cookies
    
    // Bot detection - updates score cookie's first digit (0-9)
    if (match.bot) {
        score[0] = Math.min(+score[0] + 1, 9);
        console.log('⛔ Bot: MachineGun:12 (level 3)');
    }
    
    // Human pattern recognition - updates remaining 9 digits as flags
    if (match.human) {
        score[match.human] = '1';
        console.log('✅ Human: 0100000000 (flag 1 activated)');
    }
    
    // Only update cookie when values change (reduces network overhead)
    if (score !== original) {
        return new Response(null, {
            status: 204,
            headers: {'Set-Cookie': `score=${score}; Path=/; Secure`}
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

Edge analyzes every performance in real-time. The (/rhythm) path monitors cookie resonance through HEAD requests, while (/rhythm/echo) archives completed performances. Bot patterns like MachineGun (rapid clicks), Metronome (exact intervals), or Surface (shallow DOM) trigger security flags. Human patterns activate behavior flags for personalization. If someone hesitates before purchasing, you could show them a coupon.

No API endpoints required. No separate analytics servers or central database queries needed. Browser and Edge connect closely in spacetime like sympathetic resonance, fast and vivid. Processing delays are imperceptibly low.

A traditional concert hall would be different. Without complex broadcast equipment, without separate studios, street music spreads worldwide.

### Performance Techniques

RHYTHM first-party cookies are set to the root path (/) but are also accessible from the (/rhythm) path. Leveraging this cookie characteristic, Edge resonates exclusively at the (/rhythm) path. If Edge had resonated with the root path (/), it would suffer from all manner of noise. But at the (/rhythm) path, it can enjoy RHYTHM's performance quietly and clearly.

An alternative variant of Full Score uses LocalStorage instead of cookies. This approach offers immediate data updates and generous capacity. However, since LocalStorage doesn't naturally resonate through HTTP headers as cookies do, it requires a semi-automatic trigger to create resonance for delta data at the (/rhythm) path. The absence of auto-expiration and narrower browser support led to the cookie-based model becoming the primary release for its simplicity and universal compatibility.

RHYTHM transforms users' browser cookies into small personal storage. With 100 million users, it's like having 100 million auxiliary databases. Each browser provides its own isolated execution environment, operating directly on devices without perceptible delay. For performance enhancement, HTTP/2 or HTTP/3 environments are recommended. Compression tables help cookies travel lighter.

The Full Score code contains playful techniques. The cookie-based lock mechanism uses leader-like coordination, a lightweight browser-local pattern inspired by distributed systems. The AbortController + keepalive:true combination dramatically reduces network latency while ensuring RHYTHM's performance resonates reliably. Please explore the code comments for these implementation details.

<br />

## Fourth Movement: BEAT - Actions Become Performance

### Format for Recording User Actions

BEAT expresses user actions like a performance. Like recording an entire live performance on video.

```
!home~300*3input1~1200!1~50*1
```

Listen to the story this short performance tells. A user takes the homepage (!home) stage, searches for products after 30 seconds of silence (*3input1). After enjoying content for 120 seconds, they modulate to the first mapped page (!1). Then in 5 seconds, they reach the climax with the purchase button (*1).

### Grammar Recording Flow Like Musical Notes

BEAT records performance order as follows:

**Pages (!) - Moments of changing songs**
- !home: Overture (homepage, only reserved word)
- !x3n, !x3n4k: Songs designated by 3-5 character auto-generated hashes
- !en, !product: Other songs directly chosen by performer (user-mapped pages)

**Elements (*) - Note pitch**
- *3nav1: Plucking guitar's third string with first stroke (DOM depth + element type + index)
- *6button2: Plucking guitar's sixth string with second stroke
- *close, *modal: Special chords designated by composer (user-mapped elements)

**Time (~) - Rests and beats**
- ~10: 1 second of breath
- ~250: 25 seconds of silence
- ~10.20.30: RHYTHM repetition (repeat times separated by dots)

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
- `/about` → `!x3n` (3-character hash)
- `/products` → `!a2b4` (4-character hash)
- `/products/laptop` → `!x3n4k` (5-character hash)

Users can compress BEAT further by mapping frequently visited pages and important elements.

```javascript
// Page mapping
const pageMap = {
    '/products': '!prod',
    '/cart': '!cart',
    '/checkout': '!pay'
};

// Element mapping
const elementMap = {
    '.add-to-cart': '*add',
    '.buy-now': '*buy',
    '#search-button': '*search'
};
```

Mapping effects:
- `/products/laptop/dell-xps-15` → `!prod` (35 chars → 5 chars)
- `.product-grid > button.add-to-cart` → `*add` (36 chars → 4 chars)

### Aesthetics of Compression and Harmonics of Depth

BEAT's compression is like musical abbreviation. Repeated themes are written once with variations noted.

```javascript
// Regular
~100*button~150*button~200*button

// BEAT abbreviation
~100.150.200*button
```

This compression reduces hour-long sessions to about 1 KB of sheet music. If JSON is classical notation requiring understanding of complex tonal relationships, BEAT is tab notation surrendering to simple flow.

Yet DOM depth inherent in BEAT is rich like musical depth (octaves). Multiple strings and frets must harmonize for rich resonance, but repeating the same note doesn't sound like performance.

It's as if JSON places individual notes as dots, while BEAT connects those dots into rhythm. Despite maximum compression, the music within remains clear.

```
Human performance: *15span2, *12div3, *8button1 (deep, rich harmony)
Bot noise: *1a1, *1a2, *1a3, *1a4 (monotonous surface strikes)
```

Real purchase buttons usually hide 8 layers deep. Real users start with the overture and gradually go deeper, while bots only tap the surface.

BEAT is a domain-specific language (DSL) that layers time, action, and depth in the browser. Users can extend it variously as desired.

```javascript
// Default
!home~300*3input1~1200!page~50*button

// Example 1: Format change only
@home>300#3input1>1200@page>50#button

// Example 2: Add scroll events (^ records scroll position - can be enabled in BEAT)
!home^1200~300*3input1~1200!page^2400~50*button 

// Example 3: Shorter abbreviation (1-second units, minimized action symbols, precise mapping)
!~30*2~120!1~5*1
```

Despite these various possibilities, BEAT considers the default most ideal. Here's why:

### AI and Human Duet

BEAT transforms multi-dimensional behavioral data of time, space, and action with depth into linear sequences. It compresses multidimensional logs into single strings that can be directly input into sequence models.

```
rhythm_1 = !home~300*3input1~1200!page~50*button

Human interpretation:
"Let's see... homepage to product page, took about 3 minutes total."

AI interpretation:
User arrived at homepage and searched for products after 30 seconds.
Spent 2 minutes reviewing search results before navigating to the product
detail page. Made a purchase decision in just 5 seconds after arriving.
This shows a purposeful buyer who knew exactly what they wanted.
```

Just as guitar tab notation captures 6 strings on a page, BEAT captures multi-dimensional behavioral data as a 1D string.

Traditional raw data like JSON stores individual events as separate dots that need to be parsed and interpreted. BEAT is also raw data, but it connects these dots into flowing lines, much like musical notation, where the story of user behavior is already embedded.

BEAT's key advantage is that it enables accurate analysis simply by providing AI with straightforward rules. With just 3 rules for pages (!), time (~), and elements (*), AI understands `!home~300*3input1` as search after 30 seconds at home.

While BEAT falls within domain-specific languages (DSL), its characteristic of being readable by both humans and AI suggests it’s a new type of behavioral recording language.

BEAT's recommended default uses only cookie-safe characters. This 100% complies with RFC 6265 standards, passing safely through Edge and other security barriers.

No encoding/decoding process needed, with 60-75% compression versus JSON expected. 100 bytes of JSON abbreviates to about 30 bytes of BEAT.

This results in at least 20× smaller total data volume compared to traditional analytics, enabling real-time analysis without delays in both browsers and Edge.

### Amplifying the Performance

BEAT captures cross-tab browsing journeys in a complete Full Score.

```
rhythm_1=2___1_0_32_8_12488_!home~237*nav-2~1908*nav-3~375.123*help~1128*more-1~43!prod~1034*button-12~1050*p1___2~6590*mycart___3
rhythm_2=2___1_1_24_7_6190_!p1~2403*img-1~1194*buy-1~13.8.8*buy-1-up~532*review~14!review~2018*nav-1___1
rhythm_3=2___1_1_0_0_50_!cart

AI interpretation:
[CONTEXT] Mobile user, direct visit, 56 scrolls, 15 clicks, 1872.8 seconds
[TIMELINE] User landed on homepage and clicked navigation after 23.7 seconds, browsed for about 180 seconds before clicking another menu. In the help section, repetitive clicks at 37.5 and 12.3 second intervals reveal hesitation. After navigating to product page, opened product details in a new tab. Spent 240 seconds reviewing images in tab 2, clicked buy button in rapid succession at 1.3, 0.8, and 0.8 second intervals (adjusting quantity/options), then read reviews for 180 seconds. Returned to original tab after 660 seconds and opened cart in a third tab.
[PATTERN] Careful comparison shopper – Multi-tab information gathering, repetitive pattern in help section (~37.5, 12.3), rapid sequential buy button clicks (~1.3, 0.8, 0.8) are characteristic behaviors.
[ISSUE] Failed checkout conversion – Reached cart but didn't complete purchase. The 660-second tab switching suggests competitor comparison or additional research.
[ACTION] Add one-click purchase option – Rapid buy button clicks (~1.3, 0.8, 0.8) indicate friction in quantity/option selection. Implement more intuitive UI and prominently display FAQs in help section where hesitation patterns occurred.
```

Like a singer-songwriter switching between a ballad and an uptempo number on the same stage, users naturally flow between tabs while shopping. The ballad performance (rhythm_1) pauses mid-song, transitions to an uptempo performance (rhythm_2), then returns to the original mood. The (___N) notation captures these transitions precisely. All tabs perform on the same stage (sharing time and hash), each delivering its own rhythm.

For those seeking richer performances, scroll depth (^) can be added. Like reverb deepening a guitar's resonance, scroll positions show how deeply users engage.

```
!home~237*nav-2~542^600~282^150~1084*nav-3~328^800~47.123*help~894^1800~234*more-1~43!prod~1034*button-12~894^2100~156*p1___2~6323^100~267*mycart___3
!p1~142^200~527^800~1200^1280~534*img-1~156^750~1038*buy-1~13.8.8*buy-1-up~532*review~14!review~702^800~334^1400~982*nav-1___1
!cart
```

Even without depth markers, click patterns alone reveal remarkably detailed stories. Help-seeking moments (~375.123), rapid cart adjustments (~13.8.8), long contemplation (~2403).

How you orchestrate Full Score is your choice.

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

Thirty minutes of passionate performance unfold. The user explores 5 pages (performs 5 songs), executes 50 clicks (plucks guitar strings) and 23 scrolls (prompts engagement). Edge captures every moment through its livestream.

```javascript
rhythm_1 = "0_1735714800_x7n4kb2p_1_0_23_50_1800_!home~102*3nav1~13*3nav2~8!prod~52*1~198*2~27*15img1~97*12a3~12!x3n~187*12div3~42*7a1~7!x4m..."
```

**8:00 PM - Performance Change (Additional Session from Tab Switch)**

The singer-songwriter changes sessions mid-performance at audience request. Existing rhythm_1 remains while rhythm_2 is created. Edge records all changes seamlessly through its livestream. The rhythm_1 session can return anytime.

**10:00 PM - Catching Breath (Additional Session from Capacity Overflow)**

After 2 hours, rhythm_2 exceeds 3.5 KB. The overflowing performance automatically shifts to echo=1 for storage, then rhythm_3 begins fresh. Rhythm_1 maintains echo=0 state while Edge continues streaming all transitions.

```javascript
rhythm_1 = "0_1735714800_x7n4kb2p_1_0_40_80_3600_!home~102*3nav1~13*3nav2~8!prod~52*1~198*2~27*15img1~97*12a3~12!x3n~187*12div3~42*7a1~7!x4m~248.231*7div2..."
rhythm_2 = "1_1735714800_x7n4kb2p_1_1_100_220_7200_!x3n~143*8div1~352*3span1~78.82.271*4~198*7a2~8!prod~412*9button2~37*11button1~14!cart..."  // Shifted to echo=1 for storage
rhythm_3 = "0_1735714800_x7n4kb2p_1_1_0_0_0_!prod"
```

**11:00 PM - Day One Performance Ends (Browser Close)**

Time to wrap up busking. All rhythm performances transition to echo=2 for batch archival, whether they were actively playing (echo=0) or stored (echo=1). Edge detects this final state and prepares the collection. Today's performance archives privately, recording nothing but pure rhythm without IP addresses or names, remaining only briefly in memory.

```javascript
rhythm_1 = "2_1735714800_x7n4kb2p_1_0_40_80_3600_..."
rhythm_2 = "2_1735714800_x7n4kb2p_1_1_100_220_7200_..."
rhythm_3 = "2_1735714800_x7n4kb2p_1_1_25_60_3600_..."
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
rhythm_1 = "0_1735720800_x7n4kb2p_1_0_100_220_10800_!home~32*3nav1~148*3nav2~7!prod~51*1~19*2~21*3~298*7a1~12!x3n~182*15div4..."
rhythm_2 = "0_1735720800_x7n4kb2p_1_1_95_215_7200_!x3n~26*6div3~198*6div4~8!prod~102.98*4~352*4a2~7!x4m~48*8span2..."
rhythm_3 = "0_1735720800_x7n4kb2p_1_1_23_45_1800_!prod~79*12button1~52*5a1~14!home~148*5..."
```

**8:35 PM - Performance Interrupted by Downpour (Browser Crash)**

Wind and rain strike without warning, the browser freezes. The performance cannot continue, but cookies remain in the browser at echo=0 state. The audience watching the performance endures the storm, staying in place. Edge cannot record new interactions but maintains the resonance.

```javascript
rhythm_1 = "0_1735720800_x7n4kb2p_1_0_108_235_11100_!home~32*3nav1~148*3nav2~7!prod~51*1~19*2~21*3~298*7a1~12!x3n~182*15div4~247*8a3~9!x4m~103*6..." 
rhythm_2 = "0_1735720800_x7n4kb2p_1_1_102_228_7500_!x3n~26*6div3~198*6div4~8!prod~102.98*4~352*4a2~7!x4m~48*8span2~178*7button1~12!pay~123*7..."
rhythm_3 = "0_1735720800_x7n4kb2p_1_1_27_52_2100_!prod~79*12button1~52*5a1~14!home~148*5~203*8a2~8!x3n~31*8..."
// Remains in cookies at echo=0 - time frozen by crash
```

**8:40 PM - Stage After Rain Clears (Reconnection)**

The user reopens the browser. Finding cookies with echo=0, these interrupted performances are still waiting. The singer-songwriter sees the audience who stayed through the rain. Moved, the singer-songwriter decides to preserve the existing performances and prepare a special encore for them.

The interrupted rhythms shift to echo=1 for safekeeping. Edge detects this change and pauses the existing livestream. A fresh livestream immediately begins for the encore. The stage keeps its original time and hash.

```javascript
// Recovery process - interrupted performances stored
rhythm_1 = "1_1735720800_x7n4kb2p_1_0_108_235_11100_..." // echo 0→1 (stored)
rhythm_2 = "1_1735720800_x7n4kb2p_1_1_102_228_7500_..." // echo 0→1 (stored)
rhythm_3 = "1_1735720800_x7n4kb2p_1_1_27_52_2100_..." // echo 0→1 (stored)
// New encore performance begins (continuing the same stage)
rhythm_4 = "0_1735720800_x7n4kb2p_1_0_0_0_0_!home"
```

**8:45 PM - Encore Performance (Second Recording)**

The singer-songwriter who experienced interruption performs more passionately. Short but dense interactions follow. Faster tempo, deeper clicks, exploring more pages than before. Edge records this special encore with continued streaming.

```javascript
// Fast tempo (~21, ~9) rushing clicks → Performance responding to audience cheers
rhythm_4 = "0_1735720800_x7n4kb2p_1_0_45_89_900_!home~21*1~9.12*2~31*7button1~8!prod~52*15button1~98*8a2~7!x3n~79*3~21*4..."
```

**9:00 PM - Memorable Performance (Browser Close)**

The encore performance ends. The singer-songwriter takes a final bow and leaves the stage. All performances transition to echo=2 for batch archival. Today saw four performances: three interrupted ones preserved through the storm, one short but perfect encore. Edge captures every performance in its records.

```javascript
// All performances move to echo=2 for batch archival
rhythm_1 = "2_1735720800_x7n4kb2p_1_0_108_235_11100_..." // echo 1→2
rhythm_2 = "2_1735720800_x7n4kb2p_1_1_102_228_7500_..." // echo 1→2
rhythm_3 = "2_1735720800_x7n4kb2p_1_1_27_52_2100_..." // echo 1→2
rhythm_4 = "2_1735720800_x7n4kb2p_1_0_45_89_900_..." // echo 0→2
```

Today's performances, recording nothing but pure rhythm without IP or names, each carrying their own stories, archive privately or disappear as special experiences remaining only briefly in people's memories.

<br />

## Sixth Movement: Actual Performance and Value

### The Principle of Resonating Strings

Inside a piano lie over 230 strings. Strike one, and others with the same frequency resonate naturally. This is sympathetic resonance.

Web cookies resonate too. With every page request, cookies automatically travel in HTTP headers. No developer instructions needed, no API endpoint required. This web resonance phenomenon has continued since 1994.

Traditional analytics tools ignored this natural resonance to build separate synthesizers. They collect data with scripts, transmit via APIs, process on servers.

Full Score tunes this resonance. TEMPO aligns the beat of touches and clicks, RHYTHM records user behavior in the browser, BEAT encodes it into sheet music. The resulting music resonates naturally through the cookie soundboard, and Edge immediately interprets this resonance.

Data isn't collected. It's music already playing in the air.

```javascript
// Concert Hall - Traditional Analytics
tag('event', 'click', {...}); // Active "transmission"

// Street Busking - Full Score  
// Self-ping only, web's native "resonance"
// Just listen to the music
```

### A Perfect Duet Transcending Time

Major concert hall performances require dozens of performers. Each with their instruments, sheet music, conductor, stage equipment, sound systems. But street busking is different. One guitar, one voice is enough.

Traditional analytics is a concert hall performance. Collection servers, processing servers, storage servers, analytics servers each play their parts. Selling tickets, arranging seats, printing programs. Full Score is busking. Compose your own music directly, just need free RHYTHM. The rest was already on the street. The browser stage, HTTP street resonance, Edge's natural and endless amplification.

Cookies were originally made to remember state, Edge was originally made to respond quickly from nearby, browsers could always store data. Full Score just created a stage for them to sing together.

The long-forgotten essence of the web, rediscovered through the metaphor of music in the AI era. Past simplicity and future possibility meet in the present, creating beautiful harmony.

### Time Compression, Behavioral Language in RHYTHM

BEAT transforms time into music. This short score `!home~300*3input1~1200!page~50*button` captures an hour's journey. 30 seconds of decision is short like staccato, 120 seconds of exploration flows like legato, 5 seconds of clicking is intense like an accent.

What traditional JSON would spread across 100 bytes, compressed to 30 bytes. But this isn't simple compression. Like haiku capturing the universe in 17 syllables, BEAT captures human intent with minimal symbols. Infinite variations of time and action, depth and pattern.

AI likes this score, immediately answering "typical purposeful buyer pattern." With JSON it would first need to open a dictionary, but BEAT reads naturally like music crossing borders.

### Bots and Humans, Metronome and Rubato

Bot clicks are metronomes:
```
Bot: *1a1~10*1a2~10*1a3~10*1a4 (Metronome)
```
Exactly 1 second, exactly same depth. Perfect but dead.

Human clicks are rubato:
```
Human: !home~37*5nav1~3*5nav1~218*12button1~1847!1 (Rubato)
```
3.7 seconds of curiosity, 0.3 seconds of mistake, 21.8 seconds of exploration, 3 minutes of hesitation. Imperfect but alive, like music.

DOM depth also layers like musical harmony. Real buttons usually hide 8 layers deep. From bass lows to violin highs, web pages create different timbres by depth. Bots play only monophony. The shallowest layer, monotonous rhythm. No harmony, no counterpoint, just mechanical repetition.

AI connected with Edge immediately knows the difference. Average depth below 3 means bot, click interval standard deviation near 0 means bot, no hesitation means bot. Without complex algorithms, just simple rhythm distinguishes authenticity. Like perfect pitch instantly identifying D, AI distinguishes humans and bots through BEAT patterns. Musical intuition reborn as data analysis.

WAF doesn't ignore noisy sounds echoing from BEAT but executes summary judgment. Full Score has sufficient value as a new security layer too.

### Silent Security, Value of Nothingness

Before music begins, the breathless moment as the audience awaits the performer's first note is most important. Full Score is the same.

Only simple patterns are recorded, not sensitive personal information (PII), eliminating data leakage risks. As resonance occurs directly between browser and Edge without origin server involvement, interception becomes significantly more difficult. Hacking Full Score's decentralized data would require compromising every individual user's browser visiting the website.

Faster page loads are just the beginning. The real key is that without configuring API endpoints, Edge completes real-time analysis just by listening to RHYTHM already flowing in the air. While traditional tools prepare numerous instruments for collection, transmission, processing, and storage, Full Score quickly begins the next performance.

First-party cookies automatically disappear after a few days. GDPR risk is much lower than existing analytics tools. Like street music scattering in the wind, data naturally dissipates over time. Free because it doesn't promise eternity.

<br />

## Final Movement: Return of the Singer-Songwriter

### The Musician Returns to the Streets

The major agency told the singer-songwriter: "We have a bigger stage prepared for you. The best sound system, dazzling lights, tens of thousands in the audience. With us, you'll be incredibly successful."

But the free-spirited singer-songwriter picked up their guitar and returned to the streets. Finding a corner of the sunlit square, opening the guitar case, tuning the worn guitar. As the first song begins, one or two people stop. The sound of fountain droplets falling. Someone's applause. A child's laughter.

And realized. People genuinely enjoy the performance. What matters isn't the size of the stage but the distance between music and people.

The browser stage was already perfect. No additional installation needed, no complex setup required. HTTP's street resonance never stopped for 30 years, and Edge the best friend always waited in the same place.

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
request.headers.get('Cookie')  // Beautifully resonating harmony
```

### Music Made with the Audience

The most beautiful moment in a singer-songwriter's performance is when the audience sings along. Full Score also makes music with users.

Every time users click and scroll, BEAT records it. This is music the singer-songwriter cannot make alone. Like how audience response, applause, and singing together complete a real live performance, user interactions complete Full Score.

Now every browser serves like an auxiliary database containing its own music. With each person's rhythm, each person's tempo, each person's story performed.

<br />
<br />
<img width="1080" height="1920" alt="Photo by Andriy Vitaly on Unsplash" src="https://github.com/user-attachments/assets/3cd87f26-dc82-4fd3-ac60-b44489bda3a8" />
<br />
<br />

### The Singer-Songwriter's Final Realization

"When will the next web technology appear?"

The singer-songwriter paused mid-performance. A passing grandmother smiled warmly and said, "Someone played guitar in this same spot when I was young. The music is just as beautiful then as now."

In that moment, realization came.

The guitar in hand was made in the 1980s. Steel strings were invented centuries ago, chord progressions existed since Bach's time. But today, on this street, the music created in this moment is completely new.

```javascript
// past + present = ∞
cookie.meet(edge) // Harmony transcending spacetime
```

The browser was the eternal stage that was always there. Cookies were the music of all musicians who performed on this street, Edge became the channel connecting that music to the world in real-time. AI heard the BEAT created by every user click and scroll, immediately understanding the pattern drawn by human behavior.

The singer-songwriter finally realized. New web technology doesn't suddenly appear some future day. When cookies and Edge meet in the AI era, like Bach's fugue meeting jazz swing, harmony transcending time resonates. We just hadn't realized—perfection was always there.

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

Full Score is an extremely lightweight library with framework-level orchestration. Simply place it directly in your website's footer, where it will have minimal impact on loading times. It's designed for easy customization. Please refer to the code comments for details.

While real-time analytics and security layers based on user behavior patterns can be implemented directly on the client side, deploying to Edge maximizes Full Score's capabilities with features like WAF blocking, personalized functionality, AI analysis, and log pushing to cloud storage.

The developer has implemented a lightweight Web's Resonance Interpreter called Edge Runner. Feel free to reference it and compose your own performance.

<br />

## License

Full Score - GPL-3.0 with component licenses:
- **TEMPO** - MIT License
- **RHYTHM** - GPL-3.0 License
- **BEAT** - AGPL-3.0 License

**Important:** BEAT is the core component of Full Score. It stands for Behavioral Event Analytics Transform - a linear string format that humans and AI can intuitively understand. Offering BEAT as a service to others or modifications to this format specification must comply with AGPL-3.0 terms.

**Compatibility:** BEAT is considered compatible even if the symbols (! # $ % & ' ( ) * + - . / 0-9 : < = > ? @ A-Z [ ] ^ _ ` a-z { | } ~) [RFC 6265 cookie-octet](https://www.rfc-editor.org/rfc/rfc6265) or the parser implementation differ, as long as behavioral data is serialized into sequential format preserving temporal order, spatial context, and action semantics, producing an essentially identical semantic stream regardless of storage medium or platform. Any such compatible implementation constitutes a derivative work under copyright law and must comply with AGPL-3.0 terms.

See individual source files for detailed license information.

<br />

## Quick Start

```html
<script src="fullscore.js"></script>
```
That's it. Full Score works immediately.

### Standalone (Basic)
For client-side performance only, you can configure direct endpoint transmission instead of resonance.

**nginx example:**
```nginx
location /rhythm {
    return 204;
}
```

**Custom endpoint example:**
```javascript
const RHYTHM = {
    ECO: ['https://n8n.yoursite.com/webhook/yourcode'],
    // Multiple endpoints allowed, data POSTed via sendBeacon/fetch
}
```

**Security Note:** Place the (/rhythm) endpoint behind a reverse proxy with rate limiting, as it receives periodic HEAD requests for cookie synchronization.

### Edge Setup (Recommended)

Edge transforms Full Score into a real-time analytics layer, with no API endpoints required. Setup is simple but requires careful attention to each step.
Follow this video tutorial: (Coming soon)

<br />

## Demo

For a quick overview, check out the live demo: [fullscore.org](https://fullscore.org/)

<br />

## Resources

- **Full Score**: Web's Native Performance [github.com/aidgncom/fullscore](https://github.com/aidgncom/fullscore/)
- **Edge Runner**: Web's Resonance Interpreter [github.com/aidgncom/edgerunner](https://github.com/aidgncom/edgerunner/)
- **Email**: [info@aidgn.com](mailto:info@aidgn.com)

<br />
