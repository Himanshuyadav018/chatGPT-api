import user from './assets/user.svg';
import bot from './assets/bot.svg';

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''
    loadInterval = setInterval(() => {
        element.textContent += '.'

        if(element.textContent === '....'){
            element.textContent = ''
        }
    }, 300)
}

function stepText(element, text) {
    let index = 0
    
    let interval = setInterval(() => {
        if(index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        }else {
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId() {
    let timeStamp = Date.now()
    let randomNumber = Math.random()
    let hexaDecimalString = randomNumber.toString(16)

    return(`id-${timeStamp}-${hexaDecimalString}`)
}

function createStripe(isAi, value, uniqueId) {
    return (
        `
        <div class='wrapper ${isAi && 'ai'}'>
            <div class='chat'>
                <div class='profile'>
                    <img src='${isAi ? bot : user}' alt='${isAi ? bot : user}' />
                </div>
                <div class='message' id=${uniqueId}>${value}</div>
            </div>
        </div>
        `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    let data = new FormData(form)

    // creating user's text
    chatContainer.innerHTML += createStripe(false, data.get('prompt'))

    form.reset()

    // creating bot text
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += createStripe(true, '', uniqueId)

    // scrolling to the current messages
    chatContainer.scrollTop = chatContainer.scrollHeight

    // getting current bot text message element
    const messageDiv = document.getElementById(uniqueId)
    loader(messageDiv)

    // sending prompt back to the server and getting the chatGpt bot's response
    const response = await fetch('https://chatgpt-api-x8cq.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                prompt: data.get('prompt')
                })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = ''

    if(response.ok) {
        const data = await response.json()
        console.log(data)
        const botText = data.bot.trim()

        stepText(messageDiv, botText)

    }else {
        const err = await response.text()

        messageDiv.innerHTML = 'something went wrong!'
        alert(err)
    }
}

form.addEventListener('submit', handleSubmit)

form.addEventListener('keyUp', (e) => {
    console.log(e)
    if(e.keyCode === 13) {
        handleSubmit(e)
    }
})