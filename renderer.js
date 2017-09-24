// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// JS file run min the app


const fs = require('fs')
const path = require('path')

const app = document.querySelector('#app')

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
// app.innerHTML = getUserHome()
let readThis = getUserHome()
fs.readdir(readThis, (err, res) => {
	console.log(res)
	const dirs = res.filter(x => x[0] !== '.')
	app.innerHTML = `${dirs.map(r => `<button data-dir="${r}">${r}</button>`).join('\n')}`
})

/* eslint-disable */
function handleClick(e) {
	console.log(e)
	if (e.target.nodeName.toLowerCase() === 'button') {
		// const newDir = e.target.getAttribute('data-dir')
		const { target } = e
		const newDir = target.textContent
		const prevDir = readThis
		readThis = target.getAttribute('data-type') === 'breadcrumb' ? target.getAttribute('data-dir') : path.join(readThis, newDir)

		fs.readdir(readThis, (err, res) => {
			console.log(res)
			if (err) {
				window.alert(`Oops, I can't read ${readThis}`)
				readThis = prevDir
				return
			} else {
				const dirs = res.filter(x => x[0] !== '.') // filter invsible files

				const breadcrumb = readThis.split('/').reduce((output, current) => {
					if (current === '') return output
					let update = output
					update.push(`${output.slice(-1)[0] || ''}/${current}`)
					return update
				}, [''])
				
				app.innerHTML = `<h4>${breadcrumb.map(b => `<button data-type="breadcrumb" data-dir="${b}">${b.split('/')[b.split('/').length - 1]}</button>`).join(' / ')}</h4>
				<div class="buttons">
				${dirs.map(r => `<button data-dir="${r}">${r}</button>`).join('\n')}</div>`
			}
		})
	}
}

app.addEventListener('click', handleClick)

