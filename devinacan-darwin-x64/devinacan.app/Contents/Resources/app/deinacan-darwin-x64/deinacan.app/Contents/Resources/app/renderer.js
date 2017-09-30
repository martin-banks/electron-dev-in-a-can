// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// JS file run min the app


const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const { dialog } = require('electron').remote
const { ipcRenderer } = require('electron')

console.log({ dialog })

const app = document.querySelector('#app')
// dialog.showOpenDialog(mainWindow, {properties: ['openDirectory']}, filePaths => console.log(filePaths))

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}
console.log(process.env)

// app.innerHTML = getUserHome()
let readThis = getUserHome()
// fs.readdir(readThis, (err, res) => {
// 	console.log(res)
// 	const dirs = res.filter(x => x[0] !== '.')
// 	app.innerHTML = `${dirs.map(r => `<button data-dir="${r}">${r}</button>`).join('\n')}`
// })



/* eslint-disable */
function handleClick(e) {
	console.log(e)
	const { target } = e
	const newDir = target.textContent
	const prevDir = readThis
	if (e.target.getAttribute('data-type') === 'newdir') {
		console.log('making dir in', prevDir)
		mkdirp(`${prevDir}/foo`, err => console.log(err || 'folder created'))
		return
	} else if (e.target.nodeName.toLowerCase() === 'button') {
		// const newDir = e.target.getAttribute('data-dir')
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
					${dirs.map(r => `<button data-dir="${r}">${r}</button>`).join('\n')}
				</div>
				<section style="position: fixed; display: block; bottom: 0; left: 0; width: 100%; padding: 16px; background: #e2e2e2">
					<button data-type="newdir">new dir</button>
				</section>`
			}
		})
	}
}

app.addEventListener('click', handleClick)

document.querySelector('#openDir').addEventListener('click', function(e) {
	ipcRenderer.send('openstuff')
})
document.querySelector('#dostuff').addEventListener('click', function(e) {
	ipcRenderer.send('dostuff', ['magick', 'my new folder'])
})

ipcRenderer.on('reply', (e, arg) => window.alert('reply:' + arg))
