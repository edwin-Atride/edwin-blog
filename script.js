const adminBtn = document.getElementById('adminBtn')
const logoutBtn = document.getElementById('logoutBtn')

const loginModal = document.getElementById('loginModal')
const loginBtn = document.getElementById('loginBtn')
const passwordInput = document.getElementById('password')

const adminPanel = document.getElementById('adminPanel')

const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')
const imageInput = document.getElementById('imageInput')

const publishBtn = document.getElementById('publishBtn')

const postsContainer = document.getElementById('posts')

const ADMIN_PASSWORD = 'admin1234'

adminBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden')
})

loginBtn.addEventListener('click', () => {
  if (passwordInput.value === ADMIN_PASSWORD) {
    loginModal.classList.add('hidden')

    adminPanel.classList.remove('hidden')

    logoutBtn.classList.remove('hidden')

    adminBtn.classList.add('hidden')
  } else {
    alert('Mauvais mot de passe')
  }
})

logoutBtn.addEventListener('click', () => {
  adminPanel.classList.add('hidden')

  logoutBtn.classList.add('hidden')

  adminBtn.classList.remove('hidden')

  passwordInput.value = ''
})

function getPosts() {
  return JSON.parse(localStorage.getItem('posts') || '[]')
}

function savePosts(posts) {
  localStorage.setItem('posts', JSON.stringify(posts))
}

function renderPosts() {
  const posts = getPosts()

  postsContainer.innerHTML = ''

  posts.slice().reverse().forEach(post => {
    const div = document.createElement('div')

    div.className = 'post'

    div.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      ${
        post.image
          ? `<img src="${post.image}" alt="image">`
          : ''
      }
    `

    postsContainer.appendChild(div)
  })
}

publishBtn.addEventListener('click', () => {
  const title = titleInput.value.trim()
  const content = contentInput.value.trim()

  if (!title || !content) {
    alert('Remplis tous les champs')
    return
  }

  const reader = new FileReader()

  const file = imageInput.files[0]

  reader.onload = function () {
    const posts = getPosts()

    posts.push({
      title,
      content,
      image: file ? reader.result : null
    })

    savePosts(posts)

    titleInput.value = ''
    contentInput.value = ''
    imageInput.value = ''

    renderPosts()
  }

  if (file) {
    reader.readAsDataURL(file)
  } else {
    reader.onload()
  }
})

renderPosts()
