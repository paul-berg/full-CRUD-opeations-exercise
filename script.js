/**
    * Разработать многопользовательское приложение для заметок, состоящее из 2 страниц
    * 1. Логин
    * 2. Заметки
    * Меню с кнопкой "Выход" доступно только на странице заметок
    * При вводе логина пользователь попадает на страницу с заметками и, пока не выйдет, страница логина ему не доступна
    * Страница заметок не доступна без логина
    * При перезагрузке страницы, открытии-закрытии браузера логин должен сохраняться, возможные
    * страницы для открытия должны вести себя корректно
    * При успешном добавлении новой заметки textarea должна очищаться
    *
    * Дополнительно:
    * 1. Для залогиненого пользователя доступна страница "Все пользователи", где располагается информация
    * о всех пользователях системы и их заметках(кнопки назад-вперед браузера работают корректно)
    * 2. Доблавить возможность удаления заметок
    */
// let container = document.querySelector('.container')
const logout = document.querySelector('#logout'),
    login = document.querySelector('div#login'),
    notes = document.querySelector('div#notes'),
    inputEmailField = document.querySelector('#inputEmail'),
    loginButton = document.querySelector('#login-button'),
    addButton = document.querySelector('#add-note'),
    noteText = document.querySelector('#note-text'),
    noteContainer = document.querySelector('#notes-container'),
    allUsersButton = document.querySelector('#all');
const containerListOfUsersAndNotes = document.createElement('div')
document.querySelector('main').append(containerListOfUsersAndNotes)
const allUsersOut = document.createElement('a')
allUsersOut.classList.add('nav-link')
allUsersOut.innerHTML = 'Вернуться к заметкам пользователя'
document.querySelector('ul li.nav-item').append(allUsersOut)
document.querySelector('main').append(containerListOfUsersAndNotes)
let userName,
    listOfNotes,
    listOfUsers = []
loginButton.addEventListener('click', (e) => {
    if (inputEmailField.value) {
        e.preventDefault()
        userName = inputEmailField.value
        localStorage.setItem('activeUser', userName)
        if (localStorage.getItem('listOfUsers')) {
            listOfUsers = JSON.parse(localStorage.getItem('listOfUsers'))
            if (!listOfUsers.includes(userName)) {
                console.log(localStorage.getItem('listOfUsers'))
                listOfUsers.push(`${userName}`)
                localStorage.setItem('listOfUsers', JSON.stringify(listOfUsers))
            }
        } else {
            listOfUsers.push(`${userName}`)
            localStorage.setItem('listOfUsers', JSON.stringify(listOfUsers))
        }
        location.hash = `#notes`
    }

})
function createNote(noteText, noteContainer) {
    let note = document.createElement('div')
    note.classList.add('alert', 'alert-primary')
    note.textContent = noteText.value
    createRemoveButton(note)
    listOfNotes.push(note)
    noteContainer.append(note)
}
function createRemoveButton(note) {
    let deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button')
    deleteButton.addEventListener('click', () => {
        console.log(listOfNotes.indexOf(note))
        let arrayOfNotes = JSON.parse(localStorage.getItem(`${userName}`))
        arrayOfNotes.splice(listOfNotes.indexOf(note), 1)
        localStorage.setItem(`${userName}`, JSON.stringify(arrayOfNotes))
        note.remove()
    })
    note.append(deleteButton)
}
addButton.addEventListener('click', (e) => {
    e.preventDefault()
    createNote(noteText, noteContainer)
    let noteMemory = {}
    noteMemory.value = noteText.value
    if (localStorage.getItem(`${userName}`)) {
        let newArrayOfMemoriedNotes = JSON.parse(localStorage.getItem(`${userName}`))
        newArrayOfMemoriedNotes.push(noteMemory)
        localStorage.setItem(`${userName}`, JSON.stringify(newArrayOfMemoriedNotes))
    } else {
        let arrayOfMemoriedNotes = []
        arrayOfMemoriedNotes.push(noteMemory)
        localStorage.setItem(`${userName}`, JSON.stringify(arrayOfMemoriedNotes))
    }
    noteText.value = ''
})

allUsersButton.addEventListener('click', () => {
    location.hash = '#allusers'
})
allUsersOut.addEventListener('click', () => {
    location.hash = '#notes'
})
function changeLocation() {
    login.hidden = true
    notes.hidden = true
    logout.hidden = true
    containerListOfUsersAndNotes.hidden = true
    allUsersButton.hidden = true
    allUsersOut.hidden = true

    switch (location.hash) {
        case `#notes`:
            inputEmailField.value = ''
            document.querySelectorAll(`.newUserNotesList`).forEach(el => el.remove())
            if (!localStorage.getItem('activeUser')) {
                location.hash = '#login'
                return
            }
            allUsersButton.hidden = false
            notes.hidden = false
            logout.hidden = false
            if (!userName) {
                userName = localStorage.getItem('activeUser')
            }
            listOfNotes = []
            if (localStorage.getItem(`${userName}`)) {
                JSON.parse(localStorage.getItem(`${userName}`)).forEach(note => {
                    createNote(note, noteContainer)
                })
                console.log(listOfNotes)
            }
            break
        case `#login`:
        case ``:
            inputEmailField.value = ''
            document.querySelectorAll('.alert.alert-primary').forEach(note => {
                note.remove()
            })
            login.hidden = false
            break
        case '#allusers':
            if (!localStorage.getItem('activeUser')) {
                location.hash = '#login'
                return
            }
            document.querySelectorAll('.alert.alert-primary').forEach(note => {
                note.remove()
            })
            containerListOfUsersAndNotes.hidden = false
            allUsersOut.hidden = false
            listOfNotes = []
            let userList = JSON.parse(localStorage.getItem('listOfUsers'))
            userList.forEach(name => {
                let newUserNotesList = document.createElement('div'),
                    userNameField = document.createElement('div'),
                    userNotesField = document.createElement('div');
                userNameField.classList.add('btn', 'btn-lg', 'btn-primary', 'btn-block')
                userNameField.textContent = name
                JSON.parse(localStorage.getItem(`${name}`)).forEach(note => createNote(note, userNotesField))
                newUserNotesList.append(userNameField)
                newUserNotesList.append(userNotesField)
                newUserNotesList.classList.add('newUserNotesList')
                containerListOfUsersAndNotes.append(newUserNotesList)
            })
            break
        default: document.querySelectorAll('.alert.alert-primary').forEach(note => {
            note.remove()
        })
            localStorage.removeItem('activeUser')
            login.hidden = false
            break
    }
}
window.addEventListener('hashchange', changeLocation)
changeLocation()

