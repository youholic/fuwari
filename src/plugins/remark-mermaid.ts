import { visit } from "unist-util-visit"
import type { Root } from "mdast"

export function remarkMermaid() {
	return (tree: Root) => {
		visit(tree, "code", (node) => {
			if (node.lang === "mermaid") {
				node.data = node.data || {}
				node.data.hProperties = node.data.hProperties || {}
				node.data.hProperties.class = `language-mermaid mermaid-block`
			}
		})
	}
}
