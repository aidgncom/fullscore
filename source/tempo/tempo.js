/**
 * TEMPO - Tap Event Method Performance Optimizer
 * Copyright (c) 2025 Aidgn
 * MIT License - See LICENSE file for details
 * 
 * A 50-line snippet that improves tap event speed and accuracy. Like an orchestra
 * conductor synchronizing different instruments' tempos, it harmonizes mobile and
 * desktop interactions. Without offbeats, every touch and click completes as a
 * single note. While it provides immediate improvements standalone, when used with
 * RHYTHM, it becomes a gateway for collecting user interaction data.
 */

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
tempo(); // Standalone use