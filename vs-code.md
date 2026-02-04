# Visual Studio Code Setup Guide for Sign Assist

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Visual Studio Code
1. Download VS Code from: https://code.visualstudio.com/
2. Install and launch VS Code

### Step 2: Open Your Project
1. Click `File` → `Open Folder`
2. Select the folder containing all your Sign Assist files:
   - index.html
   - styles.css
   - script.js
   - README.md
   - server.py (optional)

### Step 3: Install Live Server Extension
1. Click the Extensions icon (or press `Ctrl+Shift+X`)
2. Search for "Live Server"
3. Find "Live Server" by Ritwick Dey
4. Click "Install"

### Step 4: Run Your Application
**Method A: Using Live Server (Recommended)**
1. Right-click on `index.html` in the file explorer
2. Select "Open with Live Server"
3. Your browser will automatically open with the application
4. Any changes you make will auto-refresh!

**Method B: Manual Browser Opening**
1. Right-click on `index.html`
2. Select "Reveal in File Explorer"
3. Double-click `index.html` to open in browser

### Step 5: Test Your Application
1. You should see the Sign Assist login page
2. Enter any name and age
3. Select a language
4. Click "Get Started"
5. Choose an input mode and start testing!

## 🎨 Editing Your Code in VS Code

### Recommended Extensions:
1. **Live Server** (Required) - Auto-refresh on save
2. **Prettier** (Optional) - Code formatting
3. **ESLint** (Optional) - JavaScript linting
4. **HTML CSS Support** (Optional) - Better CSS IntelliSense

### To Install Extensions:
1. Press `Ctrl+Shift+X` to open Extensions
2. Search for extension name
3. Click "Install"

### Useful VS Code Shortcuts:
- `Ctrl+S` - Save file
- `Ctrl+P` - Quick file open
- `Ctrl+F` - Find in file
- `Ctrl+H` - Find and replace
- `F12` - Go to definition
- `Alt+Shift+F` - Format document
- `` Ctrl+` `` - Open terminal

## 🔧 Making Changes

### To Change Colors:
1. Open `styles.css`
2. Find the `:root` section at the top
3. Change color values:
   ```css
   --primary-blue: #1E88E5;  /* Change this hex code */
   ```
4. Save (Ctrl+S)
5. Browser will auto-refresh if using Live Server

### To Add New Phrases:
1. Open `script.js`
2. Find the `translations` object
3. Add your phrase in all languages:
   ```javascript
   newPhrase: "Your English text",
   ```
4. Save and refresh

### To Modify Layout:
1. Open `index.html`
2. Find the section you want to change
3. Edit the HTML
4. Save and see changes instantly

## 🐛 Debugging in VS Code

### Browser Developer Tools:
1. With your app running, press `F12` in browser
2. Check the "Console" tab for JavaScript errors
3. Use "Network" tab to monitor requests

### VS Code Debugger:
1. Install "Debugger for Chrome" extension
2. Press `F5` to start debugging
3. Set breakpoints by clicking left of line numbers

## 📱 Testing on Mobile

### Option 1: Using Live Server
1. Make sure your phone and computer are on same WiFi
2. Find your computer's IP address:
   - Windows: Open CMD, type `ipconfig`, look for IPv4
   - Mac: System Preferences → Network
3. On your phone, open browser and go to:
   `http://YOUR-IP:5500` (replace YOUR-IP with actual IP)

### Option 2: Using ngrok (for public URL)
1. Download ngrok from: https://ngrok.com/
2. In VS Code terminal, run: `ngrok http 5500`
3. Use the generated URL on any device

## 🔥 Common VS Code Tips

### Multi-Cursor Editing:
- Hold `Alt` and click to add cursors
- Select word, press `Ctrl+D` to select next occurrence

### Split Editor:
- Click split editor icon or press `Ctrl+\`
- View HTML and CSS side by side

### Integrated Terminal:
- Press `` Ctrl+` `` to open terminal
- Run commands without leaving VS Code
- Multiple terminals: Click `+` in terminal panel

### Zen Mode:
- Press `Ctrl+K Z` for distraction-free coding
- Press `Esc Esc` to exit

## 🎯 Project Structure in VS Code

```
SIGN-ASSIST/
├── 📄 index.html       ← Main HTML file (Start here)
├── 🎨 styles.css       ← All styling
├── ⚡ script.js        ← All functionality
├── 📖 README.md        ← Documentation
├── 🐍 server.py        ← Python backend (optional)
└── 📋 INSTALL_BACKEND.txt
```

## 🚨 Troubleshooting

### Live Server Not Working?
1. Make sure you installed the correct extension
2. Try reloading VS Code (Ctrl+R)
3. Check if port 5500 is available
4. Try right-clicking HTML file again

### Changes Not Showing?
1. Hard refresh browser: `Ctrl+Shift+R`
2. Clear browser cache
3. Make sure you saved the file (Ctrl+S)
4. Check if Live Server is running (bottom status bar)

### Camera/Microphone Not Working?
1. Check browser console (F12) for errors
2. Ensure browser has permissions (Settings → Privacy)
3. Try HTTPS instead of HTTP (some features require secure context)

### Port 5500 Already in Use?
1. Close other Live Server instances
2. Change port: VS Code Settings → search "Live Server" → change port
3. Kill process using port:
   - Windows: `netstat -ano | findstr :5500` then `taskkill /PID <pid> /F`
   - Mac/Linux: `lsof -ti:5500 | xargs kill`

## 🎓 Learning Resources

### VS Code:
- Official Docs: https://code.visualstudio.com/docs
- Keyboard Shortcuts: Help → Keyboard Shortcuts Reference
- Video Tutorials: YouTube "VS Code Tips"

### HTML/CSS/JavaScript:
- MDN Web Docs: https://developer.mozilla.org/
- W3Schools: https://www.w3schools.com/
- freeCodeCamp: https://www.freecodecamp.org/

### Web Development:
- Chrome DevTools: Press F12 in browser
- Can I Use: https://caniuse.com/ (browser compatibility)

## 💡 Pro Tips

1. **Use Emmet**: Type shortcuts for faster HTML/CSS
   - Example: `div.container>ul>li*3` then press Tab

2. **Snippets**: Create custom code snippets
   - File → Preferences → User Snippets

3. **Git Integration**: VS Code has built-in Git
   - Initialize repo: `git init` in terminal
   - Track changes in Source Control panel

4. **Settings Sync**: Sync VS Code settings across devices
   - Turn on Settings Sync in Accounts menu

5. **Color Picker**: Click on color codes to open picker
   - Useful for changing theme colors quickly

## 🎉 Next Steps

Once your basic setup is working:

1. **Test all features**: Try sign language, speech, and text input
2. **Customize**: Change colors, add phrases, modify layout
3. **Share**: Use ngrok to share with others for testing
4. **Deploy**: Consider deploying to:
   - GitHub Pages (free)
   - Netlify (free)
   - Vercel (free)

## 📞 Need Help?

If you're stuck:
1. Check browser console (F12) for errors
2. Review README.md for detailed documentation
3. Ensure all files are in same folder
4. Verify file names match exactly (case-sensitive)
5. Try in different browser (Chrome recommended)

---

**Happy Coding! 🚀**

Remember: Save often (Ctrl+S) and test frequently!
