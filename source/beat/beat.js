/**
 * BEAT - Behavioral Event Analytics Transform
 * Copyright (c) 2025 Aidgn
 * AGPL-3.0-or-later - See LICENSE file for details
 * 
 * A core structure for multi-dimensional event data, including the space where events occur,
 * the time when actions occur, and the depth of each action, in linear sequences.
 * These sequences express meaning without parsing (Semantic), preserve information
 * in their original state (Raw), and maintain a fully organized structure (Format).
 * Therefore, BEAT is the Semantic Raw Format (SRF) standard.
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