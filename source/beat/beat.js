/**
 * BEAT - Behavioral Event Analytics Transform
 * Copyright (c) 2025 Aidgn
 * AGPL-3.0-or-later - See LICENSE file for details
 * 
 * A core structure for multi-dimensional event data, including the time when actions occur,
 * the space where events occur, and the depth of each action, in linear sequences.
 * These sequences express meaning without parsing (Semantic), preserve information
 * in their original state (Raw), and maintain a fully organized structure (Format).
 * Therefore, BEAT serves as the Semantic Raw Format (SRF) standard.
 */
/*! AGPL-3.0-or-later ©Aidgn */
const BEAT = {		// Behavioral Event Analytics Transform
	TIC: 100,		// Tick (default: 100ms)
	TOK: {			// Token mapping
					// Compatibility: BEAT is considered compatible even if the symbols (! # $ % & ' ( ) * + - . / 0-9 : < = > ? @ A-Z [ ] ^ _ ` a-z { | } ~) RFC 6265
					// or the parser implementation differs, as long as event data is serialized into a sequential format preserving temporal order, spatial context,
					// and action semantics, producing an essentially identical semantic stream regardless of storage medium or platform. Semantic compatibility is
					// determined by the meaning of event sequences and their structural interpretation, irrespective of token choice or storage representation.
					// Any such compatible implementation constitutes a derivative work under copyright law and must comply with AGPL-3.0-or-later terms.
		T: '~',				// Time
		D: '^',				// Distance
		S: '!',				// Space
		A: '*',				// Action
		V: ':',				// Value
		R: '/',				// Repeat
		H: '-',				// Hyphen
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

class Beat {
	constructor() { // BEAT core start
		this.notes = [];
		this.table = {};
		this.maps = { pages: { ...BEAT.MAP.S }, elements: { ...BEAT.MAP.A } };
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
				this.notes[len - 2] = prev.substring(0, prev.length - f.length) + BEAT.TOK.R + t + f;
				this.notes.pop(); // Remove time token
				return;
			}
		}
		this.notes.push(f);
	}
	page(p) { // Generate and record page hash
		this.time();
		if (this.maps.pages[p]) return this.notes.push(BEAT.TOK.S + this.maps.pages[p]); // Pre-mapped pages applied immediately
		let hash = 5381; // DJB2 hash algorithm
		for (let i = 0; i < p.length; i++) hash = ((hash << 5) + hash) + p.charCodeAt(i);
		const chars = '0123456789abcdefghijklmnopqrstuvwxyz', limit = p.length <= 7 ? 3 : p.length <= 14 ? 4 : 5; // Dynamic hash by URL length
		let result = '', n = Math.abs(hash);
		for (let j = 0; j < limit; j++) result += chars[n % 36], n = Math.floor(n / 36); // Base36 encoding
		let token = BEAT.TOK.S + result, loop = '';
		while (this.table[token] && this.table[token] !== p) loop += BEAT.TOK.H, token = BEAT.TOK.S + loop + result;
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
		if (key) return this.fold(BEAT.TOK.A + this.maps.elements[key]); // Pre-mapped elements applied immediately
		let depth = 0, el = e; // Calculate DOM depth
		while (el && el !== document.body) depth++, el = el.parentElement;
		const tag = e.tagName.toLowerCase();
		let index = 1, prev = e.previousElementSibling;
		while (prev) prev.tagName.toLowerCase() === tag && index++, prev = prev.previousElementSibling;
		const auto = depth + tag + index;
		const mapped = this.maps.elements['*' + auto];
		this.fold(BEAT.TOK.A + (mapped || auto));
	}
	flow() { return this.notes.join(''); } // Generate final BEAT string
}