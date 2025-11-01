/**
 * Full Score - Web's Native Performance
 * Copyright (c) 2025 Aidgn
 * GPL-3.0-or-later with component licenses:
 * - TEMPO: MIT License
 * - RHYTHM: GPL-3.0 License
 * - BEAT: AGPL-3.0 License
 * See LICENSE file for details
 *
 * Inside a piano lie over 230 strings. Strike one, and others with the same
 * frequency resonate naturally. This is sympathetic resonance.
 * 
 * Web cookies resonate too. With every page request, cookies automatically travel
 * in HTTP headers. No developer instructions needed, no code required—this
 * web resonance phenomenon has continued since 1994.
 * 
 * Traditional analytics tools ignored this natural resonance to build separate
 * synthesizers. They collect data with scripts, transmit via APIs, process on servers.
 * 
 * Full Score tunes this resonance. TEMPO aligns the beat of touches and clicks,
 * RHYTHM records user behavior in the browser, BEAT encodes it into sheet music.
 * The resulting music resonates naturally through the cookie soundboard,
 * and Edge immediately interprets this resonance.
 * 
 * Data isn't collected. It's music already playing in the air.
 * 
 * Everything is contained within this small Full Score.
 * Will you join the performance?
 */

const BEAT = {		// Behavioral Event Analytics Transform
	TIC: 100,		// Tick (default: 100ms)
	TOK: {			// Token mapping (default: cookie safe)
					// Compatibility: BEAT is considered compatible even if the symbols
					// (! # $ % & ' ( ) * + - . / 0-9 : < = > ? @ A-Z [ ] ^ _ ` a-z { | } ~) RFC 6265 cookie-octet or the parser implementation differ,
					// as long as behavioral data is serialized into sequential format preserving temporal order, spatial context, and action semantics, 
					// producing an essentially identical semantic stream regardless of storage medium or platform. Any such compatible implementation 
					// constitutes a derivative work under copyright law and must comply with AGPL-3.0 terms.
		P: '!',				// Page
		E: '*',				// Element
		T: '~',				// Time
		A: '/',				// Again
		L: '-',				// Loop
	},
	MAP: {					// Manual mapping (default: automatic)
		P: {						// Page URL paths
			'/': 'home', 			// Homepage reserved word (result: !home)
			'/english/': 'en', 		// Multilingual path example (result: !en)
		},
		E: {						// Element id or class selectors
			'#close-button': 'close',		// ID selector example (#id)
			'.open-modal': 'm',				// Class selector example (.class)
		    'https://example.com/': 'ex',	// A tag href example (absolute URL)
		    '/english/': 'en',				// A tag href example (relative URL)
			'*10div1': 'auto',				// Example of remapping an auto-generated element
		}
	}
};

const RHYTHM = {	// Real-time Hybrid Traffic History Monitor
	HIT: '/rhythm',			// Session activation and cookie resonance path (default: '/rhythm')
							// Edge observes real-time cookie resonance without endpoints
							// Edge Worker only monitors this specific path for analytics
	ECO: [					// Session endpoint and batch signal (default: '/rhythm/echo')
		'/rhythm/echo',		// Should use same path prefix as HIT for cookie consistency
							// Sends completion signal only, no need to specify exact endpoint paths
							// You can replace or add custom endpoints for direct data: 'https://n8n.yoursite.com/webhook/yourcode'
							// Custom endpoints expose public URLs. Use IP whitelist or reverse proxy for security
	],
	TIC: 100,				// Tick (default: 100ms)
	TAP: 3,					// Session refresh cycle (default: 3 clicks)
	THR: 1,					// Session refresh throttle (default: 1 ms)
	KEY: 8,					// Session key length (default: 8 chars)
	AGE: 259200,			// Session retention period (default: 3 days)
	MAX: 7,					// Maximum session count (default: 7 slots)
	CAP: 3500,				// Maximum session capacity (default: 3500 bytes)
	DEL: 1,					// Session deletion threshold (default: 1 clicks)
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
	ADD: {			// Addon features
		TAB: true,			// BEAT Cross-tab tracking addon (default: true)
		SCR: false,			// BEAT Scroll position tracking addon (default: false)
		SPA: false,			// Single Page Application addon (default: false)
		POW: false,			// Power Mode for immediate batch on visibility change (default: false)
							// To explain the default mode POW=false first,
							// Full Score resonates the complete browsing journey including cross-tab only once.
							// High accuracy is expected on both mobile and desktop, but some environments may delay or lose data.
							// Delayed data will be re-batched and resonated when the user visits the website next time.
							// Consider Power Mode when total data volume matters more than journey completeness.
							// When setting POW=true, immediate batch triggers even on page refreshes or tab switches.
							// Unfortunately, immediate batch nature prevents cross-tab journey recording, so the feature is disabled.
							// However, these fragmented batches are all bound by the same time and key,
							// allowing the entire journey to be reconstructed into a single flow by considering batch order.
	},
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
			let el = e.target.closest('label')?.control || e.target; // Get real target from label
			rhythm && rhythm.click(el); // desktop RHYTHM integration
		}, {capture: true});
	}
}
// tempo(); // Uncomment for standalone use
class Beat {
	constructor() { // BEAT core start
		this.notes = [];
		this.table = {};
		this.maps = { pages: { ...BEAT.MAP.P }, elements: { ...BEAT.MAP.E } };
		this.tick = Date.now();
	}
	time() { // Record elapsed time
		const now = Date.now(), elapsed = ((now - this.tick) / BEAT.TIC) | 0;
		if (elapsed > 0) {
			this.notes.push(BEAT.TOK.T + elapsed);
			this.tick = now;
		}
	}
	fold(f) { // Fold repetitive elements
		const len = this.notes.length;
		if (len > 1 && this.notes[len - 1].startsWith(BEAT.TOK.T)) { // Time-based fold
			const t = this.notes[len - 1].substring(1), prev = this.notes[len - 2];
			if (prev.endsWith(f)) {
				this.notes[len - 2] = prev.substring(0, prev.length - f.length) + BEAT.TOK.A + t + f;
				this.notes.pop(); // Remove time token
				return;
			}
		}
		this.notes.push(f);
	}
	page(p) { // Generate and record page hash
		this.time();
		if (this.maps.pages[p]) return this.notes.push(BEAT.TOK.P + this.maps.pages[p]); // Pre-mapped pages applied immediately
		let hash = 5381; // DJB2 hash algorithm
		for (let i = 0; i < p.length; i++) hash = ((hash << 5) + hash) + p.charCodeAt(i);
		const chars = '0123456789abcdefghijklmnopqrstuvwxyz', limit = p.length <= 7 ? 3 : p.length <= 14 ? 4 : 5; // Dynamic hash by URL length
		let result = '', n = Math.abs(hash);
		for (let j = 0; j < limit; j++) result += chars[n % 36], n = Math.floor(n / 36); // Base36 encoding
		let token = BEAT.TOK.P + result, dots = ''; // Hash collision handling: add dots(.) in front to ensure uniqueness
		while (this.table[token] && this.table[token] !== p) dots += BEAT.TOK.L, token = BEAT.TOK.P + dots + result;
		this.table[token] = p;
		this.notes.push(token);
	}
	element(e) { // Record element clicks as a linear DOM depth string
		if (!e || e.nodeType === 3 && !(e = e.parentElement)) return;
		this.time();
		let key = e.id && this.maps.elements['#' + e.id] ? '#' + e.id : null;
		if (!key && typeof e.className === 'string' && e.className) key = e.className.trim().split(/\s+/).map(c => '.' + c).find(k => this.maps.elements[k]);
		const href = !key && e.tagName === 'A' && e.href && e.getAttribute('href');
		if (href && this.maps.elements[href]) key = href;
		if (key) return this.fold(BEAT.TOK.E + this.maps.elements[key]); // Pre-mapped elements applied immediately
		let depth = 0, el = e; // Calculate DOM depth
		while (el && el !== document.body) depth++, el = el.parentElement;
		const tag = e.tagName.toLowerCase();
		let index = 1, prev = e.previousElementSibling;
		while (prev) prev.tagName.toLowerCase() === tag && index++, prev = prev.previousElementSibling;
		const auto = depth + tag + index;
		const mapped = this.maps.elements['*' + auto];
		this.fold(BEAT.TOK.E + (mapped || auto));
	}
	flow() { return this.notes.join(''); } // Generate final BEAT string
}

class Rhythm {
	constructor() { // RHYTHM engine start
		this.hasBeat = typeof Beat !== 'undefined';
		this.hasTempo = typeof tempo !== 'undefined';
		this.tail = '; Path=/; Max-Age=' + RHYTHM.AGE + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // Session retention period (default: 3 days)
		const newScore = () => { // Compose new score
			let key = '';
			for (let i = 0; i < RHYTHM.KEY; i++) key += '0123456789abcdefghijklmnopqrstuvwxyz'[Math.random() * 36 | 0];
			document.cookie = 'score=0000000000_' + Math.floor(Date.now() / RHYTHM.TIC) + '_' + key + '___; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
		};
		if (!this.get('score')) { // Browser session orchestrator
			this.clean(); // Remove echo=2 completed sessions
			this.batch(); // Batch sessions to edge or custom endpoints
			newScore();
		} // Score fields modified by edge worker analyzing BEAT patterns to identify bot vs human behaviors ([0] bot security level, [1-9] human behavior flags)
		this.session(); // Session management
		this.hasTempo ? tempo(this) : document.addEventListener('click', e => this.click(e.target), {capture: true}); // Tempo integration
		this.scrolling = false; // Debounce to count once per scroll gesture
		document.addEventListener('scroll', () => { // BEAT Scroll position tracking addon (default: false)
			this.data || this.session();
			if (!this.scrolling) this.scrolling = true, this.data.scrolls++, this.save(); // Count and save immediately
			clearTimeout(this.s), this.s = setTimeout(() => {
				if (RHYTHM.ADD.SCR && this.hasBeat) this.beat.time(), this.beat.notes.push('^' + Math.round(window.scrollY)); // Record final scroll position
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
				!this.get('score') && (newScore(), this.session(true));
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
		if (force) document.cookie = 'score=; Max-Age=0; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
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
			if (updates.length) {
				const data = updates.join('');
				for (const echo of RHYTHM.ECO) { // Session endpoint and batch signal (default: '/rhythm/echo')
					const url = echo[0] === 'h' ? echo : location.origin + echo;
					navigator.sendBeacon(url, data) || fetch(url, {method: 'POST', body: data, keepalive: true}).catch(() => {}); // Send with fallback
				}
			}
			this.clean();
		}
	}
	session(force = false) { // Session management
		this.score = this.get('score'); // Store current score
		const parts = this.score.split('_');
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
					this.beat.page(location.pathname); // Add current page to BEAT
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
			this.score = this.score.split('_')[0] + '_' + newTime + '_' + this.key + '___'; // New score signal
			document.cookie = 'score=' + this.score + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
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
		if (this.hasBeat) this.beat = new Beat(), this.beat.page(location.pathname); // Create new BEAT instance
		this.save(true);
	}
	save(force = false) { // Save session data to cookie
		const current = this.get('score') || this.score;
		if (!force && +current.split('_', 2)[1] !== +this.score.split('_', 2)[1]) { // Score change detection
			this.score = current;
			this.data = null; // Follow the new time signal from leader
			this.session(true);
			return; // Restart with fresh session
		}
		const number = window.name.slice(7);
		const parts = current.split('___');
		const tabs = parts[1] || '';
		if (RHYTHM.ADD.TAB && !RHYTHM.ADD.POW && this.hasBeat) { // BEAT Cross-tab tracking addon (default: true)
			if (!tabs.endsWith('~' + number) && tabs !== number) {
				document.cookie = 'score=' + parts[0] + '___' + (tabs ? tabs + '~' : '') + number + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
				const before = tabs.split('~').pop();
				if (before && before !== number) {
					const mark = this.get('rhythm_' + before); // Mark tab switch in previous session
					if (mark) document.cookie = 'rhythm_' + before + '=' + mark + '___' + number + this.tail;
				}
			}
			const ses = this.get(window.name);
			if (ses) {
				const flow = ses.split('_').slice(8).join('_');
				if (flow.match(/___\d+$/)) {
					const mem = this.beat.flow();
					let i = 0;
					while (flow[i] === mem[i]) i++; // Tab switch marker detected
					this.beat.notes = [flow + mem.slice(i).replace(/^\/+/, BEAT.TOK.T)]; // Merge flows
				}
			}
		}
		const save = [0, this.data.time, this.data.key, this.data.device, this.data.referrer, this.data.scrolls, this.data.clicks, Math.floor(Date.now() / RHYTHM.TIC) - this.data.time, this.beat?.flow() || ''].join('_'); // Build session string
		document.cookie = this.data.name + '=' + save + this.tail;
		if (save.length > RHYTHM.CAP) { // Maximum session capacity (default: 3500 bytes)
			document.cookie = this.data.name + '=' + ('1' + save.slice(1)) + this.tail; // Mark as echo=1
			this.session(true); // Rotate session if capacity exceeded
		}
	}
	click(el) { // Click action and cookie refresh
		this.data || this.session();
		this.data.clicks++;
		if (this.hasBeat) this.beat.element(el);
		this.save();
		const score = this.get('score'); // Bot Detection and Human Personalization
		const field = score?.split('_')[0], waf = this.get('waf'), prevField = this.score?.split('_')[0];
		field && field !== prevField && (this.score = score, this.force = RHYTHM.TAP); // Skip abort for next RHYTHM.TAP fetches when score field changes
		const current = field?.[0], previous = prevField?.[0]; // Compare security level changes
		current && current >= '1' && (!waf || current > waf) && current !== previous && (document.cookie = 'waf=' + current + '; Path=/', location.reload()); // Update security field (OXXXXXXXXX)
		for (let i = 1; field && i < 10; i++) field[i] === '1' && RHYTHM.HUM?.[i]?.(this); // Update personalization field (XOOOOOOOOO)
		if (this.data.clicks % RHYTHM.TAP === 0 || this.force) { // After first request, abort others to save bandwidth
			const ctrl = new AbortController();
			fetch(location.origin + (RHYTHM.HIT === '/' ? '' : RHYTHM.HIT) + '/?livestreaming', // Session activation and cookie resonance path (default: '/rhythm')
				{method: 'HEAD', signal: ctrl.signal, credentials: 'include', redirect: 'manual', keepalive: true}).catch(() => {}); // Abort+keepalive trick fires and forgets with guaranteed delivery
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
			if (self.hasBeat && self.beat) self.beat.page(location.pathname);
			self.save();
		};
		history.replaceState = function(state, title, url) { // Detect browser filter/query changes etc.
			replace.call(history, state, title, url);
			if (self.hasBeat && self.beat) self.beat.page(location.pathname);
			self.save();
		};
		window.addEventListener('popstate', () => { // Detect browser forward/back buttons
			if (self.hasBeat && self.beat) self.beat.page(location.pathname);
			self.save();
		});
	}
}
RHYTHM.HUM = { // Works with Edge Runner humanPattern() detection.
	1: (rhythm) => { // Example uses slot 1. Slots 1-9 available.
		console.log('HumanExample');
		document.cookie = 'score=' + (rhythm.score = rhythm.score[0] + '2' + rhythm.score.substring(2)) + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // Marks as completed
	}
};
document.addEventListener('DOMContentLoaded', () => new Rhythm()); // Cue the performance
