const form = document.getElementById('form')
const input = document.getElementById('userName')
const autoComplete = document.getElementsByClassName('auto-complete')[0]
const BASE_URL = 'https://api.github.com/search/repositories'

const debounce = (fn, debounceTime) => {
    let isCoolDown;
    return function (){
            clearTimeout(isCoolDown)
            isCoolDown = setTimeout(() => fn.apply(this, arguments), debounceTime)
  }
  }

const debounceSearch = debounce(search, 500)

input.addEventListener('input', debounceSearch)  

async function searchRepos(name) {
    const response = await fetch(`${BASE_URL}?q=${name}`)
    const result = await response.json()
    return(result)
}



async function search() {
    const userName = input.value
    autoComplete.innerHTML = ''
    if(userName.trim() !== ''){
        const result = await searchRepos(userName)
        for (let i = 0; i < 5; i++) {
            const repo = document.createElement('li')
            repo.className = `auto-complete__item`
            repo.innerHTML = result.items[i].name
            repo.addEventListener('click', addRepo.bind(this, result, i))
            autoComplete.appendChild(repo)
        }
    }
}

function addRepo (result, i) {
    const addedRepo = document.createElement('div')
    addedRepo.className = 'added__item'
    addedRepo.id = result.items[i].owner.login
    addedRepo.innerHTML = ` Name: ${result.items[i].name} \n Owner: ${result.items[i].owner.login} \n Stars: ${result.items[i].stargazers_count}`
    const removeBtn = document.createElement('div')
    removeBtn.className = 'remove-repo'
    addedRepo.appendChild(removeBtn)
    input.value = ''
    autoComplete.innerHTML = ''
    removeBtn.addEventListener('click', remove)
    document.getElementsByClassName('added')[0].appendChild(addedRepo)
}

function remove(e) {
    document.getElementById(e.target.parentNode.id).remove()
}