console.log('FrontEnd JS ishga tushdi');

function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-info d-flex align-items-center justify-content-between">
              <span class="item-text">${item.reja}</span>
              <div>
                <button
                    data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">
                  Ozgartirish
                </button>
                <button data-id="${item._id}"
                    class="delete-me btn btn-danger btn-sm">O'chirish</button>
              </div>
            </li>`;
}

let createField = document.getElementById('create-field');

//++++++++++++ CREATE STEP 1: Foydalanuvchi input ga yozadi va submit bosadi ++++++++++++//
document.getElementById('create-form').addEventListener('submit', function (e) {
  e.preventDefault();

  //++++++++++++ CREATE STEP 2: axios { reja: "..." } ni app.js ga yuboradi — keyingi step app.js da ++++++++++++//
  axios
    .post('/create-item', { reja: createField.value })
    .then((response) => {
      //++++++++++++ CREATE STEP 6: app.js dan javob keldi → itemTemplate() bilan <li> sahifaga qo'shiladi ++++++++++++//
      document
        .getElementById('item-list')
        .insertAdjacentHTML('beforeend', itemTemplate(response.data));

      createField.value = '';
      createField.focus();
    })
    .catch((err) => {
      console.log('Iltimos qaytatdan harakat qiling ');
    });
});

document.addEventListener('click', function (e) {
  console.log(e.target);

  //++++++++++++ DELETE STEP 1: Foydalanuvchi o'chirish tugmasini bosadi ++++++++++++//
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Aniq ochirmoqchimisiz?')) {
      //++++++++++++ DELETE STEP 2: data-id dan _id olinadi → axios app.js ga yuboradi — keyingi step app.js da ++++++++++++//
      axios
        .post('/delete-item', { id: e.target.getAttribute('data-id') })

        .then((response) => {
          //++++++++++++ DELETE STEP 6: app.js dan javob keldi → <li> DOM dan olib tashlanadi ++++++++++++//
          e.target.closest('li').remove();
        })
        .catch((err) => {});
    }
  }

  //++++++++++++ EDIT — hozircha faqat alert (keyingi bosqich) ++++++++++++//
  if (e.target.classList.contains('edit-me')) {
    alert('Siz edit tugmasini bosdingiz');
  }
});
