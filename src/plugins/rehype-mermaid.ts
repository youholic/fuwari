import { visit } from "unist-util-visit"
import type { Element } from "hast"

export function rehypeMermaid() {
	return (tree: Element) => {
		visit(tree, "element", (node) => {
			if (
				node.tagName === "pre" &&
				node.children.length === 1 &&
				node.children[0].type === "element" &&
				node.children[0].tagName === "code"
			) {
				const code = node.children[0]
				const className = code.properties?.className

				if (Array.isArray(className) && className.some((c) => typeof c === "string" && c.startsWith("language-mermaid"))) {
					node.properties = node.properties || {}
					const existingClass = node.properties.className
					node.properties.className = Array.isArray(existingClass)
						? [...existingClass, "mermaid-block"]
						: ["mermaid-block"]
				}
			}
		})
	}
}
