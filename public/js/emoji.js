import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
import insertText from 'https://cdn.jsdelivr.net/npm/insert-text-at-cursor@0.3.0/index.js'

//Popup Menu
const emojiButton = document.querySelector('.emojiButton')
const tooltip = document.querySelector('.tooltip')
Popper.createPopper(emojiButton, tooltip)
emojiButton.addEventListener("click", () => {
    tooltip.classList.toggle('shown')
})

//Adding Emoji
const inputBox = document.querySelector('.message');
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    insertText(inputBox, e.detail.unicode)
})
