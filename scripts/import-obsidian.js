/* Import Obsidian vault to blog posts */

import fs from "fs"
import path from "path"

const OBSIDIAN_VAULT = process.argv[2]
const SERIES_NAME = process.argv[3] || path.basename(OBSIDIAN_VAULT || "")
const TARGET_DIR = "./src/content/posts/"

if (!OBSIDIAN_VAULT || !fs.existsSync(OBSIDIAN_VAULT)) {
	console.error(`Error: Invalid Obsidian vault path: ${OBSIDIAN_VAULT}`)
	console.error(`Usage: node scripts/import-obsidian.js <obsidian-vault-path> [series-name]`)
	process.exit(1)
}

const CATEGORY = SERIES_NAME
const TAGS = [SERIES_NAME]

function getDate() {
	const today = new Date()
	const year = today.getFullYear()
	const month = String(today.getMonth() + 1).padStart(2, "0")
	const day = String(today.getDate()).padStart(2, "0")
	return `${year}-${month}-${day}`
}

function sanitizeFilename(filename) {
	return filename
		.replace(/[[\]]/g, "")
		.replace(/\s+/g, " ")
		.trim()
}

// Language mapping for syntax highlighting
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

function processCodeBlocks(content) {
	return content.replace(/```(\w*)/g, (match, lang) => {
		if (!lang) return match

		const mappedLang = mapLanguage(lang)

		if (mappedLang !== lang) {
			return `\`\`\`${mappedLang}`
		}

		return match
	})
}

function convertWikiLinks(content, allFilesMap) {
	return content.replace(/\[\[(.*?)\]\]/g, (match, linkText) => {
		const parts = linkText.split("|")
		let targetFile = parts[0].trim()
		let displayText = parts[1] ? parts[1].trim() : targetFile

		targetFile = sanitizeFilename(targetFile)

		const targetPath = allFilesMap.get(targetFile)
		if (targetPath) {
			const relativePath = targetPath.replace(TARGET_DIR, "")
			const slug = relativePath.replace(/\.md$/, "")
			return `[${displayText}](/posts/${slug}/)`
		}

		return `[${displayText}](javascript:void(0))`
	})
}

function processFile(sourcePath, relativePath, allFilesMap) {
	const targetPath = path.join(TARGET_DIR, relativePath)

	const dirPath = path.dirname(targetPath)
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}

	let content = fs.readFileSync(sourcePath, "utf-8")

	const fileName = path.basename(sourcePath, ".md")
	const title = sanitizeFilename(fileName)

	const hasFrontmatter = content.startsWith("---")

	if (!hasFrontmatter) {
		const frontmatter = `---
title: ${title}
published: ${getDate()}
description: ""
image: ""
tags: ${JSON.stringify(TAGS)}
category: ${CATEGORY}
series: ${SERIES_NAME}
draft: false
lang: zh_CN
---
`
		content = frontmatter + "\n" + content
	} else {
		content = content.replace(
			/^---\n([\s\S]*?)\n---/,
			(match, existingFrontmatter) => {
				const lines = existingFrontmatter.split("\n")
				const frontmatterMap = {}

				lines.forEach(line => {
					const [key, ...valueParts] = line.split(":")
					if (key && valueParts.length > 0) {
						frontmatterMap[key.trim()] = valueParts.join(":").trim()
					}
				})

				frontmatterMap.title = title
				frontmatterMap.published = getDate()
				frontmatterMap.category = CATEGORY
				frontmatterMap.series = SERIES_NAME

				if (!frontmatterMap.tags) {
					frontmatterMap.tags = JSON.stringify(TAGS)
				}

				if (!frontmatterMap.draft) {
					frontmatterMap.draft = "false"
				}

				if (!frontmatterMap.lang) {
					frontmatterMap.lang = "zh_CN"
				}

				let newFrontmatter = "---\n"
				for (const [key, value] of Object.entries(frontmatterMap)) {
					newFrontmatter += `${key}: ${value}\n`
				}
				newFrontmatter += "---"

				return newFrontmatter
			}
		)
	}

	content = convertWikiLinks(content, allFilesMap)

	content = processCodeBlocks(content)

	fs.writeFileSync(targetPath, content, "utf-8")
}

function getAllMarkdownFiles(dir, baseDir = dir) {
	const files = new Map()

	function traverse(currentDir) {
		const entries = fs.readdirSync(currentDir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = path.join(currentDir, entry.name)

			if (entry.isDirectory()) {
				const skipDirs = [".obsidian", ".git", "node_modules", ".trash"]
				if (!skipDirs.includes(entry.name)) {
					traverse(fullPath)
				}
			} else if (entry.isFile() && entry.name.endsWith(".md")) {
				const relativePath = path.relative(baseDir, fullPath)
				const fileName = sanitizeFilename(path.basename(entry.name, ".md"))
				files.set(fileName, path.join(TARGET_DIR, relativePath))
			}
		}
	}

	traverse(dir)
	return files
}

console.log(`\n📦 Importing Obsidian vault: ${OBSIDIAN_VAULT}`)
console.log(`📚 Series name: ${SERIES_NAME}`)
console.log(`🏷️  Category: ${CATEGORY}`)
console.log(`🔖 Tags: ${TAGS.join(", ")}\n`)

console.log("🔍 Scanning for Markdown files...")
const allFiles = getAllMarkdownFiles(OBSIDIAN_VAULT)
console.log(`   Found ${allFiles.size} Markdown files\n`)

console.log("📝 Processing files...")
let processedCount = 0

function processDirectory(dir, relativePath = "") {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const skipDirs = [".obsidian", ".git", "node_modules", ".trash"]

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name)
		const entryRelativePath = path.join(relativePath, entry.name)

		if (entry.isDirectory()) {
			if (!skipDirs.includes(entry.name)) {
				processDirectory(fullPath, entryRelativePath)
			}
		} else if (entry.isFile() && entry.name.endsWith(".md")) {
			processFile(fullPath, entryRelativePath, allFiles)
			processedCount++
			console.log(`   ✓ ${entryRelativePath}`)
		}
	}
}

processDirectory(OBSIDIAN_VAULT)

console.log(`\n✅ Import complete! Processed ${processedCount} files.`)
console.log(`\n💡 Tips:`)
console.log(`   - Run \`pnpm dev\` to preview your blog`)
console.log(`   - Check imported files in ${TARGET_DIR}`)
console.log(`   - Review frontmatter if needed\n`)
