const form = document.getElementById('form')
const input = document.getElementById('userName')
const autoComplete = document.getElementsByClassName('auto-complete')[0]

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
    const response = await fetch(`https://api.github.com/search/repositories?q=${name}`)
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
            repo.addEventListener('click', (e)=> {
                if(!e.target.classList.contains('disabled')){
                    e.target.classList.add('disabled')
                    const addedRepo = document.createElement('div')
                    addedRepo.className = 'added__item'
                    addedRepo.id = result.items[i].owner.login
                    addedRepo.innerHTML = ` Name: ${result.items[i].name} \n Owner: ${result.items[i].owner.login} \n Stars: ${result.items[i].stargazers_count}`
                    const removeBtn = document.createElement('div')
                    removeBtn.className = 'remove-repo'
                    addedRepo.appendChild(removeBtn)
                    input.value = ''
                    autoComplete.innerHTML = ''
                    removeBtn.addEventListener('click', (e) => {
                        document.getElementById(e.target.parentNode.id).remove()
                    })
                document.getElementsByClassName('added')[0].appendChild(addedRepo)}
            })
            autoComplete.appendChild(repo)
        }
    }
}