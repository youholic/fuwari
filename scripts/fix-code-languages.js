/* Pre-process markdown files to handle unsupported languages */

import fs from "fs"
import path from "path"

const POSTS_DIR = "./src/content/posts/"

// Language mapping for syntax highlighting
// Maps unsupported languages to supported alternatives
const LANGUAGE_MAP = {
	// HDL languages - map to C (similar syntax) or txt
	verilog: "c",
	systemverilog: "c",
	vhdl: "c",

	// Script languages
	tcl: "txt",

	// Other unsupported languages
	matlab: "matlab", // if supported, else txt
	julia: "julia", // if supported, else txt
}

// Fallback language if no mapping exists
const FALLBACK_LANGUAGE = "txt"

function mapLanguage(lang) {
	if (!lang) return FALLBACK_LANGUAGE

	const lowerLang = lang.toLowerCase().trim()

	// Direct match
	if (LANGUAGE_MAP[lowerLang]) {
		return LANGUAGE_MAP[lowerLang]
	}

	// Check for partial matches (case-insensitive)
	for (const [key, value] of Object.entries(LANGUAGE_MAP)) {
		if (lowerLang.includes(key) || key.includes(lowerLang)) {
			return value
		}
	}

	// Return the original language if it's commonly supported
	const commonLanguages = [
		"javascript", "typescript", "python", "java", "c", "cpp",
		"go", "rust", "ruby", "php", "swift", "kotlin", "scala",
		"html", "css", "json", "xml", "yaml", "toml", "sql",
		"bash", "sh", "powershell", "dockerfile", "makefile"
	]

	if (commonLanguages.includes(lowerLang)) {
		return lowerLang
	}

	return FALLBACK_LANGUAGE
}

function processCodeBlock(content, codeBlock) {
	const langMatch = codeBlock.match(/^```(\w*)/)
	if (!langMatch) return codeBlock

	const originalLang = langMatch[1]
	if (!originalLang) return codeBlock

	const mappedLang = mapLanguage(originalLang)

	if (mappedLang !== originalLang) {
		console.log(`   Mapping: ${originalLang} → ${mappedLang}`)
		return codeBlock.replace(/^```\w*/, `\`\`\`${mappedLang}`)
	}

	return codeBlock
}

function processMarkdownFile(filePath) {
	let content = fs.readFileSync(filePath, "utf-8")

	// Find and replace code blocks
	const codeBlockRegex = /```[\s\S]*?```/g
	let modified = false

	content = content.replace(codeBlockRegex, (codeBlock) => {
		const processed = processCodeBlock(content, codeBlock)
		if (processed !== codeBlock) {
			modified = true
		}
		return processed
	})

	if (modified) {
		fs.writeFileSync(filePath, content, "utf-8")
		return true
	}

	return false
}

function processDirectory(dir, relativePath = "") {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	let processedCount = 0
	let modifiedCount = 0

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		const entryRelativePath = path.join(relativePath, entry.name)

		if (entry.isDirectory()) {
			const { processed, modified } = processDirectory(fullPath, entryRelativePath)
			processedCount += processed
			modifiedCount += modified
		} else if (entry.isFile() && entry.name.endsWith(".md")) {
			processedCount++
			if (processMarkdownFile(fullPath)) {
				modifiedCount++
				console.log(`   ✓ Modified: ${entryRelativePath}`)
			}
		}
	}

	return { processed: processedCount, modified: modifiedCount }
}

console.log("🔧 Processing markdown files for language support...\n")

if (!fs.existsSync(POSTS_DIR)) {
	console.error(`❌ Error: Posts directory not found: ${POSTS_DIR}`)
	process.exit(1)
}

const { processed, modified } = processDirectory(POSTS_DIR)

console.log(`\n✅ Processing complete!`)
console.log(`   - Total files processed: ${processed}`)
console.log(`   - Files modified: ${modified}`)

if (modified > 0) {
	console.log(`\n💡 Languages have been mapped to supported alternatives.`)
	console.log(`   Run \`pnpm dev\` to verify the changes.`)
} else {
	console.log(`\n✨ All code blocks use supported languages!`)
}
