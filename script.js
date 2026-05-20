const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
)

const adminBtn = document.getElementById('adminBtn')
const logoutBtn = document.getElementById('logoutBtn')

const loginModal = document.getElementById('loginModal')
const loginBtn = document.getElementById('loginBtn')

const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')

const adminPanel = document.getElementById('adminPanel')

const titleInput = document.getElementById('title')
const contentInput = document.getElementById('content')
const imageInput = document.getElementById('imageInput')

const publishBtn = document.getElementById('publishBtn')

const postsContainer = document.getElementById('posts')

adminBtn.addEventListener('click', () => {
  loginModal.classList.remove('hidden')
})

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value
  const password = passwordInput.value

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert("Connexion refusée")
    return
  }

  loginModal.classList.add('hidden')
  adminPanel.classList.remove('hidden')

  adminBtn.classList.add('hidden')
  logoutBtn.classList.remove('hidden')
})

logoutBtn.addEventListener('click', async () => {
  await supabaseClient.auth.signOut()

  adminPanel.classList.add('hidden')

  adminBtn.classList.remove('hidden')
  logoutBtn.classList.add('hidden')
})

async function renderPosts() {
  const { data } = await supabaseClient
    .from('posts')
    .select('*')
    .order('id', { ascending: false })

  postsContainer.innerHTML = ''

  data.forEach(post => {
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

publishBtn.addEventListener('click', async () => {
  const title = titleInput.value.trim()
  const content = contentInput.value.trim()

  if (!title || !content) {
    alert('Remplis tous les champs')
    return
  }

  const file = imageInput.files[0]

  let imageBase64 = null

  if (file) {
    imageBase64 = await toBase64(file)
  }

  const { error } = await supabaseClient
    .from('posts')
    .insert([
      {
        title,
        content,
        image: imageBase64
      }
    ])

  if (error) {
    alert(error.message)
    return
  }

  titleInput.value = ''
  contentInput.value = ''
  imageInput.value = ''

  renderPosts()
})

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = error => reject(error)
  })
}

renderPosts()
