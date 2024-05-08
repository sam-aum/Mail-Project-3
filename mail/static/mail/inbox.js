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
  document.querySelector('#single-email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';

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

function view_email(id) {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#single-email-view').style.display = 'block';

      document.querySelector('#single-email-view').innerHTML = 
      `
        <ul style="list-style-type: none;">
          <li><strong>From:</strong> ${email.sender}</li>
          <li><strong>To:</strong> ${email.recipients}</li>
          <li><strong>Subject:</strong> ${email.subject}</li>
          <li><strong>Timestamp:</strong> ${email.timestamp}</li>
          <hr>
          <li>${email.body}</li>
      `;

      // Find if read
      if(!email.read){
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          })
        })
      }

      // Archive button
      const archive_button = document.createElement('button');
      archive_button.innerHTML = email.archived ? "Unarchive": "Archive";
      archive_button.className = email.archived ? "btn btn-success ": "btn btn-danger";
      archive_button.addEventListener('click', function() {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email.archived
          })
        })
        .then(() => load_mailbox('archive'))
      });
      document.querySelector('#single-email-view').append(archive_button);


      // Reply Button
      const reply_button = document.createElement('button');
      reply_button.innerHTML = "Reply";
      reply_button.className = "btn btn-info";
      reply_button.addEventListener('click', function() {
        console.log("hello")
      });
      document.querySelector('#single-email-view').append(reply_button);


  });
}