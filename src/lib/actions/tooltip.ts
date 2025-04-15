export function tooltip(node: HTMLElement, text: string | null) {
	if (!text) return;

	const tooltip = document.createElement('div');
	tooltip.textContent = text;
	tooltip.className = "absolute z-50 text-xs bg-black text-white px-2 py-1 rounded shadow pointer-events-none opacity-0 transition-opacity duration-200";
	tooltip.style.position = 'absolute';
	document.body.appendChild(tooltip);

	const show = () => {
		const rect = node.getBoundingClientRect();
		tooltip.style.top = `${rect.top - tooltip.offsetHeight - 6 + window.scrollY}px`;
		tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX}px`;
		tooltip.style.opacity = '1';
	};

	const hide = () => {
		tooltip.style.opacity = '0';
	};

	node.addEventListener('mouseenter', show);
	node.addEventListener('mouseleave', hide);

	return {
		destroy() {
			node.removeEventListener('mouseenter', show);
			node.removeEventListener('mouseleave', hide);
			document.body.removeChild(tooltip);
		},
		update(newText: string) {
			tooltip.textContent = newText;
		}
	};
}
