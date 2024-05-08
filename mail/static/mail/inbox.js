document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Submit 
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function view_email(id) {
  console.log(id)
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  // Get emails for that mailbox and user.
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Loop through emails and create a div for each email
      emails.forEach(singleEmail => {

        // create div for each email
        const createdEmail = document.createElement('div');

        // Bootstrap create box
        createdEmail.classList.add("list-group-item");


        // Load content
        createdEmail.innerHTML = 
          `
            <h5>Sender: ${singleEmail.sender}</h5>
            <p>Subject: ${singleEmail.subject}</p>
            <p>${singleEmail.timestamp}</p>
          `;

        // Background for read/unread emails
        // createdEmail.className = singleEmail.read ? 'read': 'unread';

        // Background for read/unread emails
        if (singleEmail.read) {
          createdEmail.classList.add('read');
        } else {
          createdEmail.classList.add('unread');
        }
      


        // click on email
        createdEmail.addEventListener('click', function() {
          view_email(singleEmail.id)
        });
        document.querySelector('#emails-view').append(createdEmail);
      });
  });
}

function send_email(event) {

  event.preventDefault();

  // Add composition fields
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send data to backend
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}

