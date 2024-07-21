# Chit Chat

Chit-Chat is a web-based chatting platform where you can connect with friends, family, and colleagues in a fun and personalized way.

## Key Features:

- **Real-time Text Messaging:** Send text messages to your contacts and enjoy instant conversations.
- **Image Sharing:** Share your favorite images with your contacts and make your conversations more engaging.
- **Customizable Profiles:** Personalize your profile with a profile picture and status that reflects your personality.
- **User Search:** Easily find and add new contacts to your list with our robust search functionality.
- **Contact Management:** Manage your contacts and organize your conversations with ease.

## Getting Started:

1. Sign up or log in to your account.
2. Customize your profile to make it unique.
3. Search and add contacts to your list.
4. Start chatting and sharing images with your contacts.

---

## Technologies Used:

- **Frontend:** EJS, Tailwind, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Libraries:** JWT, Socket.io, Multer, Emoji-Picker

## Learning

1.  **_Socket.io:_** Implemented Socket.io for real-time communication between two users, enabling instant messaging and live updates.
2.  **_Reading and writing Image upload:_** Acquired skills in using the File System (fs) module to write image upload functionality, successfully storing images in a designated folder and transferring them in real-time using Socket.io.
3.  **_Emoji Picker:_** Integrated an emoji-picker library, enabling users to select and share a range of emojis, enhancing their ability to express and convey emotions more effectively in our application.

## Future Features:

1. **_Groups:_** To Implement a feature that enables users to create and manage groups, fostering community building and facilitating discussions among users with shared interests.
2. **_Video and other file support:_** To Expand the platform's capabilities by integrating video and file upload functionality, allowing users to share diverse content types and enriching the overall user experience.

---

## Contributing:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

### How to contribute:

### Make sure you have Node.js and MongoDB installed on your device.

Install all dependencies listed in **package.json**

```bash
npm install
```

Create a **.env** file in your directory and add following variables

```.env
PORT = PORTofYourChoice
JWTSecretKey = "Any String"
ErrorKey = 'Any String'
MongoDBURL = "MongoDB connextion Link"
```
