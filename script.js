const errAlert = document.querySelector("[data-err-box]")
const errMsg = document.querySelector("[data-err-msg]")

const newForm = document.querySelector("[data-new-form]") 
const newTitle = document.querySelector("[data-new-title]")
const newDate = document.querySelector("[data-new-date]")

const countdown = document.querySelector("[data-countdown]")
const countdownTitle = document.querySelector("[data-countdown-title]")
const countdownTime = document.querySelectorAll("[data-countdown-time]")

const completed = document.querySelector("[data-completed]")
const completedInfo = document.querySelector("[data-completed-info]")

const newBtn = document.querySelectorAll("[data-new-btn]")

let timeUpdaterInterval, errTimeout

// Time Units
const second = 1000 
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour

newBtn.forEach(btn => 
    btn.addEventListener("click", e => {
        clearInterval(timeUpdaterInterval)

        newForm.hidden = false
        countdown.hidden = true
        completed.hidden = true
}))

newForm.addEventListener('submit', e => {
    e.preventDefault()
    const title = newTitle.value.trim()
    const date = new Date(newDate.value).getTime()

    const isInvalid = date <= Date.now();
    if (title === '' || isNaN(date) || isInvalid) {
        let message = title === ""
        ? "Please Enter Title!"
        : isNaN(date)
        ? "Please Enter Date!"
        : "Please Enter Future Date"

        notificator(message)
        return
    }
    countdownCreator(title, date)
})

function notificator(message) {
    errMsg.innerText = message

    clearTimeout(errTimeout);

    errAlert.classList.remove('hide')
    void errAlert.offsetWidth
    errAlert.classList.add('show')

    errTimeout = setTimeout(() => {
        errAlert.classList.add('hide')
        errAlert.classList.remove('show')
    }, 3000)
}

function countdownCreator(title, date) {
    clearInterval(timeUpdaterInterval)

    countdownTitle.innerText = title
    timeUpdaterInterval = setInterval(() => timeUpdater(date), second)

    localStorage.setItem('countdown', JSON.stringify({'title': title, 'date': date}))
    
    countdown.hidden = false
    newForm.hidden = true
    completed.hidden = true
}

function timeUpdater(date) {
    let distance = date - Date.now();

    if (distance <= 0) {
        countdownComplete(countdownTitle.innerText, date);
        clearInterval(timeUpdaterInterval);
        return;
    }
    
    const days = Math.floor(distance / day)
    const hours = Math.floor(distance % day / hour)
    const minutes = Math.floor(distance  % hour / minute)
    const seconds = Math.floor(distance  % minute / second)
    
    countdownTime[0].innerText = days
    countdownTime[1].innerText = hours
    countdownTime[2].innerText = minutes
    countdownTime[3].innerText = seconds
}

function countdownComplete(title, date) {
    completed.hidden = false
    countdown.hidden = true
    newForm.hidden = true

    completedInfo.innerText = `${title} Finished on ${new Date(date).toISOString().split('T')[0]}`
}

const previousCountdown = JSON.parse(localStorage.getItem('countdown'))
if (previousCountdown) {
    countdownCreator(previousCountdown.title, previousCountdown.date)
}