import mermaid from 'mermaid'

function getCodeContent(code: Element): string {
	const codeLines = code.querySelectorAll(':scope > .ec-line')
	if (codeLines.length > 0) {
		const lines = Array.from(codeLines).map((line) => {
			let lineText = ''
			for (const child of Array.from(line.children)) {
				if (child.classList.contains('code')) {
					lineText += child.textContent || ''
				}
			}
			return lineText
		})
		const content = lines.join('\n')
		return content
	}

	const directContent = code.textContent || ''

	const cleanedContent = directContent.split('\n')
		.map(line => line.replace(/^\d+\s*/, ''))
		.filter(line => line.trim())
		.join('\n')

	return cleanedContent
}

function isMermaidContent(text: string): boolean {
	const trimmed = text.trim()
	if (!trimmed) return false

	const mermaidKeywords = [
		'graph',
		'sequenceDiagram',
		'classDiagram',
		'stateDiagram',
		'erDiagram',
		'pie',
		'gitGraph',
		'journey',
		'gantt',
		'mindmap',
		'timeline',
		'flowchart',
		'C4Context',
	]

	const firstLine = trimmed.split('\n')[0].trim()

	for (const keyword of mermaidKeywords) {
		if (firstLine.startsWith(keyword)) {
			return true
		}
	}

	return false
}

export function renderMermaid() {
	console.log('=== renderMermaid called ===')

	mermaid.initialize({
		startOnLoad: false,
		theme: 'dark',
		securityLevel: 'loose',
	})

	const codes = document.querySelectorAll('code')
	console.log('Found code elements:', codes.length)

	let mermaidCount = 0

	codes.forEach((code, index) => {
		const content = getCodeContent(code)
		const firstLine = content.trim().split('\n')[0].trim()

		if (isMermaidContent(content)) {
			console.log(`>>> Found mermaid block at index ${index + 1}: "${firstLine.substring(0, 50)}..."`)
			mermaidCount++

			const pre = code.closest('pre') as HTMLElement
			if (!pre) {
				console.log('No parent pre element found')
				return
			}

			if (!content.trim()) {
				console.log('Content is empty, skipping')
				return
			}

			const wrapper = document.createElement('div')
			wrapper.className = 'mermaid-container'
			pre.replaceWith(wrapper)

			const uniqueId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000000)}`
			mermaid.render(uniqueId, content).then((result: { svg: string }) => {
				wrapper.innerHTML = result.svg
				console.log('Mermaid rendered successfully')
			}).catch((error: Error) => {
				console.error('Mermaid rendering error:', error)
				wrapper.textContent = `Mermaid error: ${error.message}`
			})
		}
	})

	console.log(`=== renderMermaid finished, rendered ${mermaidCount} mermaid diagrams ===`)
}

document.addEventListener('DOMContentLoaded', () => {
	console.log('>>> DOMContentLoaded fired, calling renderMermaid')
	renderMermaid()
})

if (window.swup) {
	window.swup.hooks.on('page:view', () => {
		console.log('>>> page:view fired, calling renderMermaid')
		renderMermaid()
	})
} else {
	document.addEventListener('swup:enable', () => {
		window.swup.hooks.on('page:view', () => {
			console.log('>>> page:view fired, calling renderMermaid')
			renderMermaid()
		})
	})
}
