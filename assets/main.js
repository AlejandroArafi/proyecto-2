let tareas = []
let editMode = false
let editionId = null
const addButton = document.getElementById('add')
addButton.addEventListener('click', function (event) {
  if (editMode === false) {
    create(event)
  } else {
    update(event)
  }
})

function create(event) {
  event.preventDefault()
  const tarea = readForm()
  const values = Object.values(tarea)
  const resultado = values.every((value) => value !== '')
  if (resultado === false) {
    Swal.fire('Hay campos vacíos', '', 'error')
  } else {
    tareas.push(tarea)
    createRow(tarea)
    clearForm()
    saveDataLS()
  }
}

function readForm() {
  const nameInput = document.getElementById('name')
  const lastnameInput = document.getElementById('lastname')
  const descInput = document.getElementById('description')
  const emailInput = document.getElementById('email')

  const tarea = {
    name: nameInput.value,
    lastname: lastnameInput.value,
    desc: descInput.value,
    email: emailInput.value,
    id: Date.now() 
  }
  return tarea
}

function createRow(tarea) {
  const tbody = document.getElementById('tbody')

  tbody.innerHTML += `
         <tr id="${tarea.id}">
            <td>${tarea.name}</td>
            <td>${tarea.lastname}</td>
            <td>${tarea.desc}</td>
            <td>
                <button class="edit" onclick="editTask(${tarea.id})">Editar</button>
                <button class="delete" onclick="deleteTask(${tarea.id})">Eliminar</button>
            </td>
        </tr>
    `
}

function clearForm() {
  const form = document.getElementById('form')
  form.reset()
}

function saveDataLS() {
  localStorage.setItem('tareas', JSON.stringify(tareas))
}

function deleteTask(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, borrar!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const row = document.getElementById(id)
      row.remove()
      tareas = tareas.filter((tarea) => tarea.id !== id)
      saveDataLS()
      Swal.fire('Borrado correctamente', '', 'success')
    }
  })
}

function readFromLS() {
 
  tareas = JSON.parse(localStorage.getItem('tareas')) || []
  tareas.forEach((el) => createRow(el))
}

function editTask(id) {
  editMode = true
  addButton.innerText = 'Actualizar'
  editionId = id
  document.getElementById(id).style.backgroundColor = 'red'
  const tarea = tareas.find((tarea) => tarea.id === id)
  const nameInput = document.getElementById('name')
  const lastnameInput = document.getElementById('lastname')
  const descInput = document.getElementById('description')
  const emailInput = document.getElementById('email')

  nameInput.value = tarea.name
  lastnameInput.value = tarea.lastname
  descInput.value = tarea.desc
  emailInput.value = tarea.email
}

function update(event) {
  event.preventDefault()
  const valores = readForm()
  valores.id = editionId

  const index = tareas.findIndex((tarea) => tarea.id === editionId)
  tareas.splice(index, 1, valores)
  saveDataLS()
  const row = document.getElementById(editionId)
  row.innerHTML = `
    <td>${valores.name}</td>
    <td>${valores.lastname}</td>
    <td>${valores.desc}</td>
    <td>
        <button class="edit" onclick="editTask(${valores.id})">Editar</button>
        <button class="delete" onclick="deleteTask(${valores.id})">Eliminar</button>
    </td>
  `
  row.style.backgroundColor = 'initial'

  clearForm()
  editMode = false
  editionId = null
  addButton.innerText = 'Agregar'
}

readFromLS()
