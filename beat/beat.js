/**
 * BEAT - Behavioral Event Analytics Transform
 * Copyright (c) 2025 Aidgn
 * AGPL-3.0-or-later - See LICENSE file for details
 * 
 * A domain-specific language (DSL) that transforms multi-dimensional behavioral data 
 * into linear sequences. It captures when actions occur (time), where users navigate 
 * (space), and what they do (actions with depth). This compression transforms complex 
 * user journeys into single strings that both humans and AI can read. While serving 
 * as RHYTHM's core data format, BEAT maintains versatility for use in other systems.
 */

const BEAT = { 	// Behavioral Event Analytics Transform
	TIC: 100,	// Tick (default: 100ms)
	TOK: {		// Token mapping (default: cookie safe)
				// Compatibility: BEAT is considered compatible even if the symbols
				// (! # $ % & ' ( ) * + - . / 0-9 : < = > ? @ A-Z [ ] ^ _ ` a-z { | } ~) RFC 6265 cookie-octet or the parser implementation differ,
				// as long as behavioral data is serialized into sequential format preserving temporal order, spatial context, and action semantics, 
				// producing an essentially identical semantic stream regardless of storage medium or platform. Any such compatible implementation 
				// constitutes a derivative work under copyright law and must comply with AGPL-3.0 terms.
		P: '!',			// Page
		E: '*',			// Element
		T: '~',			// Time
		A: '.',			// Again
		L: '.',			// Loop
	},
	MAP: {				// Manual mapping (default: automatic)
		P: {					// Page URL paths
			'/': 'home', 		// Homepage reserved word (result: !home)
			'/english/': 'en', 	// Multilingual path example (result: !en)
		},
		E: {					// Element id or class selectors
			'#close-button': 'close',	// Close button example (result: *close)
			'.open-modal': 'm',			// Modal button example (result: *m)
		}
	}
};

class Beat {
	constructor(config = {}) { // BEAT core start
		this.config = { timeUnit: BEAT.TIC, ...config };
		this.notes = [];
		this.table = {};
		this.maps = { pages: { ...BEAT.MAP.P }, elements: { ...BEAT.MAP.E } };
		this.tick = Date.now();
	}
	time() { // Record elapsed time
		const now = Date.now(), elapsed = Math.floor((now - this.tick) / this.config.timeUnit);
		if (elapsed > 0) {
			this.notes.push(BEAT.TOK.T + elapsed);
			this.tick = now;
		}
	}
	page(p) { // Generate and record page hash
		this.time();
		if (this.maps.pages[p]) return void this.notes.push(BEAT.TOK.P + this.maps.pages[p]); // Pre-mapped pages applied immediately
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
	element(e) { // Record element clicks as a linear DOM depth string
		if (!e || e.nodeType === 3 && !(e = e.parentElement)) return;
		this.time();
		const key = e.id ? '#' + e.id : typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/)[0] : null;
		if (key && this.maps.elements[key]) return void this.fold(BEAT.TOK.E + this.maps.elements[key]); // Pre-mapped elements applied immediately
		let depth = 0, el = e; // Calculate DOM depth
		while (el && el !== document.body) depth++, el = el.parentElement;
		const tag = e.tagName.toLowerCase();
		let index = 1, prev = e.previousElementSibling;
		while (prev) prev.tagName.toLowerCase() === tag && index++, prev = prev.previousElementSibling;
		this.fold(BEAT.TOK.E + depth + tag + index);
	}
	flow() { return this.notes.join(''); } // Generate final BEAT string
}