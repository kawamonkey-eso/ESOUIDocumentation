const { writeFile } = require('node:fs/promises')

;(async () => {
	const response = await fetch('https://raw.githubusercontent.com/esoui/esoui/master/ESOUIDocumentation.txt')
	const text = await response.text()
	const [, title] = text.match(/h1\. (.+)/)

	let html = `
<!doctype html>
<html lang="en" data-bs-theme="auto">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<title>${title}</title>
<link rel="canonical" href="https://kawamonkey-eso.github.io/ESOUIDocumentation/">
<link rel="stylesheet" href="scss/styles.scss">
<script type="module" src="js/main.js"></script>
</head>
<body data-bs-spy="scroll" data-bs-target="#toc">
<main>
<div class="container-fluid">
<div class="row">
<div class="col-2">
<nav id="toc" class="sticky-top"></nav>
</div>
<div class="col">`

	html += text
		.replace(/h(\d)\. ?(.+)/g, (match, p1, p2) => `<h${p1} id="${p2.replace(/ /g, '_')}">${p2}</h${p1}>`)
		.replace(/(\s|\()_(\S+)_/g, "$1<em>$2</em>")
		.replace(/(\s|\()\*(\S+)\*/g, "$1<strong>$2</strong>")
		.replace(/\* (.+)\n\*\* (.+)/g, '<ul><li>$1<ul><li>$2</li></ul></li></ul>')
		.replace(/\* ?(.+)/g, '<ul><li>$1</li></ul>')
		.replace(/<\/ul>\n<ul>/g, "\n")
		.replace(/\[(.+?)\|(#.+?)\]/g, '<a href="$2">$1</a>')
		.replace(/\.\.\./g, '&hellip;')
		.replace(/{TOC.+}/, '')

	html += `
</div>
</div>
</div>
</main>
</body>
</html>`

	await writeFile('src/index.html', html)
})()