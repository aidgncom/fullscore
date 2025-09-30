/**
 * RHYTHM - Real-time Hybrid Traffic History Monitor
 * Copyright (c) 2025 Aidgn
 * GPL-3.0-or-later - See LICENSE file for details
 * 
 * A client-side engine that leverages users' browsers like auxiliary databases.
 * Unlike traditional approaches that send, store, and process data on servers,
 * it embeds core functionality in the browser. Connected with Edge Computing,
 * it enables real-time analysis and immediate response without server intervention.
 * It proposes a new paradigm with minimal data transfer, server operation, and processing costs.
 */

const RHYTHM = { // Real-time Hybrid Traffic History Monitor
	HIT: '/rhythm',		// Session activation and cookie resonance path (default: '/rhythm')
						// Edge observes real-time cookie resonance without endpoints
						// Edge Worker only monitors this specific path for analytics
	ECO: [				// Session endpoint and batch signal (default: '/rhythm/echo')
		'/rhythm/echo',	// Should use same path prefix as HIT for cookie consistency
						// Sends completion signal only, no need to specify exact endpoint paths
						// You can replace or add custom endpoints for direct data: 'https://n8n.yoursite.com/webhook/yourcode'
						// Custom endpoints expose public URLs. Use IP whitelist or reverse proxy for security
	],
	TIC: 100,			// Tick (default: 100ms)
	TAP: 3,				// Session refresh cycle (default: 3 clicks)
	THR: 1,				// Session refresh throttle (default: 1 ms)
	KEY: 8,				// Session key length (default: 8 chars)
	AGE: 259200,		// Session retention period (default: 3 days)
	MAX: 7,				// Maximum session count (default: 7 slots)
	CAP: 3500,			// Maximum session capacity (default: 3500 bytes)
	DEL: 1,				// Session deletion threshold (default: 1 clicks)
						// Below threshold not batched, 0 means all sessions batched
	REF: {				// Referrer mapping (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
		'google.com': 3,
		'youtube.com': 4,
		'cloudflare.com': 5,
		'claude.ai': 6,
		'chatgpt.com': 7,
		'meta.com': 8,
	},
	ADD: { 		// Addon features
		TAB: true,		// BEAT Cross-tab tracking addon (default: true)
		SCR: false,		// BEAT Scroll position tracking addon (default: false)
		SPA: false,		// Single Page Application addon (default: false)
		RCV: false,		// Keep crashed sessions for recovery after abnormal exit (default: false)
						// However, session time before and after recovery will not be identical
		POW: false,		// Power Mode for immediate batch on visibility change (default: false)
						// To explain the default mode POW=false first,
						// Full Score resonates the complete browsing journey including cross-tab only once.
						// However, due to browser pagehide event characteristics, transmission may be delayed or lost.
						// Delayed data will be re-batched and resonated when the user visits the website next time.
						// Consider Power Mode when total data volume matters more than journey completeness.
						// When setting POW=true, immediate batch triggers even on tab switches or app changes.
						// Unfortunately, immediate batch nature prevents cross-tab journey recording, so the feature is disabled.
						// However, these fragmented batches are all bound by the same time and key,
						// allowing the entire journey to be reconstructed into a single flow by considering batch order.
	}
};

class Rhythm {
	constructor() { // RHYTHM engine start
		this.hasBeat = typeof Beat !== 'undefined';
		this.hasTempo = typeof tempo !== 'undefined';
		this.ended = false;
		this.tail = '; Path=/; Max-Age=' + RHYTHM.AGE + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // Session retention period (default: 3 days)
		if (!this.get('score')) { // Browser session orchestrator
			this.clean(); // Remove echo=2 completed sessions
			this.batch(); // Batch sessions to edge or custom endpoints
			let key = '';
			for (let i = 0; i < RHYTHM.KEY; i++) key += '0123456789abcdefghijklmnopqrstuvwxyz'[Math.random() * 36 | 0];
			const time = Math.floor(Date.now() / RHYTHM.TIC); // Tick (default: 100ms)
			document.cookie = 'score=0000000000_' + time + '_' + key + '___; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
		} // Score fields modified by edge worker analyzing BEAT patterns to identify bot vs human behaviors ([0] bot security level, [1-9] human behavior flags)
		this.score = this.get('score'); // Store current score
		const parts = this.score.split('_');
		this.time = +parts[1];
		this.key = parts[2];
		this.session(); // Session management
		this.hasTempo ? tempo(this) : document.addEventListener('click', e => this.click(e.target), {capture: true}); // Tempo integration
		this.scrolling = false; // Debounce to count once per scroll gesture
		document.addEventListener('scroll', () => { // BEAT Scroll position tracking addon (default: false)
			this.data || this.session();
			if (!this.scrolling) this.scrolling = true, this.data.scrolls++, this.save(); // Count and save immediately
			clearTimeout(this.s), this.s = setTimeout(() => {
				this.hasBeat && RHYTHM.ADD.SCR && (this.beat.time(), this.beat.notes.push('^' + Math.round(window.scrollY))); // Record final scroll position
				this.scrolling = false;
			}, 150); // Reset after 150ms
		}, {capture: true, passive: true});
		RHYTHM.ADD.SPA && this.spa(); // Single Page Application addon (default: false)
		const end = () => { // RHYTHM engine stop
			if (this.ended) return; this.ended = true; // Prevent duplicate execution
			if (RHYTHM.DEL > 0) {
				for (let i = 1; i <= RHYTHM.MAX; i++) {
					const name = 'rhythm_' + i;
					const ses = this.get(name);
					if (ses && +(ses.split('_')[6] || 0) < RHYTHM.DEL) { // Session deletion threshold (default: 1 clicks)
						document.cookie = name + '=; Max-Age=0; Path=/';
						if (name === window.name) this.data = null, this.beat = null, window.name = '';
					}
				}
			}
			const ses = this.get(window.name);
			if (ses && ses[0] === '0') document.cookie = window.name + '=1' + ses.slice(1) + this.tail; // Mark as echo=1 temporarily, but quickly restores to echo=0 on refresh or navigation
			setTimeout(() => /rhythm_\d+=0/.test(document.cookie) || this.batch(true), 1); // Skip batch if any echo=0 tabs exist
		}; // setTimeout(1) isn't just for delay. Browsers can process short macrotasks after pagehide event
		RHYTHM.ADD.POW && document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && end(), { capture: true }); // Power Mode for immediate batch on visibility change (default: false)
		window.addEventListener('pagehide', end, { capture: true });
	}
	click(el) { // Click action and cookie refresh
		this.data || this.session();
		this.data.clicks++;
		if (this.hasBeat) this.beat.element(el);
		this.save();
		if (this.data.clicks % RHYTHM.TAP === 0) { // After first request, abort others to save bandwidth
			const ctrl = new AbortController();
			fetch(location.origin + (RHYTHM.HIT === '/' ? '' : RHYTHM.HIT) + '/?livestreaming', // Session activation and cookie resonance path (default: '/rhythm')
				{method: 'HEAD', signal: ctrl.signal, credentials: 'include', redirect: 'manual', keepalive: true}).catch(() => {}); // Abort+keepalive trick fires and forgets with guaranteed delivery
			if (this.data.clicks > RHYTHM.TAP) setTimeout(() => ctrl.abort(), RHYTHM.THR); // Session refresh cycle (default: 3 clicks)
		}
		return el;
	}
	get(g) { // Get cookie
		const c = '; ' + document.cookie + ';', i = c.indexOf('; ' + g + '=');
		return i < 0 ? null : c.slice(i + g.length + 3, c.indexOf(';', i + g.length + 3));
	}
	clean(force = false) { // Remove echo=2 completed sessions
		for (let i = 1; i <= RHYTHM.MAX; i++) {
		    const name = 'rhythm_' + i;
		    if (force || this.get(name)?.[0] === '2') document.cookie = name + '=; Max-Age=0; Path=/';
		}
	    if (force) this.data = null, this.beat = null, window.name = '';
	}
	batch(force = false) { // Batch sessions to edge or custom endpoints
		const cookies = document.cookie.match(/rhythm_\d+=[^;]*/g);
		if (!force) {
			if (cookies) {
				for (let i = 0; i < cookies.length; i++) { // Preserve crashed sessions as echo=1
					const updated = cookies[i].replace(/=./, '=1');
					document.cookie = updated + this.tail;
				}
			}
			if (RHYTHM.ADD.RCV === true) return; // Keep crashed sessions for recovery after abnormal exit (default: false)
		}
		if (cookies) {
			const updates = []; // Gather echo data
			for (let i = 0; i < cookies.length; i++) {
				const updated = cookies[i].replace(/=./, '=2'); // Mark as echo=2
				document.cookie = updated + this.tail;
				updates.push(updated);
			}
			const data = updates.join('');
			for (const echo of RHYTHM.ECO) { // Session endpoint and batch signal (default: '/rhythm/echo')
				const url = echo[0] === 'h' ? echo : location.origin + echo;
				navigator.sendBeacon(url, data) || fetch(url, {method: 'POST', body: data, keepalive: true}).catch(() => {}); // Send with fallback
			}
		}
		this.clean(true);
	}
	session(force = false) { // Session management
		if (!force) {
			if (window.name.startsWith('rhythm_')) { // Page restoration using window.name
				const ses = this.get(window.name);
				if (ses) { // Restore existing session
					const parts = ses.split('_');
					const flow = parts.slice(8).join('_'); // Extract BEAT flow from session
					this.data = {name: window.name, time: +parts[1], key: parts[2], device: +parts[3], referrer: +parts[4], scrolls: +parts[5], clicks: +parts[6]}; // Convert string to object
					if (this.hasBeat) {
						this.beat = new Beat();
						if (flow) {
							this.beat.notes = [flow];
							this.beat.tick = Date.now(); // Initialize timing
						}
						this.beat.page(location.pathname); // Add current page to BEAT
					}
					this.save(); // Save updated session
					return;
				}
				window.name = ''; // Clear invalid session
			}
		}
		let name = null; // Available session slot finder
		for (let i = 1; i <= RHYTHM.MAX; i++) { // Maximum session count (default: 7)
			if (!this.get('rhythm_' + i)) {
				name = 'rhythm_' + i;
				break;
			}
		}
		if (!name) { // If all sessions in use
			this.batch(true); 
			this.data = null; // Cookie-based leader election without coordination overhead
			const newTime = Math.floor(Date.now() / RHYTHM.TIC);
			document.cookie = 'score=' + this.score.split('_')[0] + '_' + newTime + '_' + this.key + '___; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); // New score signal
			this.time = newTime;
			name = 'rhythm_1';
		}
		window.name = name; // Store session name in window.name
		const ua = navigator.userAgent; // User agent for device detection
		const ref = document.referrer; // Referrer URL for traffic source analysis
		const domain = ref?.match(/^https?:\/\/([^\/]+)/)?.[1] || ''; // Parse hostname from referrer URL
		let index = !ref ? 0 : domain === location.hostname ? 1 : 2;
		if (index === 2 && domain) for (const key in RHYTHM.REF) if (domain === key || domain.endsWith('.' + key)) { index = RHYTHM.REF[key]; break; } // Referrer mapping (0=direct, 1=internal, 2=unknown, 3-255=specific domains)
		this.data = {name: name, time: this.time, key: this.key, device: /mobi/i.test(ua) ? 1 : /tablet|ipad/i.test(ua) ? 2 : 0, referrer: index, scrolls: 0, clicks: 0}; // Create new session
		if (this.hasBeat) {
			this.beat = new Beat(); // Create new BEAT instance
			this.beat.page(location.pathname);
		}
		this.save();
	}
	save() { // Save session data to cookie
		const current = this.get('score') || this.score;
		if (+current.split('_', 2)[1] !== +this.score.split('_', 2)[1]) { // Score change detection
			this.score = current;
			this.data = null; // Follow the new time signal from leader
			this.session(true);
			return; // Restart with fresh session
		}
		const number = window.name.slice(7);
		const parts = current.split('___');
		const tabs = parts[1] || '';
		if (!tabs.endsWith('~' + number) && tabs !== number) { // RHYTHM Cross-tab tracking
			document.cookie = 'score=' + parts[0] + '___' + (tabs ? tabs + '~' : '') + number + '; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
			if (this.hasBeat && RHYTHM.ADD.TAB && !RHYTHM.ADD.POW) { // BEAT Cross-tab tracking addon (default: true)
				const before = tabs.split('~').pop();
				if (before && before !== number) {
					const ses = this.get('rhythm_' + before); // Mark tab switch in previous session
					if (ses && ses[0] === '0') {
						const flow = ses.split('_');
						flow[flow.length - 1] += '___' + number;
						document.cookie = 'rhythm_' + before + '=' + flow.join('_') + this.tail;
					}
				}
			}
		}
		if (this.hasBeat && RHYTHM.ADD.TAB && !RHYTHM.ADD.POW) { // BEAT Cross-tab tracking addon (default: true)
			const ses = this.get(window.name);
			if (ses && ses[0] === '0') {
				const flow = ses.split('_').slice(8).join('_');
				if (flow.match(/___\d+$/)) { // Tab switch marker detected
					const mem = this.beat.flow();
					let i = 0;
					while (flow[i] === mem[i]) i++; // Find exact divergence point for integrity
					this.beat.notes = [flow + mem.slice(i)]; // Merge flows
				}
			}
		}
		const save = [0, this.data.time, this.data.key, this.data.device, this.data.referrer, this.data.scrolls, this.data.clicks, Math.floor(Date.now() / RHYTHM.TIC) - this.data.time, this.beat?.flow() || ''].join('_'); // Build session string
		document.cookie = this.data.name + '=' + save + this.tail;
		if (save.length > RHYTHM.CAP) { // Maximum session capacity (default: 3500 bytes)
			document.cookie = this.data.name + '=' + ('1' + save.slice(1)) + this.tail; // Mark as echo=1
			return void this.session(true); // Rotate session if capacity exceeded
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

document.addEventListener('DOMContentLoaded', () => new Rhythm()); // Cue the performance