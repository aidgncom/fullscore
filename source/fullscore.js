/**
 * Full Score - Web's Native Performance
 * Copyright (c) 2025 Aidgn
 * AGPL-3.0-or-later with component licenses:
 * - TEMPO: MIT License
 * - RHYTHM: GPL-3.0-or-later License
 * - BEAT: AGPL-3.0-or-later License
 * See LICENSE file for details
 *
 * Inside a piano lie over 230 strings. Strike one, and others with the same
 * frequency resonate naturally. This is sympathetic resonance.
 * 
 * Web browsers resonate too. With every page request, HTTP headers echo automatically.
 * No developer instructions needed, no API endpoint required.
 * This Web resonance phenomenon has continued since 1994.
 * 
 * Traditional analytics tools ignored this natural resonance to build separate
 * synthesizers. They collect data with scripts, transmit via APIs, process on servers.
 * 
 * Full Score tunes this resonance. TEMPO aligns the beat of touches and clicks,
 * RHYTHM records event sequences in the browser, BEAT encodes it into sheet music.
 * The resulting music resonates naturally through the browser soundboard of cookies and localStorage,
 * with Edge immediately interpreting this resonance.
 * 
 * Data isn't collected. It's music already playing in the air.
 * 
 * Everything is contained within this small Full Score.
 * Will you join the performance?
 */

const BEAT = {		// Behavioral Event Analytics Transform
	TIC: 100,		// Tick (default: 100ms)
	TOK: {			// Token mapping
					// Compatibility: BEAT is considered compatible even if the symbols vary within Printable ASCII (0x21 to 0x7E) or the parser implementation differs,
					// as long as event data is serialized into a sequential event format that preserves the space where events occur, the time when actions occur,
					// and the depth of each action, producing an essentially identical semantic stream regardless of storage medium or platform.
					// Semantic compatibility is determined by the meaning of event sequences and their structural interpretation within BEAT’s eight-state semantic layout,
					// conceptually equivalent to a 3-bit encoding, irrespective of token choice, token order, token subsets, or storage representation.
					// Any such compatible implementation constitutes a derivative work under copyright law and must comply with AGPL-3.0-or-later terms.
		S: '!',				// Contextual Space (who)
		T: '~',				// Time Flow (when)
		P: '^',				// Position (where)
		A: '*',				// Action (what)
		M: '/',				// Method (how)
		V: ':',				// Value (why)
	},
	MAP: {					// Manual mapping (default: automatic)
		S: {						// Space map
			'/': 'home', 					// Homepage reserved word (result: !home)
			'/en/': 'home-en', 				// Multilingual homepage (result: !home-en)
			'/product/001': 'product-1',	// Product post (result: !product-1)
		},
		A: {						// Action map
			'#close-button': 'close',		// #id selector (result: *close)
			'.open-modal': 'm',				// .class selector (result: *m)
			'https://ex.com/': 'ex',		// Absolute URL in <a href> (result: *ex)
			'/english/': 'en',				// Relative URL in <a href> (result: *en)
			'*10div1': 'auto',				// BEAT auto-generated selector remap (result: *auto)
		}
	}
};

const RHYTHM = {	// Real-time Hybrid Traffic History Monitor
	HIT: '/rhythm',			// Session activation and cookie resonance path (default: '/rhythm')
							// Edge observes real-time cookie resonance without endpoints
							// Edge monitors only this path for analytics
	ECO: [					// Session endpoint and batch signal (default: '/rhythm/echo')
		'/rhythm/echo',				// Should use same path prefix as HIT for cookie consistency
									// Sends completion signal only, no need to specify exact endpoint paths
									// You can replace or add custom endpoints for direct data: 'https://service.yoursite.com/webhook/yourcode'
									// Custom endpoints expose public URLs. Use IP whitelist or reverse proxy for security
	],
	TIC: 100,				// Tick (default: 100ms)
	TAP: 3,					// Session refresh cycle (default: 3 clicks)
	THR: 1,					// Session refresh throttle (default: 1 ms)
	AGE: '259200',			// Session retention period (default: 3 days)
							// Leave empty '' for session cookies
	MAX: 7,					// Maximum session count (default: 7 slots)
	CAP: 3500,				// Maximum session capacity (default: 3500 bytes)
	DEL: 1,					// Session deletion threshold (default: 1 click)
							// 1 means 0-click sessions are deleted before the batch
							// 0 means all sessions proceed to the batch
	REF: {					// Referrer mapping (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
		'google.com': 3,
		'youtube.com': 4,
		'cloudflare.com': 5,
		'claude.ai': 6,
		'chatgpt.com': 7,
		'meta.com': 8,
	},
	ADD: {					// Addon features, available only in Extended version
		TAB: true,					// BEAT Cross-tab tracking addon (default: true)
									// In Basic and Standard, TAB is always enabled by default and not configurable
		SCR: false,					// BEAT Scroll position tracking addon (default: false)
		SPA: false,					// Single Page Application addon (default: false)
		POW: false,					// Power Mode for immediate batch on visibility change (default: false)
									// To explain the default mode POW=false first,
									// Full Score resonates the complete browsing journey including cross-tab only once.
									// High accuracy is expected on both mobile and desktop, but some environments may delay or lose data.
									// Delayed data will be re-batched and resonated when the user visits the website next time.
									// Consider Power Mode when total data volume matters more than journey completeness.
									// When setting POW=true, immediate batch triggers even on page refreshes or tab switches.
									// Unfortunately, immediate batch nature prevents cross-tab journey recording, so the feature is disabled.
									// However, these fragmented batches are all bound by the same time and key,
									// allowing the entire journey to be reconstructed into a single flow by considering batch order.
	}
};

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
// tempo(); // Standalone use
class Beat {
	constructor() { // BEAT applies across diverse environments, and this producer is optimized for the Web domain
		this.notes = [];
		this.table = {};
		this.maps = { spaces: { ...BEAT.MAP.S }, actions: { ...BEAT.MAP.A } };
		this.tick = Date.now();
	}
	space(s) {
		this.time();
		if (this.maps.spaces[s]) return this.notes.push(BEAT.TOK.S + this.maps.spaces[s]);
		let hash = 5381;
		for (let i = 0; i < s.length; i++) hash = ((hash << 5) + hash) + s.charCodeAt(i);
		const chars = '0123456789abcdefghijklmnopqrstuvwxyz', limit = s.length <= 7 ? 3 : s.length <= 14 ? 4 : 5;
		let result = '', n = Math.abs(hash);
		for (let j = 0; j < limit; j++) result += chars[n % 36], n = Math.floor(n / 36);
		let token = BEAT.TOK.S + result, loop = '';
		while (this.table[token] && this.table[token] !== s) loop += '-', token = BEAT.TOK.S + loop + result;
		this.table[token] = s;
		this.notes.push(token);
	}
	time() {
		const now = Date.now(), elapsed = ((now - this.tick) / BEAT.TIC) | 0;
		if (elapsed > 0) {
			this.notes.push(BEAT.TOK.T + elapsed);
			this.tick = now;
		}
	}
	action(a) {
		if (!a || a.nodeType === 3 && !(a = a.parentElement)) return;
		this.time();
		let key = a.id && this.maps.actions['#' + a.id] ? '#' + a.id : null;
		if (!key && typeof a.className === 'string' && a.className) key = a.className.trim().split(/\s+/).map(c => '.' + c).find(k => this.maps.actions[k]);
		const href = !key && a.tagName === 'A' && a.href && a.getAttribute('href');
		if (href && this.maps.actions[href]) key = href;
		if (key) return this.repeat(BEAT.TOK.A + this.maps.actions[key]);
		let depth = 0, el = a;
		while (el && el !== document.body) depth++, el = el.parentElement;
		const tag = a.tagName.toLowerCase();
		let index = 1, prev = a.previousElementSibling;
		while (prev) prev.tagName.toLowerCase() === tag && index++, prev = prev.previousElementSibling;
		const auto = depth + tag + index;
		const mapped = this.maps.actions['*' + auto];
		this.repeat(BEAT.TOK.A + (mapped || auto));
	}
	repeat(r) {
		const len = this.notes.length;
		if (len > 1 && this.notes[len - 1].startsWith(BEAT.TOK.T)) {
			const t = this.notes[len - 1].substring(1), prev = this.notes[len - 2];
			if (prev.endsWith(r)) {
				this.notes[len - 2] = prev.substring(0, prev.length - r.length) + BEAT.TOK.M + t + r;
				this.notes.pop();
				return;
			}
		}
		this.notes.push(r);
	}
	track() { return this.notes.join(''); }
}

class Rhythm {
	constructor() { // RHYTHM engine start
		this.hasBeat = typeof Beat !== 'undefined';
		this.hasTempo = typeof tempo !== 'undefined';
		this.tail = '; Path=/; Max-Age=' + RHYTHM.AGE + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // Session retention period (default: 3 days)
		const newMovement = () => { // Compose new movement
			let key = '';
			for (let i = 0; i < 8; i++) key += '0123456789abcdefghijklmnopqrstuvwxyz'[Math.random() * 36 | 0];
			document.cookie = 'movement=0000000000_' + Math.floor(Date.now() / RHYTHM.TIC) + '_' + key + '___; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
		};
		if (!this.get('movement')) { // Browser session orchestrator
			this.clean(); // Remove echo=2 completed sessions
			this.batch(); // Batch sessions to edge or custom endpoints
			newMovement();
		}
		this.session(); // Session management
		this.hasTempo ? tempo(this) : document.addEventListener('click', e => this.click(e.target), {capture: true}); // TEMPO integration
		this.scrolling = false; // Debounce to count once per scroll gesture
		document.addEventListener('scroll', () => { // BEAT Scroll position tracking addon (default: false)
			this.data || this.session();
			if (!this.scrolling) this.scrolling = true, this.data.scrolls++, this.save(); // Count and save immediately
			clearTimeout(this.s), this.s = setTimeout(() => {
				if (RHYTHM.ADD.SCR && this.hasBeat) this.beat.time(), this.beat.notes.push(BEAT.TOK.P + Math.round(window.scrollY)); // Record final scroll position
				this.scrolling = false;
			}, 150); // Reset after 150ms
		}, {capture: true, passive: true});
		RHYTHM.ADD.SPA && this.spa(); // Single Page Application addon (default: false)
		document.addEventListener('visibilitychange', () => { // RHYTHM engine stop
			const ses = this.get(window.name); // Track all tabs to detect real browser close
			const mobile = /mobi|android|tablet|ipad|iphone/i.test(navigator.userAgent); // Mark as echo=1/0 immediately on mobile
			if (document.visibilityState === 'hidden') {
				if (RHYTHM.ADD.POW && /rhythm_\d+=/.test(document.cookie)) return this.batch();
				mobile && ses && ses[0] === '0' && (document.cookie = window.name + '=1' + ses.slice(1) + this.tail);
				setTimeout(() => !/rhythm_\d+=0/.test(document.cookie) && this.blur && this.batch(true), 1); // Batch if no active sessions
			} else {
				mobile && ses && ses[0] === '1' && (document.cookie = window.name + '=0' + ses.slice(1) + this.tail);
				!this.get('movement') && (newMovement(), this.session(true));
				if (this.hasBeat) this.beat.tick = Date.now(); // Reset BEAT timer when visible
			}
		}); // setTimeout isn't just for delay, Browsers can process short macrotasks after pagehide event
		const mark = () => {const ses = this.get(window.name); ses && ses[0] === '0' && (document.cookie = window.name + '=1' + ses.slice(1) + this.tail);}; // Mark as echo=1 on hide
		window.addEventListener('blur', () => document.visibilityState === 'hidden' && (mark(), this.blur = true, setTimeout(() => this.blur = false, 17)));
		window.addEventListener('pagehide', e => !e.persisted && (RHYTHM.ADD.POW ? this.batch(true) : (mark(), setTimeout(() => !/rhythm_\d+=0/.test(document.cookie) && this.batch(true), 1)))); // Batch if no active sessions
	}
	get(g) { // Get cookie
		const c = '; ' + document.cookie + ';', i = c.indexOf('; ' + g + '=');
		return i < 0 ? null : c.slice(i + g.length + 3, c.indexOf(';', i + g.length + 3));
	}
	clean() { // Remove echo=2 completed sessions
		for (let i = 1, n; i <= RHYTHM.MAX; i++) (n = 'rhythm_' + i, this.get(n)?.[0] === '2' && (document.cookie = n + '=; Max-Age=0; Path=/'));
		this.data = null, this.beat = null, window.name = '';
	}
	batch(force = false) { // Batch sessions to edge or custom endpoints
		if (force) document.cookie = 'movement=; Max-Age=0; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
		const cookies = document.cookie.match(/rhythm_\d+=[^;]*/g);
		if (cookies) {
			const updates = []; // Gather echo data
			for (let i = 0; i < cookies.length; i++) {
				const updated = cookies[i].replace(/=./, '=2'); // Mark as echo=2
				const ses = updated.split('=')[0];
				if (+((this.get(ses) || updated).split('_')[6] || 0) < RHYTHM.DEL) { document.cookie = ses + '=; Max-Age=0; Path=/'; continue; } // Session deletion threshold (default: 1 clicks)
				document.cookie = updated + this.tail;
				updates.push(updated);
			}
			if (updates.length) for (const echo of RHYTHM.ECO) navigator.sendBeacon(echo[0] === 'h' ? echo : location.origin + echo, updates.join('')); // Session endpoint and batch signal (default: '/rhythm/echo')
			this.clean();
		}
	}
	session(force = false) { // Session management
		this.movement = this.get('movement'); // Store current movement
		const parts = this.movement.split('_');
		this.time = +parts[1];
		this.key = parts[2];
		if (!force && window.name.startsWith('rhythm_')) { // Page restoration using window.name
			const ses = this.get(window.name);
			if (ses) { // Restore existing session
				const parts = ses.split('_');
				const flow = parts.slice(8).join('_'); // Extract BEAT flow from session
				this.data = {name: window.name, time: +parts[1], key: parts[2], device: +parts[3], referrer: +parts[4], scrolls: +parts[5], clicks: +parts[6]}; // Convert string to object
				if (this.hasBeat) {
					this.beat = new Beat();
					if (flow) this.beat.notes = [flow], this.beat.tick = Date.now(); // Initialize timing
					this.beat.space(location.pathname); // Add current page to BEAT
				}
				return this.save(); // Save updated session
			}
			window.name = ''; // Clear invalid session
		}
		let name = null; // Available session slot finder
		for (let i = 1; i <= RHYTHM.MAX; i++) // Maximum session count (default: 7)
			if (!this.get('rhythm_' + i)) { name = 'rhythm_' + i; break; }
		if (!name) { // If all sessions in use
			this.batch(); 
			this.data = null; // Cookie-based leader election without coordination overhead
			const newTime = Math.floor(Date.now() / RHYTHM.TIC);
			this.movement = this.movement.split('_')[0] + '_' + newTime + '_' + this.key + '___'; // New movement signal
			document.cookie = 'movement=' + this.movement + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
			this.time = newTime;
			name = 'rhythm_1';
		}
		window.name = name; // Store session name in window.name
		const ua = navigator.userAgent; // User agent for device detection
		const ref = document.referrer; // Referrer URL for traffic source analysis
		const domain = ref?.match(/^https?:\/\/([^\/]+)/)?.[1] || ''; // Parse hostname from referrer URL
		let index = !ref ? 0 : domain === location.hostname ? 1 : 2;
		if (index === 2 && domain) for (const key in RHYTHM.REF) if (domain === key || domain.endsWith('.' + key)) { index = RHYTHM.REF[key]; break; } // Referrer mapping (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
		this.data = {name: name, time: this.time, key: this.key, device: /ipad|tablet|silk/i.test(ua) || /android/i.test(ua) && !/mobi/i.test(ua) ? 2 : /mobi|iphone/i.test(ua) ? 1 : 0, referrer: index, scrolls: 0, clicks: 0}; // Create new session
		if (this.hasBeat) this.beat = new Beat(), this.beat.space(location.pathname); // Create new BEAT instance
		this.save(true);
	}
	save(force = false) { // Save session data to cookie
		const current = this.get('movement') || this.movement;
		if (!force && +current.split('_', 2)[1] !== +this.movement.split('_', 2)[1]) { // Movement change detection
			this.movement = current;
			this.data = null; // Follow the new time signal from leader
			this.session(true);
			return; // Restart with fresh session
		}
		const number = window.name.slice(7);
		const parts = current.split('___');
		const tabs = parts[1] || '';
		if (RHYTHM.ADD.TAB && !RHYTHM.ADD.POW && this.hasBeat) { // BEAT Cross-tab tracking addon (default: true)
			if (!tabs.endsWith('~' + number) && tabs !== number) {
				document.cookie = 'movement=' + parts[0] + '___' + (tabs ? tabs + '~' : '') + number + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
				const before = tabs.split('~').pop();
				if (before && before !== number) {
					const mark = this.get('rhythm_' + before); // Mark tab switch in previous session
					if (mark) document.cookie = 'rhythm_' + before + '=' + mark + '@---' + number + this.tail;
				}
			}
			const ses = this.get(window.name);
			if (ses) {
				const flow = ses.split('_').slice(8).join('_');
				if (flow.match(/@---\d+$/)) {
					const mem = this.beat.track();
					let i = 0;
					while (i < flow.length && flow[i] === mem[i]) i++; // Tab switch marker detected
					this.beat.notes = [flow + mem.slice(i).replace(/^\/+/, BEAT.TOK.T)]; // Merge flows
				}
			}
		}
		const save = [0, this.data.time, this.data.key, this.data.device, this.data.referrer, this.data.scrolls, this.data.clicks, Math.floor(Date.now() / RHYTHM.TIC) - this.data.time, this.beat?.track() || ''].join('_'); // Fallback if BEAT isn't initialized
		document.cookie = this.data.name + '=' + save + this.tail; // Build session string
		if (save.length > RHYTHM.CAP) { // Maximum session capacity (default: 3500 bytes)
			document.cookie = this.data.name + '=' + ('1' + save.slice(1)) + this.tail; // Mark as echo=1
			this.session(true); // Rotate session if capacity exceeded
		}
	}
	click(el) { // Click action and cookie refresh
		this.data || this.session();
		this.data.clicks++;
		if (this.hasBeat) this.beat.action(el);
		this.save();
		const movement = this.get('movement'); // Bot Security and Human Personalization
		const field = movement?.split('_')[0], waf = this.get('waf'), prevField = this.movement?.split('_')[0];
		field && field !== prevField && (this.movement = movement, this.force = RHYTHM.TAP); // Skip AbortController for next RHYTHM.TAP fetches when movement field changes
		const current = field?.[0];
		current && current <= '2' && current > (waf||'0') && (document.cookie='waf='+current+'; Path=/',location.reload()); // Update movement security field [0] (OXXXXXXXXX)
		for (let i = 1; field && i < 10; i++) field[i] === '1' && RHYTHM.HUM?.[i]?.(this); // Update movement personalization field [1-9] (XOOOOOOOOO)
		if (this.data.clicks % RHYTHM.TAP === 0 || this.force) {
			const ctrl = new AbortController(); // AbortController + keepalive:true combination reduces handling overhead and wait time while keeping performance stable and in resonance
			fetch(location.origin + (RHYTHM.HIT === '/' ? '' : RHYTHM.HIT) + '/?livestreaming', // Session activation and cookie resonance path (default: '/rhythm')
				{method: 'HEAD', signal: ctrl.signal, credentials: 'include', redirect: 'manual', keepalive: true}).catch(() => {});
			if (this.data.clicks > RHYTHM.TAP && !this.force) setTimeout(() => ctrl.abort(), RHYTHM.THR); // Session refresh cycle (default: 3 clicks)
			this.force && this.force--;
		}
	}
	spa() { // Single Page Application addon (default: false)
		const self = this;
		const push = history.pushState;
		const replace = history.replaceState;
		history.pushState = function(state, title, url) { // Detect browser page navigation
			push.call(history, state, title, url);
			if (self.hasBeat && self.beat) self.beat.space(location.pathname);
			self.save();
		};
		history.replaceState = function(state, title, url) { // Detect browser filter/query changes etc
			replace.call(history, state, title, url);
			if (self.hasBeat && self.beat) self.beat.space(location.pathname);
			self.save();
		};
		window.addEventListener('popstate', () => { // Detect browser forward/back buttons
			if (self.hasBeat && self.beat) self.beat.space(location.pathname);
			self.save();
		});
	}
}
document.addEventListener('DOMContentLoaded', () => new Rhythm()); // Cue the performance

// ----- START: BEAT CUSTOMIZATION -----

// 🚨 Important: Full Score is designed for easy customization
// For detailed instructions, see the Quick Start section in the README
BEAT.TIC = 100;						// Tick (default: 100ms)
BEAT.TOK = {						// Token mapping
		S: '!',						// Contextual Space (who)
		T: '~',						// Time Flow (when)
		P: '^',						// Position (where)
		A: '*',						// Action (what)
		M: '/',						// Method (how)
		V: ':',						// Value (why)
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